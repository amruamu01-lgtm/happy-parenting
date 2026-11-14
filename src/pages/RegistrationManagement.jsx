import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Phone, 
  MapPin, 
  GraduationCap,
  Calendar,
  Clock,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function RegistrationManagement({ adminUser }) {
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
  }, []);

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
      setModalError('Please fill in all required fields');
      return;
    }

    if (newReg.registrationType === 'Student Parent' && !newReg.studentName.trim()) {
      setModalError('Student name is required for Student Parent registration');
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
        loadData();
      } else {
        setModalError(res.message || 'Creation failed');
      }
    } catch (err) {
      setModalError('Server error while saving registration');
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
        loadData();
      } else {
        setModalError(res.message || 'Update failed');
      }
    } catch (err) {
      setModalError('Server error updating record');
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmItem) return;
    try {
      const res = await apiService.deleteRegistration(deleteConfirmItem.registrationId, adminUser?.adminId);
      if (res.success) {
        setDeleteConfirmItem(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border-2 border-gold-antique/30 shadow-card space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-antique/20 pb-4">
          <div>
            <h1 className="font-heading font-black text-2xl text-emerald-deep">
              Registration Management
            </h1>
            <p className="text-xs text-text-secondary">
              Total Database Records: <strong className="text-emerald-deep">{registrations.length}</strong> (Showing: {sortedList.length})
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-emerald-forest transition-colors shadow-sm border border-gold-antique/30"
            >
              <Plus className="w-4 h-4 text-gold-antique" />
              <span>Add Registration</span>
            </button>

            <button
              onClick={loadData}
              title="Refresh"
              className="p-2.5 rounded-xl border border-gold-antique/40 bg-ivory/50 text-emerald-deep hover:bg-ivory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gold-antique absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, mobile, ID, place..."
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
              <option value="">All Categories (എല്ലാം)</option>
              <option value="Student Parent">Student Parent</option>
              <option value="Normal Guest">Normal Guest</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep"
            >
              <option value="">All Departments</option>
              <option value="Dars">Dars Only</option>
              <option value="Hifz">Hifz Only</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep"
            >
              <option value="latest">Sort: Latest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>

        </div>

      </div>

      {/* ========================================================
          DATA DISPLAY (Desktop Table & Mobile Responsive Cards)
          ======================================================== */}
      {sortedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-gold-antique/30 space-y-3">
          <Users className="w-10 h-10 text-gold-antique mx-auto opacity-50" />
          <p className="text-sm font-semibold text-text-secondary">No registrations match your search filters.</p>
          <button
            onClick={() => { setSearch(''); setTypeFilter(''); setDeptFilter(''); setAttendanceFilter(''); }}
            className="text-xs text-emerald-forest font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE (Hidden on Mobile) */}
          <div className="hidden lg:block bg-white rounded-3xl border-2 border-gold-antique/30 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-emerald-deep text-gold-champagne uppercase tracking-wider text-[11px] border-b border-gold-antique/40">
                    <th className="py-3.5 px-4 font-bold">Reg ID</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Participant Name</th>
                    <th className="py-3.5 px-4 font-bold">Student / Dept</th>
                    <th className="py-3.5 px-4 font-bold">Mobile</th>
                    <th className="py-3.5 px-4 font-bold">Headcount</th>
                    <th className="py-3.5 px-4 font-bold">Place</th>
                    <th className="py-3.5 px-4 font-bold">Attendance</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
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
                          {item.registrationType}
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
                          <span>{item.attendanceStatus || 'Absent'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setViewItem(item)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg text-emerald-forest hover:bg-emerald-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditItem({ ...item }); setModalError(''); }}
                            title="Edit Record"
                            className="p-1.5 rounded-lg text-gold-dark hover:bg-gold-light"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem(item)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-burgundy-deep hover:bg-burgundy-surface"
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

          {/* MOBILE CARDS (Visible on Small / Tablet screens) */}
          <div className="lg:hidden space-y-3">
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
                    {item.registrationType}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Name:</span>
                    <span className="font-bold text-text-primary">{item.name}</span>
                  </div>
                  {item.studentName && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Student:</span>
                      <span className="font-medium text-emerald-deep">{item.studentName} ({item.studentDepartment})</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-muted">Mobile:</span>
                    <span className="font-mono text-text-secondary">{item.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Attendees:</span>
                    <span className="font-semibold text-text-primary">
                      {item.registrationType === 'Student Parent' ? `${item.parentsAttending} Parents` : `${item.guestsCount} Guests`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Attendance:</span>
                    <span className={`font-bold ${item.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-gray-600'}`}>
                      {item.attendanceStatus || 'Absent'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gold-antique/15 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setViewItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-ivory text-emerald-deep font-semibold text-xs border border-gold-antique/30 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => { setEditItem({ ...item }); setModalError(''); }}
                    className="px-3 py-1.5 rounded-lg bg-gold-light text-gold-dark font-semibold text-xs border border-gold-antique/30 flex items-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-burgundy-surface text-burgundy-deep font-semibold text-xs border border-burgundy-deep/20 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
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
                <span className="font-bold text-text-secondary">Registration ID:</span>
                <span className="font-heading font-bold text-base text-emerald-deep font-mono">{viewItem.registrationId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-text-muted block">Category</span>
                  <span className="font-semibold text-text-primary">{viewItem.registrationType}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Registered Name</span>
                  <span className="font-semibold text-text-primary">{viewItem.name}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Mobile Number</span>
                  <span className="font-mono text-text-primary">{viewItem.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-text-muted block">WhatsApp Number</span>
                  <span className="font-mono text-text-primary">{viewItem.whatsappNumber || viewItem.mobileNumber}</span>
                </div>
                {viewItem.studentName && (
                  <>
                    <div>
                      <span className="text-text-muted block">Student Name</span>
                      <span className="font-semibold text-emerald-deep">{viewItem.studentName}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Student Department</span>
                      <span className="font-semibold text-emerald-deep">{viewItem.studentDepartment}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Relationship</span>
                      <span className="text-text-primary">{viewItem.relationship}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Parents Attending</span>
                      <span className="font-bold text-text-primary">{viewItem.parentsAttending}</span>
                    </div>
                  </>
                )}
                {viewItem.registrationType === 'Normal Guest' && (
                  <div>
                    <span className="text-text-muted block">Guests Attending</span>
                    <span className="font-bold text-text-primary">{viewItem.guestsCount}</span>
                  </div>
                )}
                <div>
                  <span className="text-text-muted block">Attendance Status</span>
                  <span className={`font-bold ${viewItem.attendanceStatus === 'Present' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {viewItem.attendanceStatus}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gold-antique/20">
                <span className="text-text-muted block">Place / Address</span>
                <span className="font-medium text-text-primary">{viewItem.addressPlace}</span>
              </div>

              <div className="pt-2 border-t border-gold-antique/20 text-[10px] text-text-muted flex justify-between">
                <span>Created: {viewItem.createdDate} {viewItem.createdTime}</span>
                <span>Updated: {viewItem.updatedDate || '—'}</span>
              </div>
            </div>

            <div className="p-4 bg-ivory/50 border-t border-gold-antique/20 text-right">
              <button
                onClick={() => setViewItem(null)}
                className="px-5 py-2 rounded-xl bg-emerald-deep text-gold-champagne font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT REGISTRATION
          ======================================================== */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
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
              <div className="mx-6 mt-4 p-2.5 rounded-lg bg-burgundy-surface text-burgundy-deep text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">Name</label>
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
                  <label className="block font-bold text-text-primary mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={editItem.mobileNumber || ''}
                    onChange={(e) => setEditItem({ ...editItem, mobileNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-primary mb-1">WhatsApp</label>
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
                      <label className="block font-bold text-text-primary mb-1">Student Name</label>
                      <input
                        type="text"
                        value={editItem.studentName || ''}
                        onChange={(e) => setEditItem({ ...editItem, studentName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">Department</label>
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
                      <label className="block font-bold text-text-primary mb-1">Relationship</label>
                      <select
                        value={editItem.relationship || 'Father'}
                        onChange={(e) => setEditItem({ ...editItem, relationship: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">Parents Attending</label>
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
                  <label className="block font-bold text-text-primary mb-1">Guests Attending</label>
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
                <label className="block font-bold text-text-primary mb-1">Address / Place</label>
                <input
                  type="text"
                  value={editItem.addressPlace || ''}
                  onChange={(e) => setEditItem({ ...editItem, addressPlace: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Attendance Status</label>
                <select
                  value={editItem.attendanceStatus || 'Absent'}
                  onChange={(e) => setEditItem({ ...editItem, attendanceStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                >
                  <option value="Absent">Absent</option>
                  <option value="Present">Present</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gold-antique/20 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-deep text-gold-champagne font-bold"
                >
                  Save Changes
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
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
              <div className="mx-6 mt-4 p-2.5 rounded-lg bg-burgundy-surface text-burgundy-deep text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-text-primary mb-1">Registration Category</label>
                <select
                  value={newReg.registrationType}
                  onChange={(e) => setNewReg({ ...newReg, registrationType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-semibold text-emerald-deep"
                >
                  <option value="Student Parent">Student Parent</option>
                  <option value="Normal Guest">Normal Guest</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Participant Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newReg.name}
                  onChange={(e) => setNewReg({ ...newReg, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit Mobile"
                    value={newReg.mobileNumber}
                    onChange={(e) => setNewReg({ ...newReg, mobileNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gold-antique/40 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-text-primary mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="WhatsApp"
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
                      <label className="block font-bold text-text-primary mb-1">Student Name *</label>
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={newReg.studentName}
                        onChange={(e) => setNewReg({ ...newReg, studentName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">Student Department *</label>
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
                      <label className="block font-bold text-text-primary mb-1">Relationship</label>
                      <select
                        value={newReg.relationship}
                        onChange={(e) => setNewReg({ ...newReg, relationship: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gold-antique/40"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-text-primary mb-1">Parents Attending</label>
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
                  <label className="block font-bold text-text-primary mb-1">Guests Attending</label>
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
                <label className="block font-bold text-text-primary mb-1">Address / Place *</label>
                <input
                  type="text"
                  placeholder="Place Name"
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-deep text-gold-champagne font-bold"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DELETE CONFIRMATION DIALOG
          ======================================================== */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border-2 border-burgundy-deep/40 shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-burgundy-surface border border-burgundy-deep text-burgundy-deep flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-emerald-deep">
                Delete Registration?
              </h3>
              <p className="text-xs text-text-secondary">
                Are you sure you want to permanently delete registration <strong className="font-mono text-burgundy-deep">{deleteConfirmItem.registrationId}</strong> ({deleteConfirmItem.name})?
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-text-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-burgundy-deep text-white text-xs font-bold shadow-md hover:bg-burgundy-dark"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
