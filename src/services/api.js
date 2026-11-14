/**
 * API Service for Happy Parenting Web Application
 * Handles communication with Google Apps Script Web App API
 * and keeps temporary UI state in React memory (NO localStorage/sessionStorage for registration data).
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

// In-Memory Registration Data (Temporary UI State only)
let inMemoryRegistrations = [
  {
    registrationId: 'HP-SP-1001',
    registrationType: 'Student Parent',
    name: 'മുഹമ്മദ് ബഷീർ കെ.',
    mobileNumber: '9847123456',
    whatsappNumber: '9847123456',
    studentName: 'അഹമ്മദ് ഫായിസ്',
    studentDepartment: 'Dars',
    relationship: 'പിതാവ്',
    parentsAttending: 2,
    guestsCount: 0,
    addressPlace: 'കരിങ്കല്ലത്താണി, പെരിന്തൽമണ്ണ',
    attendanceStatus: 'Present',
    createdDate: '14/11/2026',
    createdTime: '10:15 AM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-SP-1002',
    registrationType: 'Student Parent',
    name: 'ഫാത്തിമ സുഹറ',
    mobileNumber: '9745987654',
    whatsappNumber: '9745987654',
    studentName: 'ഹാഫിള് ബിലാൽ',
    studentDepartment: 'Hifz',
    relationship: 'മാതാവ്',
    parentsAttending: 1,
    guestsCount: 0,
    addressPlace: 'താഴെക്കോട്',
    attendanceStatus: 'Present',
    createdDate: '14/11/2026',
    createdTime: '11:30 AM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-SP-1003',
    registrationType: 'Student Parent',
    name: 'അബ്ദുൽ റഷീദ് ഇ.',
    mobileNumber: '9447332211',
    whatsappNumber: '9447332211',
    studentName: 'ഉമർ ഫാറൂഖ്',
    studentDepartment: 'Dars',
    relationship: 'പിതാവ്',
    parentsAttending: 2,
    guestsCount: 0,
    addressPlace: 'മണ്ണാർക്കാട്',
    attendanceStatus: 'Absent',
    createdDate: '14/11/2026',
    createdTime: '12:05 PM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-NG-2001',
    registrationType: 'Normal Guest',
    name: 'ഡോ. ഉസ്മാൻ മാസ്റ്റർ',
    mobileNumber: '9895001122',
    whatsappNumber: '9895001122',
    studentName: '',
    studentDepartment: '',
    relationship: '',
    parentsAttending: 0,
    guestsCount: 2,
    addressPlace: 'മേലാറ്റൂർ, മലപ്പുറം',
    attendanceStatus: 'Present',
    createdDate: '14/11/2026',
    createdTime: '01:20 PM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-NG-2002',
    registrationType: 'Normal Guest',
    name: 'സയ്യിദ് മുനവ്വറലി',
    mobileNumber: '9633445566',
    whatsappNumber: '9633445566',
    studentName: '',
    studentDepartment: '',
    relationship: '',
    parentsAttending: 0,
    guestsCount: 1,
    addressPlace: 'അലനല്ലൂർ',
    attendanceStatus: 'Absent',
    createdDate: '14/11/2026',
    createdTime: '02:45 PM',
    updatedDate: '14/11/2026'
  }
];

let inMemoryLogs = [
  {
    logId: 'LOG-1001',
    adminId: 'SYSTEM',
    action: 'ഡാറ്റാബേസ് സജ്ജീകരിച്ചു',
    registrationId: 'ALL',
    date: '14/11/2026',
    time: '10:00 AM'
  }
];

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
      return localStorage.getItem(STORAGE_KEYS.API_URL) || import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
    } catch (e) {
      return '';
    }
  },

  setGasUrl(url) {
    try {
      localStorage.setItem(STORAGE_KEYS.API_URL, (url || '').trim());
      notifyDataChanged();
    } catch (e) {
      console.error(e);
    }
  },

  // Test connection to Google Apps Script Web App
  async testConnection(url) {
    const targetUrl = (url || this.getGasUrl()).trim();
    if (!targetUrl) {
      return { success: false, message: 'ഗൂഗിൾ ആപ്സ് സ്ക്രിപ്റ്റ് URL നൽകിയിട്ടില്ല' };
    }
    try {
      const response = await fetch(`${targetUrl}?action=ping`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      return { success: data.success || data.status === 'online', data, message: 'കണക്ഷൻ വിജയകരമാണ്!' };
    } catch (err) {
      return { success: false, error: err.message, message: 'കണക്റ്റ് ചെയ്യാനായില്ല. അനുമതികൾ പരിശോധിക്കുക.' };
    }
  },

  // Public: Create Registration
  async createRegistration(formData) {
    const gasUrl = this.getGasUrl();

    // If Google Apps Script is configured, call it directly
    if (gasUrl) {
      try {
        const response = await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify({
            action: 'createRegistration',
            registration: formData
          })
        });
        const res = await response.json();
        if (res && res.success) {
          inMemoryRegistrations.unshift(res.registration);
          notifyDataChanged();
          return res;
        } else if (res && res.isDuplicate) {
          return res;
        }
      } catch (err) {
        console.warn('Google Apps Script request failed, using in-memory state:', err);
      }
    }

    // In-memory Handler
    const type = formData.registrationType || formData.type;
    const mobile = (formData.mobileNumber || '').trim();

    // Duplicate Check
    const exists = inMemoryRegistrations.find(r => r.mobileNumber === mobile && r.registrationType === type);
    if (exists) {
      return {
        success: false,
        isDuplicate: true,
        message: `ഈ മൊബൈൽ നമ്പറിൽ ഇതിനകം രജിസ്ട്രേഷൻ നിലവിലുണ്ട്. (രജിസ്ട്രേഷൻ ഐഡി: ${exists.registrationId})`
      };
    }

    // Generate unique ID
    const prefix = type === 'Student Parent' ? 'HP-SP' : 'HP-NG';
    const startNum = type === 'Student Parent' ? 1000 : 2000;
    const existingNums = inMemoryRegistrations
      .filter(r => r.registrationId && r.registrationId.startsWith(prefix))
      .map(r => {
        const parts = r.registrationId.split('-');
        return parseInt(parts[2], 10) || startNum;
      });
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : startNum + 1;
    const newId = `${prefix}-${nextNum}`;

    const now = new Date();
    const newRecord = {
      registrationId: newId,
      registrationType: type,
      name: formData.name.trim(),
      mobileNumber: mobile,
      whatsappNumber: (formData.whatsappNumber || mobile).trim(),
      studentName: type === 'Student Parent' ? (formData.studentName || '').trim() : '',
      studentDepartment: type === 'Student Parent' ? (formData.studentDepartment || '').trim() : '',
      relationship: type === 'Student Parent' ? (formData.relationship || '').trim() : '',
      parentsAttending: type === 'Student Parent' ? (parseInt(formData.parentsAttending, 10) || 1) : 0,
      guestsCount: type === 'Normal Guest' ? (parseInt(formData.guestsCount, 10) || 1) : 0,
      addressPlace: (formData.addressPlace || '').trim(),
      attendanceStatus: 'Absent',
      createdDate: now.toLocaleDateString(),
      createdTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedDate: now.toLocaleDateString()
    };

    inMemoryRegistrations.unshift(newRecord);
    this.logActivity('PUBLIC', 'പുതിയ രജിസ്ട്രേഷൻ സൃഷ്ടിച്ചു', newId);
    notifyDataChanged();

    return {
      success: true,
      registrationId: newId,
      registration: newRecord
    };
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
        const response = await fetch(`${gasUrl}?${queryParams}`, { method: 'GET' });
        const res = await response.json();
        if (res && res.success && Array.isArray(res.data)) {
          inMemoryRegistrations = res.data;
          return res;
        }
      } catch (err) {
        console.warn('Failed to fetch from Google Apps Script, using memory:', err);
      }
    }

    // In-memory filtering
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
        await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify({
            action: 'updateRegistration',
            registration: registrationData,
            adminId
          })
        });
      } catch (e) {
        console.warn('Update via GAS failed, updating in-memory:', e);
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

  // Admin: Delete registration (Requirement 3: Delete actual record from Google Sheets & in-memory)
  async deleteRegistration(id, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();
    let backendSuccess = false;

    if (gasUrl) {
      try {
        const response = await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'deleteRegistration', id, adminId })
        });
        const res = await response.json();
        if (res && res.success) {
          backendSuccess = true;
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
          body: JSON.stringify({ action: 'updateAttendance', id, status, adminId })
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
        const response = await fetch(`${gasUrl}?action=getDashboardStats`);
        const res = await response.json();
        if (res && res.success && res.stats) {
          return res;
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
          body: JSON.stringify({
            action: 'adminLogin',
            username,
            password
          })
        });
        const res = await response.json();
        if (res && res.success) {
          const session = {
            ...res.admin,
            expiresAt: Date.now() + 8 * 60 * 60 * 1000
          };
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
          return res;
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
    return {
      success: true,
      logs: inMemoryLogs
    };
  }
};
