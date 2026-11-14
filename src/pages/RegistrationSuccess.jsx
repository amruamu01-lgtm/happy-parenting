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
        colors: ['#A9927D', '#49111C', '#0A0908', '#5E503F', '#F2F4F3']
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  if (!registrationData) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-grullo/30 text-center space-y-4">
        <p className="text-sm font-malayalam text-umber">രജിസ്ട്രേഷൻ വിവരങ്ങൾ ലഭ്യമല്ല.</p>
        <button
          onClick={() => setActivePage('home')}
          className="px-6 py-2.5 rounded-full bg-richblack text-grullo-light text-xs font-malayalam font-bold"
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
      <div className="bg-white rounded-3xl border-2 border-grullo/60 shadow-card overflow-hidden print-card">
        
        {/* Top Celebration Banner - Rich Black & Grullo */}
        <div className="bg-gradient-to-r from-richblack via-richblack-light to-richblack text-cultured p-6 sm:p-8 text-center relative border-b-2 border-grullo">
          <div className="w-16 h-16 rounded-full bg-darksienna/40 border-2 border-grullo flex items-center justify-center mx-auto mb-3 shadow-grullo">
            <CheckCircle2 className="w-10 h-10 text-grullo-light" />
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-grullo-light tracking-wider uppercase">
            REGISTRATION SUCCESSFUL!
          </h1>
          <p className="font-malayalam text-base sm:text-lg text-cultured/95 font-medium mt-1">
            നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിജയകരമായി പൂർത്തിയായി.
          </p>

          <OrnamentalDivider light className="my-3 opacity-60" />

          <p className="font-malayalam text-xs text-cultured/80">
            താസ്കിയ അക്കാദമി കാമ്പസ് പ്രവേശനത്തിനായി ഈ ഔദ്യോഗിക സ്ഥിരീകരണ സ്ലിപ്പ് സൂക്ഷിക്കുകയോ പ്രിന്റ് എടുക്കുകയോ ചെയ്യുക.
          </p>
        </div>

        {/* Official Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Registration ID Highlight Badge */}
          <div className="bg-cultured border-2 border-grullo/50 rounded-2xl p-5 text-center shadow-xs">
            <span className="block text-xs font-malayalam font-bold text-umber mb-1">
              ഔദ്യോഗിക രജിസ്ട്രേഷൻ ഐഡി (Registration ID)
            </span>
            <span className="font-heading font-black text-3xl sm:text-4xl text-richblack tracking-wider select-all font-mono">
              {registrationData.registrationId}
            </span>
            <p className="font-malayalam text-[11px] text-darksienna font-semibold mt-1">
              ഞായറാഴ്ച റിസപ്ഷൻ കൗണ്ടറിൽ ഈ ഐഡി കാണിക്കുക.
            </p>
          </div>

          {/* Event & Candidate Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-malayalam">
            
            {/* Registered Name */}
            <div className="p-3.5 rounded-xl bg-cultured border border-grullo/20">
              <span className="text-umber font-bold block mb-0.5">രജിസ്റ്റർ ചെയ്ത ആളുടെ പേര്</span>
              <span className="font-bold text-base text-richblack block font-heading">
                {registrationData.name}
              </span>
              <span className="font-mono text-umber">{registrationData.mobileNumber}</span>
            </div>

            {/* Registration Type */}
            <div className="p-3.5 rounded-xl bg-cultured border border-grullo/20">
              <span className="text-umber font-bold block mb-0.5">രജിസ്ട്രേഷൻ വിഭാഗം</span>
              <span className="font-bold text-base text-richblack block">
                {registrationData.registrationType === 'Student Parent' ? 'വിദ്യാർത്ഥി രക്ഷിതാവ്' : 'മറ്റു അതിഥി'}
              </span>
              <span className="text-darksienna font-semibold">
                {isStudentParent ? `വിഭാഗം: ${registrationData.studentDepartment}` : 'പൊതു അതിഥി'}
              </span>
            </div>

            {/* Number of Attendees */}
            <div className="p-3.5 rounded-xl bg-cultured border border-grullo/20">
              <span className="text-umber font-bold block mb-0.5">ആകെ പങ്കെടുക്കുന്ന ആളുകൾ</span>
              <span className="font-bold text-base text-richblack block">
                {attendeeCount} {isStudentParent ? 'രക്ഷിതാവ്' : 'അതിഥി'}
              </span>
              {isStudentParent && (
                <span className="text-umber">
                  ബന്ധം: {registrationData.relationship}
                </span>
              )}
            </div>

            {/* Student Name (if applicable) */}
            {isStudentParent && (
              <div className="p-3.5 rounded-xl bg-cultured border border-grullo/20">
                <span className="text-umber font-bold block mb-0.5">വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ</span>
                <span className="font-bold text-base text-richblack block">
                  {registrationData.studentName}
                </span>
                <span className="text-umber">
                  താസ്കിയ അക്കാദമി ({registrationData.studentDepartment})
                </span>
              </div>
            )}

            {/* Address / Location */}
            <div className="p-3.5 rounded-xl bg-cultured border border-grullo/20 sm:col-span-2">
              <span className="text-umber font-bold block mb-0.5">സ്ഥലം / മേൽവിലാസം</span>
              <span className="text-sm font-medium text-richblack">
                {registrationData.addressPlace}
              </span>
            </div>

          </div>

          {/* Event Schedule Capsule */}
          <div className="bg-richblack text-cultured rounded-2xl p-5 border border-grullo shadow-md">
            <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-grullo/20">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-grullo shrink-0">
                <img src="/thazkiya-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-grullo-light tracking-wider">
                  THAZKIYA ACADEMY, KARINKALLATHANI
                </h4>
                <p className="font-malayalam text-xs text-cultured/80 font-medium">
                  HAPPY PARENTING — നേതൃത്വം: അബ്ദുൽ ഹക്കീം സഖാഫി അൽ അർശദി അയഞ്ചേരി
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-malayalam">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-grullo shrink-0" />
                <span>22 നവംബർ, ഞായർ</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-grullo-light shrink-0" />
                <span>രാവിലെ 10:00 – ഉച്ചക്ക് 2:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-darksienna-light shrink-0" />
                <span>അക്കാദമി ഓഡിറ്റോറിയം</span>
              </div>
            </div>
          </div>

          {/* Meeting Type Reminder */}
          <div className="p-3 rounded-xl bg-darksienna-surface border border-darksienna/30 text-center text-xs font-malayalam text-darksienna">
            ശ്രദ്ധിക്കുക: ഇതൊരു ഗ്രൂപ്പ് പേരന്റ്സ് മീറ്റിംഗ് ആണ്. രാവിലെ 9:45 ന് എത്തിച്ചേരുക.
          </div>

          {/* Action Buttons (Hidden during Print) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 no-print">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-richblack text-grullo-light font-malayalam font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-darksienna transition-colors shadow-md border border-grullo"
            >
              <Printer className="w-4 h-4 text-grullo" />
              <span>കൺഫർമേഷൻ സ്ലിപ്പ് പ്രിന്റ് ചെയ്യുക</span>
            </button>

            <button
              onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cultured text-richblack font-malayalam font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-white transition-colors border border-grullo/50"
            >
              <Home className="w-4 h-4 text-grullo" />
              <span>ഹോമിലേക്ക് മടങ്ങുക</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
