import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Instagram,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function HomePage({ setActivePage }) {
  return (
    <div className="space-y-12 pb-16 bg-bg text-text-primary">
      
      {/* ========================================================
          HERO SECTION (Primary Burgundy #952F2F with Golden Orange #D9883F)
          ======================================================== */}
      <section className="relative islamic-pattern-bg text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-orange shadow-md overflow-hidden">
        {/* Subtle Ambient Glows in Golden Orange */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Institution Header Badge */}
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-burgundy-dark/85 border border-orange/40 shadow-xs backdrop-blur-sm animate-fadeIn">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-orange shrink-0">
              <img src="/thazkiya-logo.jpg" alt="Thazkiya Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="text-left">
              <span className="block font-heading font-black text-xs sm:text-sm tracking-widest text-orange-light">
                THAZKIYA ACADEMY
              </span>
              <span className="block text-[10px] text-cream/90 tracking-widest uppercase font-medium">
                KARINKALLATHANI
              </span>
            </div>
          </div>

          {/* Main Programme Title & Hero Heading */}
          <div className="space-y-3">
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-wide text-white drop-shadow-sm leading-tight">
              HAPPY PARENTING
            </h1>

            <p className="font-malayalam font-bold text-xl sm:text-3xl text-white max-w-3xl mx-auto pt-2 leading-relaxed">
              "സന്തോഷകരമായ കുടുംബ ജീവിതത്തിലേക്ക് ഒരു ചുവടുവെപ്പ്"
            </p>
          </div>

          <OrnamentalDivider light className="my-6" />

          {/* Key Leader & Speaker Box */}
          <div className="inline-block bg-burgundy-dark/90 border border-orange/40 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm max-w-xl mx-auto">
            <p className="font-malayalam text-xs text-orange-light font-bold mb-1">
              മുഖ്യ പ്രഭാഷകനും മാർഗദർശിയും
            </p>
            <p className="font-heading font-black text-lg sm:text-2xl text-white">
              Abdul Hakeem Saqafi Al Arshadi Ayancheri
            </p>
            <p className="font-malayalam text-xs text-cream/90 mt-1">
              പ്രമുഖ ഇസ്ലാമിക പണ്ഡിതനും ഫാമിലി കൗൺസിലറും പാരന്റിംഗ് ട്രെയിനറും
            </p>
          </div>

          {/* Schedule Badges (Date & Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
            
            <div className="flex items-center justify-center space-x-3 bg-burgundy-dark/85 border border-orange/40 rounded-xl p-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-orange border border-orange-light/50 flex items-center justify-center text-white">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-malayalam text-cream/70 font-semibold">തീയതി</span>
                <span className="font-heading font-black text-base text-orange-light">22 NOVEMBER • SUNDAY</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 bg-burgundy-dark/85 border border-orange/40 rounded-xl p-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-burgundy border border-orange/40 flex items-center justify-center text-white">
                <Clock className="w-5 h-5 text-orange-light" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-malayalam text-cream/70 font-semibold">സമയം</span>
                <span className="font-heading font-black text-base text-orange-light">10:00 AM – 2:00 PM</span>
              </div>
            </div>

          </div>

          {/* Call to Action CTA: Golden Orange button with white text */}
          <div className="pt-6">
            <button
              onClick={() => {
                const el = document.getElementById('registration-selection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-3 px-8 sm:px-10 py-4 rounded-full bg-orange hover:bg-orange-dark text-white font-malayalam font-bold text-base sm:text-lg shadow-orange hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-orange-light/40"
            >
              <span>രജിസ്റ്റർ ചെയ്യുക</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
            <p className="font-malayalam text-xs text-cream/80 mt-3 font-medium">
              * മുൻകൂട്ടിയുള്ള രജിസ്ട്രേഷൻ നിർബന്ധമാണ്
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          CONNECTIVITY & SOCIAL SECTION
          ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange/30 shadow-card">
          <div className="text-center mb-6">
            <h3 className="font-heading font-bold text-lg text-burgundy uppercase tracking-wider">
              Connect & Join Us
            </h3>
            <p className="font-malayalam text-xs sm:text-sm text-text-secondary mt-1">
              അന്വേഷണങ്ങൾക്കും അപ്ഡേറ്റുകൾക്കുമായി ഞങ്ങളുമായി ബന്ധപ്പെടുക
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Enquiry Number Clickable */}
            <a
              href="tel:+919207617723"
              className="flex items-center space-x-3.5 p-4 rounded-2xl bg-cream/40 hover:bg-white border border-orange/30 hover:border-burgundy shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-burgundy text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-orange-light" />
              </div>
              <div className="overflow-hidden">
                <span className="block font-malayalam text-xs font-semibold text-text-secondary">
                  അന്വേഷണങ്ങൾക്ക് വിളിക്കുക
                </span>
                <span className="font-heading font-bold text-sm sm:text-base text-burgundy group-hover:text-burgundy-dark transition-colors">
                  +91 9207 61 7723
                </span>
              </div>
            </a>

            {/* WhatsApp Group Invitation */}
            <a
              href="https://chat.whatsapp.com/E4EkTsSiE99JBqsouqK8pH"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3.5 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-300 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <MessageCircle className="w-6 h-6 fill-current text-white" />
              </div>
              <div>
                <span className="block font-malayalam text-xs font-semibold text-emerald-800">
                  വാട്സ്ആപ്പ് ഗ്രൂപ്പ്
                </span>
                <span className="font-malayalam font-bold text-sm text-[#075E54] group-hover:underline">
                  വാട്സ്ആപ്പ് ഗ്രൂപ്പിൽ ചേരുക
                </span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/thazkiya_academy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3.5 p-4 rounded-2xl bg-cream/40 hover:bg-white border border-orange/30 hover:border-orange shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange hover:bg-orange-dark text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-malayalam text-xs font-semibold text-burgundy">
                  ഇൻസ്റ്റാഗ്രാം പേജ്
                </span>
                <span className="font-malayalam font-bold text-sm text-burgundy group-hover:underline">
                  ഇൻസ്റ്റാഗ്രാമിൽ പിന്തുടരുക
                </span>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* ========================================================
          REGISTRATION SELECTION SECTION
          ======================================================== */}
      <section id="registration-selection" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-burgundy/10 text-burgundy text-xs font-malayalam font-bold tracking-wider border border-burgundy/20">
            ഔദ്യോഗിക രജിസ്ട്രേഷൻ പോർട്ടൽ
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-burgundy">
            Choose Your Registration Type
          </h2>
          <p className="font-malayalam text-base sm:text-lg text-text-secondary font-medium">
            നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിഭാഗം താഴെ തിരഞ്ഞെടുക്കുക
          </p>
          <OrnamentalDivider className="my-4" />
        </div>

        {/* 2 Dedicated Registration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* CARD 1: Student Parent */}
          <div 
            onClick={() => {
              setActivePage('student-parent-register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative bg-white rounded-3xl p-8 border-2 border-burgundy/20 shadow-card hover:shadow-burgundy hover:border-burgundy transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Corner ribbon in Primary Burgundy */}
            <div className="absolute top-0 right-0 bg-burgundy text-white text-[11px] font-malayalam font-bold py-1 px-4 rounded-bl-xl shadow-xs">
              താസ്കിയ രക്ഷിതാക്കൾ
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-burgundy/10 border-2 border-burgundy/20 flex items-center justify-center text-burgundy group-hover:bg-burgundy group-hover:text-white transition-all duration-300">
                <Users className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-burgundy group-hover:text-burgundy-dark transition-colors">
                  Student Parent
                </h3>
                <p className="font-malayalam text-lg text-burgundy font-semibold mt-1">
                  വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കായി
                </p>
              </div>

              <p className="font-malayalam text-sm text-text-secondary leading-relaxed">
                താസ്കിയ അക്കാദമിയിൽ <strong>Dars</strong> അല്ലെങ്കിൽ <strong>Hifz</strong> വിഭാഗങ്ങളിൽ പഠിക്കുന്ന വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കും രക്ഷാധികാരികൾക്കുമായുള്ള രജിസ്ട്രേഷൻ.
              </p>

              <div className="bg-cream/40 rounded-xl p-3.5 border border-burgundy/15 space-y-1.5 text-xs font-malayalam text-text-primary">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0" />
                  <span>വിദ്യാർത്ഥിയുടെ പേരും വിഭാഗവും (Dars / Hifz) നൽകുക</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-burgundy shrink-0" />
                  <span>പങ്കെടുക്കുന്ന രക്ഷിതാക്കളുടെ എണ്ണം രേഖപ്പെടുത്തുക</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-burgundy/15 flex items-center justify-between">
              <span className="font-malayalam text-sm font-bold text-burgundy group-hover:text-burgundy-dark transition-colors">
                രജിസ്ട്രേഷനിലേക്ക് തുടരുക
              </span>
              <div className="w-9 h-9 rounded-full bg-burgundy text-white flex items-center justify-center group-hover:bg-burgundy-dark group-hover:translate-x-1 transition-all shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* CARD 2: Normal Guest */}
          <div 
            onClick={() => {
              setActivePage('normal-guest-register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative bg-white rounded-3xl p-8 border-2 border-orange/30 shadow-card hover:shadow-orange hover:border-orange transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Corner ribbon in Golden Orange */}
            <div className="absolute top-0 right-0 bg-orange text-white text-[11px] font-malayalam font-bold py-1 px-4 rounded-bl-xl shadow-xs">
              പൊതു അതിഥികൾ
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange/15 border-2 border-orange/30 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-all duration-300">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-orange-dark group-hover:text-orange transition-colors">
                  Normal Guest
                </h3>
                <p className="font-malayalam text-lg text-orange-dark font-semibold mt-1">
                  മറ്റു അതിഥികൾക്കായി
                </p>
              </div>

              <p className="font-malayalam text-sm text-text-secondary leading-relaxed">
                ഹാപ്പി പാരന്റിംഗ് സെമിനാറിൽ പങ്കെടുക്കാൻ ആഗ്രഹിക്കുന്ന പൊതുജനങ്ങൾ, ഗുണകാംക്ഷികൾ, അധ്യാപകർ, മറ്റു അതിഥികൾ എന്നിവർക്കായി.
              </p>

              <div className="bg-cream/40 rounded-xl p-3.5 border border-orange/20 space-y-1.5 text-xs font-malayalam text-text-primary">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange shrink-0" />
                  <span>അതിഥിയുടെ പേരും മൊബൈൽ നമ്പറും നൽകുക</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange shrink-0" />
                  <span>കൂടെ പങ്കെടുക്കുന്ന അതിഥികളുടെ എണ്ണം രേഖപ്പെടുത്തുക</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-orange/20 flex items-center justify-between">
              <span className="font-malayalam text-sm font-bold text-orange-dark group-hover:text-orange transition-colors">
                രജിസ്ട്രേഷനിലേക്ക് തുടരുക
              </span>
              <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center group-hover:bg-orange-dark group-hover:translate-x-1 transition-all shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          VENUE & SCHEDULE SUMMARY
          ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-burgundy text-white rounded-3xl p-8 sm:p-10 border-2 border-orange shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            <div className="md:col-span-2 space-y-3">
              <span className="font-malayalam text-xs font-bold text-orange-light bg-burgundy-dark px-3 py-1 rounded-full border border-orange/40">
                വേദിയും സമയക്രമവും
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                Venue & Schedule
              </h3>
              <p className="font-malayalam text-sm text-cream/90 leading-relaxed max-w-xl">
                കരിങ്കല്ലത്താണിയിലെ താസ്കിയ അക്കാദമി കാമ്പസ് ഓഡിറ്റോറിയത്തിൽ വെച്ച് നടക്കുന്ന സംഗമത്തിൽ കൃത്യസമയത്ത് തന്നെ പങ്കുചേരുവാൻ എല്ലാ രക്ഷിതാക്കളെയും സ്വാഗതം ചെയ്യുന്നു.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-orange-light">
                <span className="flex items-center space-x-1.5 bg-burgundy-dark/90 px-3 py-1.5 rounded-lg border border-orange/30">
                  <MapPin className="w-3.5 h-3.5 text-orange shrink-0" />
                  <span className="font-malayalam text-white">താസ്കിയ അക്കാദമി കാമ്പസ്, കരിങ്കല്ലത്താണി</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-burgundy-dark/90 px-3 py-1.5 rounded-lg border border-orange/30">
                  <Clock className="w-3.5 h-3.5 text-orange shrink-0" />
                  <span className="font-malayalam text-white">രാവിലെ 10:00 ന് ആരംഭിക്കുന്നു</span>
                </span>
              </div>
            </div>

            <div className="text-center md:text-right">
              {/* Secondary button: Golden Orange background with white text */}
              <button
                onClick={() => {
                  const el = document.getElementById('registration-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-malayalam font-bold text-sm shadow-orange hover:brightness-105 transition-all border border-orange-light/40"
              >
                രജിസ്ട്രേഷൻ വിഭാഗം തിരഞ്ഞെടുക്കുക
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
