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
    studentDepartment: 'Dars', // Strictly Dars or Hifz
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
      errs.parentName = 'രക്ഷിതാവിന്റെ പേര് നൽകുക';
    }

    const mobileClean = formData.mobileNumber.replace(/\D/g, '');
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'മൊബൈൽ നമ്പർ നൽകുക';
    } else if (mobileClean.length < 10) {
      errs.mobileNumber = 'സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക';
    }

    const waClean = (formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber).replace(/\D/g, '');
    if (!formData.sameAsMobile && !formData.whatsappNumber.trim()) {
      errs.whatsappNumber = 'വാട്സ്ആപ്പ് നമ്പർ നൽകുക';
    } else if (waClean.length < 10) {
      errs.whatsappNumber = 'സാധുവായ 10 അക്ക വാട്സ്ആപ്പ് നമ്പർ നൽകുക';
    }

    if (!formData.studentName.trim()) {
      errs.studentName = 'വിദ്യാർത്ഥിയുടെ പേര് നൽകുക';
    }

    // Strict validation: Only Dars or Hifz
    if (formData.studentDepartment !== 'Dars' && formData.studentDepartment !== 'Hifz') {
      errs.studentDepartment = 'വിഭാഗം Dars അല്ലെങ്കിൽ Hifz ആയിരിക്കണം';
    }

    if (!formData.relationship) {
      errs.relationship = 'വിദ്യാർത്ഥിയുമായുള്ള ബന്ധം തിരഞ്ഞെടുക്കുക';
    }

    if (formData.parentsAttending < 1) {
      errs.parentsAttending = 'കുറഞ്ഞത് ഒരാളെങ്കിലും പങ്കെടുക്കണം';
    }

    if (!formData.addressPlace.trim()) {
      errs.addressPlace = 'സ്ഥലം / മേൽവിലാസം നൽകുക';
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
        setServerError(result.message || 'രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു. ദയവായി വിവരങ്ങൾ പരിശോധിക്കുക.');
      }
    } catch (err) {
      setServerError('സെർവർ തകരാർ സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
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
        className="inline-flex items-center space-x-2 text-xs font-malayalam font-semibold text-text-secondary hover:text-burgundy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-orange" />
        <span>ഹോമിലേക്ക് മടങ്ങുക</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border-2 border-burgundy/20 shadow-card overflow-hidden">
        
        {/* Header Banner - Burgundy with Orange Accents */}
        <div className="bg-burgundy text-white p-6 sm:p-8 text-center relative border-b-2 border-orange">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-burgundy-dark border border-orange/40 text-xs text-orange-light mb-3">
            <Users className="w-4 h-4 text-orange" />
            <span className="font-malayalam">താസ്കിയ അക്കാദമി ഔദ്യോഗിക പോർട്ടൽ</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            STUDENT PARENT REGISTRATION
          </h1>
          <p className="font-malayalam text-base sm:text-lg text-white/95 font-medium mt-1">
            വിദ്യാർത്ഥികളുടെ രക്ഷിതാക്കൾക്കുള്ള രജിസ്ട്രേഷൻ
          </p>

          <OrnamentalDivider light className="my-3 opacity-60" />

          <p className="font-malayalam text-xs text-white/80 max-w-lg mx-auto">
            ഹാപ്പി പാരന്റിംഗ് സംഗമത്തിൽ പങ്കെടുക്കുന്നതിനായി വിദ്യാർത്ഥിയുടെയും രക്ഷിതാവിന്റെയും കൃത്യമായ വിവരങ്ങൾ രേഖപ്പെടുത്തുക.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-burgundy-surface border border-burgundy text-burgundy text-xs font-malayalam font-medium flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">രജിസ്ട്രേഷൻ അറിയിപ്പ്</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Body: White & Soft Ivory with Burgundy focus borders */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {/* SECTION 1: PARENT DETAILS */}
          <div className="space-y-4">
            <div className="border-b border-burgundy/15 pb-2">
              <h3 className="font-heading font-bold text-base text-burgundy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orange" />
                <span>Parent Information</span>
                <span className="font-malayalam text-xs font-normal text-text-secondary">(രക്ഷിതാവിന്റെ വിവരങ്ങൾ)</span>
              </h3>
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                രക്ഷിതാവിന്റെ പേര് (Parent Name) <span className="text-burgundy">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="രക്ഷിതാവിന്റെ പൂർണ്ണ പേര് നൽകുക"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/50 text-text-primary placeholder:text-text-muted text-sm font-malayalam focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy focus:bg-white transition-all ${
                    errors.parentName ? 'border-burgundy' : 'border-burgundy/20'
                  }`}
                />
              </div>
              {errors.parentName && (
                <p className="text-[11px] font-malayalam text-burgundy mt-1">{errors.parentName}</p>
              )}
            </div>

            {/* Mobile & WhatsApp Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile */}
              <div>
                <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                  മൊബൈൽ നമ്പർ (Mobile Number) <span className="text-burgundy">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="10 അക്ക മൊബൈൽ നമ്പർ"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={handleMobileChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/50 text-text-primary placeholder:text-text-muted text-sm font-mono focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy focus:bg-white transition-all ${
                      errors.mobileNumber ? 'border-burgundy' : 'border-burgundy/20'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-[11px] font-malayalam text-burgundy mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                  വാട്സ്ആപ്പ് നമ്പർ (WhatsApp Number) <span className="text-burgundy">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    disabled={formData.sameAsMobile}
                    placeholder="10 അക്ക വാട്സ്ആപ്പ് നമ്പർ"
                    maxLength={10}
                    value={formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono transition-all ${
                      formData.sameAsMobile ? 'bg-gray-100 text-text-muted cursor-not-allowed' : 'bg-ivory/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy focus:bg-white'
                    } ${errors.whatsappNumber ? 'border-burgundy' : 'border-burgundy/20'}`}
                  />
                </div>
                <div className="mt-1.5 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsMobile"
                    checked={formData.sameAsMobile}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-burgundy rounded border-burgundy/30 focus:ring-burgundy"
                  />
                  <label htmlFor="sameAsMobile" className="text-xs font-malayalam text-text-secondary cursor-pointer select-none">
                    മൊബൈൽ നമ്പർ തന്നെ (Same as Mobile)
                  </label>
                </div>
                {errors.whatsappNumber && (
                  <p className="text-[11px] font-malayalam text-burgundy mt-1">{errors.whatsappNumber}</p>
                )}
              </div>
            </div>

            {/* Relationship & Number of Parents Attending */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Relationship */}
              <div>
                <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                  വിദ്യാർത്ഥിയുമായുള്ള ബന്ധം (Relationship) <span className="text-burgundy">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-burgundy/20 bg-ivory/50 text-text-primary text-sm font-malayalam focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy focus:bg-white"
                  >
                    <option value="Father">പിതാവ് (Father)</option>
                    <option value="Mother">മാതാവ് (Mother)</option>
                    <option value="Guardian">രക്ഷാധികാരി (Guardian)</option>
                  </select>
                </div>
              </div>

              {/* Number of Parents Attending */}
              <div>
                <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                  പങ്കെടുക്കുന്ന രക്ഷിതാക്കളുടെ എണ്ണം <span className="text-burgundy">*</span>
                </label>
                <div className="flex items-center space-x-3 bg-ivory/60 border border-burgundy/20 rounded-xl p-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, parentsAttending: Math.max(1, prev.parentsAttending - 1) }))}
                    className="w-10 h-10 rounded-lg bg-white border border-burgundy/20 flex items-center justify-center text-text-primary hover:bg-orange hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-heading font-bold text-lg text-burgundy font-mono">
                    {formData.parentsAttending}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, parentsAttending: prev.parentsAttending + 1 }))}
                    className="w-10 h-10 rounded-lg bg-white border border-burgundy/20 flex items-center justify-center text-text-primary hover:bg-orange hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: STUDENT DETAILS */}
          <div className="space-y-4 pt-4">
            <div className="border-b border-burgundy/15 pb-2">
              <h3 className="font-heading font-bold text-base text-burgundy flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orange" />
                <span>Student Information</span>
                <span className="font-malayalam text-xs font-normal text-text-secondary">(വിദ്യാർത്ഥിയുടെ വിവരങ്ങൾ)</span>
              </h3>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                വിദ്യാർത്ഥിയുടെ പേര് (Student Name) <span className="text-burgundy">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="വിദ്യാർത്ഥിയുടെ പൂർണ്ണ പേര് നൽകുക"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/50 text-text-primary placeholder:text-text-muted text-sm font-malayalam focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy focus:bg-white transition-all ${
                    errors.studentName ? 'border-burgundy' : 'border-burgundy/20'
                  }`}
                />
              </div>
              {errors.studentName && (
                <p className="text-[11px] font-malayalam text-burgundy mt-1">{errors.studentName}</p>
              )}
            </div>

            {/* Student Department (STRICTLY ONLY TWO OPTIONS: Dars or Hifz) */}
            <div>
              <label className="block text-xs font-malayalam font-bold text-text-primary mb-2">
                വിദ്യാർത്ഥിയുടെ വിഭാഗം (Student Department - Dars / Hifz മാത്രം) <span className="text-burgundy">*</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Dars Option */}
                <div
                  onClick={() => setFormData({ ...formData, studentDepartment: 'Dars' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    formData.studentDepartment === 'Dars'
                      ? 'border-burgundy bg-burgundy text-white shadow-md'
                      : 'border-burgundy/20 bg-ivory/50 hover:border-burgundy text-text-primary'
                  }`}
                >
                  <div>
                    <span className="font-heading font-bold text-base block">Dars</span>
                    <span className="font-malayalam text-xs opacity-90">ദർസ് വിഭാഗം</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.studentDepartment === 'Dars' ? 'border-white bg-white' : 'border-gray-400'
                  }`}>
                    {formData.studentDepartment === 'Dars' && <span className="w-2 h-2 rounded-full bg-burgundy" />}
                  </div>
                </div>

                {/* Hifz Option */}
                <div
                  onClick={() => setFormData({ ...formData, studentDepartment: 'Hifz' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    formData.studentDepartment === 'Hifz'
                      ? 'border-burgundy bg-burgundy text-white shadow-md'
                      : 'border-burgundy/20 bg-ivory/50 hover:border-burgundy text-text-primary'
                  }`}
                >
                  <div>
                    <span className="font-heading font-bold text-base block">Hifz</span>
                    <span className="font-malayalam text-xs opacity-90">ഹിഫ്സ് വിഭാഗം</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.studentDepartment === 'Hifz' ? 'border-white bg-white' : 'border-gray-400'
                  }`}>
                    {formData.studentDepartment === 'Hifz' && <span className="w-2 h-2 rounded-full bg-burgundy" />}
                  </div>
                </div>
              </div>

              {errors.studentDepartment && (
                <p className="text-[11px] font-malayalam text-burgundy mt-1">{errors.studentDepartment}</p>
              )}
            </div>

            {/* Address / Place */}
            <div>
              <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                സ്ഥലം / മേൽവിലാസം (Place / Address) <span className="text-burgundy">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="ഉദാ: കരിങ്കല്ലത്താണി, പെരിന്തൽമണ്ണ"
                  value={formData.addressPlace}
                  onChange={(e) => setFormData({ ...formData, addressPlace: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/50 text-text-primary placeholder:text-text-muted text-sm font-malayalam focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-burgundy focus:bg-white transition-all ${
                    errors.addressPlace ? 'border-burgundy' : 'border-burgundy/20'
                  }`}
                />
              </div>
              {errors.addressPlace && (
                <p className="text-[11px] font-malayalam text-burgundy mt-1">{errors.addressPlace}</p>
              )}
            </div>

          </div>

          {/* Primary Submit Button: Burgundy background with white text */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-burgundy hover:bg-burgundy-dark text-white font-malayalam font-bold text-base shadow-burgundy hover:shadow-lg active:scale-95 transition-all duration-300 border border-burgundy flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-orange-light" />
                  <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുന്നു...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-orange-light" />
                  <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുക</span>
                </>
              )}
            </button>
            <p className="text-center text-xs font-malayalam text-text-secondary mt-2">
              വിവരങ്ങൾ നേരിട്ട് താസ്കിയ അക്കാദമി ഡാറ്റാബേസിൽ രേഖപ്പെടുത്തുന്നതാണ്.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
