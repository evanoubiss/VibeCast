
import React, { useState } from 'react';
import { Session, Vote, MoodOption } from '../types';
import { EMOJI_THEME, WEATHER_THEME } from '../constants';

interface ParticipantViewProps {
  session: Session;
  nickname: string;
  onVote: (v: Vote) => void;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ session, nickname, onVote }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [kudos, setKudos] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const themeOptions = session.themeType === 'emoji' ? EMOJI_THEME : WEATHER_THEME;

  const handleSubmit = () => {
    if (!selectedMood) return;
    const vote: Vote = {
      id: Math.random().toString(),
      nickname,
      moodId: selectedMood,
      reason,
      kudos,
      timestamp: Date.now()
    };
    onVote(vote);
    setHasVoted(true);
  };

  if (hasVoted) {
    return (
      <div className="text-center space-y-8 animate-pulse">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-lg">
          <i className="fas fa-check"></i>
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900">Vibe Submitted!</h2>
          <p className="text-slate-500 mt-2 text-xl">Waiting for the host to trigger the big reveal...</p>
        </div>
        <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-slate-100 shadow-xl">
          <p className="text-slate-600 italic">"Patience is the bridge between submission and celebration."</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900">Hey, {nickname}!</h2>
        <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mt-1">Session: {session.name}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center">Pick your vibe</h3>
        <div className="grid grid-cols-3 gap-4">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedMood(opt.id)}
              className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all transform active:scale-95 ${
                selectedMood === opt.id 
                ? 'border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-50' 
                : 'border-slate-50 hover:border-slate-200'
              }`}
            >
              <span className="text-4xl">{opt.icon}</span>
              <span className="text-sm font-bold text-slate-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-500 mb-1">Reason (Optional)</label>
          <textarea 
            maxLength={140}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Why this mood? (max 140 chars)"
            rows={2}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-500 mb-1">Give Kudos! (Optional)</label>
          <input 
            type="text"
            value={kudos}
            onChange={(e) => setKudos(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Who was a legend this week?"
          />
        </div>
      </div>

      <button
        disabled={!selectedMood}
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
      >
        <i className="fas fa-paper-plane"></i> Submit Vibe
      </button>
    </div>
  );
};

export default ParticipantView;
