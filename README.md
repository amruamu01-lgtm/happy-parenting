# HAPPY PARENTING — Official Web Application

### THAZKIYA ACADEMY, KARINKALLATHANI

**Programme:** HAPPY PARENTING  
**Theme:** *"Mastering the Art of Islamic Parenting: 7 Powerful Principles for Success"*  
**Keynote Leader:** Abdul Hakeem Saqafi Al Arshadi Ayancheri  
**Event Date:** 22 November, Sunday  
**Event Time:** 10:00 AM – 2:00 PM  
**Venue:** Thazkiya Academy Campus Auditorium, Karinkallathani  
**Format:** Strictly a **Group Parents Meeting**

---

## 🌟 Project Overview

A complete, high-performance, mobile-first web application featuring:
1. **Public Registration Website:**
   - Dark Emerald Green & Antique Gold Islamic Hero section
   - Registration Type selection: **Student Parent** (Dars & Hifz) and **Normal Guest**
   - Bilingual (English & Malayalam) responsive registration forms
   - Live duplicate registration prevention
   - Printable Official Admission Confirmation Slip with unique ID (`HP-SP-100X` / `HP-NG-200X`)

2. **Secure Admin Dashboard & Portals:**
   - Live metrics: Total Student Parent Registrations, Total Guest Registrations, Total Parents, Total Guests
   - Department breakdown: strictly **Dars** vs **Hifz**
   - Real-time Attendance Check-in Portal (Present / Absent)
   - Full Registration Management (View, Add, Edit, Delete, Filter, Search)
   - Export Reports to Excel (`.xlsx`), PDF, and direct print
   - Google Sheets Cloud Database integration with zero third-party database lock-in

---

## 🎨 Premium Islamic Design System

### Complete Colour Palette:
- **Deep Emerald Green:** `#123F32` (Primary navbar, hero, primary buttons)
- **Royal Forest Green:** `#174B3B` (Secondary headers, accents)
- **Antique Gold:** `#C6A45B` (Premium headings, borders, ornaments)
- **Champagne Gold:** `#DCC58E` (Hero typography, star motifs, accents)
- **Deep Burgundy Red:** `#952F2F` (Special highlights, attendance alerts, badges)
- **Warm Amber Orange:** `#D9883F` (CTA highlights, guest badges, stats)
- **Warm Ivory:** `#F7F3E9` (Main background)
- **Pure White:** `#FFFFFF` (Cards and form fields)
- **Primary Text:** `#183D32`
- **Secondary Text:** `#77766D`

### Typography:
- **Headings & English:** Montserrat
- **Malayalam Scripts:** Anek Malayalam

---

## 🗄️ Google Sheets & Apps Script Cloud Database Architecture

Google Sheets is the **sole single source of truth** for all application data across all devices.

- **Spreadsheet ID:** `1ZIHjHI_uNUrAh6IiZzU148I2vHs3z2ZCdbteRKH6SXI`
- **Spreadsheet URL:** `https://docs.google.com/spreadsheets/d/1ZIHjHI_uNUrAh6IiZzU148I2vHs3z2ZCdbteRKH6SXI/edit`
- **Backend:** Google Apps Script Web App API (`google-apps-script/Code.gs`)
- **Multi-Device Synchronization:** Automatic real-time polling every 12 seconds (10–15s window) and BroadcastChannel instant tab synchronization.

### Sheet Structure:
1. **`Registrations`**:
   - `Registration ID`, `Registration Type`, `Parent / Guest Name`, `Mobile Number`, `WhatsApp Number`, `Student Name`, `Student Department` (Dars/Hifz), `Relationship`, `Number of Parents Attending`, `Number of Guests`, `Address / Place`, `Attendance Status`, `Created Date`, `Created Time`, `Updated Date`.
2. **`Admins`**:
   - `Admin ID`, `Username`, `Password Hash` (SHA-256 + Salt), `Role`, `Status`, `Created Date`.
3. **`Settings`**:
   - Event parameters, capacity, schedule.
4. **`ActivityLogs`**:
   - `Log ID`, `Admin ID`, `Action`, `Registration ID`, `Date`, `Time`.

---

## 🚀 Quick Setup & Deployment Guide

### 1. Run Locally
```bash
# In project folder:
npm install
npm run dev
```

### 2. Connect Google Sheets
1. Open the official Google Spreadsheet at:  
   `https://docs.google.com/spreadsheets/d/1ZIHjHI_uNUrAh6IiZzU148I2vHs3z2ZCdbteRKH6SXI/edit`
2. Go to **Extensions > Apps Script**.
3. Replace the contents of `Code.gs` with the complete code in `google-apps-script/Code.gs`.
4. In the script editor toolbar, select **`setupDatabase`** and click **Run**. (Initializes all 4 sheets and admin account).
5. Click **Deploy > New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the generated Web App URL (`https://script.google.com/macros/s/.../exec`).
7. In the Admin Dashboard, go to **Settings & Cloud**, paste the URL into the input field, and click **Save URL** (or set `VITE_GOOGLE_APPS_SCRIPT_URL` in `.env`).

### 3. Deploy to Vercel
```bash
# Push to GitHub, then import to Vercel:
# Build Command: npm run build
# Output Directory: dist
# Environment Variable (Optional): VITE_GOOGLE_APPS_SCRIPT_URL
```

---

## 🔐 Admin Credentials (Default)
- **Username:** `admin`
- **Password:** `thazkiya@2026`
