import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminLayout({ 
  children, 
  activePage, 
  setActivePage, 
  adminUser, 
  onLogout 
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gasUrl, setGasUrl] = useState(apiService.getGasUrl());

  useEffect(() => {
    setGasUrl(apiService.getGasUrl());
  }, [activePage]);

  const navItems = [
    { id: 'admin-dashboard', label: 'ഡാഷ്‌ബോർഡ് അവലോകനം', en: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-registrations', label: 'രജിസ്ട്രേഷനുകൾ', en: 'Registrations', icon: Users },
    { id: 'admin-attendance', label: 'ഹാജർ നിയന്ത്രണം', en: 'Attendance', icon: CheckSquare },
    { id: 'admin-reports', label: 'റിപ്പോർട്ടുകൾ & എക്സ്പോർട്ട്', en: 'Reports', icon: FileText },
    { id: 'admin-settings', label: 'സെറ്റിംഗ്സ് & ക്ലൗഡ്', en: 'Settings', icon: Settings },
  ];

  const handleSyncRefresh = async () => {
    setIsSyncing(true);
    try {
      await apiService.getRegistrations();
      await apiService.getDashboardStats();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-cultured flex flex-col md:flex-row font-malayalam">
      
      {/* Desktop Sidebar in Rich Black */}
      <aside className="hidden md:flex flex-col w-64 bg-richblack text-cultured border-r border-grullo/30 shrink-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-grullo/20 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-grullo shadow-grullo">
            <img src="/thazkiya-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm tracking-wide text-grullo-light leading-tight">
              THAZKIYA ADMIN
            </h2>
            <p className="text-[10px] text-cultured/60 tracking-wider uppercase font-sans">
              HAPPY PARENTING PORTAL
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="px-5 py-3 bg-richblack-light border-b border-grullo/15 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${gasUrl ? 'bg-emerald-400' : 'bg-grullo'}`} />
            <span className="text-cultured/90 font-medium">
              {gasUrl ? 'ഗൂഗിൾ ഷീറ്റ്സ് ലൈവ്' : 'ലോക്കൽ ഡാറ്റാബേസ്'}
            </span>
          </div>
          <button 
            onClick={handleSyncRefresh}
            title="വിവരങ്ങൾ പുതുക്കുക"
            className={`p-1 text-grullo hover:text-white transition-transform ${isSyncing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-darksienna to-darksienna-light text-white font-bold shadow-sienna border border-grullo/40'
                    : 'text-cultured/80 hover:bg-richblack-light hover:text-grullo'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-grullo-light' : 'text-grullo'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-grullo-light" />}
              </button>
            );
          })}
        </nav>

        {/* Current Admin User Info & Footer */}
        <div className="p-4 border-t border-grullo/20 bg-richblack-surface">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-darksienna/30 border border-grullo flex items-center justify-center text-grullo-light font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-grullo" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-cultured truncate font-sans">{adminUser?.username || 'Admin'}</p>
              <p className="text-[10px] text-grullo truncate font-sans">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-grullo/10">
            <button
              onClick={() => setActivePage('home')}
              className="flex-1 py-1.5 px-2 rounded bg-richblack-light text-[11px] text-cultured/90 hover:text-white flex items-center justify-center space-x-1 border border-grullo/20"
            >
              <Globe className="w-3 h-3" />
              <span>വെബ്സൈറ്റ്</span>
            </button>
            <button
              onClick={onLogout}
              className="py-1.5 px-2.5 rounded bg-darksienna text-[11px] text-white hover:bg-darksienna-dark flex items-center justify-center space-x-1"
              title="ലോഗൗട്ട്"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Admin Header */}
        <header className="md:hidden bg-richblack border-b border-grullo/30 p-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-grullo hover:bg-richblack-light"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-heading font-bold text-sm text-grullo-light font-sans">
              ADMIN DASHBOARD
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSyncRefresh}
              className={`p-1.5 rounded-lg text-grullo ${isSyncing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="px-2.5 py-1 rounded bg-richblack-light text-grullo-light text-xs border border-grullo/30"
            >
              വെബ്സൈറ്റ്
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-darksienna text-white text-xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Modal/Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-xs bg-richblack text-cultured border-r border-grullo/30 h-full p-4 z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-grullo/20">
                <div className="flex items-center space-x-2">
                  <img src="/thazkiya-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-grullo bg-white" />
                  <span className="font-heading font-bold text-grullo-light text-sm">THAZKIYA ADMIN</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-cultured/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold ${
                        isActive
                          ? 'bg-gradient-to-r from-darksienna to-darksienna-light text-white font-bold'
                          : 'text-cultured/80 hover:bg-richblack-light'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-grullo/20 space-y-2">
                <button
                  onClick={() => {
                    setActivePage('home');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded bg-richblack-light text-xs text-grullo-light border border-grullo/20 flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>വെബ്സൈറ്റ് കാണുക</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-2 px-3 rounded bg-darksienna text-xs text-white font-semibold flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ലോഗൗട്ട്</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Inner Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
