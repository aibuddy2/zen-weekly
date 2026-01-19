
export type DayName = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

export interface TaskItem {
  id: string;
  label: string;
  time: string;
  completed: boolean;
}

export type WeeklyData = Record<DayName, TaskItem[]>;
