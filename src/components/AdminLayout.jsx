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
    <div className="min-h-screen bg-lightbg flex flex-col md:flex-row font-malayalam">
      
      {/* Desktop Sidebar in Deep Forest Green */}
      <aside className="hidden md:flex flex-col w-64 bg-forest text-white border-r border-forest-dark shrink-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-white/15 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-emerald shadow-xs">
            <img src="/thazkiya-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm tracking-wide text-white leading-tight">
              THAZKIYA ADMIN
            </h2>
            <p className="text-[10px] text-emerald-200 tracking-wider uppercase font-sans font-semibold">
              HAPPY PARENTING PORTAL
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="px-5 py-3 bg-forest-dark/60 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${gasUrl ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-white/90 font-medium">
              {gasUrl ? 'ഗൂഗിൾ ഷീറ്റ്സ് ലൈവ്' : 'ക്ലൗഡ് URL നൽകുക'}
            </span>
          </div>
          <button 
            onClick={handleSyncRefresh}
            title="വിവരങ്ങൾ പുതുക്കുക"
            className={`p-1 text-emerald-200 hover:text-white transition-transform ${isSyncing ? 'animate-spin' : ''}`}
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
                    ? 'bg-forest-dark text-white font-bold shadow-xs border-l-4 border-emerald'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-200'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />}
              </button>
            );
          })}
        </nav>

        {/* Current Admin User Info & Footer */}
        <div className="p-4 border-t border-white/15 bg-forest-dark/80">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-emerald flex items-center justify-center text-emerald-200 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate font-sans">{adminUser?.username || 'Admin'}</p>
              <p className="text-[10px] text-emerald-200 truncate font-sans">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setActivePage('home')}
              className="flex-1 py-1.5 px-2 rounded bg-forest text-[11px] text-white hover:bg-forest-light flex items-center justify-center space-x-1 border border-white/15"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-200" />
              <span>വെബ്സൈറ്റ്</span>
            </button>
            <button
              onClick={onLogout}
              className="py-1.5 px-2.5 rounded bg-emerald hover:bg-forest-dark text-[11px] text-white flex items-center justify-center space-x-1 transition-colors"
              title="ലോഗൗട്ട്"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Admin Header */}
        <header className="md:hidden bg-forest text-white border-b border-emerald/30 p-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-white hover:bg-forest-dark"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-heading font-bold text-sm text-white font-sans">
              ADMIN DASHBOARD
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSyncRefresh}
              className={`p-1.5 rounded-lg text-emerald-200 ${isSyncing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="px-2.5 py-1 rounded bg-forest-dark text-emerald-200 text-xs border border-emerald/40"
            >
              വെബ്സൈറ്റ്
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-emerald text-white text-xs"
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
            <div className="relative flex flex-col w-72 max-w-xs bg-forest text-white border-r border-emerald/30 h-full p-4 z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div className="flex items-center space-x-2">
                  <img src="/thazkiya-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-emerald bg-white" />
                  <span className="font-heading font-bold text-white text-sm">THAZKIYA ADMIN</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-white hover:text-emerald-200"
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
                          ? 'bg-forest-dark text-white font-bold border-l-4 border-emerald'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-emerald-300" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-white/20 space-y-2">
                <button
                  onClick={() => {
                    setActivePage('home');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded bg-forest-dark text-xs text-emerald-200 border border-emerald/30 flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4 text-emerald-300" />
                  <span>വെബ്സൈറ്റ് കാണുക</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-2 px-3 rounded bg-emerald hover:bg-forest-dark text-xs text-white font-semibold flex items-center justify-center space-x-2"
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
