/**
 * =========================================================================
 * HAPPY PARENTING - GOOGLE APPS SCRIPT BACKEND
 * THAZKIYA ACADEMY, KARINKALLATHANI
 * =========================================================================
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new spreadsheet named "Happy Parenting Database")
 * 2. Click Extensions > Apps Script
 * 3. Replace all code in Code.gs with this entire file
 * 4. Run setupDatabase() once to initialize sheets, headers, and admin account
 * 5. Click Deploy > New deployment > Select type: Web app
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Copy the Web App URL and paste it into the React application Settings / .env
 */

const SPREADSHEET_ID = '1ZIHjHI_uNUrAh6IiZzU148I2vHs3z2ZCdbteRKH6SXI';

function getSpreadsheet() {
  if (typeof SPREADSHEET_ID !== 'undefined' && SPREADSHEET_ID && SPREADSHEET_ID.trim()) {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (e) {
      console.warn('Could not open spreadsheet by ID, falling back to active spreadsheet:', e);
    }
  }
  return getSpreadsheet();
}

const SHEET_NAMES = {
  REGISTRATIONS: 'Registrations',
  ADMINS: 'Admins',
  SETTINGS: 'Settings',
  ACTIVITY_LOGS: 'ActivityLogs'
};

const REGISTRATION_HEADERS = [
  'Registration ID',
  'Registration Type',
  'Parent / Guest Name',
  'Mobile Number',
  'WhatsApp Number',
  'Student Name',
  'Student Department',
  'Relationship',
  'Number of Parents Attending',
  'Number of Guests',
  'Address / Place',
  'Attendance Status',
  'Created Date',
  'Created Time',
  'Updated Date'
];

const ADMIN_HEADERS = [
  'Admin ID',
  'Username',
  'Password Hash',
  'Role',
  'Status',
  'Created Date'
];

const LOG_HEADERS = [
  'Log ID',
  'Admin ID',
  'Action',
  'Registration ID',
  'Date',
  'Time'
];

/**
 * Setup function to initialize sheets and default data
 */
function setupDatabase() {
  const ss = getSpreadsheet();

  // 1. Registrations Sheet
  let regSheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  if (!regSheet) {
    regSheet = ss.insertSheet(SHEET_NAMES.REGISTRATIONS);
  }
  if (regSheet.getLastRow() === 0) {
    regSheet.appendRow(REGISTRATION_HEADERS);
    regSheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length).setFontWeight('bold').setBackground('#123F32').setFontColor('#FFFFFF');
  }

  // 2. Admins Sheet
  let adminSheet = ss.getSheetByName(SHEET_NAMES.ADMINS);
  if (!adminSheet) {
    adminSheet = ss.insertSheet(SHEET_NAMES.ADMINS);
  }
  if (adminSheet.getLastRow() === 0) {
    adminSheet.appendRow(ADMIN_HEADERS);
    adminSheet.getRange(1, 1, 1, ADMIN_HEADERS.length).setFontWeight('bold').setBackground('#123F32').setFontColor('#FFFFFF');
    // Default admin: admin / thazkiya@2026
    const defaultPasswordHash = hashPassword('thazkiya@2026');
    adminSheet.appendRow(['ADM-001', 'admin', defaultPasswordHash, 'Super Admin', 'Active', new Date().toISOString()]);
  }

  // 3. Settings Sheet
  let settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_NAMES.SETTINGS);
  }
  if (settingsSheet.getLastRow() === 0) {
    settingsSheet.appendRow(['Key', 'Value', 'Description']);
    settingsSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#123F32').setFontColor('#FFFFFF');
    settingsSheet.appendRow(['programme_name', 'HAPPY PARENTING', 'Official event title']);
    settingsSheet.appendRow(['institution', 'THAZKIYA ACADEMY, KARINKALLATHANI', 'Host institution']);
    settingsSheet.appendRow(['event_date', 'November 22, Sunday', 'Event date']);
    settingsSheet.appendRow(['event_time', '10:00 AM – 2:00 PM', 'Event timing']);
    settingsSheet.appendRow(['event_leader', 'Abdul Hakeem Saqafi Al Arshadi Ayancheri', 'Programme leader']);
    settingsSheet.appendRow(['max_capacity', '500', 'Maximum allowed attendees']);
  }

  // 4. Activity Logs Sheet
  let logSheet = ss.getSheetByName(SHEET_NAMES.ACTIVITY_LOGS);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAMES.ACTIVITY_LOGS);
  }
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(LOG_HEADERS);
    logSheet.getRange(1, 1, 1, LOG_HEADERS.length).setFontWeight('bold').setBackground('#123F32').setFontColor('#FFFFFF');
    logSheet.appendRow(['LOG-0001', 'SYSTEM', 'Database initialized successfully', 'ALL', new Date().toLocaleDateString(), new Date().toLocaleTimeString()]);
  }

  return { success: true, message: 'Database structure initialized successfully.' };
}

