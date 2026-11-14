import React, { useState } from 'react';
import { Menu, X, Shield, Calendar, Users, Home, ChevronRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, isAdminLoggedIn, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-forest/15 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Academy Identity */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 cursor-pointer group py-2"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-forest shadow-xs group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/thazkiya-logo.jpg" 
                alt="Thazkiya Academy" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg sm:text-xl tracking-wider text-forest group-hover:text-forest-dark transition-colors leading-tight">
                THAZKIYA ACADEMY
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-emerald uppercase">
                KARINKALLATHANI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => navigateTo('home')}
              className={`text-sm font-malayalam font-medium transition-colors hover:text-forest flex items-center space-x-1.5 ${
                activePage === 'home' ? 'text-forest font-bold border-b-2 border-forest pb-1' : 'text-text-primary'
              }`}
            >
              <Home className="w-4 h-4 text-forest" />
              <span>ഹോം</span>
            </button>

            {/* Primary Button: Deep Forest Green background with white text */}
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('registration-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-5 py-2.5 rounded-full bg-forest hover:bg-forest-dark text-white font-malayalam font-bold text-sm shadow-forest hover:shadow-lg transition-all flex items-center space-x-2 border border-forest"
            >
              <Calendar className="w-4 h-4 text-emerald-light" />
              <span>രജിസ്റ്റർ ചെയ്യുക</span>
            </button>

            {/* Admin Portal Link */}
            <button
              onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`text-xs font-malayalam px-3.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                activePage.startsWith('admin') 
                  ? 'bg-forest text-white border-forest' 
                  : 'border-forest/30 text-forest hover:bg-sage/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald" />
              <span>{isAdminLoggedIn ? 'അഡ്മിൻ പാനൽ' : 'അഡ്മിൻ ലോഗിൻ'}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('registration-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-1.5 rounded-full bg-forest text-white font-malayalam font-bold text-xs shadow-xs"
            >
              രജിസ്റ്റർ
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-forest hover:text-forest-dark hover:bg-sage/40 transition-colors focus:outline-none"
              aria-label="മെനു തുറക്കുക"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-forest/20 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => navigateTo('home')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium ${
                activePage === 'home' ? 'bg-sage/70 text-forest font-bold' : 'text-text-primary hover:bg-sage/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-forest" />
                <span>ഹോം</span>
              </div>
              <ChevronRight className="w-4 h-4 text-forest/60" />
            </button>

            <button
              onClick={() => navigateTo('student-parent-register')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-text-primary hover:bg-sage/40"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-forest" />
                <span>രക്ഷിതാക്കളുടെ രജിസ്ട്രേഷൻ (Student Parent)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-forest/60" />
            </button>

            <button
              onClick={() => navigateTo('normal-guest-register')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-text-primary hover:bg-sage/40"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-emerald" />
                <span>മറ്റു അതിഥികളുടെ രജിസ്ട്രേഷൻ (Normal Guest)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald/60" />
            </button>

            <div className="pt-2 border-t border-forest/15">
              <button
                onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-forest text-white text-xs font-malayalam font-semibold tracking-wider shadow-sm hover:bg-forest-dark transition-colors"
              >
                <Shield className="w-4 h-4 text-emerald-light" />
                <span>{isAdminLoggedIn ? 'അഡ്മിൻ ഡാഷ്‌ബോർഡിലേക്ക്' : 'അഡ്മിൻ ലോഗിൻ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
