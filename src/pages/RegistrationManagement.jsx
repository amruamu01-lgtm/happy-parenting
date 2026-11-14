import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { apiService } from '../services/api';

export default function RegistrationManagement({ adminUser, onUpdateStats }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Modals
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New manual registration state
  const [newReg, setNewReg] = useState({
    registrationType: 'Student Parent',
    name: '',
    mobileNumber: '',
    whatsappNumber: '',
    studentName: '',
    studentDepartment: 'Dars',
    relationship: 'Father',
    parentsAttending: 1,
    guestsCount: 1,
    addressPlace: ''
  });
  const [modalError, setModalError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [apiError, setApiError] = useState('');

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setApiError('');
    try {
      const res = await apiService.getRegistrations();
      if (res.success && Array.isArray(res.data)) {
        setRegistrations(res.data);
      } else if (res.message && !isSilent) {
        setApiError(res.message);
      }
    } catch (e) {
      console.error(e);
      if (!isSilent) {
        setApiError('ഗൂഗിൾ ഷീറ്റ്സ് ഡാറ്റാബേസിൽ നിന്ന് വിവരങ്ങൾ ലഭ്യമാക്കാൻ സാധിച്ചില്ല.');
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Cross-device multi-client synchronization (every 20 seconds)
    const interval = setInterval(() => {
      loadData(true);
    }, 20000);

    const channel = typeof window !== 'undefined' && window.BroadcastChannel ? new BroadcastChannel('hp_data_sync') : null;
    if (channel) {
      channel.onmessage = () => loadData(true);
    }
    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Filter & Search Logic
  const filteredList = registrations.filter(item => {
    if (typeFilter && item.registrationType !== typeFilter) return false;
    if (deptFilter && item.studentDepartment !== deptFilter) return false;
    if (attendanceFilter && item.attendanceStatus !== attendanceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchMobile = (item.mobileNumber || '').includes(q);
      const matchId = (item.registrationId || '').toLowerCase().includes(q);
      const matchStudent = (item.studentName || '').toLowerCase().includes(q);
      const matchPlace = (item.addressPlace || '').toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchId && !matchStudent && !matchPlace) return false;
    }
    return true;
  });

  // Sort
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === 'oldest') {
      return a.registrationId.localeCompare(b.registrationId);
    }
    return b.registrationId.localeCompare(a.registrationId);
  });

  // Handle Manual Add
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!newReg.name.trim() || !newReg.mobileNumber.trim() || !newReg.addressPlace.trim()) {
      setModalError('ആവശ്യമായ വിവരങ്ങൾ നൽകുക');
      return;
    }

    if (newReg.registrationType === 'Student Parent' && !newReg.studentName.trim()) {
      setModalError('വിദ്യാർത്ഥിയുടെ പേര് നൽകുക');
      return;
    }

    try {
      const res = await apiService.createRegistration(newReg);
      if (res.success) {
        setShowAddModal(false);
        setNewReg({
          registrationType: 'Student Parent',
          name: '',
          mobileNumber: '',
          whatsappNumber: '',
          studentName: '',
          studentDepartment: 'Dars',
          relationship: 'Father',
          parentsAttending: 1,
          guestsCount: 1,
          addressPlace: ''
        });
        showToast('രജിസ്ട്രേഷൻ വിജയകരമായി ചേർത്തു');
        loadData();
        if (onUpdateStats) onUpdateStats();
      } else {
        setModalError(res.message || 'രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു');
      }
    } catch (err) {
      setModalError('സെർവർ തകരാർ സംഭവിച്ചു');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    try {
      const res = await apiService.updateRegistration(editItem, adminUser?.adminId);
      if (res.success) {
        setEditItem(null);
        showToast('രജിസ്ട്രേഷൻ വിവരങ്ങൾ പുതുക്കി');
        loadData();
        if (onUpdateStats) onUpdateStats();
      } else {
        setModalError(res.message || 'പുതുക്കൽ പരാജയപ്പെട്ടു');
      }
    } catch (err) {
      setModalError('സെർവർ തകരാർ സംഭവിച്ചു');
    }
  };

  // Requirement 3: Admin Panel – Delete Option with exact confirmation text and buttons
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem) return;
    if (!adminUser) {
      alert('അധികാരമുള്ള അഡ്മിന് മാത്രമേ രജിസ്ട്രേഷൻ നീക്കം ചെയ്യാൻ സാധിക്കൂ.');
      return;
    }

    setIsDeleting(true);
    try {
      // Deletes actual record from Google Sheets and in-memory list
      const res = await apiService.deleteRegistration(deleteConfirmItem.registrationId, adminUser?.adminId);
      if (res.success) {
        setDeleteConfirmItem(null);
        showToast('രജിസ്ട്രേഷൻ സ്ഥിരമായി നീക്കം ചെയ്തു');
        // Refresh list & stats
        await loadData();
        if (onUpdateStats) onUpdateStats();
      } else {
        alert(res.message || 'നീക്കം ചെയ്യൽ പരാജയപ്പെട്ടു');
      }
    } catch (err) {
      console.error(err);
      alert('സെർവർ തകരാർ സംഭവിച്ചു');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-emerald-deep text-gold-champagne font-malayalam text-xs font-bold shadow-2xl border-2 border-gold-antique flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-gold-antique" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-antique/20 pb-4">
          <div>
            {/* Main Heading in English */}
            <h1 className="font-heading font-black text-2xl text-emerald-deep">
              Registration Management
            </h1>
            <p className="font-malayalam text-xs text-text-secondary mt-0.5">
              ഡാറ്റാബേസിലെ ആകെ രേഖകൾ: <strong className="text-emerald-deep font-mono">{registrations.length}</strong> (കാണിക്കുന്നത്: {sortedList.length})
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-deep text-gold-champagne font-malayalam font-bold text-xs flex items-center space-x-1.5 hover:bg-emerald-forest transition-colors shadow-sm border border-gold-antique/30"
            >
              <Plus className="w-4 h-4 text-gold-antique" />
              <span>രജിസ്ട്രേഷൻ ചേർക്കുക</span>
            </button>

            <button
              onClick={loadData}
              title="പുതുക്കുക"
              className="p-2.5 rounded-xl border border-gold-antique/40 bg-ivory/50 text-emerald-deep hover:bg-ivory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-malayalam flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button 
              onClick={() => loadData()}
              className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 font-bold"
            >
              വീണ്ടും ശ്രമിക്കുക
            </button>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-malayalam">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gold-antique absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="പേര്, മൊബൈൽ, ഐഡി, സ്ഥലം എന്നിവ തിരയുക..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
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

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep"
            >
              <option value="">എല്ലാ ഡിപ്പാർട്ട്മെന്റുകളും</option>
              <option value="Dars">Dars (ദർസ്)</option>
              <option value="Hifz">Hifz (ഹിഫ്സ്)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep"
            >
              <option value="latest">ഏറ്റവും പുതിയത് ആദ്യം</option>
              <option value="oldest">പഴയത് ആദ്യം</option>
            </select>
          </div>

        </div>

      </div>

      {/* ========================================================
          DATA DISPLAY (Desktop Table & Mobile Responsive Cards)
          ======================================================== */}
      {sortedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-gold-antique/30 space-y-3 font-malayalam">
          <Users className="w-10 h-10 text-gold-antique mx-auto opacity-50" />
          <p className="text-sm font-semibold text-text-secondary">രജിസ്ട്രേഷനുകൾ ഒന്നും കണ്ടെത്താനായില്ല.</p>
          <button
            onClick={() => { setSearch(''); setTypeFilter(''); setDeptFilter(''); setAttendanceFilter(''); }}
            className="text-xs text-emerald-forest font-bold hover:underline"
          >
            എല്ലാ ഫിൽട്ടറുകളും ഒഴിവാക്കുക
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-3xl border-2 border-gold-antique/30 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-malayalam">
                <thead>
                  <tr className="bg-emerald-deep text-gold-champagne uppercase text-[11px] border-b border-gold-antique/40">
                    <th className="py-3.5 px-4 font-bold">Reg ID</th>
                    <th className="py-3.5 px-4 font-bold">വിഭാഗം</th>
                    <th className="py-3.5 px-4 font-bold">പേര്</th>
                    <th className="py-3.5 px-4 font-bold">വിദ്യാർത്ഥി / Dept</th>
                    <th className="py-3.5 px-4 font-bold">മൊബൈൽ</th>
                    <th className="py-3.5 px-4 font-bold">ആളുകൾ</th>
                    <th className="py-3.5 px-4 font-bold">സ്ഥലം</th>
                    <th className="py-3.5 px-4 font-bold">ഹാജർ നില</th>
                    <th className="py-3.5 px-4 font-bold text-right">നടപടികൾ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-antique/10">
                  {sortedList.map((item) => (
                    <tr key={item.registrationId} className="hover:bg-ivory/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-deep">
                        {item.registrationId}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.registrationType === 'Student Parent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.registrationType === 'Student Parent' ? 'രക്ഷിതാവ്' : 'അതിഥി'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-text-primary">
                        {item.name}
                        {item.relationship && (
                          <span className="block text-[10px] text-text-muted">
                            ({item.relationship})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.studentName ? (
                          <div>
                            <span className="font-semibold text-text-primary">{item.studentName}</span>
                            <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              item.studentDepartment === 'Dars' ? 'bg-emerald-50 text-emerald-700' : 'bg-gold-light text-gold-dark'
                            }`}>
                              {item.studentDepartment}
                            </span>
                          </div>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-text-secondary">
                        {item.mobileNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-text-primary">
                        {item.registrationType === 'Student Parent' ? item.parentsAttending : item.guestsCount}
                      </td>
                      <td className="py-3 px-4 text-text-secondary max-w-xs truncate" title={item.addressPlace}>
                        {item.addressPlace}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.attendanceStatus === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <span>{item.attendanceStatus === 'Present' ? 'ഹാജർ' : 'ഹാജരില്ല'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setViewItem(item)}
                            title="വിശദാംശങ്ങൾ കാണുക"
                            className="p-1.5 rounded-lg text-emerald-forest hover:bg-emerald-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditItem({ ...item }); setModalError(''); }}
                            title="തിരുത്തുക"
                            className="p-1.5 rounded-lg text-gold-dark hover:bg-gold-light"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Requirement 3: Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmItem(item)}
                            title="നീക്കം ചെയ്യുക"
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:scale-105 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-3 font-malayalam">
            {sortedList.map((item) => (
              <div 
                key={item.registrationId}
                className="bg-white rounded-2xl p-4 border border-gold-antique/30 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between border-b border-gold-antique/15 pb-2">
                  <span className="font-mono font-bold text-xs text-emerald-deep">
                    {item.registrationId}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.registrationType === 'Student Parent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.registrationType === 'Student Parent' ? 'രക്ഷിതാവ്' : 'അതിഥി'}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">പേര്:</span>
                    <span className="font-bold text-text-primary">{item.name}</span>
                  </div>
                  {item.studentName && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">വിദ്യാർത്ഥി:</span>
                      <span className="font-medium text-emerald-deep">{item.studentName} ({item.studentDepartment})</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-muted">മൊബൈൽ:</span>
                    <span className="font-mono text-text-secondary">{item.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">ആളുകൾ:</span>
                    <span className="font-semibold text-text-primary">
                      {item.registrationType === 'Student Parent' ? `${item.parentsAttending} രക്ഷിതാക്കൾ` : `${item.guestsCount} അതിഥികൾ`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">ഹാജർ നില:</span>
                    <span className={`font-bold ${item.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-gray-600'}`}>
                      {item.attendanceStatus === 'Present' ? 'ഹാജർ' : 'ഹാജരില്ല'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gold-antique/15 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setViewItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-ivory text-emerald-deep font-semibold text-xs border border-gold-antique/30 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>കാണുക</span>
                  </button>
                  <button
                    onClick={() => { setEditItem({ ...item }); setModalError(''); }}
                    className="px-3 py-1.5 rounded-lg bg-gold-light text-gold-dark font-semibold text-xs border border-gold-antique/30 flex items-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>തിരുത്തുക</span>
                  </button>
                  {/* Requirement 3: Delete Button on Mobile Card */}
                  <button
                    onClick={() => setDeleteConfirmItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-semibold text-xs border border-red-200 flex items-center space-x-1 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>നീക്കം ചെയ്യുക</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================
          MODAL: VIEW DETAILS
          ======================================================== */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-malayalam">
          <div className="bg-white rounded-3xl border-2 border-gold-antique/50 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="bg-emerald-deep text-ivory p-5 flex items-center justify-between border-b-2 border-gold-antique">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gold-champagne" />
                <h3 className="font-heading font-bold text-lg text-gold-champagne">
                  Registration Details
                </h3>
              </div>
              <button 
                onClick={() => setViewItem(null)}
                className="p-1 rounded-lg text-ivory/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-ivory/70 border border-gold-antique/30 flex items-center justify-between">
                <span className="font-bold text-text-secondary">രജിസ്ട്രേഷൻ ഐഡി:</span>
                <span className="font-heading font-bold text-base text-emerald-deep font-mono">{viewItem.registrationId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-muted block">വിഭാഗം</span>
                  <span className="font-semibold text-text-primary">{viewItem.registrationType}</span>
                </div>
                <div>
                  <span className="text-text-muted block">പേര്</span>
                  <span className="font-semibold text-text-primary">{viewItem.name}</span>
                </div>
                <div>
                  <span className="text-text-muted block">മൊബൈൽ നമ്പർ</span>
                  <span className="font-mono text-text-primary">{viewItem.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-text-muted block">വാട്സ്ആപ്പ് നമ്പർ</span>
                  <span className="font-mono text-text-primary">{viewItem.whatsappNumber || viewItem.mobileNumber}</span>
                </div>
                {viewItem.studentName && (
                  <>
                    <div>
                      <span className="text-text-muted block">വിദ്യാർത്ഥിയുടെ പേര്</span>
                      <span className="font-semibold text-emerald-deep">{viewItem.studentName}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">വിഭാഗം</span>
                      <span className="font-semibold text-emerald-deep">{viewItem.studentDepartment}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">ബന്ധം</span>
                      <span className="text-text-primary">{viewItem.relationship}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">രക്ഷിതാക്കളുടെ എണ്ണം</span>
                      <span className="font-bold text-text-primary">{viewItem.parentsAttending}</span>
                    </div>
                  </>
                )}
                {viewItem.registrationType === 'Normal Guest' && (
                  <div>
                    <span className="text-text-muted block">അതിഥികളുടെ എണ്ണം</span>
                    <span className="font-bold text-text-primary">{viewItem.guestsCount}</span>
                  </div>
                )}
                <div>
                  <span className="text-text-muted block">ഹാജർ നില</span>
                  <span className={`font-bold ${viewItem.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {viewItem.attendanceStatus === 'Present' ? 'ഹാജർ' : 'ഹാജരില്ല'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gold-antique/20">
                <span className="text-text-muted block">സ്ഥലം / മേൽവിലാസം</span>
                <span className="font-medium text-text-primary">{viewItem.addressPlace}</span>
              </div>

              <div className="pt-2 border-t border-gold-antique/20 text-[10px] text-text-muted flex justify-between">
                <span>രജിസ്റ്റർ ചെയ്ത തീയതി: {viewItem.createdDate} {viewItem.createdTime}</span>
              </div>
            </div>

            <div className="p-4 bg-ivory/50 border-t border-gold-antique/20 text-right">
              <button
                onClick={() => setViewItem(null)}
                className="px-5 py-2 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs"
              >
                അടക്കുക
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT REGISTRATION
          ======================================================== */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-malayalam">
          <div className="bg-white rounded-3xl border-2 border-gold-antique/50 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="bg-emerald-deep text-ivory p-5 flex items-center justify-between border-b-2 border-gold-antique">
              <div>
                <h3 className="font-heading font-bold text-lg text-gold-champagne">
                  Edit Registration
                </h3>
                <p className="text-[11px] text-ivory/80 font-mono">{editItem.registrationId}</p>
              </div>
              <button 
                onClick={() => setEditItem(null)}
                className="p-1 rounded-lg text-ivory/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mx-6 mt-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">പേര്</label>
                <input
                  type="text"
                  value={editItem.name || ''}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">മൊബൈൽ നമ്പർ</label>
                  <input
                    type="tel"
                    value={editItem.mobileNumber || ''}
                    onChange={(e) => setEditItem({ ...editItem, mobileNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-primary mb-1">വാട്സ്ആപ്പ് നമ്പർ</label>
                  <input
                    type="tel"
                    value={editItem.whatsappNumber || ''}
                    onChange={(e) => setEditItem({ ...editItem, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-mono"
                  />
                </div>
              </div>

              {editItem.registrationType === 'Student Parent' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-text-primary mb-1">വിദ്യാർത്ഥിയുടെ പേര്</label>
                      <input
                        type="text"
                        value={editItem.studentName || ''}
                        onChange={(e) => setEditItem({ ...editItem, studentName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">വിഭാഗം</label>
                      <select
                        value={editItem.studentDepartment || 'Dars'}
                        onChange={(e) => setEditItem({ ...editItem, studentDepartment: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      >
                        <option value="Dars">Dars</option>
                        <option value="Hifz">Hifz</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-text-primary mb-1">ബന്ധം</label>
                      <select
                        value={editItem.relationship || 'Father'}
                        onChange={(e) => setEditItem({ ...editItem, relationship: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      >
                        <option value="Father">പിതാവ്</option>
                        <option value="Mother">മാതാവ്</option>
                        <option value="Guardian">രക്ഷാധികാരി</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">രക്ഷിതാക്കളുടെ എണ്ണം</label>
                      <input
                        type="number"
                        min="1"
                        value={editItem.parentsAttending || 1}
                        onChange={(e) => setEditItem({ ...editItem, parentsAttending: parseInt(e.target.value, 10) || 1 })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      />
                    </div>
                  </div>
                </>
              )}

              {editItem.registrationType === 'Normal Guest' && (
                <div>
                  <label className="block font-bold text-text-primary mb-1">അതിഥികളുടെ എണ്ണം</label>
                  <input
                    type="number"
                    min="1"
                    value={editItem.guestsCount || 1}
                    onChange={(e) => setEditItem({ ...editItem, guestsCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-text-primary mb-1">സ്ഥലം / മേൽവിലാസം</label>
                <input
                  type="text"
                  value={editItem.addressPlace || ''}
                  onChange={(e) => setEditItem({ ...editItem, addressPlace: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">ഹാജർ നില</label>
                <select
                  value={editItem.attendanceStatus || 'Absent'}
                  onChange={(e) => setEditItem({ ...editItem, attendanceStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                >
                  <option value="Absent">ഹാജരില്ല (Absent)</option>
                  <option value="Present">ഹാജർ (Present)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gold-antique/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-text-secondary"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-deep text-gold-champagne font-bold"
                >
                  മാറ്റങ്ങൾ സേവ് ചെയ്യുക
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD MANUAL REGISTRATION
          ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-malayalam">
          <div className="bg-white rounded-3xl border-2 border-gold-antique/50 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="bg-emerald-deep text-ivory p-5 flex items-center justify-between border-b-2 border-gold-antique">
              <h3 className="font-heading font-bold text-lg text-gold-champagne">
                Add Registration Manually
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-ivory/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mx-6 mt-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">രജിസ്ട്രേഷൻ വിഭാഗം</label>
                <select
                  value={newReg.registrationType}
                  onChange={(e) => setNewReg({ ...newReg, registrationType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-semibold text-emerald-deep"
                >
                  <option value="Student Parent">Student Parent (രക്ഷിതാവ്)</option>
                  <option value="Normal Guest">Normal Guest (അതിഥി)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">പേര് *</label>
                <input
                  type="text"
                  placeholder="പൂർണ്ണ പേര് നൽകുക"
                  value={newReg.name}
                  onChange={(e) => setNewReg({ ...newReg, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">മൊബൈൽ നമ്പർ *</label>
                  <input
                    type="tel"
                    placeholder="10 അക്ക മൊബൈൽ"
                    value={newReg.mobileNumber}
                    onChange={(e) => setNewReg({ ...newReg, mobileNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-primary mb-1">വാട്സ്ആപ്പ് നമ്പർ</label>
                  <input
                    type="tel"
                    placeholder="വാട്സ്ആപ്പ് നമ്പർ"
                    value={newReg.whatsappNumber}
                    onChange={(e) => setNewReg({ ...newReg, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-mono"
                  />
                </div>
              </div>

              {newReg.registrationType === 'Student Parent' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-text-primary mb-1">വിദ്യാർത്ഥിയുടെ പേര് *</label>
                      <input
                        type="text"
                        placeholder="വിദ്യാർത്ഥിയുടെ പേര്"
                        value={newReg.studentName}
                        onChange={(e) => setNewReg({ ...newReg, studentName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">വിഭാഗം *</label>
                      <select
                        value={newReg.studentDepartment}
                        onChange={(e) => setNewReg({ ...newReg, studentDepartment: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-semibold"
                      >
                        <option value="Dars">Dars</option>
                        <option value="Hifz">Hifz</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-text-primary mb-1">ബന്ധം</label>
                      <select
                        value={newReg.relationship}
                        onChange={(e) => setNewReg({ ...newReg, relationship: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      >
                        <option value="Father">പിതാവ്</option>
                        <option value="Mother">മാതാവ്</option>
                        <option value="Guardian">രക്ഷാധികാരി</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">രക്ഷിതാക്കളുടെ എണ്ണം</label>
                      <input
                        type="number"
                        min="1"
                        value={newReg.parentsAttending}
                        onChange={(e) => setNewReg({ ...newReg, parentsAttending: parseInt(e.target.value, 10) || 1 })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      />
                    </div>
                  </div>
                </>
              )}

              {newReg.registrationType === 'Normal Guest' && (
                <div>
                  <label className="block font-bold text-text-primary mb-1">അതിഥികളുടെ എണ്ണം</label>
                  <input
                    type="number"
                    min="1"
                    value={newReg.guestsCount}
                    onChange={(e) => setNewReg({ ...newReg, guestsCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-text-primary mb-1">സ്ഥലം / മേൽവിലാസം *</label>
                <input
                  type="text"
                  placeholder="സ്ഥലം നൽകുക"
                  value={newReg.addressPlace}
                  onChange={(e) => setNewReg({ ...newReg, addressPlace: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  required
                />
              </div>

              <div className="pt-3 border-t border-gold-antique/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-text-secondary"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-deep text-gold-champagne font-bold"
                >
                  രേഖ ചേർക്കുക
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          REQUIREMENT 3: MALAYALAM DELETE CONFIRMATION DIALOG
          ======================================================== */}
      {deleteConfirmItem && (
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
                <p><strong>ID:</strong> {deleteConfirmItem.registrationId}</p>
                <p className="font-sans font-semibold"><strong>പേര്:</strong> {deleteConfirmItem.name}</p>
                <p><strong>മൊബൈൽ:</strong> {deleteConfirmItem.mobileNumber}</p>
              </div>
            </div>

            {/* Exact Requirement 3 Buttons: "റദ്ദാക്കുക" and "നീക്കം ചെയ്യുക" */}
            <div className="flex items-center justify-center space-x-3 pt-3 border-t border-forest/15">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
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