/**
 * Handle GET requests
 */
function doGet(e) {
  return handleRequest(e, 'GET');
}

/**
 * Handle POST requests
 */
function doPost(e) {
  return handleRequest(e, 'POST');
}

/**
 * Central request router
 */
function handleRequest(e, method) {
  const lock = LockService.getScriptLock();
  try {
    // Wait for up to 10 seconds for concurrent requests
    lock.waitLock(10000);

    let params = {};
    if (e.parameter) {
      params = Object.assign({}, e.parameter);
    }

    let body = {};
    if (e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (err) {
        body = {};
      }
    }

    let paramData = {};
    if (params.data) {
      try {
        paramData = JSON.parse(params.data);
      } catch (err) {}
    } else if (params.registration) {
      try {
        paramData = typeof params.registration === 'string' ? JSON.parse(params.registration) : params.registration;
      } catch (err) {}
    }

    const action = params.action || body.action || paramData.action || 'ping';

    let response = { success: false, message: 'Unknown action: ' + action };

    switch (action) {
      case 'ping':
        response = { success: true, status: 'online', timestamp: new Date().toISOString() };
        break;

      case 'setup':
        response = setupDatabase();
        break;

      case 'adminLogin':
        response = handleAdminLogin(body.username || params.username, body.password || params.password);
        break;

      case 'createRegistration':
        response = handleCreateRegistration(body.registration || body || paramData.registration || paramData || params);
        break;

      case 'getRegistrations':
        response = handleGetRegistrations(params);
        break;

      case 'getRegistrationById':
        response = handleGetRegistrationById(params.id || body.id);
        break;

      case 'updateRegistration':
        response = handleUpdateRegistration(body.registration || body);
        break;

      case 'deleteRegistration':
        response = handleDeleteRegistration(params.id || body.id, body.adminId || params.adminId);
        break;

      case 'updateAttendance':
        response = handleUpdateAttendance(body.id || params.id, body.status || params.status, body.adminId || params.adminId);
        break;

      case 'getDashboardStats':
        response = handleGetDashboardStats();
        break;

      case 'getReports':
        response = handleGetReports();
        break;

      case 'getActivityLogs':
        response = handleGetActivityLogs();
        break;

      case 'getSettings':
        response = handleGetSettings();
        break;

      default:
        response = { success: false, message: 'Unsupported action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString(),
      message: 'Internal server error occurred.'
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * SHA-256 password hashing helper
 */
function hashPassword(password) {
  const salt = 'Thazkiya_HP_2026_Secure_Salt#$';
  const rawBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + salt, Utilities.Charset.UTF_8);
  let hashStr = '';
  for (let i = 0; i < rawBytes.length; i++) {
    let byteVal = rawBytes[i];
    if (byteVal < 0) byteVal += 256;
    let hex = byteVal.toString(16);
    if (hex.length === 1) hex = '0' + hex;
    hashStr += hex;
  }
  return hashStr;
}

/**
 * Admin Login
 */
function handleAdminLogin(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Username and password are required' };
  }

  const ss = getSpreadsheet();
  const adminSheet = ss.getSheetByName(SHEET_NAMES.ADMINS);
  if (!adminSheet) return { success: false, message: 'Admins sheet not initialized' };

  const data = adminSheet.getDataRange().getValues();
  const inputHash = hashPassword(password);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowUser = (row[1] || '').toString().trim().toLowerCase();
    const rowHash = (row[2] || '').toString().trim();
    const rowStatus = (row[4] || '').toString().trim();

    if (rowUser === username.toLowerCase().trim()) {
      if (rowStatus !== 'Active') {
        return { success: false, message: 'Admin account is deactivated' };
      }
      if (rowHash === inputHash) {
        logActivity(row[0], 'Admin Login', 'N/A');
        return {
          success: true,
          admin: {
            adminId: row[0],
            username: row[1],
            role: row[3],
            token: Utilities.base64Encode(row[0] + ':' + new Date().getTime())
          }
        };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    }
  }

  return { success: false, message: 'Admin user not found' };
}

/**
 * Create Registration
 */
function handleCreateRegistration(data) {
  if (!data) return { success: false, message: 'No registration data provided' };

  const type = (data.registrationType || data.type || '').trim();
  const name = (data.name || data.parentGuestName || '').trim();
  const mobile = (data.mobileNumber || data.mobile || '').toString().trim();
  const whatsapp = (data.whatsappNumber || data.whatsapp || mobile).toString().trim();
  const place = (data.addressPlace || data.address || '').trim();

  // Basic validations
  if (!type || !name || !mobile) {
    return { success: false, message: 'Registration type, Name, and Mobile number are required.' };
  }

  if (type === 'Student Parent') {
    if (!data.studentName || !data.studentDepartment || !data.relationship) {
      return { success: false, message: 'Student Name, Department, and Relationship are required for Student Parents.' };
    }
    // Strict Department restriction: ONLY Dars or Hifz
    if (data.studentDepartment !== 'Dars' && data.studentDepartment !== 'Hifz') {
      return { success: false, message: 'Student Department must be strictly Dars or Hifz.' };
    }
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  if (!sheet) return { success: false, message: 'Registrations sheet missing' };

  // Duplicate Check: Same Mobile Number + Same Registration Type
  const allData = sheet.getDataRange().getValues();
  for (let i = 1; i < allData.length; i++) {
    const existingType = allData[i][1];
    const existingMobile = (allData[i][3] || '').toString().trim();
    if (existingMobile === mobile && existingType === type) {
      return {
        success: false,
        isDuplicate: true,
        message: 'A registration already exists with this mobile number for ' + type + '. Registration ID: ' + allData[i][0]
      };
    }
  }

  // Generate Unique ID: HP-SP-1001 for Student Parent, HP-NG-2001 for Normal Guest
  const prefix = (type === 'Student Parent') ? 'HP-SP' : 'HP-NG';
  const startNum = (type === 'Student Parent') ? 1000 : 2000;
  let maxIdNum = startNum;

  for (let i = 1; i < allData.length; i++) {
    const regId = (allData[i][0] || '').toString();
    if (regId.startsWith(prefix)) {
      const parts = regId.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxIdNum) {
        maxIdNum = num;
      }
    }
  }

  const nextId = prefix + '-' + (maxIdNum + 1);
  const now = new Date();
  const createdDate = now.toLocaleDateString();
  const createdTime = now.toLocaleTimeString();

  const studentName = (type === 'Student Parent') ? (data.studentName || '').trim() : '';
  const studentDept = (type === 'Student Parent') ? (data.studentDepartment || '').trim() : '';
  const relationship = (type === 'Student Parent') ? (data.relationship || '').trim() : '';
  const parentsCount = (type === 'Student Parent') ? (parseInt(data.parentsAttending, 10) || 1) : '';
  const guestsCount = (type === 'Normal Guest') ? (parseInt(data.guestsCount || data.numberGuests, 10) || 1) : '';

  const newRow = [
    nextId,
    type,
    name,
    mobile,
    whatsapp,
    studentName,
    studentDept,
    relationship,
    parentsCount,
    guestsCount,
    place,
    'Absent', // Default attendance status
    createdDate,
    createdTime,
    createdDate
  ];

  sheet.appendRow(newRow);
  logActivity('PUBLIC', 'New Registration Created', nextId);

  return {
    success: true,
    registrationId: nextId,
    registration: {
      registrationId: nextId,
      registrationType: type,
      name: name,
      mobileNumber: mobile,
      whatsappNumber: whatsapp,
      studentName: studentName,
      studentDepartment: studentDept,
      relationship: relationship,
      parentsAttending: parentsCount,
      guestsCount: guestsCount,
      addressPlace: place,
      attendanceStatus: 'Absent',
      createdDate: createdDate,
      createdTime: createdTime
    }
  };
}

/**
 * Get all registrations with filtering & search
 */
function handleGetRegistrations(params) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  if (!sheet) return { success: false, data: [] };

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { success: true, data: [] };

  const list = [];
  const search = (params.search || '').toLowerCase().trim();
  const typeFilter = params.type || '';
  const deptFilter = params.department || '';
  const attendanceFilter = params.attendance || '';

  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    const item = {
      registrationId: r[0],
      registrationType: r[1],
      name: r[2],
      mobileNumber: (r[3] || '').toString(),
      whatsappNumber: (r[4] || '').toString(),
      studentName: r[5],
      studentDepartment: r[6],
      relationship: r[7],
      parentsAttending: r[8],
      guestsCount: r[9],
      addressPlace: r[10],
      attendanceStatus: r[11] || 'Absent',
      createdDate: r[12],
      createdTime: r[13],
      updatedDate: r[14]
    };

    // Filter type
    if (typeFilter && item.registrationType !== typeFilter) continue;
    // Filter department
    if (deptFilter && item.studentDepartment !== deptFilter) continue;
    // Filter attendance
    if (attendanceFilter && item.attendanceStatus !== attendanceFilter) continue;

    // Search query
    if (search) {
      const matchName = (item.name || '').toLowerCase().includes(search);
      const matchMobile = item.mobileNumber.includes(search);
      const matchId = (item.registrationId || '').toLowerCase().includes(search);
      const matchStudent = (item.studentName || '').toLowerCase().includes(search);
      if (!matchName && !matchMobile && !matchId && !matchStudent) continue;
    }

    list.push(item);
  }

  // Sort by latest first
  list.reverse();

  return { success: true, data: list, count: list.length };
}

