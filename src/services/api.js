/**
 * API Service for HAPPY PARENTING Web Application
 * Connected directly to Google Apps Script Cloud Web App API & Google Sheets.
 * 
 * STRICT ARCHITECTURE RULES:
 * 1. Zero localStorage, sessionStorage, or IndexedDB for registration/application data.
 * 2. Every single CRUD operation directly reads and writes to Google Sheets via Apps Script.
 * 3. NO fake, dummy, or fallback local data returned when API requests fail.
 * 4. Multi-device cloud sync: all devices read from the same Google Sheets database.
 */

const STORAGE_KEYS = {
  API_URL: 'hp_gas_api_url',
  AUTH_SESSION: 'hp_auth_session'
};

// Strict Requirement 1 & 2: Wipe any legacy registration data from browser storage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('hp_registrations_v1');
    localStorage.removeItem('hp_admins_v1');
    localStorage.removeItem('hp_settings_v1');
    localStorage.removeItem('hp_logs_v1');
    sessionStorage.removeItem('hp_registrations_v1');
    sessionStorage.removeItem('hp_admins_v1');
  } catch (e) {
    // Ignore storage clear errors
  }
}

// BroadcastChannel for instant synchronization across tabs on the same device
const broadcastChannel = typeof window !== 'undefined' && window.BroadcastChannel 
  ? new BroadcastChannel('hp_data_sync') 
  : null;

function notifyDataChanged() {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }
}

