
import React, { useState, useEffect } from 'react';
import { Session, Vote, ThemeType } from './types';
import { APP_STORAGE_KEY } from './constants';
import FacilitatorView from './components/FacilitatorView';
import ParticipantView from './components/ParticipantView';
import BigReveal from './components/BigReveal';
import LandingPage from './components/LandingPage';
import HistoryView from './components/HistoryView';
import DiagnosticPanel from './components/DiagnosticPanel';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'facilitator' | 'participant' | 'reveal' | 'history'>('landing');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<Session[]>([]);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Auth and initial fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // Load local history first as a fallback
      const localSaved = localStorage.getItem(APP_STORAGE_KEY);
      let localHistory: Session[] = [];
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          localHistory = Array.isArray(parsed) ? parsed : [parsed];
          setHistory(localHistory);
        } catch (e) {
          console.error("Failed to load local history", e);
        }
      }

      if (isSupabaseConfigured) {
        try {
          // Try to sign in anonymously
          const { error: authError } = await supabase.auth.signInAnonymously();
          if (authError) {
            console.error("Anonymous auth error:", authError);
            console.warn("⚠️ Check that anonymous auth is enabled in Supabase Dashboard");
          }
          
          // Fetch history from Supabase
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('sessions')
            .select('*, votes (*)')
            .order('startTime', { ascending: false });

          if (sessionsData) {
            console.log(`✓ Loaded ${sessionsData.length} session(s) from cloud`);
            setHistory(sessionsData.map((s: any) => ({
              ...s,
              votes: s.votes || []
            })));
          } else if (sessionsError) {
            console.error("Supabase fetch error:", sessionsError);
            if (sessionsError.code === '42P01') {
              console.warn("⚠️ Database tables not found. Please run setup-db.sql in Supabase SQL Editor");
            } else {
              console.warn(`⚠️ Cloud sync unavailable: ${sessionsError.message}`);
            }
            // Keep using local history as fallback
          }
        } catch (e) {
          console.error("Supabase initialization failed:", e);
          console.warn("⚠️ Running with local storage only");
        }
      }
      
      setLoading(false);
    };

    init();
  }, []);

  // Persist to local storage as fallback
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const session = history.find(s => s.id === currentSessionId) || null;

  const createSession = async (name: string, theme: ThemeType, timer: number) => {
    const newSession: Session = {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      name,
      themeType: theme,
      startTime: Date.now(),
      timerDuration: timer,
      status: 'active',
      votes: []
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .insert([{
            id: newSession.id,
            name: newSession.name,
            themeType: newSession.themeType,
            startTime: newSession.startTime,
            timerDuration: newSession.timerDuration,
            status: newSession.status
          }])
          .select()
          .single();

        if (error) {
          console.error("Supabase session creation error:", error);
          if (error.code === '42P01') {
            setError("⚠️ Database not set up! Run setup-db.sql in Supabase. Session saved locally only.");
          } else {
            setError(`⚠️ Cloud sync failed: ${error.message}. Session saved locally only.`);
          }
          setTimeout(() => setError(''), 5000);
        } else {
          console.log("✓ Session created and synced to cloud:", newSession.id);
        }
      } catch (e) {
        console.error("Session creation error:", e);
        setError("⚠️ Cloud sync failed. Session saved locally only.");
        setTimeout(() => setError(''), 5000);
      }
    }

    setHistory(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setView('facilitator');
  };

  const joinSession = async (id: string, name: string) => {
    setNickname(name);
    
    if (isSupabaseConfigured) {
      try {
        const { data: found, error } = await supabase
          .from('sessions')
          .select('*, votes (*)')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Join session Supabase error:", error);
          // Check if it's a table doesn't exist error or policy error
          if (error.code === '42P01') {
            setError("Database not set up. Please run setup-db.sql in Supabase.");
          } else if (error.code === 'PGRST116') {
            // No rows returned - session doesn't exist in DB
            console.log("Session not in database, checking local history...");
          } else {
            setError(`Database error: ${error.message}`);
            setTimeout(() => setError(''), 5000);
          }
        }

        if (found) {
          const fullSession = { ...found, votes: found.votes || [] };
          setCurrentSessionId(id);
          if (!history.find(h => h.id === id)) {
            setHistory(prev => [fullSession, ...prev]);
          }
          setView('participant');
          return;
        }
      } catch (e) {
        console.error("Join session error:", e);
        setError(`Connection error: ${e instanceof Error ? e.message : 'Unknown error'}`);
        setTimeout(() => setError(''), 5000);
      }
    }

    // Fallback to local history
    const localFound = history.find(s => s.id === id);
    if (localFound) {
      setCurrentSessionId(id);
      setView('participant');
    } else {
      const mode = isSupabaseConfigured ? "cloud and local storage" : "local storage only (offline mode)";
      setError(`Session "${id}" not found in ${mode}. Verify the code is correct.`);
      setTimeout(() => setError(''), 5000);
    }
  };

  const updateSession = async (updated: Session) => {
    setHistory(prev => prev.map(s => s.id === updated.id ? updated : s));

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('sessions')
        .update({
          status: updated.status,
          aiSummary: updated.aiSummary,
          aiAction: updated.aiAction
        })
        .eq('id', updated.id);
      
      if (error) console.error("Supabase update error:", error);
    }
  };

  const handleVote = async (vote: Vote) => {
    if (!session) return;
    
    const newVotes = [...session.votes.filter(v => v.nickname !== vote.nickname), vote];
    setHistory(prev => prev.map(s => s.id === session.id ? { ...s, votes: newVotes } : s));

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('votes')
        .insert([{
          ...vote,
          session_id: session.id
        }]);
      
      if (error) {
        console.error("Supabase vote insert error:", error);
        console.warn("⚠️ Vote saved locally but not synced to cloud");
      } else {
        console.log("✓ Vote synced to cloud");
      }
    }
  };

  const triggerReveal = async (summary: any) => {
    if (!session) return;
    const updated = { 
      ...session, 
      status: 'revealing' as const,
      aiSummary: summary.summary,
      aiAction: summary.actionableTip
    };
    await updateSession(updated);
    setView('reveal');
  };

  const goHome = () => {
    setView('landing');
    setCurrentSessionId(null);
  };

  const clearAllHistory = async () => {
    if (confirm("Clear all session history?")) {
      if (isSupabaseConfigured) {
        await supabase.from('sessions').delete().neq('id', '0');
      }
      setHistory([]);
      goHome();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-bold">Connecting to VibeCast...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 transition-all duration-500">
      {!isSupabaseConfigured && (
        <div className="bg-amber-500 text-white text-[10px] py-1 px-4 text-center font-bold tracking-widest uppercase z-[100]">
          Running in Offline/Local Mode • Cloud Sync Disabled
        </div>
      )}
      <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={goHome}>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg transition-transform group-hover:scale-110">
              <i className="fas fa-satellite-dish"></i>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-indigo-900">VibeCast</h1>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={goHome}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${view === 'landing' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <i className="fas fa-home"></i>
              <span className="hidden sm:inline">Home</span>
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${view === 'history' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <i className="fas fa-history"></i>
              <span className="hidden sm:inline">History</span>
            </button>
            {session && (view === 'facilitator' || view === 'participant' || view === 'reveal') && (
              <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
            )}
            {session && (view === 'facilitator' || view === 'participant' || view === 'reveal') && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-black text-slate-600">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isSupabaseConfigured ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                SESSION: {session.id}
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {error && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 animate-bounce shadow-lg">
            {error}
          </div>
        )}

        {view === 'landing' && (
          <LandingPage onCreate={createSession} onJoin={joinSession} />
        )}

        {view === 'history' && (
          <HistoryView 
            history={history} 
            onSelectSession={(s) => {
              setCurrentSessionId(s.id);
              setView('reveal');
            }}
            onClear={clearAllHistory}
          />
        )}

        {view === 'facilitator' && session && (
          <FacilitatorView 
            session={session} 
            onReveal={triggerReveal} 
            onUpdateSession={updateSession}
          />
        )}

        {view === 'participant' && session && (
          <ParticipantView 
            session={session} 
            nickname={nickname} 
            onVote={handleVote}
          />
        )}

        {view === 'reveal' && session && (
          <BigReveal session={session} onBack={goHome} />
        )}
      </main>

      <footer className="p-4 text-center text-slate-400 text-xs border-t bg-white">
        © 2024 VibeCast Team Mood Tracker • Powered by Gemini AI
      </footer>

      <DiagnosticPanel />
    </div>
  );
};

export default App;