/**
 * Get registration by ID
 */
function handleGetRegistrationById(id) {
  if (!id) return { success: false, message: 'ID required' };

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      const r = values[i];
      return {
        success: true,
        registration: {
          registrationId: r[0],
          registrationType: r[1],
          name: r[2],
          mobileNumber: (r[3] || '').toString(),
          whatsappNumber: (r[4] || '').toString(),
          studentName: r[5],
          studentDepartment: r[6],
          relationship: r[7],
          parentsAttending: r[8],
          guestsCount: r[9],
          addressPlace: r[10],
          attendanceStatus: r[11] || 'Absent',
          createdDate: r[12],
          createdTime: r[13],
          updatedDate: r[14]
        }
      };
    }
  }

  return { success: false, message: 'Registration not found' };
}

/**
 * Update Registration
 */
function handleUpdateRegistration(data) {
  if (!data || !data.registrationId) {
    return { success: false, message: 'Registration ID required for update' };
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.registrationId) {
      const rowIndex = i + 1;
      const type = data.registrationType || values[i][1];
      const name = data.name !== undefined ? data.name : values[i][2];
      const mobile = data.mobileNumber !== undefined ? data.mobileNumber : values[i][3];
      const whatsapp = data.whatsappNumber !== undefined ? data.whatsappNumber : values[i][4];
      const studentName = (type === 'Student Parent') ? (data.studentName !== undefined ? data.studentName : values[i][5]) : '';
      const studentDept = (type === 'Student Parent') ? (data.studentDepartment !== undefined ? data.studentDepartment : values[i][6]) : '';
      const relationship = (type === 'Student Parent') ? (data.relationship !== undefined ? data.relationship : values[i][7]) : '';
      const parentsCount = (type === 'Student Parent') ? (data.parentsAttending !== undefined ? data.parentsAttending : values[i][8]) : '';
      const guestsCount = (type === 'Normal Guest') ? (data.guestsCount !== undefined ? data.guestsCount : values[i][9]) : '';
      const place = data.addressPlace !== undefined ? data.addressPlace : values[i][10];
      const attendance = data.attendanceStatus !== undefined ? data.attendanceStatus : values[i][11];
      const updatedDate = new Date().toLocaleDateString();

      sheet.getRange(rowIndex, 2).setValue(type);
      sheet.getRange(rowIndex, 3).setValue(name);
      sheet.getRange(rowIndex, 4).setValue(mobile);
      sheet.getRange(rowIndex, 5).setValue(whatsapp);
      sheet.getRange(rowIndex, 6).setValue(studentName);
      sheet.getRange(rowIndex, 7).setValue(studentDept);
      sheet.getRange(rowIndex, 8).setValue(relationship);
      sheet.getRange(rowIndex, 9).setValue(parentsCount);
      sheet.getRange(rowIndex, 10).setValue(guestsCount);
      sheet.getRange(rowIndex, 11).setValue(place);
      sheet.getRange(rowIndex, 12).setValue(attendance);
      sheet.getRange(rowIndex, 15).setValue(updatedDate);

      logActivity(data.adminId || 'ADMIN', 'Updated Registration', data.registrationId);
      return { success: true, message: 'Registration updated successfully' };
    }
  }

  return { success: false, message: 'Registration record not found' };
}

