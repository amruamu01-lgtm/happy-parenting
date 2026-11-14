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
    <header className="sticky top-0 z-50 bg-richblack/95 backdrop-blur-md border-b border-grullo/30 shadow-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Academy Identity */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 cursor-pointer group py-2"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-grullo shadow-grullo group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/thazkiya-logo.jpg" 
                alt="Thazkiya Academy" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg sm:text-xl tracking-wider text-grullo-light group-hover:text-grullo transition-colors leading-tight">
                THAZKIYA ACADEMY
              </span>
              <span className="text-[11px] sm:text-xs font-medium tracking-[0.2em] text-cultured/80 uppercase">
                KARINKALLATHANI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => navigateTo('home')}
              className={`text-sm font-malayalam font-medium transition-colors hover:text-grullo-light flex items-center space-x-1.5 ${
                activePage === 'home' ? 'text-grullo font-semibold border-b-2 border-grullo pb-1' : 'text-cultured/90'
              }`}
            >
              <Home className="w-4 h-4 text-grullo" />
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
              className="text-sm font-malayalam font-medium text-cultured/90 hover:text-grullo-light transition-colors"
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
              className="px-5 py-2 rounded-full bg-gradient-to-r from-darksienna to-darksienna-dark text-cultured font-malayalam font-bold text-sm shadow-sienna hover:shadow-lg hover:brightness-110 transition-all flex items-center space-x-2 border border-grullo/40"
            >
              <Calendar className="w-4 h-4 text-grullo-light" />
              <span>രജിസ്റ്റർ ചെയ്യുക</span>
            </button>

            {/* Admin Portal Link */}
            <button
              onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`text-xs font-malayalam px-3.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                activePage.startsWith('admin') 
                  ? 'bg-darksienna text-cultured border-grullo' 
                  : 'border-grullo/40 text-grullo hover:bg-richblack-light'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-grullo" />
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
              className="px-3 py-1.5 rounded-full bg-darksienna text-cultured font-malayalam font-bold text-xs border border-grullo/40"
            >
              രജിസ്റ്റർ
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-grullo hover:text-cultured hover:bg-richblack-light transition-colors focus:outline-none"
              aria-label="മെനു തുറക്കുക"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-richblack border-b border-grullo/30 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => navigateTo('home')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium ${
                activePage === 'home' ? 'bg-richblack-light text-grullo' : 'text-cultured hover:bg-richblack-light/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-grullo" />
                <span>ഹോം</span>
              </div>
              <ChevronRight className="w-4 h-4 text-grullo/60" />
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('about-programme');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-cultured hover:bg-richblack-light/60"
            >
              <span>പരിപാടിയെക്കുറിച്ച്</span>
              <ChevronRight className="w-4 h-4 text-grullo/60" />
            </button>

            <button
              onClick={() => navigateTo('student-parent-register')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-cultured hover:bg-richblack-light/60"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-grullo" />
                <span>രക്ഷിതാക്കളുടെ രജിസ്ട്രേഷൻ (Student Parent)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-grullo/60" />
            </button>

            <button
              onClick={() => navigateTo('normal-guest-register')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-malayalam font-medium text-cultured hover:bg-richblack-light/60"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-grullo-light" />
                <span>മറ്റു അതിഥികളുടെ രജിസ്ട്രേഷൻ (Normal Guest)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-grullo/60" />
            </button>

            <div className="pt-2 border-t border-grullo/20">
              <button
                onClick={() => navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-darksienna text-cultured text-xs font-malayalam font-semibold tracking-wider border border-grullo/40 shadow-sm"
              >
                <Shield className="w-4 h-4 text-grullo" />
                <span>{isAdminLoggedIn ? 'അഡ്മിൻ ഡാഷ്‌ബോർഡിലേക്ക്' : 'അഡ്മിൻ ലോഗിൻ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
