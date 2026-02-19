
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService';

interface FocusTimerProps {
  onSessionComplete?: (duration: number) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialDuration, setInitialDuration] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [aiTip, setAiTip] = useState("Preparing your session...");
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to avoid namespace issues in browser environment
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('zenflow_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.focusDuration) {
        const dur = parsed.focusDuration * 60;
        setInitialDuration(dur);
        setTimeLeft(dur);
      }
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (onSessionComplete) onSessionComplete(initialDuration);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, onSessionComplete, initialDuration]);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await gemini.getFocusRecommendation("General Knowledge Worker Focus");
      setAiTip(tip || "Eliminate distractions for deep work.");
    };
    fetchTip();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialDuration);
  };

  const progress = ((initialDuration - timeLeft) / initialDuration) * 283;

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen bg-background-dark overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <div className="relative flex items-center justify-center mb-12">
          <svg className="size-[320px] md:size-[480px] -rotate-90 transform timer-glow" viewBox="0 0 100 100">
            <circle className="text-border-dark" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="2" />
            <circle 
              className="text-primary transition-all duration-300" 
              cx="50" cy="50" fill="none" r="45" stroke="currentColor" 
              strokeWidth="2" strokeDasharray="283" strokeDashoffset={283 - progress}
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-7xl md:text-9xl font-thin tracking-tighter tabular-nums text-white">
              {formatTime(timeLeft)}
            </span>
            <span className="mt-4 text-xs font-black tracking-widest uppercase text-primary/80">Growth Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTimer}
            className="flex items-center gap-2 h-16 px-10 rounded-full bg-surface-dark text-white font-bold hover:bg-border-dark transition-all active:scale-95 shadow-xl shadow-black/40"
          >
            <span className="material-symbols-outlined">{isActive ? 'pause' : 'play_arrow'}</span>
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>
          <button 
            onClick={resetTimer}
            className="flex items-center justify-center size-16 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      <aside className="w-full lg:w-[400px] border-l border-border-dark bg-surface-dark/30 backdrop-blur-md p-10 flex flex-col gap-10 z-10">
        <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-white font-black">
                 <span className="material-symbols-outlined text-primary">eco</span>
                 DEEP WORK MODE
              </div>
              <p className="text-xs text-text-secondary">AI noise cancellation active</p>
           </div>
           <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked readOnly />
              <div className="w-11 h-6 bg-border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
           </div>
        </div>

        <div>
           <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-4">Daily AI Tip</h3>
           <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-white italic">
              "{aiTip}"
           </div>
        </div>

        <div className="mt-auto p-4 rounded-full bg-surface-dark border border-border-dark flex items-center justify-between gap-4">
           <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-cover bg-center animate-[spin_10s_linear_infinite]" style={{backgroundImage: `url(https://picsum.photos/seed/ambient/200)`}}></div>
              <div className="flex flex-col">
                 <span className="text-sm font-black text-white">Forest Rain</span>
                 <span className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter">Ambient Audio</span>
              </div>
           </div>
           <div className="flex items-center gap-4 pr-2 text-text-secondary">
              <span className="material-symbols-outlined hover:text-white cursor-pointer">skip_previous</span>
              <span className="material-symbols-outlined hover:text-white cursor-pointer text-3xl">pause_circle</span>
              <span className="material-symbols-outlined hover:text-white cursor-pointer">skip_next</span>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default FocusTimer;