/**
 * Delete Registration
 */
function handleDeleteRegistration(id, adminId) {
  if (!id) return { success: false, message: 'ID required' };

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      logActivity(adminId || 'ADMIN', 'Deleted Registration', id);
      return { success: true, message: 'Registration deleted successfully' };
    }
  }

  return { success: false, message: 'Registration record not found' };
}

/**
 * Update Attendance
 */
function handleUpdateAttendance(id, status, adminId) {
  if (!id || !status) return { success: false, message: 'ID and Status are required' };

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.getRange(i + 1, 12).setValue(status);
      sheet.getRange(i + 1, 15).setValue(new Date().toLocaleDateString());
      logActivity(adminId || 'ADMIN', 'Attendance marked: ' + status, id);
      return { success: true, message: 'Attendance updated to ' + status };
    }
  }

  return { success: false, message: 'Registration record not found' };
}

/**
 * Dashboard Statistics
 */
function handleGetDashboardStats() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REGISTRATIONS);
  if (!sheet) return { success: false };

  const values = sheet.getDataRange().getValues();
  let studentParentRegs = 0;
  let guestRegs = 0;
  let totalParents = 0;
  let totalGuests = 0;
  let darsCount = 0;
  let hifzCount = 0;
  let presentCount = 0;
  let absentCount = 0;

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const type = row[1];
    const dept = row[6];
    const parents = parseInt(row[8], 10) || 0;
    const guests = parseInt(row[9], 10) || 0;
    const attendance = row[11] || 'Absent';

    if (type === 'Student Parent') {
      studentParentRegs++;
      totalParents += (parents > 0 ? parents : 1);
      if (dept === 'Dars') darsCount++;
      if (dept === 'Hifz') hifzCount++;
    } else if (type === 'Normal Guest') {
      guestRegs++;
      totalGuests += (guests > 0 ? guests : 1);
    }

    if (attendance === 'Present') {
      presentCount++;
    } else {
      absentCount++;
    }
  }

  const totalAttendees = totalParents + totalGuests;
  const totalRegistrations = studentParentRegs + guestRegs;
  const attendanceRate = totalRegistrations > 0 ? Math.round((presentCount / totalRegistrations) * 100) : 0;

  return {
    success: true,
    stats: {
      totalStudentParentRegs: studentParentRegs,
      totalGuestRegs: guestRegs,
      totalParents: totalParents,
      totalGuests: totalGuests,
      totalRegistrations: totalRegistrations,
      totalAttendees: totalAttendees,
      darsCount: darsCount,
      hifzCount: hifzCount,
      presentCount: presentCount,
      absentCount: absentCount,
      attendanceRate: attendanceRate
    }
  };
}

