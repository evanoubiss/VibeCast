
import React, { useState } from 'react';
import { ThemeType } from '../types';

interface LandingPageProps {
  onCreate: (name: string, theme: ThemeType, timer: number) => void;
  onJoin: (id: string, nickname: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreate, onJoin }) => {
  const [mode, setMode] = useState<'choice' | 'create' | 'join'>('choice');
  const [sessionName, setSessionName] = useState('Weekly Retrospective');
  const [joinCode, setJoinCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [theme, setTheme] = useState<ThemeType>('emoji');
  const [timer, setTimer] = useState(2);

  return (
    <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
          How's the <span className="text-indigo-600">Vibe</span> in your team today?
        </h2>
        <p className="text-xl text-slate-600">
          Gamify your team check-ins with visual themes, AI-powered mood synthesis, and interactive reveals.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => setMode('create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus-circle"></i> Create Session
          </button>
          <button 
            onClick={() => setMode('join')}
            className="bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2"
          >
            <i className="fas fa-user-plus"></i> Join Team
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        {mode === 'choice' && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl">
              <i className="fas fa-users-viewfinder"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Ready to start?</h3>
            <p className="text-slate-500">Select an option on the left to begin your VibeCast journey.</p>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Create Session</h3>
              <button onClick={() => setMode('choice')} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-1">Session Name</label>
              <input 
                type="text" 
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Sprint Check-in"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2">Choose Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setTheme('emoji')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'emoji' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}
                >
                  <span className="text-2xl">🤩</span>
                  <span className="font-bold">Emoji Pack</span>
                </button>
                <button 
                  onClick={() => setTheme('weather')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'weather' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}
                >
                  <span className="text-2xl">⛈️</span>
                  <span className="font-bold">Weather Pack</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-1">Timer (minutes)</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={timer}
                onChange={(e) => setTimer(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => onCreate(sessionName, theme, timer)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold mt-4 shadow-lg transition-all"
            >
              Launch VibeCast
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Join Session</h3>
              <button onClick={() => setMode('choice')} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-1">Session Code</label>
              <input 
                type="text" 
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-center text-xl tracking-widest"
                placeholder="A1B2C3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-1">Your Nickname</label>
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Who are you?"
              />
            </div>
            <button 
              onClick={() => onJoin(joinCode, nickname)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold mt-4 shadow-lg transition-all"
            >
              Join the Vibe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
