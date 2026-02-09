
import { MoodOption } from './types';

export const EMOJI_THEME: MoodOption[] = [
  { id: '1', label: 'Stoked', icon: '🤩', value: 1.0 },
  { id: '2', label: 'Good', icon: '🙂', value: 0.8 },
  { id: '3', label: 'Meh', icon: '😐', value: 0.5 },
  { id: '4', label: 'Melting', icon: '🫠', value: 0.3 },
  { id: '5', label: 'Mind Blown', icon: '🤯', value: 0.2 },
  { id: '6', label: 'Sleeping', icon: '😴', value: 0.1 },
];

export const WEATHER_THEME: MoodOption[] = [
  { id: 'w1', label: 'Sunny', icon: '☀️', value: 1.0 },
  { id: 'w2', label: 'Partly Cloudy', icon: '⛅', value: 0.7 },
  { id: 'w3', label: 'Foggy', icon: '🌫️', value: 0.4 },
  { id: 'w4', label: 'Rainy', icon: '🌧️', value: 0.3 },
  { id: 'w5', label: 'Thunderstorm', icon: '⛈️', value: 0.1 },
  { id: 'w6', label: 'Snowy', icon: '❄️', value: 0.5 },
];

export const APP_STORAGE_KEY = 'vibecast_session_data';
