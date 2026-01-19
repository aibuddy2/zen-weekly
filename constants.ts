
import { DayName, TaskItem } from './types';

export const DAYS: DayName[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const INITIAL_HABITS_TEMPLATE = [
  { label: 'Wake up on time', time: '06:00 AM' },
  { label: 'Workout / Run', time: '07:00 AM' },
  { label: 'Meditation', time: '08:30 AM' },
  { label: 'Tech learning', time: '10:00 AM' },
  { label: 'GF time', time: '06:00 PM' },
  { label: 'Channel task', time: '08:00 PM' },
  { label: 'Online class', time: '09:00 PM' },
  { label: 'Sleep on time', time: '11:00 PM' }
];

export const LOCAL_STORAGE_KEY = 'zenweekly-v2-data';
