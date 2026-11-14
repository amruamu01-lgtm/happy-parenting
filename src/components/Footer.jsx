import React from 'react';
import { MapPin, Calendar, Clock, Phone, Award, Heart, MessageCircle, Instagram } from 'lucide-react';
import OrnamentalDivider from './OrnamentalDivider';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-burgundy text-white relative overflow-hidden font-malayalam border-t-2 border-orange/40">
      {/* Decorative top pattern in Golden Orange */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange via-orange-light to-orange" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Academy & Programme */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-orange shadow-xs">
                <img src="/thazkiya-logo.jpg" alt="Thazkiya Academy" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white tracking-wider">
                  THAZKIYA ACADEMY
                </h3>
                <p className="text-xs text-orange-light tracking-widest uppercase font-sans font-semibold">
                  KARINKALLATHANI
                </p>
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed max-w-md">
              ദർസ്, ഹിഫ്സ് സമന്വയ വിദ്യാഭ്യാസത്തിലൂടെ ഉത്തമ തലമുറയെ വാർത്തെടുക്കുന്ന പ്രമുഖ ഇസ്ലാമിക വിദ്യാഭ്യാസ സ്ഥാപനം. ആത്മീയതയും സ്വഭാവ മഹിമയും സമന്വയിപ്പിച്ച ഉന്നത പഠന സംസ്കാരം.
            </p>

            <div className="inline-flex items-center space-x-2 bg-burgundy-dark/60 px-3.5 py-1.5 rounded-full border border-orange/40 text-xs text-white">
              <Award className="w-3.5 h-3.5 text-orange-light shrink-0" />
              <span>പ്രത്യേക പരിപാടി: <strong className="text-orange-light font-heading">HAPPY PARENTING</strong></span>
            </div>
          </div>

          {/* Col 2: Event Details - Heading in English */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-orange-light text-base uppercase tracking-wider border-b border-white/20 pb-2">
              Programme Schedule
            </h4>
            <ul className="space-y-2.5 text-xs text-white/90">
              <li className="flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-orange-light mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">22 നവംബർ, ഞായർ</span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-orange-light mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">രാവിലെ 10:00 – ഉച്ചക്ക് 2:00</span>
                  <p className="text-[11px] text-white/70">4 മണിക്കൂർ പാരന്റിംഗ് സെഷൻ</p>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-orange-light mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-white">താസ്കിയ അക്കാദമി കാമ്പസ്</span>
                  <p className="text-[11px] text-white/70">കരിങ്കല്ലത്താണി</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-orange-light text-base uppercase tracking-wider border-b border-white/20 pb-2">
              Connect & Support
            </h4>
            
            {/* Clickable Enquiry Number */}
            <div className="space-y-1">
              <p className="text-[11px] text-white/70">അന്വേഷണങ്ങൾക്ക് വിളിക്കുക (Enquiry):</p>
              <a 
                href="tel:+919207617723" 
                className="inline-flex items-center space-x-2 text-white hover:text-orange-light font-mono font-bold text-sm bg-burgundy-dark/80 px-3.5 py-2 rounded-xl border border-orange/40 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-orange-light" />
                <span>+91 9207 61 7723</span>
              </a>
            </div>

            {/* WhatsApp and Instagram buttons */}
            <div className="pt-2 space-y-2">
              <a
                href="https://chat.whatsapp.com/E4EkTsSiE99JBqsouqK8pH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-xs hover:brightness-105 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>വാട്സ്ആപ്പ് ഗ്രൂപ്പിൽ ചേരുക</span>
              </a>

              <a
                href="https://www.instagram.com/thazkiya_academy/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs font-bold shadow-xs transition-all border border-orange-light/30"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>ഇൻസ്റ്റാഗ്രാമിൽ പിന്തുടരുക</span>
              </a>
            </div>

            {/* Admin Link */}
            <div className="pt-2">
              <button 
                onClick={() => { setActivePage('admin-login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs text-orange-light hover:underline hover:text-white transition-colors"
              >
                അഡ്മിൻ പോർട്ടൽ (Admin Login)
              </button>
            </div>
          </div>

        </div>

        <OrnamentalDivider light className="opacity-60 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} Thazkiya Academy, Karinkallathani. All Rights Reserved.</p>
          <p className="flex items-center space-x-1">
            <span>വിശ്വാസവും മാതൃകയും പകർന്നുനൽകുന്ന പാരന്റിംഗ്</span>
            <Heart className="w-3.5 h-3.5 text-orange-light inline fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
