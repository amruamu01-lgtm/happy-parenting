import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Search, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Percent
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AttendanceManagement({ adminUser }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getRegistrations();
      if (res.success && Array.isArray(res.data)) {
        setRegistrations(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const channel = typeof window !== 'undefined' && window.BroadcastChannel ? new BroadcastChannel('hp_data_sync') : null;
    if (channel) {
      channel.onmessage = () => loadData();
    }
    return () => {
      if (channel) channel.close();
    };
  }, []);

  const handleToggleAttendance = async (item) => {
    const newStatus = item.attendanceStatus === 'Present' ? 'Absent' : 'Present';
    setUpdatingId(item.registrationId);
    try {
      const res = await apiService.updateAttendance(item.registrationId, newStatus, adminUser?.adminId);
      if (res.success) {
        setRegistrations(prev => 
          prev.map(r => r.registrationId === item.registrationId ? { ...r, attendanceStatus: newStatus } : r)
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculations
  const totalCount = registrations.length;
  const presentCount = registrations.filter(r => r.attendanceStatus === 'Present').length;
  const absentCount = totalCount - presentCount;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Filtered List
  const filteredList = registrations.filter(item => {
    if (typeFilter && item.registrationType !== typeFilter) return false;
    if (deptFilter && item.studentDepartment !== deptFilter) return false;
    if (statusFilter && item.attendanceStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchMobile = (item.mobileNumber || '').includes(q);
      const matchId = (item.registrationId || '').toLowerCase().includes(q);
      const matchStudent = (item.studentName || '').toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchId && !matchStudent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-malayalam">
      
      {/* Attendance Header & Live Metric Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-antique/20 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20 font-sans">
                Attendance Desk
              </span>
              <span className="text-xs text-text-muted">തത്സമയ ഹാജർ പരിശോധന</span>
            </div>
            {/* Main Heading in English */}
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep mt-1">
              Attendance Management
            </h1>
            <p className="text-xs text-text-secondary">
              ഓഡിറ്റോറിയം പ്രവേശന കവാടത്തിൽ ഹാജർ രേഖപ്പെടുത്തുക. എല്ലാ ഉപകരണങ്ങളിലും തത്സമയം ലഭ്യമാകും.
            </p>
          </div>

          <button
            onClick={loadData}
            title="ഹാജർ നില പുതുക്കുക"
            className="p-2.5 rounded-xl border border-gold-antique/40 bg-ivory/50 text-emerald-deep hover:bg-ivory flex items-center space-x-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>പുതുക്കുക</span>
          </button>
        </div>

        {/* 3 Prominent Stat Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-emerald-deep text-ivory border border-gold-antique shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gold-champagne block">
                ആകെ ഹാജരുള്ളവർ (Present)
              </span>
              <span className="font-heading font-black text-3xl text-ivory font-mono">
                {presentCount}
              </span>
              <span className="text-[10px] text-ivory/70 block mt-0.5">ചെക്ക് ഇൻ ചെയ്തവർ</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-forest border border-gold-antique/40 flex items-center justify-center text-gold-champagne">
              <CheckCircle2 className="w-6 h-6 text-gold-champagne" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-700 block">
                ഹാജരില്ലാത്തവർ (Absent)
              </span>
              <span className="font-heading font-black text-3xl text-gray-800 font-mono">
                {absentCount}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">എത്തിച്ചേരാനുള്ളവർ</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-500">
              <XCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gold-light border border-gold-antique/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gold-dark block">
                ഹാജർ ശതമാനം (Turnout)
              </span>
              <span className="font-heading font-black text-3xl text-gold-dark font-mono">
                {attendanceRate}%
              </span>
              <span className="text-[10px] text-text-muted block mt-0.5">ആകെ {totalCount} രജിസ്ട്രേഷനുകളിൽ</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white border border-gold-antique/40 flex items-center justify-center text-gold-dark">
              <Percent className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          <div className="relative">
            <Search className="w-4 h-4 text-gold-antique absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="ഐഡി, പേര്, മൊബൈൽ എന്നിവ തിരയുക..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep font-semibold"
            >
              <option value="">എല്ലാ ഹാജർ നിലയും</option>
              <option value="Present">ഹാജരുള്ളവർ (Present Only)</option>
              <option value="Absent">ഹാജരില്ലാത്തവർ (Absent Only)</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep"
            >
              <option value="">എല്ലാ വിഭാഗങ്ങളും</option>
              <option value="Student Parent">Student Parent (രക്ഷിതാക്കൾ)</option>
              <option value="Normal Guest">Normal Guest (അതിഥികൾ)</option>
            </select>
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep"
            >
              <option value="">എല്ലാ ഡിപ്പാർട്ട്മെന്റുകളും</option>
              <option value="Dars">Dars Only</option>
              <option value="Hifz">Hifz Only</option>
            </select>
          </div>

        </div>

      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-3xl border-2 border-gold-antique/30 shadow-card overflow-hidden">
        
        {/* Desktop View Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-emerald-deep text-gold-champagne uppercase text-[11px] border-b border-gold-antique/40">
                <th className="py-3.5 px-4 font-bold">Reg ID</th>
                <th className="py-3.5 px-4 font-bold">പേര്</th>
                <th className="py-3.5 px-4 font-bold">മൊബൈൽ</th>
                <th className="py-3.5 px-4 font-bold">വിഭാഗം</th>
                <th className="py-3.5 px-4 font-bold">ഡിപ്പാർട്ട്മെന്റ്</th>
                <th className="py-3.5 px-4 font-bold">ആളുകൾ</th>
                <th className="py-3.5 px-4 font-bold">ഹാജർ നില</th>
                <th className="py-3.5 px-4 font-bold text-right">ഹാജർ രേഖപ്പെടുത്തൽ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-antique/10">
              {filteredList.map((item) => {
                const isPresent = item.attendanceStatus === 'Present';
                const isBusy = updatingId === item.registrationId;
                const headcount = item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount;

                return (
                  <tr key={item.registrationId} className="hover:bg-ivory/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-deep">
                      {item.registrationId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-primary">
                      {item.name}
                      {item.studentName && (
                        <span className="block text-[11px] font-normal text-text-secondary">
                          വിദ്യാർത്ഥി: {item.studentName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-text-secondary">
                      {item.mobileNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.registrationType === 'Student Parent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.registrationType === 'Student Parent' ? 'രക്ഷിതാവ്' : 'അതിഥി'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.studentDepartment ? (
                        <span className="font-semibold text-emerald-deep">
                          {item.studentDepartment}
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-text-primary font-mono">
                      {headcount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isPresent ? 'ഹാജർ (Present)' : 'ഹാജരില്ല (Absent)'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleAttendance(item)}
                        disabled={isBusy}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isPresent
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-deep text-gold-champagne hover:bg-emerald-forest border border-gold-antique/40'
                        }`}
                      >
                        {isBusy ? 'സേവ് ചെയ്യുന്നു...' : isPresent ? 'ഹാജരില്ല എന്ന് മാറ്റുക' : 'ഹാജർ രേഖപ്പെടുത്തുക'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="lg:hidden p-4 space-y-3">
          {filteredList.map((item) => {
            const isPresent = item.attendanceStatus === 'Present';
            const isBusy = updatingId === item.registrationId;
            const headcount = item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount;

            return (
              <div 
                key={item.registrationId}
                className={`p-4 rounded-2xl border transition-all ${
                  isPresent ? 'border-emerald-300 bg-emerald-50/40' : 'border-gold-antique/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between border-b border-gold-antique/15 pb-2 mb-2">
                  <span className="font-mono font-bold text-xs text-emerald-deep">{item.registrationId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isPresent ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isPresent ? 'ഹാജർ' : 'ഹാജരില്ല'}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-text-primary text-sm">{item.name}</p>
                  {item.studentName && (
                    <p className="text-emerald-deep font-medium">വിദ്യാർത്ഥി: {item.studentName} ({item.studentDepartment})</p>
                  )}
                  <p className="text-text-secondary font-mono">മൊബൈൽ: {item.mobileNumber}</p>
                  <p className="text-text-muted">ആളുകൾ: <strong>{headcount} പേർ</strong></p>
                </div>

                <div className="pt-3 mt-2 border-t border-gold-antique/15 flex justify-end">
                  <button
                    onClick={() => handleToggleAttendance(item)}
                    disabled={isBusy}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      isPresent
                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        : 'bg-emerald-deep text-gold-champagne hover:bg-emerald-forest'
                    }`}
                  >
                    {isPresent ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-gold-antique" />}
                    <span>{isBusy ? 'പുതുക്കുന്നു...' : isPresent ? 'ഹാജരില്ല എന്ന് മാറ്റുക' : 'ഹാജർ രേഖപ്പെടുത്തുക'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
