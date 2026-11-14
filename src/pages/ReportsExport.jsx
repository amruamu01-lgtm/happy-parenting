import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Filter, 
  FileSpreadsheet, 
  File, 
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { apiService } from '../services/api';

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
      'ക്രമ നമ്പർ': idx + 1,
      'രജിസ്ട്രേഷൻ ഐഡി': item.registrationId,
      'വിഭാഗം': item.registrationType === 'Student Parent' ? 'രക്ഷിതാവ്' : 'അതിഥി',
      'പേര്': item.name,
      'മൊബൈൽ നമ്പർ': item.mobileNumber,
      'വാട്സ്ആപ്പ്': item.whatsappNumber || item.mobileNumber,
      'വിദ്യാർത്ഥിയുടെ പേര്': item.studentName || '—',
      'വിഭാഗം (Dept)': item.studentDepartment || '—',
      'ബന്ധം': item.relationship || '—',
      'രക്ഷിതാക്കൾ': item.parentsAttending || 0,
      'അതിഥികൾ': item.guestsCount || 0,
      'സ്ഥലം': item.addressPlace,
      'ഹാജർ നില': item.attendanceStatus === 'Present' ? 'ഹാജർ' : 'ഹാജരില്ല',
      'രജിസ്റ്റർ ചെയ്ത തീയതി': item.createdDate,
      'സമയം': item.createdTime
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

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

    // Header styling - Rich Black with Grullo & Cultured
    doc.setFillColor(10, 9, 8); // Rich Black (#0A0908)
    doc.rect(0, 0, 842, 75, 'F');

    doc.setTextColor(169, 146, 125); // Grullo (#A9927D)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('HAPPY PARENTING — OFFICIAL REGISTRATION REPORT', 421, 28, { align: 'center' });

    doc.setTextColor(242, 244, 243); // Cultured (#F2F4F3)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('THAZKIYA ACADEMY, KARINKALLATHANI', 421, 46, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(169, 146, 125); // Grullo
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
        fillColor: [73, 17, 28], // Dark Sienna (#49111C)
        textColor: [242, 244, 243], // Cultured (#F2F4F3)
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak'
      },
      alternateRowStyles: {
        fillColor: [242, 244, 243] // Cultured (#F2F4F3)
      },
      margin: { top: 85, left: 20, right: 20, bottom: 20 }
    });

    doc.save(`Happy_Parenting_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print-container font-malayalam">
      
      {/* Header Banner - Main Heading in English */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20 font-sans">
              Reports Desk
            </span>
            <span className="text-xs text-text-muted">ഡാറ്റാ എക്സ്പോർട്ട് പോർട്ടൽ</span>
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
            className="px-4 py-2.5 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs flex items-center space-x-2 hover:bg-emerald-forest shadow-md border border-gold-antique/40 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Excel (.xlsx) ഡൗൺലോഡ്</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-burgundy-deep text-white font-bold text-xs flex items-center space-x-2 hover:bg-burgundy-dark shadow-md border border-gold-antique/40 transition-all"
          >
            <File className="w-4 h-4 text-gold-champagne" />
            <span>PDF ഡൗൺലോഡ്</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-ivory text-emerald-deep font-bold text-xs flex items-center space-x-2 hover:bg-gold-light border border-gold-antique/50 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>ലിസ്റ്റ് പ്രിന്റ് ചെയ്യുക</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
        <h3 className="font-heading font-bold text-base text-emerald-deep border-b border-gold-antique/20 pb-2">
          Comprehensive Summit Analytics Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">ആകെ രജിസ്ട്രേഷനുകൾ</span>
            <span className="font-heading font-black text-2xl text-emerald-deep font-mono">
              {stats?.totalRegistrations ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">രക്ഷിതാക്കൾ (Student Parents)</span>
            <span className="font-heading font-black text-2xl text-emerald-forest font-mono">
              {stats?.totalStudentParentRegs ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">മറ്റു അതിഥികൾ (Guests)</span>
            <span className="font-heading font-black text-2xl text-amber-dark font-mono">
              {stats?.totalGuestRegs ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">ആകെ രക്ഷിതാക്കൾ</span>
            <span className="font-heading font-black text-2xl text-gold-dark font-mono">
              {stats?.totalParents ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory/60 border border-gold-antique/20">
            <span className="text-text-muted block">ആകെ അതിഥികൾ</span>
            <span className="font-heading font-black text-2xl text-burgundy-deep font-mono">
              {stats?.totalGuests ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 font-semibold block">ദർസ് വിഭാഗം (Dars)</span>
            <span className="font-heading font-black text-2xl text-emerald-900 font-mono">
              {stats?.darsCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-amber-800 font-semibold block">ഹിഫ്സ് വിഭാഗം (Hifz)</span>
            <span className="font-heading font-black text-2xl text-amber-900 font-mono">
              {stats?.hifzCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-100/60 border border-emerald-300">
            <span className="text-emerald-900 font-semibold block">ഹാജരുള്ളവർ (Present)</span>
            <span className="font-heading font-black text-2xl text-emerald-900 font-mono">
              {stats?.presentCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-rose-800 font-semibold block">ഹാജരില്ലാത്തവർ (Absent)</span>
            <span className="font-heading font-black text-2xl text-rose-900 font-mono">
              {stats?.absentCount ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gold-light border border-gold-antique">
            <span className="text-gold-dark font-semibold block">ഹാജർ ശതമാനം</span>
            <span className="font-heading font-black text-2xl text-gold-dark font-mono">
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
            <span>എക്സ്പോർട്ട് ചെയ്യുന്നതിന് മുൻപ് ഫിൽട്ടർ ചെയ്യുക</span>
          </h3>
          <span className="text-xs text-text-muted">ഫിൽട്ടർ ചെയ്ത രേഖകൾ: <strong className="font-mono">{filteredData.length}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">രജിസ്ട്രേഷൻ വിഭാഗം</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-gold-antique/40 text-xs"
            >
              <option value="">എല്ലാ വിഭാഗങ്ങളും</option>
              <option value="Student Parent">Student Parent</option>
              <option value="Normal Guest">Normal Guest</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">വിദ്യാർത്ഥി വിഭാഗം</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-gold-antique/40 text-xs"
            >
              <option value="">എല്ലാ ഡിപ്പാർട്ട്മെന്റുകളും</option>
              <option value="Dars">Dars Only</option>
              <option value="Hifz">Hifz Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">ഹാജർ നില</label>
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-gold-antique/40 text-xs"
            >
              <option value="">എല്ലാ ഹാജർ നിലയും</option>
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
          <p className="text-xs text-gold-champagne/90 mt-1 font-semibold font-mono">
            22 NOVEMBER • SUNDAY | 10:00 AM – 2:00 PM
          </p>
          <p className="text-[11px] text-ivory/70 mt-0.5 font-malayalam">
            നേതൃത്വം: അബ്ദുൽ ഹക്കീം സഖാഫി അൽ അർശദി അയഞ്ചേരി
          </p>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory/80 text-emerald-deep border-b border-gold-antique/30 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">SL</th>
                <th className="py-2.5 px-3">Reg ID</th>
                <th className="py-2.5 px-3">വിഭാഗം</th>
                <th className="py-2.5 px-3">പേര്</th>
                <th className="py-2.5 px-3">മൊബൈൽ</th>
                <th className="py-2.5 px-3">വിദ്യാർത്ഥി / Dept</th>
                <th className="py-2.5 px-3">എണ്ണം</th>
                <th className="py-2.5 px-3">സ്ഥലം</th>
                <th className="py-2.5 px-3">ഹാജർ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-antique/10">
              {filteredData.map((item, idx) => (
                <tr key={item.registrationId} className="hover:bg-ivory/30">
                  <td className="py-2 px-3 text-text-muted font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-deep">{item.registrationId}</td>
                  <td className="py-2 px-3">{item.registrationType === 'Student Parent' ? 'രക്ഷിതാവ്' : 'അതിഥി'}</td>
                  <td className="py-2 px-3 font-medium">{item.name}</td>
                  <td className="py-2 px-3 font-mono">{item.mobileNumber}</td>
                  <td className="py-2 px-3">
                    {item.studentName ? `${item.studentName} (${item.studentDepartment})` : '—'}
                  </td>
                  <td className="py-2 px-3 font-bold font-mono">
                    {item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount}
                  </td>
                  <td className="py-2 px-3">{item.addressPlace}</td>
                  <td className="py-2 px-3 font-semibold">
                    <span className={item.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.attendanceStatus === 'Present' ? 'ഹാജർ' : 'ഹാജരില്ല'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-ivory/40 border-t border-gold-antique/20 text-[11px] text-text-secondary flex justify-between">
          <span>താസ്കിയ അക്കാദമി ഔദ്യോഗിക രേഖ</span>
          <span>ജനറേറ്റ് ചെയ്ത സമയം: {new Date().toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}
