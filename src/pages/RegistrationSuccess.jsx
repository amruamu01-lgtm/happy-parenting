import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Home, 
  Calendar, 
  Clock, 
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function RegistrationSuccess({ registrationData, setActivePage }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#952F2F', '#D9883F', '#FFFFFF', '#F8F5F2', '#222222']
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  if (!registrationData) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-orange/30 text-center space-y-4">
        <p className="text-sm font-malayalam text-text-secondary">രജിസ്ട്രേഷൻ വിവരങ്ങൾ ലഭ്യമല്ല.</p>
        <button
          onClick={() => setActivePage('home')}
          className="px-6 py-2.5 rounded-full bg-burgundy text-white text-xs font-malayalam font-bold"
        >
          ഹോമിലേക്ക് മടങ്ങുക
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const isStudentParent = registrationData.registrationType === 'Student Parent';
  const attendeeCount = isStudentParent 
    ? (registrationData.parentsAttending || 1) 
    : (registrationData.guestsCount || 1);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 print-container font-malayalam">
      
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/40 shadow-card overflow-hidden print-card">
        
        {/* Top Celebration Banner - Burgundy with Orange Accents */}
        <div className="bg-burgundy text-white p-6 sm:p-8 text-center relative border-b-2 border-orange">
          <div className="w-16 h-16 rounded-full bg-burgundy-dark/60 border-2 border-orange flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-orange-light" />
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wider uppercase">
            REGISTRATION SUCCESSFUL!
          </h1>
          <p className="font-malayalam text-base sm:text-lg text-white/95 font-medium mt-1">
            നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിജയകരമായി പൂർത്തിയായി.
          </p>

          <OrnamentalDivider light className="my-3 opacity-60" />

          <p className="font-malayalam text-xs text-white/80">
            താസ്കിയ അക്കാദമി കാമ്പസ് പ്രവേശനത്തിനായി ഈ ഔദ്യോഗിക സ്ഥിരീകരണ സ്ലിപ്പ് സൂക്ഷിക്കുകയോ പ്രിന്റ് എടുക്കുകയോ ചെയ്യുക.
          </p>
        </div>

        {/* Official Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Registration ID Highlight Badge */}
          <div className="bg-ivory border-2 border-burgundy/40 rounded-2xl p-5 text-center shadow-xs">
            <span className="block text-xs font-malayalam font-bold text-text-secondary mb-1">
              ഔദ്യോഗിക രജിസ്ട്രേഷൻ ഐഡി (Registration ID)
            </span>
            <span className="font-heading font-black text-3xl sm:text-4xl text-burgundy tracking-wider select-all font-mono">
              {registrationData.registrationId}
            </span>
            <p className="font-malayalam text-[11px] text-orange-dark font-semibold mt-1">
              ഞായറാഴ്ച റിസപ്ഷൻ കൗണ്ടറിൽ ഈ ഐഡി കാണിക്കുക.
            </p>
          </div>

          {/* Event & Candidate Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-malayalam">
            
            {/* Registered Name */}
            <div className="p-3.5 rounded-xl bg-ivory border border-burgundy/15">
              <span className="text-text-secondary font-bold block mb-0.5">രജിസ്റ്റർ ചെയ്ത ആളുടെ പേര്</span>
              <span className="font-bold text-base text-burgundy block font-heading">
                {registrationData.name}
              </span>
              <span className="font-mono text-text-secondary">{registrationData.mobileNumber}</span>
            </div>

            {/* Registration Type */}
            <div className="p-3.5 rounded-xl bg-ivory border border-burgundy/15">
              <span className="text-text-secondary font-bold block mb-0.5">രജിസ്ട്രേഷൻ വിഭാഗം</span>
              <span className="font-bold text-base text-burgundy block">
                {registrationData.registrationType === 'Student Parent' ? 'വിദ്യാർത്ഥി രക്ഷിതാവ്' : 'മറ്റു അതിഥി'}
              </span>
              <span className="text-orange-dark font-semibold">
                {isStudentParent ? `വിഭാഗം: ${registrationData.studentDepartment}` : 'പൊതു അതിഥി'}
              </span>
            </div>

            {/* Number of Attendees */}
            <div className="p-3.5 rounded-xl bg-ivory border border-burgundy/15">
              <span className="text-text-secondary font-bold block mb-0.5">ആകെ പങ്കെടുക്കുന്ന ആളുകൾ</span>
              <span className="font-bold text-base text-burgundy block">
                {attendeeCount} {isStudentParent ? 'രക്ഷിതാവ്' : 'അതിഥി'}
              </span>
              {isStudentParent && (
                <span className="text-text-secondary">
                  ബന്ധം: {registrationData.relationship}
                </span>
              )}
            </div>

            {/* Student Name (if applicable) */}
            {isStudentParent && (
              <div className="p-3.5 rounded-xl bg-ivory border border-burgundy/15">
                <span className="text-text-secondary font-bold block mb-0.5">വിദ്യാർത്ഥിയുടെ പേര്</span>
                <span className="font-bold text-base text-burgundy block">
                  {registrationData.studentName}
                </span>
                <span className="text-orange-dark font-semibold">
                  താസ്കിയ അക്കാദമി ({registrationData.studentDepartment})
                </span>
              </div>
            )}

            {/* WhatsApp */}
            <div className="p-3.5 rounded-xl bg-ivory border border-burgundy/15">
              <span className="text-text-secondary font-bold block mb-0.5">വാട്സ്ആപ്പ് നമ്പർ</span>
              <span className="font-mono font-bold text-sm text-text-primary block">
                {registrationData.whatsappNumber || registrationData.mobileNumber}
              </span>
            </div>

            {/* Place */}
            <div className="p-3.5 rounded-xl bg-ivory border border-burgundy/15">
              <span className="text-text-secondary font-bold block mb-0.5">സ്ഥലം</span>
              <span className="font-medium text-text-primary block">
                {registrationData.addressPlace}
              </span>
            </div>

          </div>

          {/* Event Schedule Ticket Box */}
          <div className="bg-burgundy text-white rounded-2xl p-5 space-y-3 border-2 border-orange/40">
            <div className="flex items-center space-x-3 border-b border-white/20 pb-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-orange">
                <img src="/thazkiya-logo.jpg" alt="Thazkiya Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm tracking-wide text-white">
                  THAZKIYA ACADEMY, KARINKALLATHANI
                </h4>
                <p className="font-malayalam text-xs text-orange-light font-medium">
                  HAPPY PARENTING — നേതൃത്വം: അബ്ദുൽ ഹക്കീം സഖാഫി അൽ അർശദി അയഞ്ചേരി
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-malayalam text-white/90">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-orange-light shrink-0" />
                <span>22 നവംബർ, ഞായർ</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-light shrink-0" />
                <span>രാവിലെ 10:00 – ഉച്ചക്ക് 2:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-light shrink-0" />
                <span>അക്കാദമി ഓഡിറ്റോറിയം</span>
              </div>
            </div>
          </div>

          {/* Meeting Type Reminder */}
          <div className="p-3 rounded-xl bg-burgundy-surface border border-burgundy/30 text-center text-xs font-malayalam text-burgundy font-semibold">
            ശ്രദ്ധിക്കുക: ഇതൊരു ഗ്രൂപ്പ് പേരന്റ്സ് മീറ്റിംഗ് ആണ്. രാവിലെ 9:45 ന് എത്തിച്ചേരുക.
          </div>

          {/* Action Buttons (Hidden during Print) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 no-print">
            {/* Primary button: Burgundy background with white text */}
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-white font-malayalam font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-burgundy hover:shadow-lg border border-burgundy"
            >
              <Printer className="w-4 h-4 text-orange-light" />
              <span>കൺഫർമേഷൻ സ്ലിപ്പ് പ്രിന്റ് ചെയ്യുക</span>
            </button>

            {/* Secondary button: Orange background with white text */}
            <button
              onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange hover:bg-orange-dark text-white font-malayalam font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-orange hover:shadow-lg border border-orange-light/30"
            >
              <Home className="w-4 h-4 text-white" />
              <span>ഹോമിലേക്ക് മടങ്ങുക</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
