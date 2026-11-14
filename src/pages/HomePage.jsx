import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  Instagram,
  MessageCircle,
  Quote
} from 'lucide-react';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function HomePage({ setActivePage }) {
  // 7 Meaningful Islamic Parenting Quotes in Malayalam
  const parentingQuotes = [
    { num: '01', quote: 'മക്കൾക്ക് നൽകാവുന്ന ഏറ്റവും വലിയ സമ്മാനം നല്ലൊരു മാതൃകയാണ്.' },
    { num: '02', quote: 'കുട്ടികളുടെ ഹൃദയത്തിലേക്കുള്ള വഴി സ്നേഹത്തിലൂടെയാണ്.' },
    { num: '03', quote: 'നല്ല സ്വഭാവം വീട്ടിൽ നിന്ന് തുടങ്ങുന്നു.' },
    { num: '04', quote: 'മക്കളെ വളർത്തുന്നത് ഒരു ഉത്തരവാദിത്തം മാത്രമല്ല, അതൊരു അമാനത്താണ്.' },
    { num: '05', quote: 'നല്ല കുടുംബമാണ് നല്ല സമൂഹത്തിന്റെ അടിത്തറ.' },
    { num: '06', quote: 'ശിക്ഷിക്കുന്നതിനേക്കാൾ മനസ്സിലാക്കാൻ ശ്രമിക്കുക.' },
    { num: '07', quote: 'മാതാപിതാക്കളുടെ നല്ല വാക്കുകൾ മക്കളുടെ ജീവിതത്തിൽ വെളിച്ചമാകും.' }
  ];

  return (
    <div className="space-y-16 pb-16 bg-cultured">
      
      {/* ========================================================
          HERO SECTION (Rich Black #0A0908 + Dark Sienna & Grullo)
          ======================================================== */}
      <section className="relative islamic-pattern-bg text-cultured py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-grullo shadow-black overflow-hidden">
        {/* Decorative ambient glows in Dark Sienna and Grullo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-grullo/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-darksienna/40 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Institution Header Badge */}
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-richblack-light/90 border border-grullo/50 shadow-grullo backdrop-blur-sm animate-fadeIn">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-grullo shrink-0">
              <img src="/thazkiya-logo.jpg" alt="Thazkiya Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="text-left">
              <span className="block font-heading font-bold text-xs sm:text-sm tracking-widest text-grullo-light">
                THAZKIYA ACADEMY
              </span>
              <span className="block text-[10px] text-cultured/80 tracking-widest uppercase font-medium">
                KARINKALLATHANI
              </span>
            </div>
          </div>

          {/* Main Programme Title & Hero Heading */}
          <div className="space-y-3">
            <span className="inline-block text-xs sm:text-sm font-malayalam font-semibold tracking-wider text-grullo bg-richblack-surface/90 px-4 py-1.5 rounded-full border border-grullo/40 shadow-xs">
              വാർഷിക രക്ഷിതാക്കളുടെ ശാക്തീകരണ സംഗമം
            </span>
            
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-wide gold-gradient-text drop-shadow-sm leading-tight">
              HAPPY PARENTING
            </h1>

            <p className="font-malayalam font-bold text-xl sm:text-3xl text-cultured/95 max-w-3xl mx-auto pt-2 leading-relaxed">
              "സന്തോഷകരമായ കുടുംബ ജീവിതത്തിലേക്ക് ഒരു ചുവടുവെപ്പ്"
            </p>
          </div>

          <OrnamentalDivider light className="my-6" />

          {/* Key Leader & Speaker Box */}
          <div className="inline-block bg-richblack-light/85 border border-grullo/40 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm max-w-xl mx-auto">
            <p className="font-malayalam text-xs text-grullo font-semibold mb-1">
              മുഖ്യ പ്രഭാഷകനും മാർഗദർശിയും
            </p>
            <p className="font-heading font-bold text-lg sm:text-2xl text-cultured">
              Abdul Hakeem Saqafi Al Arshadi Ayancheri
            </p>
            <p className="font-malayalam text-xs text-cultured/80 mt-1">
              പ്രമുഖ ഇസ്ലാമിക പണ്ഡിതനും ഫാമിലി കൗൺസിലറും പാരന്റിംഗ് ട്രെയിനറും
            </p>
          </div>

          {/* Schedule Badges (Date & Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
            
            <div className="flex items-center justify-center space-x-3 bg-richblack-light/90 border border-grullo/40 rounded-xl p-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-darksienna border border-grullo/50 flex items-center justify-center text-grullo-light">
                <Calendar className="w-5 h-5 text-grullo-light" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-malayalam text-cultured/70 font-semibold">തീയതി</span>
                <span className="font-heading font-bold text-base text-grullo-light">22 NOVEMBER • SUNDAY</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 bg-richblack-light/90 border border-grullo/40 rounded-xl p-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-umber border border-grullo/50 flex items-center justify-center text-cultured">
                <Clock className="w-5 h-5 text-cultured" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-malayalam text-cultured/70 font-semibold">സമയം</span>
                <span className="font-heading font-bold text-base text-grullo-light">10:00 AM – 2:00 PM</span>
              </div>
            </div>

          </div>

          {/* Call to Action CTA in Dark Sienna & Grullo */}
          <div className="pt-6">
            <button
              onClick={() => {
                const el = document.getElementById('registration-selection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-3 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-darksienna via-darksienna-light to-darksienna text-cultured font-malayalam font-bold text-base sm:text-lg shadow-sienna hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-grullo"
            >
              <span>രജിസ്റ്റർ ചെയ്യുക</span>
              <ArrowRight className="w-5 h-5 text-grullo-light" />
            </button>
            <p className="font-malayalam text-xs text-grullo-light/90 mt-3 font-medium">
              * മുൻകൂട്ടിയുള്ള രജിസ്ട്രേഷൻ നിർബന്ധമാണ് • ഗ്രൂപ്പ് പേരന്റ്സ് മീറ്റിംഗ് മാത്രം
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          CONNECTIVITY & SOCIAL SECTION
          ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-grullo/50 shadow-card">
          <div className="text-center mb-6">
            <h3 className="font-heading font-bold text-lg text-richblack uppercase tracking-wider">
              Connect & Join Us
            </h3>
            <p className="font-malayalam text-xs sm:text-sm text-umber mt-1">
              അന്വേഷണങ്ങൾക്കും അപ്ഡേറ്റുകൾക്കുമായി ഞങ്ങളുമായി ബന്ധപ്പെടുക
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Enquiry Number Clickable */}
            <a
              href="tel:+919207617723"
              className="flex items-center space-x-3.5 p-4 rounded-2xl bg-cultured hover:bg-white border border-grullo/40 hover:border-grullo shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-richblack text-grullo-light flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5 text-grullo" />
              </div>
              <div className="overflow-hidden">
                <span className="block font-malayalam text-xs font-semibold text-umber">
                  അന്വേഷണങ്ങൾക്ക് വിളിക്കുക
                </span>
                <span className="font-heading font-bold text-sm sm:text-base text-richblack group-hover:text-darksienna transition-colors">
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
              className="flex items-center space-x-3.5 p-4 rounded-2xl bg-darksienna-surface hover:bg-white border border-darksienna/30 hover:border-darksienna shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-darksienna to-darksienna-light text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block font-malayalam text-xs font-semibold text-darksienna">
                  ഇൻസ്റ്റാഗ്രാം പേജ്
                </span>
                <span className="font-malayalam font-bold text-sm text-darksienna group-hover:underline">
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-grullo/15 text-umber text-xs font-malayalam font-bold tracking-wider border border-grullo/30">
            ഔദ്യോഗിക രജിസ്ട്രേഷൻ പോർട്ടൽ
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-richblack">
            Choose Your Registration Type
          </h2>
          <p className="font-malayalam text-base sm:text-lg text-umber font-medium">
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
            className="group relative bg-white rounded-3xl p-8 border-2 border-grullo/40 shadow-card hover:shadow-grullo hover:border-grullo transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Corner ribbon in Dark Sienna */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-darksienna to-darksienna-light text-white text-[11px] font-malayalam font-bold py-1 px-4 rounded-bl-xl shadow-xs">
              താസ്കിയ രക്ഷിതാക്കൾ
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-richblack/10 border-2 border-richblack/20 flex items-center justify-center text-richblack group-hover:bg-richblack group-hover:text-grullo-light transition-all duration-300">
                <Users className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-richblack group-hover:text-darksienna transition-colors">
                  Student Parent
                </h3>
                <p className="font-malayalam text-lg text-darksienna font-semibold mt-1">
                  വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കായി
                </p>
              </div>

              <p className="font-malayalam text-sm text-umber leading-relaxed">
                താസ്കിയ അക്കാദമിയിൽ <strong>Dars</strong> അല്ലെങ്കിൽ <strong>Hifz</strong> വിഭാഗങ്ങളിൽ പഠിക്കുന്ന വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കും രക്ഷാധികാരികൾക്കുമായുള്ള രജിസ്ട്രേഷൻ.
              </p>

              <div className="bg-cultured rounded-xl p-3 border border-grullo/20 space-y-1.5 text-xs font-malayalam text-richblack">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-darksienna shrink-0" />
                  <span>വിദ്യാർത്ഥിയുടെ പേരും വിഭാഗവും (Dars / Hifz) നൽകുക</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-darksienna shrink-0" />
                  <span>പങ്കെടുക്കുന്ന രക്ഷിതാക്കളുടെ എണ്ണം രേഖപ്പെടുത്തുക</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-grullo/20 flex items-center justify-between">
              <span className="font-malayalam text-sm font-bold text-richblack group-hover:text-darksienna transition-colors">
                രജിസ്ട്രേഷനിലേക്ക് തുടരുക
              </span>
              <div className="w-9 h-9 rounded-full bg-richblack text-grullo-light flex items-center justify-center group-hover:bg-darksienna group-hover:text-white group-hover:translate-x-1 transition-all">
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
            className="group relative bg-white rounded-3xl p-8 border-2 border-grullo/40 shadow-card hover:shadow-grullo hover:border-umber transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Corner ribbon in Umber */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-umber to-umber-dark text-white text-[11px] font-malayalam font-bold py-1 px-4 rounded-bl-xl shadow-xs">
              പൊതു അതിഥികൾ
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-umber/15 border-2 border-umber/30 flex items-center justify-center text-umber group-hover:bg-umber group-hover:text-white transition-all duration-300">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-richblack group-hover:text-umber transition-colors">
                  Normal Guest
                </h3>
                <p className="font-malayalam text-lg text-umber font-semibold mt-1">
                  മറ്റു അതിഥികൾക്കായി
                </p>
              </div>

              <p className="font-malayalam text-sm text-umber leading-relaxed">
                ഹാപ്പി പാരന്റിംഗ് സെമിനാറിൽ പങ്കെടുക്കാൻ ആഗ്രഹിക്കുന്ന പൊതുജനങ്ങൾ, ഗുണകാംക്ഷികൾ, അധ്യാപകർ, മറ്റു അതിഥികൾ എന്നിവർക്കായി.
              </p>

              <div className="bg-cultured rounded-xl p-3 border border-grullo/20 space-y-1.5 text-xs font-malayalam text-richblack">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-umber shrink-0" />
                  <span>അതിഥിയുടെ പേരും മൊബൈൽ നമ്പറും നൽകുക</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-umber shrink-0" />
                  <span>കൂടെ പങ്കെടുക്കുന്ന അതിഥികളുടെ എണ്ണം രേഖപ്പെടുത്തുക</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-grullo/20 flex items-center justify-between">
              <span className="font-malayalam text-sm font-bold text-richblack group-hover:text-umber transition-colors">
                രജിസ്ട്രേഷനിലേക്ക് തുടരുക
              </span>
              <div className="w-9 h-9 rounded-full bg-richblack text-grullo-light flex items-center justify-center group-hover:bg-umber group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

        {/* Important Meeting Notice Box in Dark Sienna tint */}
        <div className="max-w-3xl mx-auto mt-8 bg-darksienna-surface border border-darksienna/30 rounded-2xl p-4 text-center">
          <p className="font-malayalam text-xs sm:text-sm font-semibold text-darksienna flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-darksienna shrink-0" />
            <span>ശ്രദ്ധിക്കുക: ഇതൊരു ഗ്രൂപ്പ് പേരന്റ്സ് മീറ്റിംഗ് മാത്രമാണ്. വ്യക്തിഗത മീറ്റിംഗുകൾ ഉണ്ടായിരിക്കുന്നതല്ല.</span>
          </p>
        </div>
      </section>

      {/* ========================================================
          PROGRAMME BLUEPRINT WITH MALAYALAM QUOTES
          ======================================================== */}
      <section id="about-programme" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-grullo/30 shadow-card">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="font-malayalam text-xs font-bold text-darksienna tracking-wider uppercase bg-darksienna-surface px-3.5 py-1.5 rounded-full border border-darksienna/20">
              ഇസ്ലാമിക പാരന്റിംഗ് തത്ത്വങ്ങൾ
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-richblack">
              Programme Blueprint
            </h2>
            <p className="font-malayalam text-sm text-umber leading-relaxed">
              വിശ്വാസത്തിലൂന്നിയ സ്നേഹവും ഉത്തമ മാതൃകയും പകർന്നുനൽകി മക്കളെ വളർത്താനുള്ള വഴികാട്ടി.
            </p>
            <OrnamentalDivider className="my-3" />
          </div>

          {/* Simple, Meaningful Malayalam Parenting Quote Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parentingQuotes.map((item, idx) => (
              <div 
                key={idx}
                className="bg-cultured rounded-2xl p-6 border border-grullo/30 hover:border-grullo hover:bg-white hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-lg text-grullo group-hover:text-darksienna transition-colors">
                      {item.num}
                    </span>
                    <Quote className="w-5 h-5 text-grullo/40 group-hover:text-grullo transition-colors" />
                  </div>
                  <p className="font-malayalam font-medium text-sm sm:text-base text-richblack leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-grullo/15 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-darksienna" />
                  <span className="font-malayalam text-[11px] text-umber">ഹാപ്പി പാരന്റിംഗ് സന്ദേശം</span>
                </div>
              </div>
            ))}

            {/* Special Highlight Card in Rich Black & Grullo */}
            <div className="bg-gradient-to-br from-richblack to-richblack-light rounded-2xl p-6 border-2 border-grullo text-cultured flex flex-col justify-between shadow-black">
              <div className="space-y-3">
                <span className="text-[11px] font-malayalam font-bold text-grullo-light bg-richblack-surface px-2.5 py-1 rounded-full border border-grullo/30">
                  നേരിട്ടുള്ള സംവാദം
                </span>
                <h4 className="font-heading font-bold text-lg text-grullo-light">
                  Open Q&A & Discussion
                </h4>
                <p className="font-malayalam text-xs text-cultured/85 leading-relaxed">
                  രക്ഷിതാക്കളുടെ ചോദ്യങ്ങൾക്ക് അബ്ദുൽ ഹക്കീം സഖാഫി അൽ അർശദി അയഞ്ചേരി നേരിട്ട് മറുപടി നൽകുന്നു.
                </p>
              </div>
              <div className="pt-4 flex items-center space-x-2 text-xs font-malayalam font-semibold text-grullo">
                <Sparkles className="w-4 h-4" />
                <span>അനുഭവസമ്പന്നമായ മാർഗദർശനം</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          VENUE & SCHEDULE SUMMARY
          ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-richblack text-cultured rounded-3xl p-8 sm:p-10 border-2 border-grullo shadow-black relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            <div className="md:col-span-2 space-y-3">
              <span className="font-malayalam text-xs font-bold text-grullo bg-richblack-light/80 px-3 py-1 rounded-full border border-grullo/30">
                വേദിയും സമയക്രമവും
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-cultured">
                Venue & Schedule
              </h3>
              <p className="font-malayalam text-sm text-cultured/85 leading-relaxed max-w-xl">
                കരിങ്കല്ലത്താണിയിലെ താസ്കിയ അക്കാദമി കാമ്പസ് ഓഡിറ്റോറിയത്തിൽ വെച്ച് നടക്കുന്ന സംഗമത്തിൽ കൃത്യസമയത്ത് തന്നെ പങ്കുചേരുവാൻ എല്ലാ രക്ഷിതാക്കളെയും സ്വാഗതം ചെയ്യുന്നു.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-grullo-light">
                <span className="flex items-center space-x-1.5 bg-richblack-light/80 px-3 py-1.5 rounded-lg border border-grullo/30">
                  <MapPin className="w-3.5 h-3.5 text-grullo shrink-0" />
                  <span className="font-malayalam">താസ്കിയ അക്കാദമി കാമ്പസ്, കരിങ്കല്ലത്താണി</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-richblack-light/80 px-3 py-1.5 rounded-lg border border-grullo/30">
                  <Clock className="w-3.5 h-3.5 text-grullo shrink-0" />
                  <span className="font-malayalam">രാവിലെ 10:00 ന് ആരംഭിക്കുന്നു</span>
                </span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <button
                onClick={() => {
                  const el = document.getElementById('registration-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-darksienna to-darksienna-dark text-cultured font-malayalam font-bold text-sm shadow-sienna hover:brightness-110 transition-all border border-grullo"
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