/**
 * Reports
 */
function handleGetReports() {
  const statsRes = handleGetDashboardStats();
  return {
    success: true,
    programme: {
      name: 'HAPPY PARENTING',
      institution: 'THAZKIYA ACADEMY, KARINKALLATHANI',
      date: '22 NOVEMBER • SUNDAY',
      time: '10:00 AM – 2:00 PM',
      lead: 'Abdul Hakeem Saqafi Al Arshadi Ayancheri'
    },
    metrics: statsRes.stats
  };
}

/**
 * Activity Logs
 */
function logActivity(adminId, action, regId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.ACTIVITY_LOGS);
    if (!sheet) return;

    const logId = 'LOG-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    sheet.appendRow([
      logId,
      adminId || 'SYSTEM',
      action,
      regId || 'N/A',
      now.toLocaleDateString(),
      now.toLocaleTimeString()
    ]);
  } catch (e) {
    // Silent fail for logging to not block main flow
  }
}

function handleGetActivityLogs() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.ACTIVITY_LOGS);
  if (!sheet) return { success: true, logs: [] };

  const values = sheet.getDataRange().getValues();
  const logs = [];
  for (let i = 1; i < values.length; i++) {
    logs.push({
      logId: values[i][0],
      adminId: values[i][1],
      action: values[i][2],
      registrationId: values[i][3],
      date: values[i][4],
      time: values[i][5]
    });
  }
  logs.reverse();
  return { success: true, logs: logs.slice(0, 50) };
}

/**
 * Settings
 */
function handleGetSettings() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  if (!sheet) return { success: true, settings: {} };

  const values = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < values.length; i++) {
    settings[values[i][0]] = values[i][1];
  }
  return { success: true, settings: settings };
}
