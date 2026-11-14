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
    <div className="min-h-screen bg-ivory flex flex-col md:flex-row font-malayalam">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-emerald-deep text-ivory border-r border-gold-antique/30 shrink-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-gold-antique/20 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-gold-antique shadow-gold">
            <img src="/thazkiya-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm tracking-wide text-gold-champagne leading-tight">
              THAZKIYA ADMIN
            </h2>
            <p className="text-[10px] text-ivory/60 tracking-wider uppercase font-sans">
              HAPPY PARENTING PORTAL
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="px-5 py-3 bg-emerald-forest/60 border-b border-gold-antique/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${gasUrl ? 'bg-emerald-400' : 'bg-amber-warm'}`} />
            <span className="text-ivory/90 font-medium">
              {gasUrl ? 'ഗൂഗിൾ ഷീറ്റ്സ് ലൈവ്' : 'ലോക്കൽ ഡാറ്റാബേസ്'}
            </span>
          </div>
          <button 
            onClick={handleSyncRefresh}
            title="വിവരങ്ങൾ പുതുക്കുക"
            className={`p-1 text-gold-champagne hover:text-white transition-transform ${isSyncing ? 'animate-spin' : ''}`}
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
                    ? 'bg-gradient-to-r from-gold-antique to-amber-warm text-emerald-deep font-bold shadow-gold'
                    : 'text-ivory/80 hover:bg-emerald-forest hover:text-gold-champagne'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-deep' : 'text-gold-champagne'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-deep" />}
              </button>
            );
          })}
        </nav>

        {/* Current Admin User Info & Footer */}
        <div className="p-4 border-t border-gold-antique/20 bg-emerald-surface">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold-antique/20 border border-gold-antique flex items-center justify-center text-gold-champagne font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-gold-champagne" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-ivory truncate font-sans">{adminUser?.username || 'Admin'}</p>
              <p className="text-[10px] text-gold-champagne/80 truncate font-sans">{adminUser?.role || 'Super Admin'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-gold-antique/10">
            <button
              onClick={() => setActivePage('home')}
              className="flex-1 py-1.5 px-2 rounded bg-emerald-forest/80 text-[11px] text-ivory/90 hover:text-white flex items-center justify-center space-x-1 border border-gold-antique/20"
            >
              <Globe className="w-3 h-3" />
              <span>വെബ്സൈറ്റ്</span>
            </button>
            <button
              onClick={onLogout}
              className="py-1.5 px-2.5 rounded bg-burgundy-deep text-[11px] text-white hover:bg-burgundy-dark flex items-center justify-center space-x-1"
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
        <header className="md:hidden bg-emerald-deep border-b border-gold-antique/30 p-3.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gold-champagne hover:bg-emerald-forest"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-heading font-bold text-sm text-gold-champagne font-sans">
              ADMIN DASHBOARD
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSyncRefresh}
              className={`p-1.5 rounded-lg text-gold-champagne ${isSyncing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="px-2.5 py-1 rounded bg-emerald-forest text-gold-champagne text-xs border border-gold-antique/30"
            >
              വെബ്സൈറ്റ്
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-burgundy-deep text-white text-xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Modal/Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-xs bg-emerald-deep text-ivory border-r border-gold-antique/30 h-full p-4 z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gold-antique/20">
                <div className="flex items-center space-x-2">
                  <img src="/thazkiya-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-gold-antique bg-white" />
                  <span className="font-heading font-bold text-gold-champagne text-sm">THAZKIYA ADMIN</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-ivory/80 hover:text-white"
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
                          ? 'bg-gradient-to-r from-gold-antique to-amber-warm text-emerald-deep font-bold'
                          : 'text-ivory/80 hover:bg-emerald-forest'
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

              <div className="pt-3 border-t border-gold-antique/20 space-y-2">
                <button
                  onClick={() => {
                    setActivePage('home');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded bg-emerald-forest text-xs text-gold-champagne border border-gold-antique/20 flex items-center justify-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>വെബ്സൈറ്റ് കാണുക</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-2 px-3 rounded bg-burgundy-deep text-xs text-white font-semibold flex items-center justify-center space-x-2"
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
