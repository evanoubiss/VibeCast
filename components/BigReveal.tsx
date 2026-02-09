
import React, { useState, useEffect, useRef } from 'react';
import { Session } from '../types';
import { EMOJI_THEME, WEATHER_THEME } from '../constants';
import { toPng } from 'html-to-image';
import VibeCard from './VibeCard';

interface BigRevealProps {
  session: Session;
  onBack: () => void;
}

const BigReveal: React.FC<BigRevealProps> = ({ session, onBack }) => {
  const [showContent, setShowContent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [reactions, setReactions] = useState<{ id: number, icon: string, left: number }[]>([]);
  const reactionIdRef = useRef(0);
  
  const themeOptions = session.themeType === 'emoji' ? EMOJI_THEME : WEATHER_THEME;
  
  const moodCounts = session.votes.reduce((acc, vote) => {
    acc[vote.moodId] = (acc[vote.moodId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantMoodId = Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
  const dominantMood = themeOptions.find(o => o.id === dominantMoodId);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const addReaction = (icon: string) => {
    const id = ++reactionIdRef.current;
    const left = Math.random() * 80 + 10;
    setReactions(prev => [...prev, { id, icon, left }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const handleDownload = async () => {
    const node = document.getElementById('vibe-card-hidden');
    if (!node) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `VibeCast-${session.name.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden reveal-gradient">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {session.themeType === 'weather' && dominantMood?.id === 'w4' && (
          <div className="absolute inset-0 bg-blue-900/20 animate-pulse">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute bg-white/40 w-[1px] h-10 animate-bounce" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s` }} />
            ))}
          </div>
        )}
        {session.themeType === 'emoji' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} className="absolute text-6xl opacity-20 animate-spin" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${3 + Math.random() * 5}s` }}>🎉</span>
            ))}
          </div>
        )}
      </div>

      {!showContent ? (
        <div className="text-white text-center animate-bounce">
          <h2 className="text-6xl font-black mb-4">Brace Yourselves...</h2>
          <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white animate-progress w-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl glassmorphism rounded-[3rem] p-10 md:p-16 text-white text-center space-y-10 relative animate-fade-in shadow-2xl">
          <div className="space-y-4">
            <div className="text-9xl mb-4 animate-bounce drop-shadow-2xl">
              {dominantMood?.icon || '🤔'}
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              The Vibe is <span className="text-yellow-300">{dominantMood?.label || 'Unknown'}</span>
            </h2>
            <div className="flex justify-center gap-2">
              {session.votes.map((v, i) => (
                <div key={i} title={v.nickname} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-xs font-bold">
                  {v.nickname[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl font-medium leading-relaxed italic">
              "{session.aiSummary}"
            </p>
          </div>

          {session.aiAction && (
            <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md max-w-lg mx-auto transform hover:scale-105 transition-transform">
              <h4 className="text-sm font-black uppercase tracking-widest text-yellow-300 mb-2">VibeBot Nudge</h4>
              <p className="text-lg font-bold">💡 {session.aiAction}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <button 
              onClick={onBack}
              className="w-full md:w-auto px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <i className="fas fa-home"></i> Back Home
            </button>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full md:w-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white border border-white/20 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isDownloading ? (
                <><i className="fas fa-spinner animate-spin"></i> Generating...</>
              ) : (
                <><i className="fas fa-download"></i> Download Vibe Card</>
              )}
            </button>
          </div>

          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 p-4 bg-black/20 rounded-full backdrop-blur-xl border border-white/10">
            {['❤️', '🔥', '👏', '🙌', '🚀'].map(emoji => (
              <button key={emoji} onClick={() => addReaction(emoji)} className="text-2xl hover:scale-125 transition-transform p-2 active:scale-90">{emoji}</button>
            ))}
          </div>

          {reactions.map(r => (
            <div key={r.id} className="reaction-float text-4xl" style={{ left: `${r.left}%` }}>{r.icon}</div>
          ))}

          {/* Hidden Vibe Card for Export */}
          <div className="absolute left-[-9999px] top-[-9999px]">
            <div id="vibe-card-hidden">
              <VibeCard session={session} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigReveal;
