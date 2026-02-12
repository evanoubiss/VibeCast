import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface DiagnosticInfo {
  supabaseConfigured: boolean;
  authStatus: 'checking' | 'success' | 'error';
  tablesExist: 'checking' | 'yes' | 'no' | 'error';
  sessionCount: number;
}

const DiagnosticPanel: React.FC = () => {
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState<DiagnosticInfo>({
    supabaseConfigured: isSupabaseConfigured,
    authStatus: 'checking',
    tablesExist: 'checking',
    sessionCount: 0
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      if (!isSupabaseConfigured) {
        setInfo(prev => ({ ...prev, authStatus: 'error', tablesExist: 'error' }));
        return;
      }

      // Test auth
      try {
        const { error: authError } = await supabase.auth.signInAnonymously();
        setInfo(prev => ({ ...prev, authStatus: authError ? 'error' : 'success' }));
      } catch {
        setInfo(prev => ({ ...prev, authStatus: 'error' }));
      }

      // Test tables
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('count')
          .limit(1);

        if (error) {
          setInfo(prev => ({ ...prev, tablesExist: error.code === '42P01' ? 'no' : 'error' }));
        } else {
          setInfo(prev => ({ ...prev, tablesExist: 'yes' }));
          
          // Get count
          const { count } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true });
          
          setInfo(prev => ({ ...prev, sessionCount: count || 0 }));
        }
      } catch {
        setInfo(prev => ({ ...prev, tablesExist: 'error' }));
      }
    };

    if (show) {
      runDiagnostics();
    }
  }, [show]);

  const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'checking') return <span className="text-gray-400">⏳</span>;
    if (status === 'success' || status === 'yes') return <span className="text-green-500">✓</span>;
    if (status === 'error' || status === 'no') return <span className="text-red-500">✗</span>;
    return <span>-</span>;
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-700 transition-all text-xs font-mono"
        title="Show diagnostics"
      >
        🔧 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-slate-800 rounded-xl shadow-2xl p-4 w-80 text-xs font-mono z-[9999]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">System Diagnostics</h3>
        <button
          onClick={() => setShow(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Supabase Config:</span>
          <span className={info.supabaseConfigured ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
            {info.supabaseConfigured ? 'YES' : 'NO (Offline)'}
          </span>
        </div>

        {info.supabaseConfigured && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Anonymous Auth:</span>
              <span className="flex items-center gap-1">
                <StatusIcon status={info.authStatus} />
                {info.authStatus === 'error' && <span className="text-red-600">FAILED</span>}
                {info.authStatus === 'success' && <span className="text-green-600">OK</span>}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">Database Tables:</span>
              <span className="flex items-center gap-1">
                <StatusIcon status={info.tablesExist} />
                {info.tablesExist === 'no' && <span className="text-red-600">MISSING</span>}
                {info.tablesExist === 'yes' && <span className="text-green-600">OK</span>}
                {info.tablesExist === 'error' && <span className="text-red-600">ERROR</span>}
              </span>
            </div>

            {info.tablesExist === 'yes' && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Cloud Sessions:</span>
                <span className="text-indigo-600 font-bold">{info.sessionCount}</span>
              </div>
            )}
          </>
        )}

        <div className="pt-2 mt-2 border-t border-slate-200">
          <div className="text-slate-500 text-[10px]">
            Local Storage: {localStorage.getItem('vibecast-sessions') ? 'Has data' : 'Empty'}
          </div>
        </div>

        {!info.supabaseConfigured && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-[10px]">
            <p className="text-amber-800 font-bold mb-1">Offline Mode Active</p>
            <p className="text-amber-700">Add .env.local with Supabase credentials to enable cloud sync.</p>
          </div>
        )}

        {info.tablesExist === 'no' && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-[10px]">
            <p className="text-red-800 font-bold mb-1">Database Not Set Up</p>
            <p className="text-red-700">Run setup-db.sql in Supabase SQL Editor.</p>
          </div>
        )}

        {info.authStatus === 'error' && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-[10px]">
            <p className="text-red-800 font-bold mb-1">Auth Failed</p>
            <p className="text-red-700">Enable anonymous auth in Supabase Dashboard.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => window.open('/TROUBLESHOOTING.md', '_blank')}
        className="mt-3 w-full bg-indigo-600 text-white py-1.5 rounded text-[10px] hover:bg-indigo-700 transition-all"
      >
        📖 View Troubleshooting Guide
      </button>
    </div>
  );
};

export default DiagnosticPanel;

