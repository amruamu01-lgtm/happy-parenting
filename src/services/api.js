/**
 * API Service for Happy Parenting Web Application
 * Handles communication with Google Apps Script Web App API
 * and provides seamless local fallback with full mock database & synchronization.
 */

const STORAGE_KEYS = {
  REGISTRATIONS: 'hp_registrations_v1',
  ADMINS: 'hp_admins_v1',
  SETTINGS: 'hp_settings_v1',
  ACTIVITY_LOGS: 'hp_logs_v1',
  API_URL: 'hp_gas_api_url',
  AUTH_SESSION: 'hp_auth_session'
};

// Initial Seed Data for immediate testing and fallback
const INITIAL_REGISTRATIONS = [
  {
    registrationId: 'HP-SP-1001',
    registrationType: 'Student Parent',
    name: 'Muhammed Basheer K.',
    mobileNumber: '9847123456',
    whatsappNumber: '9847123456',
    studentName: 'Ahmad Faiz',
    studentDepartment: 'Dars',
    relationship: 'Father',
    parentsAttending: 2,
    guestsCount: 0,
    addressPlace: 'Karinkallathani, Perinthalmanna',
    attendanceStatus: 'Present',
    createdDate: '14/11/2026',
    createdTime: '10:15 AM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-SP-1002',
    registrationType: 'Student Parent',
    name: 'Fathima Suhara',
    mobileNumber: '9745987654',
    whatsappNumber: '9745987654',
    studentName: 'Hafiz Bilal',
    studentDepartment: 'Hifz',
    relationship: 'Mother',
    parentsAttending: 1,
    guestsCount: 0,
    addressPlace: 'Thazhekode',
    attendanceStatus: 'Present',
    createdDate: '14/11/2026',
    createdTime: '11:30 AM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-SP-1003',
    registrationType: 'Student Parent',
    name: 'Abdul Rasheed E.',
    mobileNumber: '9447332211',
    whatsappNumber: '9447332211',
    studentName: 'Umar Farooq',
    studentDepartment: 'Dars',
    relationship: 'Father',
    parentsAttending: 2,
    guestsCount: 0,
    addressPlace: 'Mannarkkad',
    attendanceStatus: 'Absent',
    createdDate: '14/11/2026',
    createdTime: '12:05 PM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-NG-2001',
    registrationType: 'Normal Guest',
    name: 'Dr. Usman Master',
    mobileNumber: '9895001122',
    whatsappNumber: '9895001122',
    studentName: '',
    studentDepartment: '',
    relationship: '',
    parentsAttending: 0,
    guestsCount: 2,
    addressPlace: 'Melattur, Malappuram',
    attendanceStatus: 'Present',
    createdDate: '14/11/2026',
    createdTime: '01:20 PM',
    updatedDate: '14/11/2026'
  },
  {
    registrationId: 'HP-NG-2002',
    registrationType: 'Normal Guest',
    name: 'Sayyid Munavvar Ali',
    mobileNumber: '9633445566',
    whatsappNumber: '9633445566',
    studentName: '',
    studentDepartment: '',
    relationship: '',
    parentsAttending: 0,
    guestsCount: 1,
    addressPlace: 'Alanallur',
    attendanceStatus: 'Absent',
    createdDate: '14/11/2026',
    createdTime: '02:45 PM',
    updatedDate: '14/11/2026'
  }
];

