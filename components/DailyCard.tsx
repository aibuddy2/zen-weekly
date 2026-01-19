
import React, { useState } from 'react';
import { DayName, TaskItem } from '../types';
import ProgressBar from './ProgressBar';

interface DailyCardProps {
  day: DayName;
  isToday: boolean;
  tasks: TaskItem[];
  percentage: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (label: string, time: string) => void;
}

const DailyCard: React.FC<DailyCardProps> = ({ 
  day, 
  isToday, 
  tasks, 
  percentage, 
  onToggle,
  onDelete,
  onAdd 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onAdd(newLabel, newTime);
    setNewLabel('');
    setNewTime('');
    setIsAdding(false);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 border-2 ${isToday ? 'border-emerald-500 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]' : 'border-slate-800'} rounded-[3rem] p-8 md:p-10 transition-all duration-300 max-w-2xl mx-auto w-full`}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className={`text-4xl font-black tracking-tight ${isToday ? 'text-emerald-400' : 'text-slate-100'}`}>
            {day}
          </h3>
          {isToday && <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] block mt-1">Focus on Today</span>}
        </div>
        <div className="text-right">
          <div className={`text-3xl font-mono font-bold ${percentage === 100 ? 'text-emerald-400' : 'text-slate-600'}`}>
            {percentage}%
          </div>
        </div>
      </div>

      <div className="mb-10">
        <ProgressBar progress={percentage} size="lg" color={isToday ? "emerald" : "indigo"} />
      </div>

      <div className="flex-1 space-y-4 custom-scrollbar overflow-y-auto pr-2 min-h-[350px]">
        {tasks.map((task) => (
          <div key={task.id} className="group relative flex items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-3xl border border-slate-800/50 hover:border-slate-600 transition-all duration-200">
            <label className="flex items-center gap-4 cursor-pointer flex-1 min-w-0">
              <div className="relative flex items-center shrink-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="peer h-8 w-8 appearance-none rounded-xl border-2 border-slate-800 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                />
                <svg className="absolute h-5 w-5 text-emerald-950 pointer-events-none hidden peer-checked:block left-1.5 top-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-lg font-bold transition-all truncate ${task.completed ? 'text-slate-700 line-through decoration-slate-500' : 'text-slate-100'}`}>
                  {task.label}
                </span>
                <span className={`text-xs font-mono tracking-wide ${task.completed ? 'text-slate-800' : 'text-slate-500'}`}>
                  {task.time}
                </span>
              </div>
            </label>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-3 text-slate-800 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
              title="Delete habit"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        
        {tasks.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
            </div>
            <p className="text-sm text-slate-600 font-medium">No habits scheduled for this day.</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        {isAdding ? (
          <form onSubmit={handleAdd} className="space-y-4 bg-slate-950 p-6 rounded-[2rem] border border-indigo-500/30 animate-in fade-in zoom-in duration-300">
            <input
              autoFocus
              type="text"
              placeholder="Habit name..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-white focus:border-indigo-500 focus:ring-0 outline-none transition-all placeholder:text-slate-600"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Time (e.g. 06:00 AM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-400 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
              />
              <div className="flex gap-2 shrink-0">
                <button type="submit" className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-colors">
                  Add Habit
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="p-3 text-slate-500 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-6 bg-slate-800/30 hover:bg-slate-800/60 text-slate-500 hover:text-white rounded-[2rem] border-2 border-dashed border-slate-800 hover:border-slate-600 flex items-center justify-center gap-3 text-sm font-bold transition-all group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Add New Daily Habit
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyCard;
