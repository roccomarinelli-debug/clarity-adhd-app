// Core type definitions for Clarity ADHD System

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  onboarded_at?: string;
}

export interface DailyHabit {
  id: string;
  user_id: string;
  date: string;

  // Diet Lens
  wake_time?: string;
  fasting_window_start?: string;
  fasting_window_end?: string;
  diet_adherence: number; // 1-10 scale
  ketosis_indicator?: boolean; // Optional: did they stay in ketosis?

  // Exercise Lens
  exercise_completed: boolean;
  exercise_type?: string; // e.g., "Norwegian 4x4", "Strength", "Mobility"
  exercise_duration?: number; // minutes
  exercise_intensity?: number; // 1-10 scale

  // Mindfulness Lens
  meditation_completed: boolean;
  meditation_duration?: number; // minutes
  meditation_time?: string; // time of day

  // The Alignment Effect
  reward_system_primed: boolean; // KEY METRIC
  clarity_rating: number; // 1-10: how clear/focused today?
  strategic_thinking: boolean; // Did strategic thinking emerge?

  // Notes
  notes?: string;
  wins?: string; // What went well
  challenges?: string; // What was difficult

  // Metadata
  created_at: string;
  updated_at?: string;
}

export interface Streak {
  id: string;
  user_id: string;
  streak_type: 'overall' | 'meditation' | 'exercise' | 'diet' | 'alignment';
  current_streak: number;
  longest_streak: number;
  last_updated: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  timezone: string;
  target_wake_time?: string;
  target_fasting_window: {
    start: string;
    end: string;
  };
  preferred_exercise?: string;
  meditation_style?: string;
  goals?: string[];
  created_at: string;
  updated_at?: string;
}

export interface LensAlignment {
  diet: boolean;
  exercise: boolean;
  mindfulness: boolean;
  all_aligned: boolean;
}

// Form types
export interface HabitTrackingForm {
  // Diet
  wake_time: string;
  fasting_start: string;
  fasting_end: string;
  diet_adherence: number;

  // Exercise
  exercise_completed: boolean;
  exercise_type?: string;
  exercise_duration?: number;
  exercise_intensity?: number;

  // Mindfulness
  meditation_completed: boolean;
  meditation_duration?: number;

  // Alignment
  reward_system_primed: boolean;
  clarity_rating: number;
  strategic_thinking: boolean;

  // Notes
  notes?: string;
  wins?: string;
  challenges?: string;
}

// Analytics types
export interface WeeklyStats {
  week_start: string;
  days_tracked: number;
  days_all_aligned: number;
  avg_clarity_rating: number;
  days_reward_primed: number;
  meditation_completion: number; // percentage
  exercise_completion: number; // percentage
  avg_diet_adherence: number;
}

export interface MonthlyInsights {
  month: string;
  total_days_tracked: number;
  best_streak: number;
  avg_clarity: number;
  most_common_exercise?: string;
  patterns?: string[]; // AI-identified patterns (future)
}
