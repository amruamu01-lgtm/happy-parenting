import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  Clock, 
  FileSpreadsheet, 
  File, 
  CheckCircle2, 
  RefreshCw,
  Award
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function ReportsExport() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await apiService.getDashboardStats();
      if (statsRes.success) setStats(statsRes.stats);

      const regRes = await apiService.getRegistrations();
      if (regRes.success) setRegistrations(regRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = registrations.filter(item => {
    if (typeFilter && item.registrationType !== typeFilter) return false;
    if (deptFilter && item.studentDepartment !== deptFilter) return false;
    if (attendanceFilter && item.attendanceStatus !== attendanceFilter) return false;
    return true;
  });

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const rows = filteredData.map((item, idx) => ({
      'SL No': idx + 1,
      'Registration ID': item.registrationId,
      'Type': item.registrationType,
      'Participant Name': item.name,
      'Mobile Number': item.mobileNumber,
      'WhatsApp Number': item.whatsappNumber || item.mobileNumber,
      'Student Name': item.studentName || '—',
      'Department': item.studentDepartment || '—',
      'Relationship': item.relationship || '—',
      'Parents Count': item.parentsAttending || 0,
      'Guests Count': item.guestsCount || 0,
      'Place / Address': item.addressPlace,
      'Attendance': item.attendanceStatus || 'Absent',
      'Registered Date': item.createdDate,
      'Registered Time': item.createdTime
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 8 },  // SL No
      { wch: 16 }, // ID
      { wch: 16 }, // Type
      { wch: 24 }, // Name
      { wch: 15 }, // Mobile
      { wch: 15 }, // WhatsApp
      { wch: 20 }, // Student
      { wch: 12 }, // Dept
      { wch: 14 }, // Rel
      { wch: 12 }, // Parents
      { wch: 12 }, // Guests
      { wch: 28 }, // Place
      { wch: 14 }, // Attendance
      { wch: 14 }, // Date
      { wch: 14 }  // Time
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    XLSX.writeFile(workbook, `Happy_Parenting_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    // Header styling
    doc.setFillColor(18, 63, 50); // Deep Emerald
    doc.rect(0, 0, 842, 75, 'F');

    doc.setTextColor(220, 197, 142); // Gold Champagne
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('HAPPY PARENTING — OFFICIAL REGISTRATION REPORT', 421, 28, { align: 'center' });

    doc.setTextColor(247, 243, 233); // Ivory
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('THAZKIYA ACADEMY, KARINKALLATHANI', 421, 46, { align: 'center' });
    doc.setFontSize(9);
    doc.text('22 NOVEMBER • SUNDAY | 10:00 AM – 2:00 PM', 421, 62, { align: 'center' });

    // Table Columns & Rows
    const tableColumns = [
      '#',
      'Reg ID',
      'Type',
      'Name',
      'Mobile',
      'Student Name',
      'Dept',
      'Headcount',
      'Place',
      'Attendance'
    ];

    const tableRows = filteredData.map((item, idx) => [
      idx + 1,
      item.registrationId,
      item.registrationType === 'Student Parent' ? 'Parent' : 'Guest',
      item.name,
      item.mobileNumber,
      item.studentName || '—',
      item.studentDepartment || '—',
      item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount,
      item.addressPlace,
      item.attendanceStatus || 'Absent'
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 85,
      theme: 'grid',
      headStyles: {
        fillColor: [23, 75, 59],
        textColor: [247, 243, 233],
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak'
      },
      alternateRowStyles: {
        fillColor: [247, 243, 233]
      },
      margin: { top: 85, left: 20, right: 20, bottom: 20 }
    });

    doc.save(`Happy_Parenting_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print-container">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20">
              Executive Analytics
            </span>
            <span className="text-xs text-text-muted">Instant Document Generator</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep mt-1">
            Reports & Data Export
          </h1>
          <p className="text-xs text-text-secondary">
            HAPPY PARENTING • THAZKIYA ACADEMY, KARINKALLATHANI (22 November, Sunday)
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-emerald-forest shadow-md border border-gold-antique/40 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-burgundy-deep text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-burgundy-dark shadow-md border border-gold-antique/40 transition-all"
          >
            <File className="w-4 h-4 text-gold-champagne" />
            <span>PDF Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-ivory text-emerald-deep font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-gold-light border border-gold-antique/50 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print List</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          COMPREHENSIVE STATISTICAL SUMMARY BREAKDOWN
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
        <h3 className="font-heading font-bold text-base text-emerald-deep border-b border-gold-antique/20 pb-2">
          Comprehensive Summit Analytics Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">Total Registrations</span>
            <span className="font-heading font-black text-2xl text-emerald-deep">
              {stats?.totalRegistrations ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">Student Parents</span>
            <span className="font-heading font-black text-2xl text-emerald-forest">
              {stats?.totalStudentParentRegs ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">Normal Guests</span>
            <span className="font-heading font-black text-2xl text-amber-dark">
              {stats?.totalGuestRegs ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">Total Parents Count</span>
            <span className="font-heading font-black text-2xl text-gold-dark">
              {stats?.totalParents ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">Total Guests Count</span>
            <span className="font-heading font-black text-2xl text-burgundy-deep">
              {stats?.totalGuests ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 font-semibold block">Dars Department</span>
            <span className="font-heading font-black text-2xl text-emerald-900">
              {stats?.darsCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-amber-800 font-semibold block">Hifz Department</span>
            <span className="font-heading font-black text-2xl text-amber-900">
              {stats?.hifzCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-100/60 border border-emerald-300">
            <span className="text-emerald-900 font-semibold block">Present Headcount</span>
            <span className="font-heading font-black text-2xl text-emerald-900">
              {stats?.presentCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-rose-800 font-semibold block">Absent Headcount</span>
            <span className="font-heading font-black text-2xl text-rose-900">
              {stats?.absentCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gold-light border border-gold-antique">
            <span className="text-gold-dark font-semibold block">Turnout Rate</span>
            <span className="font-heading font-black text-2xl text-gold-dark">
              {stats?.attendanceRate ?? 0}%
            </span>
          </div>

        </div>
      </div>

      {/* Filter Before Export */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4 no-print">
        <div className="flex items-center justify-between border-b border-gold-antique/20 pb-3">
          <h3 className="font-heading font-bold text-sm text-emerald-deep flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gold-antique" />
            <span>Filter Report Before Export</span>
          </h3>
          <span className="text-xs text-text-muted">Filtered Records: <strong>{filteredData.length}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Registration Category</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-gold-antique/40 text-xs"
            >
              <option value="">All Categories</option>
              <option value="Student Parent">Student Parent</option>
              <option value="Normal Guest">Normal Guest</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Student Department</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-gold-antique/40 text-xs"
            >
              <option value="">All Departments</option>
              <option value="Dars">Dars Only</option>
              <option value="Hifz">Hifz Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">Attendance Verification</label>
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-gold-antique/40 text-xs"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white rounded-3xl border-2 border-gold-antique/30 shadow-card overflow-hidden">
        
        {/* Printable Official Header */}
        <div className="p-6 bg-emerald-deep text-ivory text-center border-b-2 border-gold-antique">
          <h2 className="font-heading font-black text-xl text-gold-champagne tracking-wider">
            HAPPY PARENTING
          </h2>
          <p className="font-heading font-bold text-sm text-ivory/90 uppercase tracking-widest mt-0.5">
            THAZKIYA ACADEMY, KARINKALLATHANI
          </p>
          <p className="text-xs text-gold-champagne/90 mt-1 font-semibold">
            22 NOVEMBER • SUNDAY | 10:00 AM – 2:00 PM
          </p>
          <p className="text-[11px] text-ivory/70 mt-0.5">
            Led by: Abdul Hakeem Saqafi Al Arshadi Ayancheri
          </p>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory/80 text-emerald-deep border-b border-gold-antique/30 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">SL</th>
                <th className="py-2.5 px-3">Reg ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Mobile</th>
                <th className="py-2.5 px-3">Student / Dept</th>
                <th className="py-2.5 px-3">Count</th>
                <th className="py-2.5 px-3">Place</th>
                <th className="py-2.5 px-3">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-antique/10">
              {filteredData.map((item, idx) => (
                <tr key={item.registrationId} className="hover:bg-ivory/30">
                  <td className="py-2 px-3 text-text-muted">{idx + 1}</td>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-deep">{item.registrationId}</td>
                  <td className="py-2 px-3">{item.registrationType}</td>
                  <td className="py-2 px-3 font-medium">{item.name}</td>
                  <td className="py-2 px-3 font-mono">{item.mobileNumber}</td>
                  <td className="py-2 px-3">
                    {item.studentName ? `${item.studentName} (${item.studentDepartment})` : '—'}
                  </td>
                  <td className="py-2 px-3 font-bold">
                    {item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount}
                  </td>
                  <td className="py-2 px-3">{item.addressPlace}</td>
                  <td className="py-2 px-3 font-semibold">
                    <span className={item.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.attendanceStatus || 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-ivory/40 border-t border-gold-antique/20 text-[11px] text-text-secondary flex justify-between">
          <span>Official Thazkiya Academy Summit Record</span>
          <span>Generated: {new Date().toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}
