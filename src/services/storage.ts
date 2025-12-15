import { Storage } from '@ionic/storage';
import { 
  UserProgress, 
  UserPreferences, 
  DailyRoutine, 
  defaultPreferences, 
  defaultProgress 
} from '../models/types';

// Storage keys
const KEYS = {
  PROGRESS: 'user_progress',
  PREFERENCES: 'user_preferences',
  ROUTINES: 'routine_history',
  TODAY_ROUTINE: 'today_routine',
};

class StorageService {
  private storage: Storage | null = null;

  async init(): Promise<Storage> {
    if (this.storage) return this.storage;
    
    const storage = new Storage();
    this.storage = await storage.create();
    return this.storage;
  }

  private async getStorage(): Promise<Storage> {
    if (!this.storage) {
      await this.init();
    }
    return this.storage!;
  }

  // Progress methods
  async getProgress(): Promise<UserProgress> {
    const storage = await this.getStorage();
    const progress = await storage.get(KEYS.PROGRESS);
    return progress || defaultProgress;
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    const storage = await this.getStorage();
    await storage.set(KEYS.PROGRESS, progress);
  }

  async updateProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    const current = await this.getProgress();
    const updated = { ...current, ...updates };
    await this.saveProgress(updated);
    return updated;
  }

  // Preferences methods
  async getPreferences(): Promise<UserPreferences> {
    const storage = await this.getStorage();
    const prefs = await storage.get(KEYS.PREFERENCES);
    return prefs || defaultPreferences;
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    const storage = await this.getStorage();
    await storage.set(KEYS.PREFERENCES, preferences);
  }

  // Today's routine
  async getTodayRoutine(): Promise<DailyRoutine | null> {
    const storage = await this.getStorage();
    return storage.get(KEYS.TODAY_ROUTINE);
  }

  async saveTodayRoutine(routine: DailyRoutine): Promise<void> {
    const storage = await this.getStorage();
    await storage.set(KEYS.TODAY_ROUTINE, routine);
  }

  // Routine history
  async getRoutineHistory(): Promise<DailyRoutine[]> {
    const storage = await this.getStorage();
    const history = await storage.get(KEYS.ROUTINES);
    return history || [];
  }

  async addToRoutineHistory(routine: DailyRoutine): Promise<void> {
    const history = await this.getRoutineHistory();
    // Keep last 30 days of history
    const updated = [routine, ...history].slice(0, 30);
    const storage = await this.getStorage();
    await storage.set(KEYS.ROUTINES, updated);
  }

  // Clear all data
  async clearAll(): Promise<void> {
    const storage = await this.getStorage();
    await storage.clear();
  }
}

// Export singleton instance
export const storageService = new StorageService();

