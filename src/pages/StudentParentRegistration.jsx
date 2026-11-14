import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  User, 
  Phone, 
  MessageSquare, 
  GraduationCap, 
  HeartHandshake, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function StudentParentRegistration({ setActivePage, setSuccessData }) {
  const [formData, setFormData] = useState({
    parentName: '',
    mobileNumber: '',
    whatsappNumber: '',
    studentName: '',
    studentDepartment: 'Dars', // Default to Dars (Strictly Dars or Hifz)
    relationship: 'Father', // Father, Mother, Guardian
    parentsAttending: 1,
    addressPlace: '',
    sameAsMobile: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.parentName.trim()) {
      errs.parentName = 'Parent Name is required / രക്ഷിതാവിന്റെ പേര് നൽകുക';
    }

    const mobileClean = formData.mobileNumber.replace(/\D/g, '');
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile Number is required / മൊബൈൽ നമ്പർ നൽകുക';
    } else if (mobileClean.length < 10) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    const waClean = (formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber).replace(/\D/g, '');
    if (!formData.sameAsMobile && !formData.whatsappNumber.trim()) {
      errs.whatsappNumber = 'WhatsApp Number is required / വാട്സ്ആപ്പ് നമ്പർ നൽകുക';
    } else if (waClean.length < 10) {
      errs.whatsappNumber = 'Please enter a valid 10-digit WhatsApp number';
    }

    if (!formData.studentName.trim()) {
      errs.studentName = 'Student Name is required / വിദ്യാർത്ഥിയുടെ പേര് നൽകുക';
    }

    // Strict validation: Only Dars or Hifz
    if (formData.studentDepartment !== 'Dars' && formData.studentDepartment !== 'Hifz') {
      errs.studentDepartment = 'Department must be Dars or Hifz';
    }

    if (!formData.relationship) {
      errs.relationship = 'Please select relationship / ബന്ധം തിരഞ്ഞെടുക്കുക';
    }

    if (formData.parentsAttending < 1) {
      errs.parentsAttending = 'At least 1 parent must be attending';
    }

    if (!formData.addressPlace.trim()) {
      errs.addressPlace = 'Address / Place is required / സ്ഥലം നൽകുക';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        registrationType: 'Student Parent',
        name: formData.parentName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        whatsappNumber: formData.sameAsMobile ? formData.mobileNumber.trim() : formData.whatsappNumber.trim(),
        studentName: formData.studentName.trim(),
        studentDepartment: formData.studentDepartment,
        relationship: formData.relationship,
        parentsAttending: formData.parentsAttending,
        addressPlace: formData.addressPlace.trim()
      };

      const result = await apiService.createRegistration(payload);

      if (result.success) {
        setSuccessData(result.registration);
        setActivePage('registration-success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setServerError(result.message || 'Registration failed. Please check details.');
      }
    } catch (err) {
      setServerError('Network or server error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      mobileNumber: val,
      whatsappNumber: prev.sameAsMobile ? val : prev.whatsappNumber
    }));
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsMobile: checked,
      whatsappNumber: checked ? prev.mobileNumber : ''
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Back Navigation */}
      <button
        onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-forest hover:text-emerald-deep mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border-2 border-gold-antique/40 shadow-card overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-emerald-deep text-ivory p-6 sm:p-8 text-center relative border-b-2 border-gold-antique">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-forest/80 border border-gold-antique/40 text-xs text-gold-champagne mb-3">
            <Users className="w-4 h-4 text-amber-warm" />
            <span>Thazkiya Academy Official Portal</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gold-champagne tracking-wide uppercase">
            STUDENT PARENT REGISTRATION
          </h1>
          <p className="font-malayalam text-base sm:text-lg text-ivory/90 font-medium mt-1">
            വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കുള്ള രജിസ്ട്രേഷൻ
          </p>

          <OrnamentalDivider light className="my-3 opacity-60" />

          <p className="text-xs text-ivory/80 max-w-lg mx-auto">
            Please fill in the official details of the student and attending parent(s) for the Happy Parenting summit.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-burgundy-surface border border-burgundy-deep text-burgundy-deep text-xs font-medium flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Registration Alert</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {/* SECTION 1: PARENT DETAILS */}
          <div className="space-y-4">
            <div className="border-b border-gold-antique/20 pb-2">
              <h3 className="font-heading font-bold text-base text-emerald-deep flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-gold-antique" />
                <span>Parent / Guardian Information (രക്ഷിതാവിന്റെ വിവരങ്ങൾ)</span>
              </h3>
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Parent / Guardian Name <span className="text-burgundy-deep">*</span>
                <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                  രക്ഷിതാവിന്റെ പേര്
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Muhammed Basheer K."
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white transition-all ${
                    errors.parentName ? 'border-burgundy-deep' : 'border-gold-antique/40'
                  }`}
                />
              </div>
              {errors.parentName && (
                <p className="text-[11px] text-burgundy-deep mt-1">{errors.parentName}</p>
              )}
            </div>

            {/* Mobile & WhatsApp Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Mobile Number <span className="text-burgundy-deep">*</span>
                  <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                    മൊബൈൽ നമ്പർ
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={handleMobileChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white transition-all ${
                      errors.mobileNumber ? 'border-burgundy-deep' : 'border-gold-antique/40'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-[11px] text-burgundy-deep mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  WhatsApp Number <span className="text-burgundy-deep">*</span>
                  <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                    വാട്സ്ആപ്പ് നമ്പർ
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-forest">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    disabled={formData.sameAsMobile}
                    placeholder="10-digit WhatsApp number"
                    maxLength={10}
                    value={formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all ${
                      formData.sameAsMobile ? 'bg-gray-100 text-text-secondary cursor-not-allowed' : 'bg-ivory/30 text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white'
                    } ${errors.whatsappNumber ? 'border-burgundy-deep' : 'border-gold-antique/40'}`}
                  />
                </div>
                <div className="mt-1.5 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsMobile"
                    checked={formData.sameAsMobile}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-emerald-deep rounded border-gold-antique/50 focus:ring-emerald-deep"
                  />
                  <label htmlFor="sameAsMobile" className="text-xs text-text-secondary cursor-pointer select-none">
                    Same as Mobile Number (മൊബൈൽ നമ്പർ തന്നെ)
                  </label>
                </div>
                {errors.whatsappNumber && (
                  <p className="text-[11px] text-burgundy-deep mt-1">{errors.whatsappNumber}</p>
                )}
              </div>
            </div>

            {/* Relationship & Number of Parents Attending */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Relationship */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Relationship <span className="text-burgundy-deep">*</span>
                  <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                    വിദ്യാർത്ഥിയുമായുള്ള ബന്ധം
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
                  >
                    <option value="Father">Father (പിതാവ്)</option>
                    <option value="Mother">Mother (മാതാവ്)</option>
                    <option value="Guardian">Guardian (രക്ഷാധികാരി)</option>
                  </select>
                </div>
              </div>

              {/* Number of Parents Attending */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                  Number of Parents Attending <span className="text-burgundy-deep">*</span>
                  <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                    പങ്കെടുക്കുന്ന രക്ഷിതാക്കളുടെ എണ്ണം
                  </span>
                </label>
                <div className="flex items-center space-x-3 bg-ivory/40 border border-gold-antique/40 rounded-xl p-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, parentsAttending: Math.max(1, prev.parentsAttending - 1) }))}
                    className="w-10 h-10 rounded-lg bg-white border border-gold-antique/30 flex items-center justify-center text-emerald-deep hover:bg-gold-antique hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-heading font-bold text-lg text-emerald-deep">
                    {formData.parentsAttending}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, parentsAttending: prev.parentsAttending + 1 }))}
                    className="w-10 h-10 rounded-lg bg-white border border-gold-antique/30 flex items-center justify-center text-emerald-deep hover:bg-gold-antique hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: STUDENT DETAILS */}
          <div className="space-y-4 pt-4">
            <div className="border-b border-gold-antique/20 pb-2">
              <h3 className="font-heading font-bold text-base text-emerald-deep flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-gold-antique" />
                <span>Student Information (വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ)</span>
              </h3>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Student Name <span className="text-burgundy-deep">*</span>
                <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                  വിദ്യാർത്ഥിയുടെ പേര്
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Ahmad Faiz"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white transition-all ${
                    errors.studentName ? 'border-burgundy-deep' : 'border-gold-antique/40'
                  }`}
                />
              </div>
              {errors.studentName && (
                <p className="text-[11px] text-burgundy-deep mt-1">{errors.studentName}</p>
              )}
            </div>

            {/* Student Department (STRICTLY ONLY TWO OPTIONS: Dars or Hifz) */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                Student Department <span className="text-burgundy-deep">*</span>
                <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                  വിഭാഗം തിരഞ്ഞെടുക്കുക (Dars അല്ലെങ്കിൽ Hifz മാത്രം)
                </span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Dars Option */}
                <div
                  onClick={() => setFormData({ ...formData, studentDepartment: 'Dars' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    formData.studentDepartment === 'Dars'
                      ? 'border-emerald-deep bg-emerald-deep text-white shadow-md'
                      : 'border-gold-antique/30 bg-ivory/30 hover:border-gold-antique text-text-primary'
                  }`}
                >
                  <div>
                    <span className="font-heading font-bold text-base block">Dars</span>
                    <span className="font-malayalam text-xs opacity-90">ദർസ് വിഭാഗം</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.studentDepartment === 'Dars' ? 'border-gold-champagne bg-gold-champagne' : 'border-gray-400'
                  }`}>
                    {formData.studentDepartment === 'Dars' && <span className="w-2 h-2 rounded-full bg-emerald-deep" />}
                  </div>
                </div>

                {/* Hifz Option */}
                <div
                  onClick={() => setFormData({ ...formData, studentDepartment: 'Hifz' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    formData.studentDepartment === 'Hifz'
                      ? 'border-emerald-deep bg-emerald-deep text-white shadow-md'
                      : 'border-gold-antique/30 bg-ivory/30 hover:border-gold-antique text-text-primary'
                  }`}
                >
                  <div>
                    <span className="font-heading font-bold text-base block">Hifz</span>
                    <span className="font-malayalam text-xs opacity-90">ഹിഫ്സ് വിഭാഗം</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.studentDepartment === 'Hifz' ? 'border-gold-champagne bg-gold-champagne' : 'border-gray-400'
                  }`}>
                    {formData.studentDepartment === 'Hifz' && <span className="w-2 h-2 rounded-full bg-emerald-deep" />}
                  </div>
                </div>
              </div>

              {errors.studentDepartment && (
                <p className="text-[11px] text-burgundy-deep mt-1">{errors.studentDepartment}</p>
              )}
            </div>

            {/* Address / Place */}
            <div>
              <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
                Address / Place <span className="text-burgundy-deep">*</span>
                <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                  സ്ഥലം / മേൽവിലാസം
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Karinkallathani, Perinthalmanna"
                  value={formData.addressPlace}
                  onChange={(e) => setFormData({ ...formData, addressPlace: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white transition-all ${
                    errors.addressPlace ? 'border-burgundy-deep' : 'border-gold-antique/40'
                  }`}
                />
              </div>
              {errors.addressPlace && (
                <p className="text-[11px] text-burgundy-deep mt-1">{errors.addressPlace}</p>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-deep via-emerald-forest to-emerald-deep text-gold-champagne font-heading font-bold text-base uppercase tracking-wider shadow-emerald hover:brightness-110 active:scale-95 transition-all duration-300 border-2 border-gold-antique flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-gold-champagne" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-gold-antique" />
                  <span>Submit Parent Registration</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-text-secondary mt-2">
              Your details will be registered directly in the official Thazkiya Academy database.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
