
import React from 'react';
import { Session } from '../types';
import { EMOJI_THEME, WEATHER_THEME } from '../constants';

interface VibeCardProps {
  session: Session;
}

const VibeCard: React.FC<VibeCardProps> = ({ session }) => {
  const themeOptions = session.themeType === 'emoji' ? EMOJI_THEME : WEATHER_THEME;
  const moodCounts = session.votes.reduce((acc, vote) => {
    acc[vote.moodId] = (acc[vote.moodId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantMoodId = Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
  const dominantMood = themeOptions.find(opt => opt.id === dominantMoodId);
  const kudosList = session.votes.filter(v => v.kudos && v.kudos.trim() !== '').map(v => v.kudos);

  return (
    <div 
      className="w-[800px] bg-white text-slate-900 overflow-hidden relative"
      style={{ minHeight: '500px' }}
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-bl-full opacity-5"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400 rounded-tr-full opacity-10"></div>
      
      <div className="p-12 relative z-10 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-indigo-900">VibeCast</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              {new Date(session.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-sm border border-indigo-100">
            ID: {session.id}
          </div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="text-[120px] drop-shadow-xl animate-bounce">
            {dominantMood?.icon || '✨'}
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-800">{session.name}</h2>
            <p className="text-2xl font-bold text-indigo-600 italic leading-snug">
              The overall vibe was {dominantMood?.label || 'Incredible'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
           <i className="fas fa-quote-left absolute top-4 left-4 text-slate-200 text-3xl"></i>
           <p className="text-2xl font-medium leading-relaxed italic text-slate-700 px-4">
             {session.aiSummary || "Today's energy was unique! The team shared insights and looked forward to the next challenge."}
           </p>
        </div>

        {kudosList.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-tighter text-slate-400">Team Kudos</h3>
            <div className="flex flex-wrap gap-2">
              {kudosList.slice(0, 5).map((k, i) => (
                <div key={i} className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-full font-bold text-sm">
                  ⭐ {k}
                </div>
              ))}
              {kudosList.length > 5 && (
                <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-full font-bold text-sm">
                  + {kudosList.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-400 text-sm font-bold">
           <span>{session.votes.length} Participants shared their mood</span>
           <span className="text-indigo-600">vibecast.app</span>
        </div>
      </div>
    </div>
  );
};

export default VibeCard;
