
export type ThemeType = 'emoji' | 'weather' | 'custom';

export interface MoodOption {
  id: string;
  label: string;
  icon: string;
  value: number; // 0 (negative) to 1 (positive)
}

export interface Vote {
  id: string;
  nickname: string;
  moodId: string;
  reason?: string;
  kudos?: string;
  timestamp: number;
}

export interface Session {
  id: string;
  name: string;
  themeType: ThemeType;
  customOptions?: MoodOption[];
  startTime: number;
  timerDuration: number; // in seconds
  status: 'active' | 'locked' | 'revealing' | 'completed';
  votes: Vote[];
  aiSummary?: string;
  aiAction?: string;
}

export interface AppState {
  currentSession: Session | null;
  role: 'facilitator' | 'participant' | null;
  nickname: string;
}
