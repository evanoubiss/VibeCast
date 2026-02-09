
import React, { useState, useEffect } from 'react';
import { Session, Vote } from '../types';
import { generateMoodSummary } from '../services/geminiService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface FacilitatorViewProps {
  session: Session;
  onReveal: (summary: any) => void;
  onUpdateSession: (s: Session) => void;
}

const FacilitatorView: React.FC<FacilitatorViewProps> = ({ session, onReveal, onUpdateSession }) => {
  const [timeLeft, setTimeLeft] = useState(session.timerDuration * 60);
  const [isCompiling, setIsCompiling] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || session.status !== 'active') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, session.status]);

  // Real-time votes subscription (Only if Supabase is configured)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel(`votes-session-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newVote = payload.new as Vote;
          onUpdateSession({
            ...session,
            votes: [...session.votes.filter(v => v.nickname !== newVote.nickname), newVote]
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, onUpdateSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const simulateTeam = async () => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const moods = session.themeType === 'emoji' ? ['1', '2', '3', '4', '5', '6'] : ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
    const reasons = [
      "Great progress on the feature!",
      "Feeling a bit stuck on the API",
      "Meeting fatigue is real",
      "Excited for the weekend",
      "Coffee isn't working today",
      "Just finished a huge refactor"
    ];
    const kudos = [
      "Kudos to Bob for the pair programming!",
      "Alice saved my day with that fix",
      "",
      "Eve is crushing the designs",
      "",
      ""
    ];

    const mockVotes = names.map((name, i) => ({
      nickname: name,
      moodId: moods[Math.floor(Math.random() * moods.length)],
      reason: reasons[i],
      kudos: kudos[i],
      timestamp: Date.now(),
      session_id: session.id
    }));

    if (isSupabaseConfigured) {
      await supabase.from('votes').insert(mockVotes);
    } else {
      // Local simulation
      onUpdateSession({
        ...session,
        votes: [...session.votes, ...mockVotes.map((mv, i) => ({ ...mv, id: `mock-${i}` } as Vote))]
      });
    }
  };

  const handleReveal = async () => {
    if (session.votes.length === 0) {
      alert("Wait for some votes first!");
      return;
    }
    setIsCompiling(true);
    const summary = await generateMoodSummary(session);
    setIsCompiling(false);
    onReveal(summary);
  };

  const nudgeUsers = () => {
    alert("Nudging all participants who haven't submitted yet!");
  };

  return (
    <div className="w-full max-w-5xl space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900">{session.name}</h2>
          <p className="text-slate-500 font-medium">Host Dashboard • {session.votes.length} Votes Received</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
            <i className={`fas fa-hourglass-half ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`}></i>
            <span className="text-2xl font-mono font-bold tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={nudgeUsers}
            className="bg-amber-50 text-amber-700 px-6 py-4 rounded-2xl font-bold hover:bg-amber-100 transition-all flex items-center gap-2 border border-amber-200"
          >
            <i className="fas fa-bell"></i> Nudge
          </button>
          <button 
            disabled={isCompiling}
            onClick={handleReveal}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            {isCompiling ? (
              <><i className="fas fa-spinner animate-spin"></i> Compiling...</>
            ) : (
              <><i className="fas fa-rocket"></i> Trigger Reveal</>
            )}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Activity Feed</h3>
              <button 
                onClick={simulateTeam}
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 font-bold transition-all"
              >
                + Simulate Team
              </button>
            </div>
            {session.votes.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-inbox text-2xl"></i>
                </div>
                <p className="font-medium">Waiting for participants to join and vote...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {session.votes.map((vote, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl animate-fade-in border border-transparent hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 font-black text-indigo-600 shadow-sm">
                        {vote.nickname[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{vote.nickname}</p>
                        <p className="text-sm text-slate-500 italic">"{vote.reason || 'Keeping it private'}"</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Submitted
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
            <h3 className="text-xl font-black mb-6 relative z-10">Quick Tips</h3>
            <ul className="space-y-4 text-indigo-100 relative z-10">
              <li className="flex gap-3 text-sm font-medium">
                <i className="fas fa-check-circle mt-1 text-indigo-300"></i>
                Wait for at least 70% of the team before revealing.
              </li>
              <li className="flex gap-3 text-sm font-medium">
                <i className="fas fa-check-circle mt-1 text-indigo-300"></i>
                Use the "Nudge" button if the timer is low.
              </li>
              <li className="flex gap-3 text-sm font-medium">
                <i className="fas fa-check-circle mt-1 text-indigo-300"></i>
                Gemini will synthesize the vibe card automatically.
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
            <h3 className="text-lg font-black mb-3">Join Details</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Share the session code below with your team. They can join directly from the home page.
            </p>
            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center">
              <span className="font-mono font-black text-3xl text-indigo-700 tracking-widest">{session.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitatorView;
