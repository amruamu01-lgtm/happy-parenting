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
      errs.guestName = 'Guest Name is required / അതിഥിയുടെ പേര് നൽകുക';
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

    if (formData.guestsCount < 1) {
      errs.guestsCount = 'At least 1 guest must attend';
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-warm/20 border border-amber-warm/40 text-xs text-amber-warm mb-3">
            <UserCheck className="w-4 h-4" />
            <span>Honorable Guest Registration</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-gold-champagne tracking-wide uppercase">
            NORMAL GUEST REGISTRATION
          </h1>
          <p className="font-malayalam text-base sm:text-lg text-ivory/90 font-medium mt-1">
            മറ്റു അതിഥികൾക്കുള്ള രജിസ്ട്രേഷൻ
          </p>

          <OrnamentalDivider light className="my-3 opacity-60" />

          <p className="text-xs text-ivory/80 max-w-md mx-auto">
            Please register your attendance for the Happy Parenting summit at Thazkiya Academy, Karinkallathani.
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
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5">
          
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Guest Full Name <span className="text-burgundy-deep">*</span>
              <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                അതിഥിയുടെ പേര്
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Dr. Usman Master"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-amber-warm focus:bg-white transition-all ${
                  errors.guestName ? 'border-burgundy-deep' : 'border-gold-antique/40'
                }`}
              />
            </div>
            {errors.guestName && (
              <p className="text-[11px] text-burgundy-deep mt-1">{errors.guestName}</p>
            )}
          </div>

          {/* Mobile & WhatsApp */}
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
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-amber-warm focus:bg-white transition-all ${
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
                    formData.sameAsMobile ? 'bg-gray-100 text-text-secondary cursor-not-allowed' : 'bg-ivory/30 text-text-primary focus:outline-none focus:ring-2 focus:ring-amber-warm focus:bg-white'
                  } ${errors.whatsappNumber ? 'border-burgundy-deep' : 'border-gold-antique/40'}`}
                />
              </div>
              <div className="mt-1.5 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="guestSameAsMobile"
                  checked={formData.sameAsMobile}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-emerald-deep rounded border-gold-antique/50 focus:ring-emerald-deep"
                />
                <label htmlFor="guestSameAsMobile" className="text-xs text-text-secondary cursor-pointer select-none">
                  Same as Mobile Number (മൊബൈൽ നമ്പർ തന്നെ)
                </label>
              </div>
              {errors.whatsappNumber && (
                <p className="text-[11px] text-burgundy-deep mt-1">{errors.whatsappNumber}</p>
              )}
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Number of Guests Attending <span className="text-burgundy-deep">*</span>
              <span className="font-malayalam block text-[11px] font-normal text-text-secondary lowercase">
                പങ്കെടുക്കുന്ന ആളുകളുടെ എണ്ണം
              </span>
            </label>
            <div className="flex items-center space-x-3 bg-ivory/40 border border-gold-antique/40 rounded-xl p-2 max-w-xs">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, guestsCount: Math.max(1, prev.guestsCount - 1) }))}
                className="w-10 h-10 rounded-lg bg-white border border-gold-antique/30 flex items-center justify-center text-emerald-deep hover:bg-gold-antique hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-heading font-bold text-lg text-emerald-deep">
                {formData.guestsCount}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, guestsCount: prev.guestsCount + 1 }))}
                className="w-10 h-10 rounded-lg bg-white border border-gold-antique/30 flex items-center justify-center text-emerald-deep hover:bg-gold-antique hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
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
                placeholder="e.g. Melattur, Malappuram"
                value={formData.addressPlace}
                onChange={(e) => setFormData({ ...formData, addressPlace: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-ivory/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-amber-warm focus:bg-white transition-all ${
                  errors.addressPlace ? 'border-burgundy-deep' : 'border-gold-antique/40'
                }`}
              />
            </div>
            {errors.addressPlace && (
              <p className="text-[11px] text-burgundy-deep mt-1">{errors.addressPlace}</p>
            )}
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
                  <span>Submit Guest Registration</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-text-secondary mt-2">
              Note: This is a Group Parents Meeting. Please arrive by 9:45 AM.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
