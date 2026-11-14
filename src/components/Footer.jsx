import React from 'react';
import { MapPin, Calendar, Clock, Phone, Mail, Award, Heart } from 'lucide-react';
import OrnamentalDivider from './OrnamentalDivider';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-emerald-surface text-ivory/80 border-t-2 border-gold-antique/40 relative overflow-hidden">
      {/* Decorative top pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-forest via-gold-antique to-burgundy-deep" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Academy & Programme */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-gold-antique">
                <img src="/thazkiya-logo.jpg" alt="Thazkiya Academy" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-gold-champagne tracking-wider">
                  THAZKIYA ACADEMY
                </h3>
                <p className="text-xs text-ivory/70 tracking-widest uppercase">
                  KARINKALLATHANI
                </p>
              </div>
            </div>

            <p className="text-sm text-ivory/70 leading-relaxed max-w-md">
              A premier institution fostering holistic Islamic education and character building through dedicated Dars and Hifz streams. Committed to nurturing noble generations with intellectual and moral excellence.
            </p>

            <div className="inline-flex items-center space-x-2 bg-emerald-deep/80 px-3.5 py-1.5 rounded-full border border-gold-antique/30 text-xs text-gold-champagne">
              <Award className="w-3.5 h-3.5 text-amber-warm" />
              <span>Special Programme: <strong>HAPPY PARENTING</strong></span>
            </div>
          </div>

          {/* Col 2: Event Details */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-gold-antique text-base uppercase tracking-wider border-b border-gold-antique/20 pb-2">
              Programme Schedule
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/80">
              <li className="flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-amber-warm mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-ivory">22 November, Sunday</span>
                  <p className="text-[11px] text-ivory/60">Group Parents Meeting</p>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-gold-champagne mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-ivory">10:00 AM – 2:00 PM</span>
                  <p className="text-[11px] text-ivory/60">4-Hour Interactive Session</p>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-burgundy-deep mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-ivory">Thazkiya Academy Campus</span>
                  <p className="text-[11px] text-ivory/60">Karinkallathani</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-gold-antique text-base uppercase tracking-wider border-b border-gold-antique/20 pb-2">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => { setActivePage('student-parent-register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-ivory/80 hover:text-gold-champagne transition-colors"
                >
                  Student Parent Registration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('normal-guest-register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-ivory/80 hover:text-gold-champagne transition-colors"
                >
                  Normal Guest Registration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('admin-login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gold-antique hover:underline flex items-center space-x-1"
                >
                  <span>Admin Control Dashboard</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 text-xs text-ivory/60">
              <p>For assistance & queries:</p>
              <p className="text-ivory font-medium mt-0.5">+91 98470 00000</p>
            </div>
          </div>

        </div>

        <OrnamentalDivider light className="opacity-40 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/60 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} Thazkiya Academy, Karinkallathani. All Rights Reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built with excellence for noble parenting</span>
            <Heart className="w-3 h-3 text-burgundy-deep inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
