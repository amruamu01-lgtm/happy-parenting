import React, { useState } from 'react';
import { Shield, Lock, User, ArrowLeft, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function AdminLogin({ setActivePage, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.adminLogin(username.trim(), password.trim());
      if (res.success) {
        onLoginSuccess(res.admin);
        setActivePage('admin-dashboard');
      } else {
        setError(res.message || 'Invalid administrative credentials');
      }
    } catch (err) {
      setError('Unable to authenticate at this time. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      
      {/* Return link */}
      <div className="w-full max-w-md mb-4 text-left">
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-forest hover:text-emerald-deep transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-gold-antique/50 shadow-gold overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-deep text-ivory p-6 text-center border-b-2 border-gold-antique">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white p-0.5 border-2 border-gold-antique mx-auto mb-3 shadow-gold">
            <img src="/thazkiya-logo.jpg" alt="Thazkiya Logo" className="w-full h-full object-contain rounded-full" />
          </div>

          <h2 className="font-heading font-black text-xl text-gold-champagne tracking-wider uppercase">
            ADMIN SECURE ACCESS
          </h2>
          <p className="text-xs text-ivory/80 uppercase tracking-widest mt-0.5">
            THAZKIYA ACADEMY • KARINKALLATHANI
          </p>

          <OrnamentalDivider light className="my-2 opacity-60" />

          <p className="text-[11px] text-ivory/70">
            Protected Management Portal for Happy Parenting
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-6 p-3.5 rounded-xl bg-burgundy-surface border border-burgundy-deep text-burgundy-deep text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Admin Username / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoComplete="username"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-antique">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-deep via-emerald-forest to-emerald-deep text-gold-champagne font-heading font-bold text-sm uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all border border-gold-antique flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-champagne" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-gold-antique" />
                  <span>Authorize & Enter Portal</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gold-antique/20 text-center">
            <p className="text-[11px] text-text-muted">
              Demo Credentials: <span className="font-mono text-emerald-deep font-semibold">admin</span> / <span className="font-mono text-emerald-deep font-semibold">thazkiya@2026</span>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
