
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
    
    // Initial load: Each day gets a fresh copy of the template
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

  const currentDayName = DAYS[(new Date().getDay() + 6) % 7];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 flex flex-col lg:flex-row items-start justify-between gap-8">
        <div className="flex-1 w-full lg:w-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">ZenWeekly</h1>
          <p className="text-slate-400 text-xl mb-8">Discipline is the bridge between goals and accomplishment.</p>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weekly Discipline Score</span>
                <span className="text-2xl font-black text-emerald-400">{stats.weeklyPercentage}%</span>
              </div>
              <ProgressBar progress={stats.weeklyPercentage} size="lg" color="emerald" />
            </div>
            <button 
              onClick={resetProgress}
              className="w-full md:w-auto px-8 py-3 bg-slate-800 hover:bg-rose-900/30 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 rounded-2xl font-bold transition-all active:scale-95"
            >
              Reset Week
            </button>
          </div>
        </div>

        <Timer />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {DAYS.map((day) => (
          <DailyCard
            key={day}
            day={day}
            isToday={day === currentDayName}
            tasks={data[day] || []}
            percentage={stats.dayPercentages[day]}
            onToggle={(id) => toggleTask(day, id)}
            onDelete={(id) => deleteTask(day, id)}
            onAdd={(label, time) => addTask(day, label, time)}
          />
        ))}
      </div>

      <footer className="mt-20 text-center text-slate-700 text-sm border-t border-slate-900 pt-8">
        <p>Built for personal growth. Data stored locally on your device.</p>
      </footer>
    </div>
  );
};

export default App;
