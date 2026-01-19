
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DAYS, INITIAL_HABITS_TEMPLATE, LOCAL_STORAGE_KEY } from './constants';
import { DayName, TaskItem, WeeklyData } from './types';
import DailyCard from './components/DailyCard';
import ProgressBar from './components/ProgressBar';
import Timer from './components/Timer';

const App: React.FC = () => {
  const [data, setData] = useState<WeeklyData>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    }
    
    const initial: Partial<WeeklyData> = {};
    DAYS.forEach(day => {
      initial[day] = INITIAL_HABITS_TEMPLATE.map((h, i) => ({
        id: `init-${day}-${i}-${Date.now()}-${Math.random()}`,
        label: h.label,
        time: h.time,
        completed: false
      }));
    });
    return initial as WeeklyData;
  });

  const todayIndex = (new Date().getDay() + 6) % 7;
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const toggleTask = useCallback((day: DayName, taskId: string) => {
    setData(prev => ({
      ...prev,
      [day]: prev[day].map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  }, []);

  const addTask = useCallback((day: DayName, label: string, time: string) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random()}`,
      label,
      time: time || '--:--',
      completed: false
    };
    setData(prev => ({
      ...prev,
      [day]: [...prev[day], newTask]
    }));
  }, []);

  const deleteTask = useCallback((day: DayName, taskId: string) => {
    setData(prev => ({
      ...prev,
      [day]: prev[day].filter(task => task.id !== taskId)
    }));
  }, []);

  const resetProgress = useCallback(() => {
    if (window.confirm('Reset all checkboxes for the week? (Your habit list will remain unchanged)')) {
      setData(prev => {
        const nextData = { ...prev };
        DAYS.forEach(day => {
          nextData[day] = nextData[day].map(task => ({ ...task, completed: false }));
        });
        return nextData;
      });
    }
  }, []);

  const stats = useMemo(() => {
    let totalTasks = 0;
    let totalCompleted = 0;
    
    const dayPercentages = DAYS.reduce((acc, day) => {
      const dayTasks = data[day] || [];
      const completed = dayTasks.filter(t => t.completed).length;
      totalTasks += dayTasks.length;
      totalCompleted += completed;
      acc[day] = dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0;
      return acc;
    }, {} as Record<DayName, number>);

    const weeklyPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return { dayPercentages, weeklyPercentage };
  }, [data]);

  const selectedDayName = DAYS[selectedDayIndex];
  const currentDayName = DAYS[todayIndex];

  const goToPrevDay = () => setSelectedDayIndex(prev => (prev === 0 ? 6 : prev - 1));
  const goToNextDay = () => setSelectedDayIndex(prev => (prev === 6 ? 0 : prev + 1));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 flex flex-col lg:flex-row items-start justify-between gap-8">
        <div className="flex-1 w-full lg:w-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">ZenWeekly</h1>
          <p className="text-slate-400 text-xl mb-8">Discipline is the bridge between goals and accomplishment.</p>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weekly Score</span>
                <span className="text-2xl font-black text-emerald-400">{stats.weeklyPercentage}%</span>
              </div>
              <ProgressBar progress={stats.weeklyPercentage} size="lg" color="emerald" />
            </div>
            <button 
              onClick={resetProgress}
              className="w-full md:w-auto px-8 py-3 bg-slate-800 hover:bg-rose-900/30 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 rounded-2xl font-bold transition-all active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        <Timer />
      </header>

      {/* Day Selector Tabs */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 overflow-x-auto max-w-full custom-scrollbar">
          {DAYS.map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                selectedDayIndex === idx 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Day View Navigation */}
      <div className="relative group">
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={goToPrevDay}
            className="hidden md:flex p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:border-indigo-500 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <DailyCard
              day={selectedDayName}
              isToday={selectedDayName === currentDayName}
              tasks={data[selectedDayName] || []}
              percentage={stats.dayPercentages[selectedDayName]}
              onToggle={(id) => toggleTask(selectedDayName, id)}
              onDelete={(id) => deleteTask(selectedDayName, id)}
              onAdd={(label, time) => addTask(selectedDayName, label, time)}
            />
          </div>

          <button 
            onClick={goToNextDay}
            className="hidden md:flex p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:border-indigo-500 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div className="flex md:hidden justify-between mt-6 gap-4">
          <button 
            onClick={goToPrevDay}
            className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 font-bold active:bg-slate-800"
          >
            Previous
          </button>
          <button 
            onClick={goToNextDay}
            className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 font-bold active:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>

      <footer className="mt-20 text-center text-slate-700 text-sm border-t border-slate-900 pt-8">
        <p>Built for personal growth. Data stored locally on your device.</p>
      </footer>
    </div>
  );
};

export default App;
