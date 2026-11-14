import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Calendar, 
  Sparkles,
  FileText,
  UserPlus,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function AdminDashboard({ setActivePage, onSelectRegistration }) {
  const [stats, setStats] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await apiService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      const regRes = await apiService.getRegistrations();
      if (regRes.success && Array.isArray(regRes.data)) {
        setRecentRegistrations(regRes.data.slice(0, 5));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for cross-tab or remote updates
    const channel = typeof window !== 'undefined' && window.BroadcastChannel ? new BroadcastChannel('hp_data_sync') : null;
    if (channel) {
      channel.onmessage = () => {
        loadData();
      };
    }
    return () => {
      if (channel) channel.close();
    };
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Actions Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/40 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20">
              Executive Admin Portal
            </span>
            <span className="text-xs text-text-muted">Live Database Monitoring</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep">
            HAPPY PARENTING DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Thazkiya Academy, Karinkallathani • 22 November, Sunday (10:00 AM – 2:00 PM)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActivePage('admin-registrations')}
            className="px-4 py-2.5 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-emerald-forest transition-colors shadow-md border border-gold-antique/40"
          >
            <UserPlus className="w-4 h-4 text-gold-antique" />
            <span>Manage Registrations</span>
          </button>

          <button
            onClick={() => setActivePage('admin-attendance')}
            className="px-4 py-2.5 rounded-xl bg-gold-antique text-emerald-deep font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:brightness-105 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-deep" />
            <span>Attendance Portal</span>
          </button>

          <button
            onClick={loadData}
            title="Refresh Database Stats"
            className="p-2.5 rounded-xl border border-gold-antique/40 bg-ivory/50 text-emerald-deep hover:bg-ivory transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================
          4 PRIMARY STATISTIC CARDS (Exact Required Metrics)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* STAT 1: Total Student Parent Registrations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-deep/30 shadow-card hover:border-emerald-deep transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Parent Registrations
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-deep/10 text-emerald-deep flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-deep block">
              {stats?.totalStudentParentRegs ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              Total Student Parent forms submitted
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-deep/10 flex items-center justify-between text-[11px]">
            <span className="text-emerald-forest font-semibold">Thazkiya Parents</span>
            <span className="text-text-muted">Dars & Hifz</span>
          </div>
        </div>

        {/* STAT 2: Total Guest Registrations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-warm/30 shadow-card hover:border-amber-warm transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Guest Registrations
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-warm/15 text-amber-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-amber-dark block">
              {stats?.totalGuestRegs ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              Total Normal Guest forms submitted
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-warm/10 flex items-center justify-between text-[11px]">
            <span className="text-amber-dark font-semibold">Community Attendees</span>
            <span className="text-text-muted">Invited Guests</span>
          </div>
        </div>

        {/* STAT 3: Total Parents */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gold-antique/40 shadow-card hover:border-gold-antique transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Total Parents Headcount
            </span>
            <div className="w-10 h-10 rounded-xl bg-gold-antique/20 text-gold-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-gold-dark block">
              {stats?.totalParents ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              Cumulative parents attending summit
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gold-antique/10 flex items-center justify-between text-[11px]">
            <span className="text-gold-dark font-semibold">Fathers & Mothers</span>
            <span className="text-text-muted">Seating required</span>
          </div>
        </div>

        {/* STAT 4: Total Guests */}
        <div className="bg-white rounded-2xl p-6 border-2 border-burgundy-deep/30 shadow-card hover:border-burgundy-deep transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Total Guests Headcount
            </span>
            <div className="w-10 h-10 rounded-xl bg-burgundy-deep/10 text-burgundy-deep flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-burgundy-deep block">
              {stats?.totalGuests ?? 0}
            </span>
            <p className="text-[11px] text-text-muted">
              Cumulative guest attendees accompanying
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-burgundy-deep/10 flex items-center justify-between text-[11px]">
            <span className="text-burgundy-deep font-semibold">General Audience</span>
            <span className="text-text-muted">Delegates</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          DEPARTMENT-WISE & ATTENDANCE SUMMARY BREAKDOWN
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Breakdown: Dars vs Hifz */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-gold-antique/20 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-emerald-deep">
                Department Summary
              </h3>
              <p className="text-xs text-text-secondary">
                Dars & Hifz Student Distribution
              </p>
            </div>
            <GraduationCap className="w-5 h-5 text-gold-dark" />
          </div>

          <div className="space-y-3 pt-2">
            
            {/* Dars Bar */}
            <div className="p-4 rounded-2xl bg-ivory/60 border border-gold-antique/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-deep">
                <span>Dars Department (ദർസ്)</span>
                <span className="font-heading text-base">{stats?.darsCount ?? 0}</span>
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
                <span>Hifz Department (ഹിഫ്സ്)</span>
                <span className="font-heading text-base">{stats?.hifzCount ?? 0}</span>
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
            * Strictly restricted to Dars and Hifz streams only.
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
                Turnout & Ground Verification
              </p>
            </div>
            <Percent className="w-5 h-5 text-emerald-forest" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-800">Present</span>
              <span className="font-heading font-black text-3xl text-emerald-800 block">
                {stats?.presentCount ?? 0}
              </span>
              <span className="text-[10px] text-emerald-700">Checked In</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
              <span className="text-[11px] uppercase font-bold text-rose-800">Absent</span>
              <span className="font-heading font-black text-3xl text-rose-800 block">
                {stats?.absentCount ?? 0}
              </span>
              <span className="text-[10px] text-rose-700">Pending Arrival</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-ivory/80 border border-gold-antique/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">Attendance Turnout Rate:</span>
            <span className="font-heading font-bold text-base text-emerald-deep">
              {stats?.attendanceRate ?? 0}%
            </span>
          </div>
        </div>

        {/* Programme Configuration Card */}
        <div className="bg-emerald-deep text-ivory rounded-3xl p-6 border-2 border-gold-antique shadow-emerald flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-champagne">
              OFFICIAL SUMMIT DETAILS
            </span>
            <h3 className="font-heading font-bold text-xl text-gold-champagne leading-tight">
              HAPPY PARENTING
            </h3>
            <p className="text-xs text-ivory/80 leading-relaxed">
              Abdul Hakeem Saqafi Al Arshadi Ayancheri
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-ivory/90">
              <p className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-amber-warm" />
                <span>22 November, Sunday</span>
              </p>
              <p className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-gold-champagne" />
                <span>10:00 AM – 2:00 PM</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gold-antique/20 flex items-center justify-between">
            <span className="text-xs text-ivory/70">Group Parents Meeting Only</span>
            <button
              onClick={() => setActivePage('admin-reports')}
              className="text-xs text-gold-champagne hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Export Reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          RECENT REGISTRATIONS TABLE
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/40 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold-antique/20 pb-4">
          <div>
            <h3 className="font-heading font-bold text-xl text-emerald-deep">
              Recent Registrations
            </h3>
            <p className="text-xs text-text-secondary">
              Latest submissions received in the official database
            </p>
          </div>

          <button
            onClick={() => setActivePage('admin-registrations')}
            className="text-xs font-bold uppercase tracking-wider text-emerald-forest hover:text-emerald-deep flex items-center space-x-1"
          >
            <span>View All Registrations ({stats?.totalRegistrations ?? 0})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table / Cards */}
        {recentRegistrations.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-muted">
            No registrations found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold-antique/20 text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Registration ID</th>
                  <th className="py-3 px-4 font-bold">Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Mobile</th>
                  <th className="py-3 px-4 font-bold">Headcount</th>
                  <th className="py-3 px-4 font-bold">Attendance</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
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
                          Student: {item.studentName} ({item.studentDepartment})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.registrationType === 'Student Parent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.registrationType}
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
                        <span>{item.attendanceStatus || 'Absent'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (onSelectRegistration) onSelectRegistration(item);
                          setActivePage('admin-registrations');
                        }}
                        className="text-xs text-gold-dark hover:underline font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
