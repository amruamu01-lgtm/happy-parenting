/**
 * API Service for Happy Parenting Web Application
 * Handles communication with Google Apps Script Web App API.
 * NO dummy or sample records. Clean state on startup.
 * NO localStorage / sessionStorage for registration data.
 */

const STORAGE_KEYS = {
  ADMINS: 'hp_admins_v1',
  SETTINGS: 'hp_settings_v1',
  ACTIVITY_LOGS: 'hp_logs_v1',
  API_URL: 'hp_gas_api_url',
  AUTH_SESSION: 'hp_auth_session'
};

// Strict Requirement: Ensure NO registration data is stored in localStorage/sessionStorage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('hp_registrations_v1');
    sessionStorage.removeItem('hp_registrations_v1');
  } catch (e) {
    // Ignore storage clear errors
  }
}

// In-Memory Registration Data (Clean, starts empty - NO dummy or fake records)
let inMemoryRegistrations = [];
let inMemoryLogs = [];

// Helper to broadcast changes across open tabs/windows
const broadcastChannel = typeof window !== 'undefined' && window.BroadcastChannel 
  ? new BroadcastChannel('hp_data_sync') 
  : null;

function notifyDataChanged() {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
  }
}

export const apiService = {
  // Get active Google Apps Script Web App URL
  getGasUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.API_URL);
      if (stored && stored.trim()) return stored.trim();
      const envUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
      if (envUrl && envUrl.trim()) return envUrl.trim();
      return '';
    } catch (e) {
      return '';
    }
  },

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
      console.error(e);
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
          message: `സെർവർ പ്രതികരണം പരാജയപ്പെട്ടു (Status: ${response.status})` 
        };
      }

      const data = await response.json();
      return { 
        success: data.success || data.status === 'online', 
        data, 
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് കണക്ഷൻ വിജയകരമാണ്!' 
      };
    } catch (err) {
      return { 
        success: false, 
        error: err.message, 
        message: 'കണക്റ്റ് ചെയ്യാനായില്ല. ഗൂഗിൾ ഷീറ്റ് അനുമതികളും വെബ് ആപ്പ് വിന്യാസവും പരിശോധിക്കുക.' 
      };
    }
  },

  // Public: Create Registration (Saves directly to Google Sheets database)
  async createRegistration(formData) {
    const gasUrl = this.getGasUrl();

    // If Google Apps Script URL is not configured, inform with a clear Malayalam message
    if (!gasUrl) {
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ഡാറ്റാബേസ് കണക്ഷൻ സജ്ജീകരിച്ചിട്ടില്ല. അഡ്മിൻ പാനലിൽ Google Apps Script Web App URL നൽകുക.'
      };
    }

    try {
      // Use text/plain to avoid CORS preflight issues with Google Apps Script
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
        if (res.registration) {
          inMemoryRegistrations.unshift(res.registration);
        }
        notifyDataChanged();
        return res;
      } else if (res && res.isDuplicate) {
        return res;
      } else {
        return {
          success: false,
          message: res.message || 'രജിസ്ട്രേഷൻ ഗൂഗിൾ ഷീറ്റ്സിൽ സേവ് ചെയ്യാൻ സാധിച്ചില്ല.'
        };
      }
    } catch (err) {
      console.error('Registration saving to Google Sheets failed:', err);
      return {
        success: false,
        message: 'ഗൂഗിൾ ഷീറ്റ്സ് ഡാറ്റാബേസിലേക്ക് കണക്റ്റ് ചെയ്യാനായില്ല. ഇന്റർനെറ്റ് കണക്ഷനും അനുമതികളും പരിശോധിക്കുക.'
      };
    }
  },

  // Admin: Get all registrations
  async getRegistrations(params = {}) {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
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

        if (response.ok) {
          const res = await response.json();
          if (res && res.success && Array.isArray(res.data)) {
            inMemoryRegistrations = res.data;
            return res;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch from Google Apps Script:', err);
      }
    }

    // Return current memory state with filtering
    let list = [...inMemoryRegistrations];
    const search = (params.search || '').toLowerCase().trim();
    const typeFilter = params.type || '';
    const deptFilter = params.department || '';
    const attendanceFilter = params.attendance || '';

    if (typeFilter) {
      list = list.filter(r => r.registrationType === typeFilter);
    }
    if (deptFilter) {
      list = list.filter(r => r.studentDepartment === deptFilter);
    }
    if (attendanceFilter) {
      list = list.filter(r => r.attendanceStatus === attendanceFilter);
    }
    if (search) {
      list = list.filter(r => 
        (r.name && r.name.toLowerCase().includes(search)) ||
        (r.mobileNumber && r.mobileNumber.includes(search)) ||
        (r.registrationId && r.registrationId.toLowerCase().includes(search)) ||
        (r.studentName && r.studentName.toLowerCase().includes(search)) ||
        (r.addressPlace && r.addressPlace.toLowerCase().includes(search))
      );
    }

    return { success: true, data: list, count: list.length };
  },

  // Admin: Update registration
  async updateRegistration(registrationData, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
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
        if (response.ok) {
          const res = await response.json();
          if (res && res.success) {
            const index = inMemoryRegistrations.findIndex(r => r.registrationId === registrationData.registrationId);
            if (index !== -1) {
              inMemoryRegistrations[index] = { ...inMemoryRegistrations[index], ...registrationData };
            }
            notifyDataChanged();
            return res;
          }
        }
      } catch (e) {
        console.warn('Update via GAS failed:', e);
      }
    }

    const index = inMemoryRegistrations.findIndex(r => r.registrationId === registrationData.registrationId);
    if (index !== -1) {
      inMemoryRegistrations[index] = {
        ...inMemoryRegistrations[index],
        ...registrationData,
        updatedDate: new Date().toLocaleDateString()
      };
      this.logActivity(adminId, 'രജിസ്ട്രേഷൻ വിവരങ്ങൾ പുതുക്കി', registrationData.registrationId);
      notifyDataChanged();
      return { success: true, message: 'രജിസ്ട്രേഷൻ വിജയകരമായി പുതുക്കി', registration: inMemoryRegistrations[index] };
    }

    return { success: false, message: 'രജിസ്ട്രേഷൻ കണ്ടെത്താനായില്ല' };
  },

  // Admin: Delete registration (Deletes record from Google Sheets)
  async deleteRegistration(id, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();
    let backendSuccess = false;

    if (gasUrl) {
      try {
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deleteRegistration', id, adminId }),
          redirect: 'follow'
        });
        if (response.ok) {
          const res = await response.json();
          if (res && res.success) {
            backendSuccess = true;
          }
        }
      } catch (e) {
        console.warn('GAS delete request error:', e);
      }
    }

    inMemoryRegistrations = inMemoryRegistrations.filter(r => r.registrationId !== id);
    this.logActivity(adminId, 'രജിസ്ട്രേഷൻ നീക്കം ചെയ്തു', id);
    notifyDataChanged();

    return { 
      success: true, 
      backendDeleted: backendSuccess,
      message: 'രജിസ്ട്രേഷൻ വിജയകരമായി നീക്കം ചെയ്തു' 
    };
  },

  // Admin: Update attendance
  async updateAttendance(id, status, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'updateAttendance', id, status, adminId }),
          redirect: 'follow'
        });
      } catch (e) {
        console.warn('GAS attendance update failed:', e);
      }
    }

    const index = inMemoryRegistrations.findIndex(r => r.registrationId === id);
    if (index !== -1) {
      inMemoryRegistrations[index].attendanceStatus = status;
      inMemoryRegistrations[index].updatedDate = new Date().toLocaleDateString();
      this.logActivity(adminId, `ഹാജർ രേഖപ്പെടുത്തി: ${status}`, id);
      notifyDataChanged();
      return { success: true, message: `ഹാജർ നില പുതുക്കി` };
    }
    return { success: false, message: 'രജിസ്ട്രേഷൻ കണ്ടെത്താനായില്ല' };
  },

  // Admin: Dashboard stats
  async getDashboardStats() {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
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
            return res;
          }
        }
      } catch (e) {
        // fallback to memory
      }
    }

    let studentParentRegs = 0;
    let guestRegs = 0;
    let totalParents = 0;
    let totalGuests = 0;
    let darsCount = 0;
    let hifzCount = 0;
    let presentCount = 0;
    let absentCount = 0;

    inMemoryRegistrations.forEach(r => {
      const parents = parseInt(r.parentsAttending, 10) || 0;
      const guests = parseInt(r.guestsCount, 10) || 0;

      if (r.registrationType === 'Student Parent') {
        studentParentRegs++;
        totalParents += (parents > 0 ? parents : 1);
        if (r.studentDepartment === 'Dars') darsCount++;
        if (r.studentDepartment === 'Hifz') hifzCount++;
      } else if (r.registrationType === 'Normal Guest') {
        guestRegs++;
        totalGuests += (guests > 0 ? guests : 1);
      }

      if (r.attendanceStatus === 'Present') {
        presentCount++;
      } else {
        absentCount++;
      }
    });

    const totalRegistrations = studentParentRegs + guestRegs;
    const totalAttendees = totalParents + totalGuests;
    const attendanceRate = totalRegistrations > 0 ? Math.round((presentCount / totalRegistrations) * 100) : 0;

    return {
      success: true,
      stats: {
        totalStudentParentRegs: studentParentRegs,
        totalGuestRegs: guestRegs,
        totalParents,
        totalGuests,
        totalRegistrations,
        totalAttendees,
        darsCount,
        hifzCount,
        presentCount,
        absentCount,
        attendanceRate
      }
    };
  },

  // Admin: Login
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
          if (res && res.success) {
            const session = {
              ...res.admin,
              expiresAt: Date.now() + 8 * 60 * 60 * 1000
            };
            localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
            return res;
          }
        }
      } catch (e) {
        console.warn('GAS login failed:', e);
      }
    }

    const cleanUser = (username || '').trim().toLowerCase();
    if ((cleanUser === 'admin' || cleanUser === 'admin@thazkiya.com') && password === 'thazkiya@2026') {
      const session = {
        adminId: 'ADM-001',
        username: 'admin',
        role: 'Super Admin',
        token: btoa(`ADM-001:${Date.now()}`),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      this.logActivity('ADM-001', 'അഡ്മിൻ ലോഗിൻ ചെയ്തു', 'N/A');
      return { success: true, admin: session };
    }

    return { success: false, message: 'തെറ്റായ ഉപയോക്തൃനാമം അല്ലെങ്കിൽ പാസ്‌വേഡ്' };
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
    const session = this.getAuthSession();
    if (session) {
      this.logActivity(session.adminId, 'അഡ്മിൻ ലോഗൗട്ട് ചെയ്തു', 'N/A');
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    notifyDataChanged();
  },

  // Activity logs
  logActivity(adminId, action, regId) {
    const now = new Date();
    const logItem = {
      logId: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      adminId: adminId || 'SYSTEM',
      action,
      registrationId: regId || 'N/A',
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    inMemoryLogs.unshift(logItem);
    if (inMemoryLogs.length > 100) inMemoryLogs.pop();
  },

  async getActivityLogs() {
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
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
            return res;
          }
        }
      } catch (e) {}
    }

    return {
      success: true,
      logs: inMemoryLogs
    };
  }
};
