import React, { useState } from 'react';
import { 
  UserCheck, 
  ArrowLeft, 
  User, 
  Phone, 
  MessageSquare, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Plus,
  Minus
} from 'lucide-react';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function NormalGuestRegistration({ setActivePage, setSuccessData }) {
  const [formData, setFormData] = useState({
    guestName: '',
    mobileNumber: '',
    whatsappNumber: '',
    guestsCount: 1,
    addressPlace: '',
    sameAsMobile: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.guestName.trim()) {
      errs.guestName = 'അതിഥിയുടെ പേര് നൽകുക';
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

    if (formData.guestsCount < 1) {
      errs.guestsCount = 'കുറഞ്ഞത് ഒരാളെങ്കിലും പങ്കെടുക്കണം';
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
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        registrationType: 'Normal Guest',
        name: formData.guestName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        whatsappNumber: formData.sameAsMobile ? formData.mobileNumber.trim() : formData.whatsappNumber.trim(),
        guestsCount: formData.guestsCount,
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
        className="inline-flex items-center space-x-2 text-xs font-malayalam font-semibold text-text-secondary hover:text-forest mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-emerald" />
        <span>ഹോമിലേക്ക് മടങ്ങുക</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border-2 border-emerald/20 shadow-card overflow-hidden">
        
        {/* Header Banner - Deep Forest Green with Emerald Accents */}
        <div className="bg-forest text-white p-6 sm:p-8 text-center relative border-b-2 border-emerald">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white mb-3">
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span className="font-malayalam">ബഹുമാന്യരായ അതിഥികൾക്കുള്ള രജിസ്ട്രേഷൻ</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            NORMAL GUEST REGISTRATION
          </h1>
          <p className="font-malayalam text-base sm:text-lg text-white/95 font-medium mt-1">
            മറ്റു അതിഥികൾക്കുള്ള രജിസ്ട്രേഷൻ
          </p>

          <OrnamentalDivider light className="my-3 opacity-60" />

          <p className="font-malayalam text-xs text-white/80 max-w-md mx-auto">
            ഹാപ്പി പാരന്റിംഗ് സെമിനാറിൽ പങ്കെടുക്കുന്നതിനായി നിങ്ങളുടെ വിവരങ്ങൾ താഴെ രേഖപ്പെടുത്തുക.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-malayalam font-medium flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-bold">രജിസ്ട്രേഷൻ അറിയിപ്പ്</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Body: White & Soft Sage with Green focus borders */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
          
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
              അതിഥിയുടെ പൂർണ്ണ പേര് (Guest Full Name) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="അതിഥിയുടെ പേര് നൽകുക"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-sage/20 text-text-primary placeholder:text-text-muted text-sm font-malayalam focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald focus:bg-white transition-all ${
                  errors.guestName ? 'border-red-500' : 'border-forest/20'
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="text-[11px] font-malayalam text-red-600 mt-1">{errors.guestName}</p>
            )}
          </div>

          {/* Mobile & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile */}
            <div>
              <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                മൊബൈൽ നമ്പർ (Mobile Number) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="10 അക്ക മൊബൈൽ നമ്പർ"
                  maxLength={10}
                  value={formData.mobileNumber}
                  onChange={handleMobileChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-sage/20 text-text-primary placeholder:text-text-muted text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald focus:bg-white transition-all ${
                    errors.mobileNumber ? 'border-red-500' : 'border-forest/20'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-[11px] font-malayalam text-red-600 mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
                വാട്സ്ആപ്പ് നമ്പർ (WhatsApp Number) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald">
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
                    formData.sameAsMobile ? 'bg-gray-100 text-text-muted cursor-not-allowed' : 'bg-sage/20 text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald focus:bg-white'
                  } ${errors.whatsappNumber ? 'border-red-500' : 'border-forest/20'}`}
                />
              </div>
              <div className="mt-1.5 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="guestSameAsMobile"
                  checked={formData.sameAsMobile}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-emerald rounded border-forest/30 focus:ring-emerald accent-emerald"
                />
                <label htmlFor="guestSameAsMobile" className="text-xs font-malayalam text-text-secondary cursor-pointer select-none">
                  മൊബൈൽ നമ്പർ തന്നെ (Same as Mobile)
                </label>
              </div>
              {errors.whatsappNumber && (
                <p className="text-[11px] font-malayalam text-red-600 mt-1">{errors.whatsappNumber}</p>
              )}
            </div>
          </div>

          {/* Number of Guests Attending Counter */}
          <div>
            <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
              കൂടെ പങ്കെടുക്കുന്ന ആകെ അതിഥികളുടെ എണ്ണം <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center space-x-3 bg-sage/30 border border-forest/20 rounded-xl p-1.5 max-w-xs">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, guestsCount: Math.max(1, prev.guestsCount - 1) }))}
                className="w-10 h-10 rounded-lg bg-white border border-forest/20 flex items-center justify-center text-text-primary hover:bg-emerald hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-heading font-bold text-lg text-forest font-mono">
                {formData.guestsCount}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, guestsCount: prev.guestsCount + 1 }))}
                className="w-10 h-10 rounded-lg bg-white border border-forest/20 flex items-center justify-center text-text-primary hover:bg-emerald hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.guestsCount && (
              <p className="text-[11px] font-malayalam text-red-600 mt-1">{errors.guestsCount}</p>
            )}
          </div>

          {/* Address / Place */}
          <div>
            <label className="block text-xs font-malayalam font-bold text-text-primary mb-1">
              സ്ഥലം / മേൽവിലാസം (Place / Address) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="ഉദാ: കരിങ്കല്ലത്താണി, മേലാറ്റൂർ"
                value={formData.addressPlace}
                onChange={(e) => setFormData({ ...formData, addressPlace: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-sage/20 text-text-primary placeholder:text-text-muted text-sm font-malayalam focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald focus:bg-white transition-all ${
                  errors.addressPlace ? 'border-red-500' : 'border-forest/20'
                }`}
              />
            </div>
            {errors.addressPlace && (
              <p className="text-[11px] font-malayalam text-red-600 mt-1">{errors.addressPlace}</p>
            )}
          </div>

          {/* Primary Submit Button: Deep Forest Green background with white text */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-emerald text-white font-malayalam font-bold text-base shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 border border-forest flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>രജിസ്ട്രേഷൻ സമർപ്പിക്കുന്നു...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
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
