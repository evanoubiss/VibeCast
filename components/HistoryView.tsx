
import React from 'react';
import { Session } from '../types';
import { EMOJI_THEME, WEATHER_THEME } from '../constants';
import VibeCard from './VibeCard';
import { toPng } from 'html-to-image';

interface HistoryViewProps {
  history: Session[];
  onSelectSession: (s: Session) => void;
  onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectSession, onClear }) => {
  const downloadCard = async (session: Session) => {
    const node = document.getElementById(`vibe-card-hidden-${session.id}`);
    if (!node) return;
    
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `VibeCast-${session.name.replace(/\s+/g, '-')}-${new Date(session.startTime).toLocaleDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900">Vibe History</h2>
          <p className="text-slate-500">Your past team check-ins and insights.</p>
        </div>
        <button 
          onClick={onClear}
          className="text-red-500 hover:text-red-700 font-bold text-sm"
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-4">
        {history.map((s) => {
          const themeOptions = s.themeType === 'emoji' ? EMOJI_THEME : WEATHER_THEME;
          const moodCounts = s.votes.reduce((acc, vote) => {
            acc[vote.moodId] = (acc[vote.moodId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const dominantMoodId = Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
          const dominantMood = themeOptions.find(opt => opt.id === dominantMoodId);

          return (
            <div key={s.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="text-4xl w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                  {dominantMood?.icon || '❓'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
                  <p className="text-slate-500 text-sm">
                    {new Date(s.startTime).toLocaleDateString()} • {s.votes.length} Votes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => onSelectSession(s)}
                  className="flex-1 md:flex-none px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                >
                  <i className="fas fa-play mr-2"></i> Replay
                </button>
                <button 
                  onClick={() => downloadCard(s)}
                  className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  <i className="fas fa-download mr-2"></i> Card
                </button>
              </div>

              {/* Hidden Vibe Card for PNG Generation */}
              <div className="absolute left-[-9999px] top-[-9999px]">
                <div id={`vibe-card-hidden-${s.id}`}>
                  <VibeCard session={s} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
