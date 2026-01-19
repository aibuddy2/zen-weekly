
import React, { useState, useEffect, useRef } from 'react';

const PRESETS = {
  WORK: 25 * 60,
  SHORT: 5 * 60,
  LONG: 15 * 60
};

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(PRESETS.WORK);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'WORK' | 'SHORT' | 'LONG'>('WORK');
  // Fixed error: Cannot find namespace 'NodeJS'. Using number for browser-side setInterval.
  const timerRef = useRef<number | null>(null);

  const totalTime = PRESETS[mode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // Explicitly using window.setInterval to ensure it returns a number in browser environments
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playAlarm();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const playAlarm = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = (newMode?: 'WORK' | 'SHORT' | 'LONG') => {
    const selectedMode = newMode || mode;
    setIsActive(false);
    setMode(selectedMode);
    setTimeLeft(PRESETS[selectedMode]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 min-w-[280px]">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Progress Circle */}
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-800"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            className="text-indigo-500 transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="text-3xl font-mono font-bold text-white relative z-10">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-2">
        {(['WORK', 'SHORT', 'LONG'] as const).map((m) => (
          <button
            key={m}
            onClick={() => resetTimer(m)}
            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter transition-all ${
              mode === m ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {m === 'WORK' ? 'Focus' : m === 'SHORT' ? 'Short' : 'Long'}
          </button>
        ))}
      </div>

      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            isActive 
              ? 'bg-slate-800 text-slate-200 border border-slate-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={() => resetTimer()}
          className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Timer;
