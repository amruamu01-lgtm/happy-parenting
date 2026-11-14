import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Server,
  Activity,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminSettings() {
  const [gasUrl, setGasUrl] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
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
    setSaveMessage('ഗൂഗിൾ ആപ്സ് സ്ക്രിപ്റ്റ് URL വിജയകരമായി സേവ് ചെയ്തു.');
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

  return (
    <div className="space-y-8 font-malayalam">
      
      {/* Settings Header - Main Heading in English */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-0.5 rounded-full bg-emerald-forest/10 text-emerald-deep font-bold text-xs uppercase tracking-wider border border-emerald-deep/20 font-sans">
            System Config
          </span>
          <span className="text-xs text-text-muted">ക്ലൗഡ് ഡാറ്റാബേസും സുരക്ഷയും</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-emerald-deep mt-1">
          Settings & Cloud Synchronization
        </h1>
        <p className="text-xs text-text-secondary">
          ഗൂഗിൾ ഷീറ്റ്സ് ബാക്കെൻഡ് കണക്ഷൻ സജ്ജീകരിക്കുകയും അഡ്മിൻ ആക്ടിവിറ്റി ലോഗുകൾ പരിശോധിക്കുകയും ചെയ്യുക.
        </p>
      </div>

      {/* Google Sheets Connection Configuration */}
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
                ഗൂഗിൾ ആപ്സ് സ്ക്രിപ്റ്റ് വെബ് ആപ്പ് URL
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full animate-pulse ${gasUrl ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-xs font-semibold text-text-primary">
              {gasUrl ? 'ക്ലൗഡ് കണക്റ്റഡ്' : 'ലോക്കൽ ഡാറ്റാബേസ്'}
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
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              ഗൂഗിൾ ആപ്സ് സ്ക്രിപ്റ്റ് വെബ് ആപ്പ് URL (Google Apps Script Web App URL)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                className="w-full pl-4 pr-28 py-3 rounded-xl border border-gold-antique/40 bg-ivory/30 text-xs text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-emerald-deep focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-emerald-deep text-gold-champagne font-bold text-xs hover:bg-emerald-forest transition-colors shadow-xs"
              >
                സേവ് ചെയ്യുക
              </button>
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              പബ്ലിക് വെബ്‌സൈറ്റും അഡ്മിൻ പാനലും ഈ ഗൂഗിൾ ഷീറ്റ്സ് എൻഡ്പോയിന്റ് വഴിയാണ് പ്രവർത്തിക്കുന്നത്.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !gasUrl}
              className="px-4 py-2 rounded-xl bg-gold-antique text-emerald-deep font-bold text-xs hover:brightness-105 disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <Server className="w-4 h-4" />
              <span>{testing ? 'പരിശോധിക്കുന്നു...' : 'കണക്ഷൻ പരിശോധിക്കുക (Test Connection)'}</span>
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
            <span>ഗൂഗിൾ ഷീറ്റിലേക്ക് കണക്റ്റ് ചെയ്യുന്ന വിധം:</span>
          </h4>

          <ol className="list-decimal list-inside space-y-1.5 text-text-secondary pl-1 leading-relaxed">
            <li><a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-deep font-bold underline">Google Sheets</a> തുറന്ന് <strong>"Happy Parenting Database"</strong> എന്ന പേരിൽ പുതിയൊരു ഷീറ്റ് ഉണ്ടാക്കുക.</li>
            <li>മുകളിലെ മെനുവിൽ നിന്നും <strong>Extensions &gt; Apps Script</strong> ക്ലിക്ക് ചെയ്യുക.</li>
            <li><code className="bg-white px-1.5 py-0.5 rounded border font-mono">google-apps-script/Code.gs</code> ഫയലിലെ കോഡ് പൂർണ്ണമായും കോപ്പി ചെയ്ത് പേസ്റ്റ് ചെയ്യുക.</li>
            <li>ടൂൾബാറിൽ നിന്നും <code className="bg-white px-1.5 py-0.5 rounded border font-mono font-bold">setupDatabase</code> തിരഞ്ഞെടുത്ത് <strong>Run</strong> ചെയ്യുക (ഇത് 4 ഷീറ്റുകളും ഹെഡറുകളും ഓട്ടോമാറ്റിക് ആയി ഉണ്ടാക്കും).</li>
            <li><strong>Deploy &gt; New deployment</strong> ക്ലിക്ക് ചെയ്ത്, <em>Web app</em> തിരഞ്ഞെടുക്കുക. <em>Execute as: Me</em> എന്നും <em>Who has access: Anyone</em> എന്നും നൽകി ഡിപ്ലോയ് ചെയ്യുക.</li>
            <li>ലഭിക്കുന്ന Web App URL മുകളിലെ ബോക്സിൽ പേസ്റ്റ് ചെയ്ത് <strong>സേവ് ചെയ്യുക</strong>.</li>
          </ol>
        </div>

      </div>

      {/* Admin Activity Logs Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gold-antique/30 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-gold-antique/20 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-burgundy-deep" />
            <h2 className="font-heading font-bold text-lg text-emerald-deep">
              Admin Activity Logs
            </h2>
          </div>
          <span className="text-xs text-text-muted">ആകെ രേഖകൾ: {activityLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory/80 text-text-secondary uppercase text-[10px] font-bold border-b border-gold-antique/20">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">ഓപ്പറേറ്റർ</th>
                <th className="py-2.5 px-3">നടപടി (Action)</th>
                <th className="py-2.5 px-3">Target ID</th>
                <th className="py-2.5 px-3">തീയതി</th>
                <th className="py-2.5 px-3">സമയം</th>
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
