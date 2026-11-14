import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Sparkles,
  UserPlus,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Percent,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { API_CONFIG } from '../config/apiConfig';

export default function AdminDashboard({ setActivePage, onSelectRegistration, adminUser }) {
  const [stats, setStats] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setErrorMessage('');
    try {
      const statsRes = await apiService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      } else if (statsRes.message && !isSilent) {
        setErrorMessage(statsRes.message);
      }

      const regRes = await apiService.getRegistrations();
      if (regRes.success && Array.isArray(regRes.data)) {
        setRecentRegistrations(regRes.data.slice(0, 5));
      } else if (regRes.message && !isSilent) {
        setErrorMessage(prev => prev || regRes.message);
      }
    } catch (e) {
      console.error(e);
      if (!isSilent) {
        setErrorMessage('ഗൂഗിൾ ഷീറ്റ്സ് ഡാറ്റാബേസിൽ നിന്ന് വിവരങ്ങൾ ലഭ്യമാക്കാൻ സാധിച്ചില്ല.');
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Cross-device multi-client auto-refresh every 12 seconds (10-15s requirement)
    const interval = setInterval(() => {
      loadData(true);
    }, API_CONFIG.AUTO_REFRESH_INTERVAL_MS || 12000);

    const channel = typeof window !== 'undefined' && window.BroadcastChannel ? new BroadcastChannel('hp_data_sync') : null;
    if (channel) {
      channel.onmessage = () => {
        loadData(true);
      };
    }
    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  // Requirement 3: Delete registration from dashboard
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      const res = await apiService.deleteRegistration(deleteItem.registrationId, adminUser?.adminId);
      if (res.success) {
        setDeleteItem(null);
        await loadData();
      } else {
        alert(res.message || 'നീക്കം ചെയ്യൽ പരാജയപ്പെട്ടു');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Actions Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/40 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-malayalam">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20 font-sans">
              Admin Portal
            </span>
            <span className="text-xs text-text-muted">തത്സമയ ഡാറ്റാബേസ് വിവരങ്ങൾ</span>
          </div>
          {/* Main Heading in English */}
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep">
            HAPPY PARENTING DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            താസ്കിയ അക്കാദമി, കരിങ്കല്ലത്താണി • 22 നവംബർ, ഞായർ (രാവിലെ 10:00 – ഉച്ചക്ക് 2:00)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActivePage('admin-registrations')}
            className="px-4 py-2.5 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs flex items-center space-x-2 hover:bg-emerald-forest transition-colors shadow-md border border-gold-antique/40"
          >
            <UserPlus className="w-4 h-4 text-gold-antique" />
            <span>രജിസ്ട്രേഷനുകൾ നിയന്ത്രിക്കുക</span>
          </button>

          <button
            onClick={() => setActivePage('admin-attendance')}
            className="px-4 py-2.5 rounded-xl bg-gold-antique text-emerald-deep font-bold text-xs flex items-center space-x-2 hover:brightness-105 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-deep" />
            <span>ഹാജർ പോർട്ടൽ</span>
          </button>

          <button
            onClick={loadData}
            title="വിവരങ്ങൾ പുതുക്കുക"
            className="p-2.5 rounded-xl border border-gold-antique/40 bg-ivory/50 text-emerald-deep hover:bg-ivory transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cloud Error Alert if API failed */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-malayalam flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">ഗൂഗിൾ ഷീറ്റ്സ് ക്ലൗഡ് സ്റ്റാറ്റസ്</p>
              <p>{errorMessage}</p>
            </div>
          </div>
          <button 
            onClick={() => loadData()}
            className="px-3.5 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs transition-colors shrink-0"
          >
            വീണ്ടും ശ്രമിക്കുക
          </button>
        </div>
      )}

      {/* ========================================================
          4 PRIMARY STATISTIC CARDS (Exact Required Metrics)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-malayalam">
        
        {/* STAT 1: Total Student Parent Registrations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-deep/30 shadow-card hover:border-emerald-deep transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary">
              രക്ഷിതാക്കളുടെ രജിസ്ട്രേഷൻ
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-deep/10 text-emerald-deep flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-deep block font-mono">
              {stats?.totalStudentParentRegs ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              ആകെ വിദ്യാർത്ഥി രക്ഷിതാക്കളുടെ ഫോമുകൾ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-deep/10 flex items-center justify-between text-[11px]">
            <span className="text-emerald-forest font-semibold">താസ്കിയ രക്ഷിതാക്കൾ</span>
            <span className="text-text-muted font-mono">Dars & Hifz</span>
          </div>
        </div>

        {/* STAT 2: Total Guest Registrations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-warm/30 shadow-card hover:border-amber-warm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary">
              അതിഥികളുടെ രജിസ്ട്രേഷൻ
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-warm/15 text-amber-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-amber-dark block font-mono">
              {stats?.totalGuestRegs ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              ആകെ പൊതു അതിഥികളുടെ ഫോമുകൾ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-warm/10 flex items-center justify-between text-[11px]">
            <span className="text-amber-dark font-semibold">ക്ഷണിക്കപ്പെട്ട അതിഥികൾ</span>
            <span className="text-text-muted">General Guests</span>
          </div>
        </div>

        {/* STAT 3: Total Parents */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gold-antique/40 shadow-card hover:border-gold-antique transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary">
              ആകെ രക്ഷിതാക്കളുടെ എണ്ണം
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-antique/20 text-gold-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-gold-dark block font-mono">
              {stats?.totalParents ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              സംഗമത്തിൽ പങ്കെടുക്കുന്ന ആകെ രക്ഷിതാക്കൾ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gold-antique/10 flex items-center justify-between text-[11px]">
            <span className="text-gold-dark font-semibold">പിതാക്കന്മാരും മാതാക്കളും</span>
            <span className="text-text-muted">സീറ്റിംഗ് കണക്ക്</span>
          </div>
        </div>

        {/* STAT 4: Total Guests */}
        <div className="bg-white rounded-2xl p-6 border-2 border-forest/20 shadow-card hover:border-emerald transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary">
              ആകെ അതിഥികളുടെ എണ്ണം
            </span>
            <div className="w-10 h-10 rounded-xl bg-sage/40 text-forest flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-emerald" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-forest block font-mono">
              {stats?.totalGuests ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              കൂടെ പങ്കെടുക്കുന്ന ആകെ അതിഥികൾ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-[11px]">
            <span className="text-forest font-semibold">പൊതു സദസ്യർ</span>
            <span className="text-text-muted">Total Guests</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          DEPARTMENT-WISE & ATTENDANCE SUMMARY BREAKDOWN
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-malayalam">
        
        {/* Department Breakdown: Dars vs Hifz */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-gold-antique/20 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-emerald-deep">
                Department Summary
              </h3>
              <p className="text-xs text-text-secondary">
                ദർസ്, ഹിഫ്സ് വിദ്യാർത്ഥികളുടെ അനുപാതം
              </p>
            </div>
            <GraduationCap className="w-5 h-5 text-gold-dark" />
          </div>

          <div className="space-y-3 pt-2">
            
            {/* Dars Bar */}
            <div className="p-4 rounded-2xl bg-ivory/60 border border-gold-antique/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-deep">
                <span>ദർസ് വിഭാഗം (Dars Department)</span>
                <span className="font-mono font-bold text-base">{stats?.darsCount ?? 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-deep h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats?.totalStudentParentRegs ? ((stats?.darsCount || 0) / stats.totalStudentParentRegs) * 100 : 0)}%` }}
                />
              </div>
            </div>

            {/* Hifz Bar */}
            <div className="p-4 rounded-2xl bg-ivory/60 border border-gold-antique/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-deep">
                <span>ഹിഫ്സ് വിഭാഗം (Hifz Department)</span>
                <span className="font-mono font-bold text-base">{stats?.hifzCount ?? 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gold-antique h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats?.totalStudentParentRegs ? ((stats?.hifzCount || 0) / stats.totalStudentParentRegs) * 100 : 0)}%` }}
                />
              </div>
            </div>

          </div>

          <p className="text-[11px] text-text-muted italic pt-2">
            * ദർസ്, ഹിഫ്സ് വിഭാഗങ്ങൾക്ക് മാത്രമായി പരിമിതപ്പെടുത്തിയിരിക്കുന്നു.
          </p>
        </div>

        {/* Attendance Live Status */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-gold-antique/20 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-emerald-deep">
                Attendance Status
              </h3>
              <p className="text-xs text-text-secondary">
                തത്സമയ ഹാജർ പരിശോധന
              </p>
            </div>
            <Percent className="w-5 h-5 text-emerald-forest" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800">ഹാജരുള്ളവർ (Present)</span>
              <span className="font-heading font-black text-3xl text-emerald-800 block font-mono">
                {stats?.presentCount ?? 0}
              </span>
              <span className="text-[10px] text-emerald-700">ചെക്ക് ഇൻ ചെയ്തു</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
              <span className="text-[11px] font-bold text-rose-800">ഹാജരില്ലാത്തവർ (Absent)</span>
              <span className="font-heading font-black text-3xl text-rose-800 block font-mono">
                {stats?.absentCount ?? 0}
              </span>
              <span className="text-[10px] text-rose-700">എത്താനുള്ളവർ</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-ivory/80 border border-gold-antique/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">ഹാജർ ശതമാനം:</span>
            <span className="font-mono font-bold text-base text-emerald-deep">
              {stats?.attendanceRate ?? 0}%
            </span>
          </div>
        </div>

        {/* Programme Configuration Card */}
        <div className="bg-emerald-deep text-ivory rounded-3xl p-6 border-2 border-gold-antique shadow-emerald flex flex-col justify-between space-y-4 font-malayalam">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gold-champagne uppercase font-sans">
              OFFICIAL SUMMIT
            </span>
            <h3 className="font-heading font-bold text-xl text-gold-champagne leading-tight">
              HAPPY PARENTING
            </h3>
            <p className="text-xs text-ivory/80 leading-relaxed">
              നേതൃത്വം: അബ്ദുൽ ഹക്കീം സഖാഫി അൽ അർശദി അയഞ്ചേരി
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-ivory/90">
              <p className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-amber-warm shrink-0" />
                <span>22 നവംബർ, ഞായർ (10:00 AM – 2:00 PM)</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gold-antique/20 flex items-center justify-between text-xs">
            <span className="text-ivory/70">ഗ്രൂപ്പ് മീറ്റിംഗ് മാത്രം</span>
            <button
              onClick={() => setActivePage('admin-reports')}
              className="text-gold-champagne hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>റിപ്പോർട്ടുകൾ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          RECENT REGISTRATIONS TABLE
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/40 shadow-card space-y-4 font-malayalam">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold-antique/20 pb-4">
          <div>
            <h3 className="font-heading font-bold text-xl text-emerald-deep">
              Recent Registrations
            </h3>
            <p className="text-xs text-text-secondary">
              ഡാറ്റാബേസിൽ ലഭിച്ച ഏറ്റവും പുതിയ രജിസ്ട്രേഷനുകൾ
            </p>
          </div>

          <button
            onClick={() => setActivePage('admin-registrations')}
            className="text-xs font-bold text-emerald-forest hover:text-emerald-deep flex items-center space-x-1"
          >
            <span>എല്ലാ രജിസ്ട്രേഷനുകളും കാണുക ({stats?.totalRegistrations ?? 0})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        {recentRegistrations.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">
            രജിസ്ട്രേഷനുകൾ ഒന്നും ലഭിച്ചിട്ടില്ല.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold-antique/20 text-text-secondary uppercase text-[11px]">
                  <th className="py-3 px-4 font-bold">Reg ID</th>
                  <th className="py-3 px-4 font-bold">പേര്</th>
                  <th className="py-3 px-4 font-bold">വിഭാഗം</th>
                  <th className="py-3 px-4 font-bold">മൊബൈൽ</th>
                  <th className="py-3 px-4 font-bold">ആളുകൾ</th>
                  <th className="py-3 px-4 font-bold">ഹാജർ</th>
                  <th className="py-3 px-4 font-bold text-right">നടപടി</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-antique/10">
                {recentRegistrations.map((item) => (
                  <tr key={item.registrationId} className="hover:bg-ivory/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-deep">
                      {item.registrationId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text-primary">
                      {item.name}
                      {item.studentName && (
                        <span className="block text-[11px] text-text-secondary">
                          വിദ്യാർത്ഥി: {item.studentName} ({item.studentDepartment})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.registrationType === 'Student Parent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.registrationType === 'Student Parent' ? 'രക്ഷിതാവ്' : 'അതിഥി'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-secondary">
                      {item.mobileNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      {item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.attendanceStatus === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <span>{item.attendanceStatus === 'Present' ? 'ഹാജർ' : 'ഹാജരില്ല'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            if (onSelectRegistration) onSelectRegistration(item);
                            setActivePage('admin-registrations');
                          }}
                          className="text-xs text-gold-dark hover:underline font-semibold"
                        >
                          വിശദാംശങ്ങൾ
                        </button>
                        {/* Requirement 3: Delete Button */}
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                          title="നീക്കം ചെയ്യുക"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Requirement 3: Malayalam Confirmation Dialog for Delete */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-malayalam">
          <div className="bg-white rounded-3xl border-2 border-red-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-300 text-red-600 flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-forest">
                Delete Registration
              </h3>
              
              {/* Exact Requirement 3 Confirmation Text: "ഈ രജിസ്ട്രേഷൻ സ്ഥിരമായി നീക്കം ചെയ്യണോ?" */}
              <p className="font-malayalam font-bold text-base text-red-700">
                ഈ രജിസ്ട്രേഷൻ സ്ഥിരമായി നീക്കം ചെയ്യണോ?
              </p>

              <div className="p-3 bg-sage/20 rounded-xl border border-forest/15 text-xs text-text-primary text-left font-mono">
                <p><strong>ID:</strong> {deleteItem.registrationId}</p>
                <p className="font-sans font-semibold"><strong>പേര്:</strong> {deleteItem.name}</p>
              </div>
            </div>

            {/* Exact Requirement 3 Buttons: "റദ്ദാക്കുക" and "നീക്കം ചെയ്യുക" */}
            <div className="flex items-center justify-center space-x-3 pt-3 border-t border-forest/15">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-malayalam font-semibold text-text-secondary hover:bg-gray-100 transition-colors"
              >
                റദ്ദാക്കുക
              </button>
              
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-malayalam font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>നീക്കം ചെയ്യുന്നു...</span>
                  </>
                ) : (
                  <span>നീക്കം ചെയ്യുക</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
