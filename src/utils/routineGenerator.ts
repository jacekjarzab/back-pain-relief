import dayjs from 'dayjs';
import { exercises } from '../data/exercises';
import { 
  Exercise, 
  DailyRoutine, 
  WorkoutExercise, 
  UserPreferences,
  BodyArea,
  Difficulty 
} from '../models/types';

// Seeded random for consistent daily routines
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Get a seed from date string
function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Shuffle array with seeded random
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Filter exercises based on preferences
function filterExercises(
  allExercises: Exercise[],
  focusAreas: BodyArea[],
  difficulty: Difficulty
): Exercise[] {
  const difficultyOrder: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
  const maxDifficultyIndex = difficultyOrder.indexOf(difficulty);
  
  return allExercises.filter(exercise => {
    const areaMatch = focusAreas.includes(exercise.bodyArea) || exercise.bodyArea === 'full-back';
    const difficultyMatch = difficultyOrder.indexOf(exercise.difficulty) <= maxDifficultyIndex;
    return areaMatch && difficultyMatch;
  });
}

// Get target exercise count based on duration preference
function getExerciseCount(duration: 'short' | 'medium' | 'long'): number {
  switch (duration) {
    case 'short': return 4;
    case 'medium': return 6;
    case 'long': return 8;
    default: return 6;
  }
}

// Generate a balanced routine for a specific date
export function generateDailyRoutine(
  dateStr: string,
  preferences: UserPreferences
): DailyRoutine {
  const seed = dateSeed(dateStr);
  const random = seededRandom(seed);
  
  // Filter exercises based on user preferences
  const availableExercises = filterExercises(
    exercises,
    preferences.focusAreas,
    preferences.difficulty
  );
  
  const targetCount = getExerciseCount(preferences.workoutDuration);
  
  // Group exercises by category for balance
  const byCategory: Record<string, Exercise[]> = {};
  availableExercises.forEach(ex => {
    if (!byCategory[ex.category]) byCategory[ex.category] = [];
    byCategory[ex.category].push(ex);
  });
  
  // Shuffle each category
  Object.keys(byCategory).forEach(cat => {
    byCategory[cat] = shuffleArray(byCategory[cat], random);
  });
  
  // Build balanced routine: stretch, strength, mobility, stretch pattern
  const categoryOrder = ['stretch', 'strength', 'mobility', 'posture'];
  const selectedExercises: Exercise[] = [];
  let categoryIndex = 0;
  
  while (selectedExercises.length < targetCount) {
    const category = categoryOrder[categoryIndex % categoryOrder.length];
    const categoryExercises = byCategory[category] || [];
    
    // Find an exercise not already selected
    const available = categoryExercises.filter(
      ex => !selectedExercises.some(s => s.id === ex.id)
    );
    
    if (available.length > 0) {
      selectedExercises.push(available[0]);
    }
    
    categoryIndex++;
    
    // Prevent infinite loop if not enough exercises
    if (categoryIndex > targetCount * 4) break;
  }
  
  // Calculate total duration
  const totalDuration = selectedExercises.reduce(
    (sum, ex) => sum + ex.durationSeconds + ex.restSeconds,
    0
  );
  
  // Create workout exercises
  const workoutExercises: WorkoutExercise[] = selectedExercises.map(exercise => ({
    exercise,
    completed: false,
  }));
  
  return {
    id: `routine-${dateStr}`,
    date: dateStr,
    exercises: workoutExercises,
    completed: false,
    totalDuration,
  };
}

// Generate today's routine
export function generateTodayRoutine(preferences: UserPreferences): DailyRoutine {
  const today = dayjs().format('YYYY-MM-DD');
  return generateDailyRoutine(today, preferences);
}

// Check if routine needs regeneration (new day)
export function shouldRegenerateRoutine(routine: DailyRoutine | null): boolean {
  if (!routine) return true;
  const today = dayjs().format('YYYY-MM-DD');
  return routine.date !== today;
}

