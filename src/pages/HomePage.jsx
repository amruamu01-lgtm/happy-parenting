import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Compass, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function HomePage({ setActivePage }) {
  const principles = [
    { num: '01', title: 'Tarbiyyah bil-Qudwah', desc: 'Leading through personal role modeling & pious Islamic character in daily home life.' },
    { num: '02', title: 'Emotional Connection', desc: 'Building compassionate parent-child bonds rooted in Rahmah and active listening.' },
    { num: '03', title: 'Spiritual Foundations', desc: 'Cultivating love for Allah, the Noble Qur\'an, and Sunnah with joy and steadfastness.' },
    { num: '04', title: 'Digital Age Guardrails', desc: 'Navigating contemporary modern challenges, smartphones, and media consumption wisely.' },
    { num: '05', title: 'Positive Discipline', desc: 'Fostering accountability, mutual respect, and emotional regulation without toxicity.' },
    { num: '06', title: 'Academic & Hifz Synergy', desc: 'Harmonizing sacred Quranic/Dars memorization with balanced personality growth.' },
    { num: '07', title: 'Lifelong Family Vision', desc: 'Crafting an enduring household vision that yields righteousness in this world and the Akhirah.' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* ========================================================
          HERO SECTION (Luxurious Dark Emerald Green + Antique Gold)
          ======================================================== */}
      <section className="relative islamic-pattern-bg text-ivory py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-gold-antique shadow-emerald overflow-hidden">
        {/* Subtle decorative glow overlays */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold-antique/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-burgundy-deep/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Institution Header Badge */}
          <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-emerald-forest/90 border border-gold-antique/50 shadow-gold backdrop-blur-sm animate-fadeIn">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-gold-antique shrink-0">
              <img src="/thazkiya-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="text-left">
              <span className="block font-heading font-bold text-xs sm:text-sm tracking-widest text-gold-champagne">
                THAZKIYA ACADEMY
              </span>
              <span className="block text-[10px] text-ivory/80 tracking-widest uppercase font-medium">
                KARINKALLATHANI
              </span>
            </div>
          </div>

          {/* Main Programme Title */}
          <div className="space-y-2">
            <span className="inline-block text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-amber-warm">
              ANNUAL GROUP PARENTS EMPOWERMENT SUMMIT
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-wide gold-gradient-text drop-shadow-sm leading-tight">
              HAPPY PARENTING
            </h1>
            <p className="font-heading italic text-lg sm:text-2xl text-ivory/95 max-w-3xl mx-auto pt-2 font-medium">
              "Mastering the Art of Islamic Parenting: 7 Powerful Principles for Success"
            </p>
          </div>

          <OrnamentalDivider light className="my-6" />

          {/* Key Leader & Speaker Box */}
          <div className="inline-block bg-emerald-forest/80 border border-gold-antique/40 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm">
            <p className="text-xs uppercase tracking-widest text-gold-champagne font-semibold mb-1">
              Distinguished Keynote Leader & Mentor
            </p>
            <p className="font-heading font-bold text-lg sm:text-2xl text-ivory">
              Abdul Hakeem Saqafi Al Arshadi Ayancheri
            </p>
            <p className="text-xs text-ivory/70 mt-1">
              Renowned Islamic Scholar, Family Counsellor & Parenting Strategist
            </p>
          </div>

          {/* Schedule Badges (Date & Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
            
            <div className="flex items-center justify-center space-x-3 bg-emerald-forest/90 border border-gold-antique/40 rounded-xl p-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-burgundy-deep/90 border border-gold-antique/50 flex items-center justify-center text-gold-champagne">
                <Calendar className="w-5 h-5 text-gold-champagne" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider text-ivory/70 font-semibold">Date of Programme</span>
                <span className="font-heading font-bold text-base text-gold-champagne">22 NOVEMBER • SUNDAY</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 bg-emerald-forest/90 border border-gold-antique/40 rounded-xl p-3.5 shadow-md">
              <div className="w-10 h-10 rounded-lg bg-amber-warm/90 border border-gold-antique/50 flex items-center justify-center text-emerald-deep">
                <Clock className="w-5 h-5 text-emerald-deep" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider text-ivory/70 font-semibold">Programme Timing</span>
                <span className="font-heading font-bold text-base text-gold-champagne">10:00 AM – 2:00 PM</span>
              </div>
            </div>

          </div>

          {/* Call to Action CTA */}
          <div className="pt-6">
            <button
              onClick={() => {
                const el = document.getElementById('registration-selection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-3 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-gold-antique via-amber-warm to-gold-antique text-emerald-deep font-bold text-base sm:text-lg shadow-gold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-gold-champagne"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-gold-champagne/80 mt-3 font-medium">
              * Advance Registration Mandatory • Group Parents Meeting Only
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          REGISTRATION SELECTION SECTION
          ======================================================== */}
      <section id="registration-selection" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-gold-antique/15 text-gold-dark text-xs font-bold tracking-widest uppercase border border-gold-antique/30">
            OFFICIAL REGISTRATION PORTAL
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-emerald-deep">
            Choose Your Registration Type
          </h2>
          <p className="font-malayalam text-base sm:text-lg text-emerald-forest font-medium">
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
            className="group relative bg-white rounded-3xl p-8 border-2 border-gold-antique/40 shadow-card hover:shadow-gold hover:border-gold-antique transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Corner Decorative ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-burgundy-deep to-burgundy-light text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs">
              Thazkiya Parents
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-deep/10 border-2 border-emerald-deep/20 flex items-center justify-center text-emerald-deep group-hover:bg-emerald-deep group-hover:text-gold-champagne transition-all duration-300">
                <Users className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-emerald-deep group-hover:text-emerald-forest transition-colors">
                  Student Parent
                </h3>
                <p className="font-malayalam text-lg text-burgundy-deep font-semibold mt-1">
                  വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കായി
                </p>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                Dedicated for parents and guardians of active Thazkiya Academy students enrolled in the <strong>Dars</strong> or <strong>Hifz</strong> programmes.
              </p>

              <div className="bg-ivory/60 rounded-xl p-3 border border-gold-antique/20 space-y-1.5 text-xs text-text-primary">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-forest" />
                  <span>Student Name & Dept (Dars / Hifz) required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-forest" />
                  <span>Number of parents attending</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gold-antique/20 flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-deep group-hover:text-gold-dark transition-colors">
                Proceed to Parent Form
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-deep text-gold-champagne flex items-center justify-center group-hover:bg-gold-antique group-hover:text-emerald-deep group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* CARD 2: Normal Guest */}
          <div 
            onClick={() => {
              setActivePage('normal-guest-register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative bg-white rounded-3xl p-8 border-2 border-gold-antique/40 shadow-card hover:shadow-gold hover:border-amber-warm transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Corner Decorative ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-warm to-amber-dark text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-xs">
              General Guests
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-warm/15 border-2 border-amber-warm/30 flex items-center justify-center text-amber-dark group-hover:bg-amber-warm group-hover:text-white transition-all duration-300">
                <UserCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl text-emerald-deep group-hover:text-emerald-forest transition-colors">
                  Normal Guest
                </h3>
                <p className="font-malayalam text-lg text-amber-dark font-semibold mt-1">
                  മറ്റു അതിഥികൾക്കായി
                </p>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed">
                Open for community members, well-wishers, educators, and guests who wish to participate in the Happy Parenting seminar.
              </p>

              <div className="bg-ivory/60 rounded-xl p-3 border border-gold-antique/20 space-y-1.5 text-xs text-text-primary">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-warm" />
                  <span>Guest Name & Mobile Contact</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-warm" />
                  <span>Number of guests accompanying</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gold-antique/20 flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-deep group-hover:text-amber-dark transition-colors">
                Proceed to Guest Form
              </span>
              <div className="w-9 h-9 rounded-full bg-emerald-deep text-gold-champagne flex items-center justify-center group-hover:bg-amber-warm group-hover:text-white group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

        {/* Important Meeting Notice Box */}
        <div className="max-w-3xl mx-auto mt-8 bg-burgundy-surface border border-burgundy-deep/30 rounded-2xl p-4 text-center">
          <p className="text-xs sm:text-sm font-semibold text-burgundy-deep flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-burgundy-deep shrink-0" />
            <span>Official Note: This is strictly a <strong>Group Parents Meeting</strong>. Individual meetings are not part of this session.</span>
          </p>
        </div>
      </section>

      {/* ========================================================
          7 PRINCIPLES SECTION
          ======================================================== */}
      <section id="about-programme" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-antique/30 shadow-card">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-deep">
              Programme Blueprint
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep">
              7 Powerful Principles for Success
            </h2>
            <p className="text-sm text-text-secondary">
              A comprehensive roadmap designed to equip parents with faith-centered wisdom, emotional mastery, and practical modern strategies.
            </p>
            <OrnamentalDivider className="my-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((item, idx) => (
              <div 
                key={idx}
                className="bg-ivory/50 rounded-2xl p-5 border border-gold-antique/20 hover:border-gold-antique hover:bg-ivory transition-all duration-300 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-lg text-gold-dark">{item.num}</span>
                  <div className="w-2 h-2 rounded-full bg-burgundy-deep" />
                </div>
                <h4 className="font-heading font-bold text-base text-emerald-deep">{item.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}

            {/* Special Highlight Card */}
            <div className="bg-gradient-to-br from-emerald-deep to-emerald-forest rounded-2xl p-5 border border-gold-antique text-ivory flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-champagne">Interactive Session</span>
                <h4 className="font-heading font-bold text-base text-gold-champagne">Open Q&A & Group Reflections</h4>
                <p className="text-xs text-ivory/80">Direct engagement with Abdul Hakeem Saqafi Al Arshadi Ayancheri to address contemporary household questions.</p>
              </div>
              <div className="pt-4 flex items-center space-x-2 text-xs font-semibold text-amber-warm">
                <Sparkles className="w-4 h-4" />
                <span>Transformative Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          VENUE & SCHEDULE SUMMARY
          ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-deep text-ivory rounded-3xl p-8 sm:p-10 border-2 border-gold-antique shadow-emerald relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-champagne">
                EVENT LOGISTICS & VENUE
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-ivory">
                Join Us at Thazkiya Academy Campus
              </h3>
              <p className="text-sm text-ivory/80 leading-relaxed max-w-xl">
                Located conveniently at Karinkallathani with spacious seating and ambient facilities arranged for all registered parents and honorable guests.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-gold-champagne">
                <span className="flex items-center space-x-1.5 bg-emerald-forest/80 px-3 py-1.5 rounded-lg border border-gold-antique/30">
                  <MapPin className="w-3.5 h-3.5 text-amber-warm" />
                  <span>Karinkallathani, Kerala</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-emerald-forest/80 px-3 py-1.5 rounded-lg border border-gold-antique/30">
                  <Clock className="w-3.5 h-3.5 text-amber-warm" />
                  <span>Starts sharp at 10:00 AM</span>
                </span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <button
                onClick={() => {
                  const el = document.getElementById('registration-selection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-antique to-amber-warm text-emerald-deep font-bold text-sm shadow-gold hover:brightness-110 transition-all border border-gold-champagne"
              >
                Choose Registration
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
