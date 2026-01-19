import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import i18n from 'i18next';
import {
  UserProgress,
  UserPreferences,
  DailyRoutine,
  defaultPreferences,
  defaultProgress,
  WorkoutExercise
} from '../models/types';
import { storageService } from '../services/storage';
import { generateTodayRoutine, shouldRegenerateRoutine } from '../utils/routineGenerator';
import { notificationService } from '../services/notifications';

interface AppContextType {
  progress: UserProgress;
  preferences: UserPreferences;
  todayRoutine: DailyRoutine | null;
  isLoading: boolean;

  // Actions
  completeExercise: (exerciseId: string) => Promise<void>;
  completeWorkout: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refreshRoutine: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [todayRoutine, setTodayRoutine] = useState<DailyRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app state from storage
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await storageService.init();

        const [savedProgress, savedPreferences, savedRoutine] = await Promise.all([
          storageService.getProgress(),
          storageService.getPreferences(),
          storageService.getTodayRoutine(),
        ]);

        setProgress(savedProgress);
        setPreferences(savedPreferences);

        // Initialize language
        if (savedPreferences.language) {
          await i18n.changeLanguage(savedPreferences.language);
        }

        // Check if we need a new routine for today
        if (shouldRegenerateRoutine(savedRoutine)) {
          const newRoutine = generateTodayRoutine(savedPreferences);
          await storageService.saveTodayRoutine(newRoutine);
          setTodayRoutine(newRoutine);
        } else {
          setTodayRoutine(savedRoutine);
        }

        // Re-schedule notification if enabled (in case app was updated)
        if (savedPreferences.reminderEnabled && savedPreferences.reminderTime) {
          await notificationService.scheduleDailyReminder(savedPreferences.reminderTime);
        }

        // Set up notification click listener
        notificationService.addListeners(() => {
          // Navigate to workout when notification is tapped
          window.location.href = '/workout';
        });
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Complete a single exercise
  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!todayRoutine) return;

    const updatedExercises: WorkoutExercise[] = todayRoutine.exercises.map(we =>
      we.exercise.id === exerciseId
        ? { ...we, completed: true, completedAt: new Date().toISOString() }
        : we
    );

    const updatedRoutine: DailyRoutine = {
      ...todayRoutine,
      exercises: updatedExercises,
    };

    setTodayRoutine(updatedRoutine);
    await storageService.saveTodayRoutine(updatedRoutine);

    // Update progress
    const completedExercise = todayRoutine.exercises.find(we => we.exercise.id === exerciseId);
    if (completedExercise) {
      const updatedProgress: UserProgress = {
        ...progress,
        totalExercisesCompleted: progress.totalExercisesCompleted + 1,
        totalMinutesExercised: progress.totalMinutesExercised +
          Math.round(completedExercise.exercise.durationSeconds / 60),
      };
      setProgress(updatedProgress);
      await storageService.saveProgress(updatedProgress);
    }
  }, [todayRoutine, progress]);

  // Complete entire workout
  const completeWorkout = useCallback(async () => {
    if (!todayRoutine) return;

    const today = dayjs().format('YYYY-MM-DD');
    const completedRoutine: DailyRoutine = {
      ...todayRoutine,
      completed: true,
      completedAt: new Date().toISOString(),
      exercises: todayRoutine.exercises.map(we => ({
        ...we,
        completed: true,
        completedAt: we.completedAt || new Date().toISOString(),
      })),
    };

    setTodayRoutine(completedRoutine);
    await storageService.saveTodayRoutine(completedRoutine);
    await storageService.addToRoutineHistory(completedRoutine);

    // Calculate streak
    const isConsecutive = progress.lastWorkoutDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    const newStreak = isConsecutive ? progress.currentStreak + 1 : 1;

    const updatedProgress: UserProgress = {
      ...progress,
      totalWorkoutsCompleted: progress.totalWorkoutsCompleted + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastWorkoutDate: today,
      completedDates: [...new Set([...progress.completedDates, today])],
    };

    setProgress(updatedProgress);
    await storageService.saveProgress(updatedProgress);
  }, [todayRoutine, progress]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    await storageService.savePreferences(updated);

    // Handle language change
    if (updates.language && updates.language !== preferences.language) {
      await i18n.changeLanguage(updates.language);
    }
  }, [preferences]);

  // Refresh/regenerate routine
  const refreshRoutine = useCallback(async () => {
    const newRoutine = generateTodayRoutine(preferences);
    setTodayRoutine(newRoutine);
    await storageService.saveTodayRoutine(newRoutine);
  }, [preferences]);

  // Reset all progress and history
  const resetProgress = useCallback(async () => {
    await storageService.clearProgressHistory();
    setProgress(defaultProgress);
    // Generate a fresh routine
    const newRoutine = generateTodayRoutine(preferences);
    setTodayRoutine(newRoutine);
    await storageService.saveTodayRoutine(newRoutine);
  }, [preferences]);

  return (
    <AppContext.Provider value={{
      progress,
      preferences,
      todayRoutine,
      isLoading,
      completeExercise,
      completeWorkout,
      updatePreferences,
      refreshRoutine,
      resetProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

