
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
    <div className={`flex flex-col h-full bg-slate-900 border-2 ${isToday ? 'border-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]' : 'border-slate-800'} rounded-[2.5rem] p-6 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={`text-2xl font-black ${isToday ? 'text-emerald-400' : 'text-slate-100'}`}>
            {day}
          </h3>
          {isToday && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Today</span>}
        </div>
        <div className="text-right">
          <div className={`text-xl font-mono font-bold ${percentage === 100 ? 'text-emerald-400' : 'text-slate-500'}`}>
            {percentage}%
          </div>
        </div>
      </div>

      <div className="mb-8">
        <ProgressBar progress={percentage} size="md" color={isToday ? "emerald" : "indigo"} />
      </div>

      <div className="flex-1 space-y-3 custom-scrollbar overflow-y-auto pr-1 min-h-[200px]">
        {tasks.map((task) => (
          <div key={task.id} className="group relative flex items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors">
            <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
              <div className="relative flex items-center shrink-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="peer h-6 w-6 appearance-none rounded-lg border-2 border-slate-800 bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                />
                <svg className="absolute h-4 w-4 text-emerald-950 pointer-events-none hidden peer-checked:block left-1 top-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-sm font-bold transition-all truncate ${task.completed ? 'text-slate-700 line-through decoration-slate-500' : 'text-slate-200'}`}>
                  {task.label}
                </span>
                <span className={`text-[10px] font-mono tracking-wide ${task.completed ? 'text-slate-800' : 'text-slate-500'}`}>
                  {task.time}
                </span>
              </div>
            </label>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-40 group-hover:opacity-100"
              title="Delete habit"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        
        {tasks.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <p className="text-xs text-slate-600 font-medium italic">No habits for this day.</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isAdding ? (
          <form onSubmit={handleAdd} className="space-y-3 bg-slate-950 p-4 rounded-3xl border border-indigo-500/30 animate-in fade-in zoom-in duration-200">
            <input
              autoFocus
              type="text"
              placeholder="Habit name..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 focus:ring-0 outline-none transition-all"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Time (e.g. 06:00 AM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors">
                Add
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-3xl border-2 border-dashed border-slate-800 hover:border-slate-600 flex items-center justify-center gap-2 text-xs font-bold transition-all group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Add Daily Habit
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyCard;
