/**
 * Central API Configuration for HAPPY PARENTING Web Application
 * Google Sheets Cloud Database Backend
 */

export const API_CONFIG = {
  // Official Google Spreadsheet ID
  SPREADSHEET_ID: '1ZIHjHI_uNUrAh6IiZzU148I2vHs3z2ZCdbteRKH6SXI',
  
  // Google Apps Script Web App Deployment URL
  // Can be configured via VITE_GOOGLE_APPS_SCRIPT_URL environment variable or Admin Settings
  DEFAULT_ENDPOINT: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL) 
    ? import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL.trim() 
    : '',

  // Storage key for admin endpoint configuration override
  STORAGE_KEY_ENDPOINT: 'hp_gas_api_url',

  // Storage key for authentication session
  STORAGE_KEY_SESSION: 'hp_auth_session',

  // Automatic multi-device sync interval: 12 seconds (strictly meets 10–15 seconds requirement)
  AUTO_REFRESH_INTERVAL_MS: 12000,

  // Programme Information
  PROGRAMME_NAME: 'HAPPY PARENTING',
  INSTITUTION: 'THAZKIYA ACADEMY, KARINKALLATHANI',
  EVENT_DATE: 'November 22, Sunday',
  EVENT_TIME: '10:00 AM – 2:00 PM',
  EVENT_LEADER: 'Abdul Hakeem Saqafi Al arshadi Ayancheri'
};