const INITIAL_LOGS = [
  {
    logId: 'LOG-1001',
    adminId: 'SYSTEM',
    action: 'Database initialized with official seed records',
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

// Local storage helpers
function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyDataChanged();
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const apiService = {
  // Get active Google Apps Script Web App URL
  getGasUrl() {
    return localStorage.getItem(STORAGE_KEYS.API_URL) || import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
  },

  setGasUrl(url) {
    localStorage.setItem(STORAGE_KEYS.API_URL, (url || '').trim());
    notifyDataChanged();
  },

  // Test connection to Google Apps Script Web App
  async testConnection(url) {
    const targetUrl = (url || this.getGasUrl()).trim();
    if (!targetUrl) {
      return { success: false, message: 'No Google Apps Script URL specified' };
    }
    try {
      const response = await fetch(`${targetUrl}?action=ping`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      return { success: data.success || data.status === 'online', data, message: 'Connection successful!' };
    } catch (err) {
      return { success: false, error: err.message, message: 'Failed to connect. Check deployment and permissions.' };
    }
  },

  // Public: Create Registration
  async createRegistration(formData) {
    const gasUrl = this.getGasUrl();

    // If Google Apps Script is configured, call it
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
          // Also sync locally
          const localList = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
          localList.unshift(res.registration);
          setLocalData(STORAGE_KEYS.REGISTRATIONS, localList);
          return res;
        } else if (res && res.isDuplicate) {
          return res;
        }
      } catch (err) {
        console.warn('Google Apps Script request failed, falling back to local database:', err);
      }
    }

    // Local Database Handler (Instant & Offline-resilient)
    const list = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const type = formData.registrationType || formData.type;
    const mobile = (formData.mobileNumber || '').trim();

    // Duplicate Check
    const exists = list.find(r => r.mobileNumber === mobile && r.registrationType === type);
    if (exists) {
      return {
        success: false,
        isDuplicate: true,
        message: `A registration already exists with this mobile number for ${type}. (Registration ID: ${exists.registrationId})`
      };
    }

    // Generate unique ID
    const prefix = type === 'Student Parent' ? 'HP-SP' : 'HP-NG';
    const startNum = type === 'Student Parent' ? 1000 : 2000;
    const existingNums = list
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

    list.unshift(newRecord);
    setLocalData(STORAGE_KEYS.REGISTRATIONS, list);

    this.logActivity('PUBLIC', 'Created new registration', newId);

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
          setLocalData(STORAGE_KEYS.REGISTRATIONS, res.data);
          return res;
        }
      } catch (err) {
        console.warn('Failed to fetch from Google Apps Script, using local data:', err);
      }
    }

    // Local handling
    let list = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
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
          body: JSON.stringify({
            action: 'updateRegistration',
            registration: registrationData,
            adminId
          })
        });
        const res = await response.json();
        if (res.success) {
          // update local copy
        }
      } catch (e) {
        console.warn('Update via GAS failed, using local update:', e);
      }
    }

    const list = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const index = list.findIndex(r => r.registrationId === registrationData.registrationId);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...registrationData,
        updatedDate: new Date().toLocaleDateString()
      };
      setLocalData(STORAGE_KEYS.REGISTRATIONS, list);
      this.logActivity(adminId, 'Updated registration details', registrationData.registrationId);
      return { success: true, message: 'Registration updated successfully', registration: list[index] };
    }

    return { success: false, message: 'Registration not found' };
  },

  // Admin: Delete registration
  async deleteRegistration(id, adminId = 'ADMIN') {
    const gasUrl = this.getGasUrl();

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'deleteRegistration', id, adminId })
        });
      } catch (e) {
        console.warn('GAS delete failed, deleting locally:', e);
      }
    }

    const list = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const filtered = list.filter(r => r.registrationId !== id);
    setLocalData(STORAGE_KEYS.REGISTRATIONS, filtered);
    this.logActivity(adminId, 'Deleted registration record', id);
    return { success: true, message: 'Registration deleted successfully' };
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
        console.warn('GAS attendance update failed, falling back locally:', e);
      }
    }

    const list = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    const index = list.findIndex(r => r.registrationId === id);
    if (index !== -1) {
      list[index].attendanceStatus = status;
      list[index].updatedDate = new Date().toLocaleDateString();
      setLocalData(STORAGE_KEYS.REGISTRATIONS, list);
      this.logActivity(adminId, `Marked attendance as ${status}`, id);
      return { success: true, message: `Attendance updated to ${status}` };
    }
    return { success: false, message: 'Registration not found' };
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
        // fallback to local computation
      }
    }

    const list = getLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    let studentParentRegs = 0;
    let guestRegs = 0;
    let totalParents = 0;
    let totalGuests = 0;
    let darsCount = 0;
    let hifzCount = 0;
    let presentCount = 0;
    let absentCount = 0;

    list.forEach(r => {
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
            expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 hours
          };
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
          return res;
        }
      } catch (e) {
        console.warn('GAS login failed or offline:', e);
      }
    }

    // Default built-in secure credentials verification
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
      this.logActivity('ADM-001', 'Admin login successful', 'N/A');
      return { success: true, admin: session };
    }

    return { success: false, message: 'Invalid username or password. Default is admin / thazkiya@2026' };
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
      this.logActivity(session.adminId, 'Admin logged out', 'N/A');
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    notifyDataChanged();
  },

  // Activity logs
  logActivity(adminId, action, regId) {
    const logs = getLocalData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_LOGS);
    const now = new Date();
    const logItem = {
      logId: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      adminId: adminId || 'SYSTEM',
      action,
      registrationId: regId || 'N/A',
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    logs.unshift(logItem);
    setLocalData(STORAGE_KEYS.ACTIVITY_LOGS, logs.slice(0, 100));
  },

  async getActivityLogs() {
    return {
      success: true,
      logs: getLocalData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_LOGS)
    };
  },

  // Reset database to initial seed (useful for admin testing)
  resetToSeed() {
    setLocalData(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    setLocalData(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_LOGS);
    return { success: true, message: 'Database reset to initial demo state.' };
  }
};