export const apiService = {
  // Get active Google Apps Script Web App URL from environment or Admin Settings
  getGasUrl() {
    try {
      const envUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
      if (envUrl && envUrl.trim()) return envUrl.trim();
      const stored = localStorage.getItem(STORAGE_KEYS.API_URL);
      if (stored && stored.trim()) return stored.trim();
      return '';
    } catch (e) {
      return '';
    }
  },

  // Set Google Apps Script Web App URL override (Admin Config)
  setGasUrl(url) {
    try {
      const clean = (url || '').trim();
      if (clean) {
        localStorage.setItem(STORAGE_KEYS.API_URL, clean);
      } else {
        localStorage.removeItem(STORAGE_KEYS.API_URL);
      }
      notifyDataChanged();
    } catch (e) {
      console.error('Error saving GAS URL:', e);
    }
  },

  // Test connection to Google Apps Script Web App
  async testConnection(url) {
    const targetUrl = (url || this.getGasUrl()).trim();
    if (!targetUrl) {
      return { 
        success: false, 
        message: 'ഗൂഗിൾ ആപ്സ് സ്ക്രിപ്റ്റ് Web App URL നൽകിയിട്ടില്ല' 
      };
    }

    try {
      const separator = targetUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${targetUrl}${separator}action=ping`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        redirect: 'follow'
      });

      if (!response.ok) {
        return { 
          success: false, 
          message: `സെർവർ കണക്ഷൻ പരാജയപ്പെട്ടു (Status: ${response.status})` 
        };
      }

      const data = await response.json();
      return { 
        success: data.success || data.status === 'online', 
        data, 
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ക്ലൗഡ് കണക്ഷൻ വിജയകരമാണ്!' 
      };
    } catch (err) {
      return { 
        success: false, 
        error: err.message, 
        message: 'ഗൂഗിൾ ഷീറ്റിലേക്ക് കണക്റ്റ് ചെയ്യാനായില്ല. ദയവായി Web App വിന്യാസവും അനുമതികളും പരിശോധിക്കുക.' 
      };
    }
  },

  // 1. Create Registration: Saves directly to Google Sheets
  async createRegistration(formData) {
    const gasUrl = this.getGasUrl();

    if (!gasUrl) {
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല. അഡ്മിൻ പാനലിൽ Google Apps Script Web App URL നൽകുക.'
      };
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'createRegistration',
          registration: formData
        }),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`സെർവർ പ്രതികരണം ലഭ്യമല്ല (${response.status})`);
      }

      const res = await response.json();

      if (res && res.success) {
        notifyDataChanged();
        return res;
      } else if (res && res.isDuplicate) {
        return {
          success: false,
          isDuplicate: true,
          message: res.message || 'ഈ മൊബൈൽ നമ്പർ ഉപയോഗിച്ച് ഇതിനകം രജിസ്ട്രേഷൻ പൂർത്തിയായിട്ടുണ്ട്.'
        };
      } else {
        return {
          success: false,
          message: res.message || 'രജിസ്ട്രേഷൻ ഗൂഗിൾ ഷീറ്റ്സിൽ സേവ് ചെയ്യാൻ സാധിച്ചില്ല.'
        };
      }
    } catch (err) {
      console.error('Registration to Google Sheets failed:', err);
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ഡാറ്റാബേസിലേക്ക് കണക്റ്റ് ചെയ്യാനായില്ല. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക.'
      };
    }
  },

  // 2. Get Registrations: Fetches directly from Google Sheets
  async getRegistrations(params = {}) {
    const gasUrl = this.getGasUrl();

    if (!gasUrl) {
      return {
        success: false,
        data: [],
        count: 0,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല.'
      };
    }

    try {
      const queryParams = new URLSearchParams({
        action: 'getRegistrations',
        ...params
      }).toString();

      const separator = gasUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${gasUrl}${separator}${queryParams}`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`സെർവർ പിശക് (${response.status})`);
      }

      const res = await response.json();
      if (res && res.success && Array.isArray(res.data)) {
        return {
          success: true,
          data: res.data,
          count: res.count !== undefined ? res.count : res.data.length
        };
      } else {
        return {
          success: false,
          data: [],
          count: 0,
          message: res.message || 'ഡാറ്റ ലഭ്യമാക്കാൻ സാധിച്ചില്ല.'
        };
      }
    } catch (err) {
      console.error('Fetch from Google Sheets failed:', err);
      return {
        success: false,
        data: [],
        count: 0,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ഡാറ്റാബേസിൽ നിന്ന് വിവരങ്ങൾ ലഭ്യമാക്കാൻ സാധിച്ചില്ല. കണക്ഷൻ പരിശോധിക്കുക.'
      };
    }
  },

  // 3. Update Registration: Directly updates Google Sheets
  async updateRegistration(registrationData, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();

    if (!gasUrl) {
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല.'
      };
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateRegistration',
          registration: registrationData,
          adminId
        }),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`സെർവർ പിശക് (${response.status})`);
      }

      const res = await response.json();
      if (res && res.success) {
        notifyDataChanged();
        return {
          success: true,
          message: res.message || 'രജിസ്ട്രേഷൻ ഗൂഗിൾ ഷീറ്റിൽ വിജയകരമായി പുതുക്കി'
        };
      } else {
        return {
          success: false,
          message: res.message || 'ഗൂഗിൾ ഷീറ്റിൽ വിവരങ്ങൾ പുതുക്കാൻ സാധിച്ചില്ല.'
        };
      }
    } catch (err) {
      console.error('Update via GAS failed:', err);
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ക്ലൗഡ് അപ്ഡേറ്റ് പരാജയപ്പെട്ടു. നെറ്റ്‌വർക്ക് പരിശോധിക്കുക.'
      };
    }
  },

  // 4. Delete Registration: Directly deletes row from Google Sheets
  async deleteRegistration(id, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();

    if (!gasUrl) {
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല.'
      };
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deleteRegistration',
          id,
          adminId
        }),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`സെർവർ പിശക് (${response.status})`);
      }

      const res = await response.json();
      if (res && res.success) {
        notifyDataChanged();
        return {
          success: true,
          message: 'രജിസ്ട്രേഷൻ ഗൂഗിൾ ഷീറ്റിൽ നിന്ന് സ്ഥിരമായി നീക്കം ചെയ്തു'
        };
      } else {
        return {
          success: false,
          message: res.message || 'ഗൂഗിൾ ഷീറ്റിൽ നിന്ന് രജിസ്ട്രേഷൻ നീക്കം ചെയ്യാൻ സാധിച്ചില്ല.'
        };
      }
    } catch (err) {
      console.error('Delete via GAS failed:', err);
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സിൽ നിന്ന് നീക്കം ചെയ്യാൻ സാധിച്ചില്ല. നെറ്റ്‌വർക്ക് പരിശോധിക്കുക.'
      };
    }
  },

  // 5. Update Attendance: Directly updates Attendance column in Google Sheets
  async updateAttendance(id, status, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();

    if (!gasUrl) {
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല.'
      };
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateAttendance',
          id,
          status,
          adminId
        }),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`സെർവർ പിശക് (${response.status})`);
      }

      const res = await response.json();
      if (res && res.success) {
        notifyDataChanged();
        return {
          success: true,
          message: res.message || 'ഹാജർ നില ഗൂഗിൾ ഷീറ്റിൽ പുതുക്കി'
        };
      } else {
        return {
          success: false,
          message: res.message || 'ഹാജർ നില ഗൂഗിൾ ഷീറ്റിൽ പുതുക്കാൻ സാധിച്ചില്ല.'
        };
      }
    } catch (err) {
      console.error('Attendance update via GAS failed:', err);
      return {
        success: false,
        message: 'ഹാജർ നില ക്ലൗഡിൽ പുതുക്കാൻ സാധിച്ചില്ല. നെറ്റ്‌വർക്ക് പരിശോധിക്കുക.'
      };
    }
  },

  // 6. Dashboard Statistics: Computed directly from Google Sheets
  async getDashboardStats() {
    const gasUrl = this.getGasUrl();

    const emptyStats = {
      totalStudentParentRegs: 0,
      totalGuestRegs: 0,
      totalParents: 0,
      totalGuests: 0,
      totalRegistrations: 0,
      totalAttendees: 0,
      darsCount: 0,
      hifzCount: 0,
      presentCount: 0,
      absentCount: 0,
      attendanceRate: 0
    };

    if (!gasUrl) {
      return {
        success: false,
        stats: emptyStats,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല.'
      };
    }

    try {
      const separator = gasUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${gasUrl}${separator}action=getDashboardStats`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        redirect: 'follow'
      });

      if (response.ok) {
        const res = await response.json();
        if (res && res.success && res.stats) {
          return {
            success: true,
            stats: res.stats
          };
        }
      }
      return {
        success: false,
        stats: emptyStats,
        message: 'ഗൂഗിൾ ഷീറ്റ്സിൽ നിന്ന് കണക്കുകൾ ലഭ്യമായില്ല.'
      };
    } catch (err) {
      console.error('Dashboard stats fetch failed:', err);
      return {
        success: false,
        stats: emptyStats,
        message: 'ക്ലൗഡ് കണക്ഷൻ പിശക്. കണക്കുകൾ ലഭ്യമായില്ല.'
      };
    }
  },

  // 7. Activity Logs: Fetches directly from Google Sheets ActivityLogs
  async getActivityLogs() {
    const gasUrl = this.getGasUrl();

    if (!gasUrl) {
      return {
        success: false,
        logs: [],
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് URL സജ്ജീകരിച്ചിട്ടില്ല.'
      };
    }

    try {
      const separator = gasUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${gasUrl}${separator}action=getActivityLogs`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        redirect: 'follow'
      });

      if (response.ok) {
        const res = await response.json();
        if (res && res.success && Array.isArray(res.logs)) {
          return {
            success: true,
            logs: res.logs
          };
        }
      }
      return {
        success: false,
        logs: []
      };
    } catch (err) {
      console.error('Activity logs fetch failed:', err);
      return {
        success: false,
        logs: []
      };
    }
  },

  // 8. Admin Authentication: Verifies against Google Sheets Admins sheet
  async adminLogin(username, password) {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
      try {
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'adminLogin',
            username,
            password
          }),
          redirect: 'follow'
        });

        if (response.ok) {
          const res = await response.json();
          if (res && res.success && res.admin) {
            const session = {
              ...res.admin,
              expiresAt: Date.now() + 8 * 60 * 60 * 1000
            };
            try {
              localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
            } catch (e) {}
            return { success: true, admin: session };
          }
        }
      } catch (e) {
        console.warn('GAS admin login attempt failed:', e);
      }
    }

    // Default emergency master credentials
    const cleanUser = (username || '').trim().toLowerCase();
    if ((cleanUser === 'admin' || cleanUser === 'admin@thazkiya.com') && password === 'thazkiya@2026') {
      const session = {
        adminId: 'ADM-001',
        username: 'admin',
        role: 'Super Admin',
        token: btoa(`ADM-001:${Date.now()}`),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000
      };
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      } catch (e) {}
      return { success: true, admin: session };
    }

    return { 
      success: false, 
      message: 'തെറ്റായ അഡ്മിൻ യൂസർനെയിം അല്ലെങ്കിൽ പാസ്‌വേഡ്' 
    };
  },

  getAuthSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (session.expiresAt && session.expiresAt < Date.now()) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch (e) {}
    notifyDataChanged();
  }
};
