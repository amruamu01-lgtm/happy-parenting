import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Shield, 
  RotateCcw, 
  FileCode, 
  Check, 
  Activity, 
  Save,
  Info,
  Server
} from 'lucide-react';
import { apiService } from '../services/api';
import OrnamentalDivider from '../components/OrnamentalDivider';

export default function AdminSettings() {
  const [gasUrl, setGasUrl] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setGasUrl(apiService.getGasUrl());
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const res = await apiService.getActivityLogs();
    if (res.success) {
      setActivityLogs(res.logs);
    }
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    apiService.setGasUrl(gasUrl);
    setSaveMessage('Google Apps Script URL saved successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiService.testConnection(gasUrl);
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleCopyScriptCode = () => {
    const codeSnippet = `/**
 * HAPPY PARENTING - GOOGLE APPS SCRIPT BACKEND
 * Deploy as Web App with 'Anyone' access.
 * See google-apps-script/Code.gs for the full code.
 */`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleResetSeed = () => {
    if (window.confirm('Reset database to clean initial demonstration state?')) {
      apiService.resetToSeed();
      loadLogs();
      alert('Database reset to initial demo state.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Settings Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20">
            System Infrastructure
          </span>
          <span className="text-xs text-text-muted">Cloud Database & Security</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep mt-1">
          Settings & Cloud Synchronization
        </h1>
        <p className="text-xs text-text-secondary">
          Configure real-time Google Sheets backend connection and review administrator audit trails.
        </p>
      </div>

      {/* ========================================================
          GOOGLE SHEETS CONNECTION CONFIGURATION
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card space-y-6">
        
        <div className="flex items-center justify-between border-b border-gold-antique/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-deep text-gold-champagne flex items-center justify-center">
              <Database className="w-5 h-5 text-gold-champagne" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-emerald-deep">
                Google Sheets Database Connection
              </h2>
              <p className="text-xs text-text-secondary">
                Google Apps Script Web App Deployment URL
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full animate-pulse ${gasUrl ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-xs font-semibold text-text-primary">
              {gasUrl ? 'Cloud Connected' : 'Local Database Active'}
            </span>
          </div>
        </div>

        {saveMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveUrl} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
              Google Apps Script Web App URL
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                className="w-full pl-4 pr-24 py-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-emerald-deep text-gold-champagne font-bold text-xs hover:bg-emerald-forest transition-colors shadow-xs"
              >
                Save URL
              </button>
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              The public web app and admin portal communicate securely with this Google Sheets backend endpoint.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !gasUrl}
              className="px-4 py-2 rounded-xl bg-gold-antique text-emerald-deep font-bold text-xs uppercase tracking-wider hover:brightness-105 disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <Server className="w-4 h-4" />
              <span>{testing ? 'Testing Endpoint...' : 'Test Connection'}</span>
            </button>

            {testResult && (
              <div className={`p-2 px-3 rounded-xl text-xs font-medium flex items-center space-x-1.5 ${
                testResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </form>

        {/* 4-Step Google Sheets Setup Instructions */}
        <div className="bg-ivory/60 rounded-2xl p-5 border border-gold-antique/30 space-y-3 text-xs">
          <h4 className="font-heading font-bold text-sm text-emerald-deep flex items-center space-x-2">
            <Info className="w-4 h-4 text-gold-dark" />
            <span>How to connect your official Google Sheet:</span>
          </h4>

          <ol className="list-decimal list-inside space-y-1.5 text-text-secondary pl-1 leading-relaxed">
            <li>Open <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-deep font-bold underline">Google Sheets</a> and create a new sheet named <strong>"Happy Parenting Database"</strong>.</li>
            <li>In the top menu, click <strong>Extensions &gt; Apps Script</strong>.</li>
            <li>Copy and paste the backend code from <code className="bg-white px-1.5 py-0.5 rounded border font-mono">google-apps-script/Code.gs</code>.</li>
            <li>Run the <code className="bg-white px-1.5 py-0.5 rounded border font-mono font-bold">setupDatabase()</code> function once to automatically create the 4 sheets and headers.</li>
            <li>Click <strong>Deploy &gt; New deployment</strong>, choose <strong>Web app</strong>, set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>.</li>
            <li>Paste your Web App URL into the input field above and click <strong>Save URL</strong>.</li>
          </ol>
        </div>

      </div>

      {/* ========================================================
          DATA MANAGEMENT & SAFETY CONTROLS
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card space-y-4">
        <div className="border-b border-gold-antique/20 pb-3">
          <h2 className="font-heading font-bold text-lg text-emerald-deep">
            Database Maintenance & Testing Tools
          </h2>
          <p className="text-xs text-text-secondary">
            Reset demo data for dress rehearsals or test runs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-surface border border-amber-warm/40">
          <div>
            <h4 className="font-bold text-sm text-amber-dark">Reset to Clean Demo State</h4>
            <p className="text-xs text-text-secondary max-w-md">
              Restores initial demonstration records (3 Student Parents and 2 Normal Guests) for presentation and testing.
            </p>
          </div>
          <button
            onClick={handleResetSeed}
            className="px-4 py-2 rounded-xl bg-amber-warm text-white font-bold text-xs uppercase tracking-wider hover:bg-amber-dark transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          ADMIN ACTIVITY AUDIT LOGS TABLE
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-gold-antique/20 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-burgundy-deep" />
            <h2 className="font-heading font-bold text-lg text-emerald-deep">
              Admin Activity Logs (Audit Trail)
            </h2>
          </div>
          <span className="text-xs text-text-muted">Total Events: {activityLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory/80 text-text-secondary uppercase text-[10px] font-bold border-b border-gold-antique/20">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Target ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-antique/10 font-mono text-[11px]">
              {activityLogs.slice(0, 25).map((log) => (
                <tr key={log.logId} className="hover:bg-ivory/40">
                  <td className="py-2 px-3 text-gold-dark font-bold">{log.logId}</td>
                  <td className="py-2 px-3 text-emerald-deep font-semibold">{log.adminId}</td>
                  <td className="py-2 px-3 font-sans text-text-primary">{log.action}</td>
                  <td className="py-2 px-3 text-burgundy-deep">{log.registrationId}</td>
                  <td className="py-2 px-3 text-text-muted">{log.date}</td>
                  <td className="py-2 px-3 text-text-muted">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
