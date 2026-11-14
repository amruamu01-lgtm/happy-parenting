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
    <header className="sticky top-0 z-50 bg-emerald-deep/95 backdrop-blur-md border-b border-gold-antique/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Academy Identity */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 cursor-pointer group py-2"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-gold-antique shadow-gold group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/thazkiya-logo.jpg" 
                alt="Thazkiya Academy" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg sm:text-xl tracking-wider text-gold-champagne group-hover:text-gold-antique transition-colors leading-tight">
                THAZKIYA ACADEMY
              </span>
              <span className="text-[11px] sm:text-xs font-medium tracking-[0.2em] text-ivory/80 uppercase">
                KARINKALLATHANI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => navigateTo('home')}
              className={`text-sm font-malayalam font-medium transition-colors hover:text-gold-champagne flex items-center space-x-1.5 ${
                activePage === 'home' ? 'text-gold-antique font-semibold border-b-2 border-gold-antique pb-1' : 'text-ivory/90'
              }`}
            >
              <Home className="w-4 h-4 text-gold-champagne" />
              <span>ഹോം</span>
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('about-programme');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-malayalam font-medium text-ivory/90 hover:text-gold-champagne transition-colors"
            >
              പരിപാടിയെക്കുറിച്ച്
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('registration-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-gold-antique to-amber-warm text-emerald-deep font-malayalam font-bold text-sm shadow-gold hover:shadow-lg hover:brightness-110 transition-all flex items-center space-x-2 border border-gold-champagne"
            >
              <Calendar className="w-4 h-4" />
              <span>രജിസ്റ്റർ ചെയ്യുക</span>
            </button>

            {/* Admin Portal Link */}
            <button
              onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`text-xs font-malayalam px-3.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                activePage.startsWith('admin') 
                  ? 'bg-burgundy-deep text-white border-gold-antique' 
                  : 'border-gold-antique/40 text-gold-champagne hover:bg-emerald-forest'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-gold-champagne" />
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
              className="px-3 py-1.5 rounded-full bg-gold-antique text-emerald-deep font-malayalam font-bold text-xs"
            >
              രജിസ്റ്റർ ചെയ്യുക
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gold-champagne hover:text-white hover:bg-emerald-forest transition-colors focus:outline-none"
              aria-label="മെനു തുറക്കുക"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-deep border-b border-gold-antique/30 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => navigateTo('home')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium ${
                activePage === 'home' ? 'bg-emerald-forest text-gold-antique' : 'text-ivory hover:bg-emerald-forest/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-gold-champagne" />
                <span>ഹോം</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gold-champagne/60" />
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('about-programme');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-ivory hover:bg-emerald-forest/60"
            >
              <span>പരിപാടിയെക്കുറിച്ച്</span>
              <ChevronRight className="w-4 h-4 text-gold-champagne/60" />
            </button>

            <button
              onClick={() => navigateTo('student-parent-register')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-ivory hover:bg-emerald-forest/60"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-warm" />
                <span>രക്ഷിതാക്കളുടെ രജിസ്ട്രേഷൻ (Student Parent)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gold-champagne/60" />
            </button>

            <button
              onClick={() => navigateTo('normal-guest-register')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-ivory hover:bg-emerald-forest/60"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gold-champagne" />
                <span>മറ്റു അതിഥികളുടെ രജിസ്ട്രേഷൻ (Normal Guest)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gold-champagne/60" />
            </button>

            <div className="pt-2 border-t border-gold-antique/20">
              <button
                onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-burgundy-deep text-white text-xs font-malayalam font-semibold tracking-wider border border-gold-antique/40 shadow-sm"
              >
                <Shield className="w-4 h-4 text-gold-champagne" />
                <span>{isAdminLoggedIn ? 'അഡ്മിൻ ഡാഷ്‌ബോർഡിലേക്ക്' : 'അഡ്മിൻ ലോഗിൻ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
