// Exercise difficulty levels
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Body area targets
export type BodyArea = 'upper-back' | 'lower-back' | 'core' | 'full-back';

// Exercise category for variety
export type ExerciseCategory = 'stretch' | 'strength' | 'mobility' | 'posture';

// Single exercise definition
export interface Exercise {
  id: string;
  name: string;
  description: string;
  bodyArea: BodyArea;
  category: ExerciseCategory;
  difficulty: Difficulty;
  durationSeconds: number;
  reps?: number; // For rep-based exercises
  sets?: number;
  restSeconds: number;
  instructions: string[];
  proTips: string[];
  imageUrl: string;
  videoUrl?: string;
  benefits: string[];
}

// Exercise in a workout with completion status
export interface WorkoutExercise {
  exercise: Exercise;
  completed: boolean;
  completedAt?: string;
}

// Daily workout routine
export interface DailyRoutine {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  exercises: WorkoutExercise[];
  completed: boolean;
  completedAt?: string;
  totalDuration: number; // Estimated total time in seconds
}

// User progress tracking
export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalWorkoutsCompleted: number;
  totalExercisesCompleted: number;
  totalMinutesExercised: number;
  completedDates: string[]; // Array of ISO date strings
  lastWorkoutDate?: string;
}

// User preferences
export interface UserPreferences {
  difficulty: Difficulty;
  workoutDuration: 'short' | 'medium' | 'long'; // 10, 15, 20 min
  focusAreas: BodyArea[];
  reminderEnabled: boolean;
  reminderTime?: string; // HH:mm format
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

// Pro tip for motivation
export interface ProTip {
  id: string;
  title: string;
  content: string;
  category: 'posture' | 'lifestyle' | 'exercise' | 'motivation';
}

// App state
export interface AppState {
  progress: UserProgress;
  preferences: UserPreferences;
  todayRoutine?: DailyRoutine;
  routineHistory: DailyRoutine[];
}

// Default user preferences
export const defaultPreferences: UserPreferences = {
  difficulty: 'beginner',
  workoutDuration: 'medium',
  focusAreas: ['upper-back', 'lower-back', 'core'],
  reminderEnabled: false,
  soundEnabled: true,
  hapticEnabled: true,
};

// Default user progress
export const defaultProgress: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  totalWorkoutsCompleted: 0,
  totalExercisesCompleted: 0,
  totalMinutesExercised: 0,
  completedDates: [],
};

