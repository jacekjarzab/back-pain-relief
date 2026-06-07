import { storageService } from './storage';
import {
  CloudSyncSnapshot,
  CloudSyncState,
  chooseCloudSyncSnapshot,
  createCloudSyncSnapshot,
  parseCloudSyncSnapshot,
  serializeCloudSyncSnapshot,
} from '../models/cloudSync';

const DEVICE_ID_STORAGE_KEY = 'back-pain-relief.cloud-sync.device-id';

const getSafeLocalStorage = (): Storage | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

export const getCloudSyncDeviceId = (): string => {
  const storage = getSafeLocalStorage();
  if (!storage) {
    return `device-${Math.random().toString(36).slice(2)}`;
  }

  const existing = storage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;

  const next = globalThis.crypto?.randomUUID?.() ?? `device-${Math.random().toString(36).slice(2)}`;
  storage.setItem(DEVICE_ID_STORAGE_KEY, next);
  return next;
};

export const readCloudSyncState = async (): Promise<CloudSyncState> => {
  const [preferences, progress, todayRoutine, routineHistory] = await Promise.all([
    storageService.getPreferences(),
    storageService.getProgress(),
    storageService.getTodayRoutine(),
    storageService.getRoutineHistory(),
  ]);

  return {
    preferences,
    progress,
    todayRoutine,
    routineHistory,
  };
};

export const createLocalCloudSyncSnapshot = async (): Promise<CloudSyncSnapshot> => {
  const state = await readCloudSyncState();
  return createCloudSyncSnapshot(state, {
    deviceId: getCloudSyncDeviceId(),
    source: 'local',
  });
};

export const exportCloudSyncSnapshot = async (): Promise<string> => {
  const snapshot = await createLocalCloudSyncSnapshot();
  return serializeCloudSyncSnapshot(snapshot);
};

export const restoreCloudSyncSnapshot = async (snapshot: CloudSyncSnapshot): Promise<void> => {
  await storageService.savePreferences(snapshot.preferences);
  await storageService.saveProgress(snapshot.progress);
  if (snapshot.todayRoutine) {
    await storageService.saveTodayRoutine(snapshot.todayRoutine);
  } else {
    await storageService.clearTodayRoutine();
  }
  await storageService.saveRoutineHistory(snapshot.routineHistory);
};

export const importCloudSyncSnapshot = async (json: string): Promise<CloudSyncSnapshot> => {
  const snapshot = parseCloudSyncSnapshot(json);
  if (!snapshot) {
    throw new Error('Invalid cloud backup file');
  }

  await restoreCloudSyncSnapshot(snapshot);
  return snapshot;
};

export const chooseLocalOrRemoteSnapshot = async (
  remoteSnapshot: CloudSyncSnapshot
): Promise<CloudSyncSnapshot> => {
  const localSnapshot = await createLocalCloudSyncSnapshot();
  return chooseCloudSyncSnapshot(localSnapshot, remoteSnapshot).chosen;
};

export const downloadSnapshotJson = async (): Promise<{ content: string; filename: string }> => ({
  content: await exportCloudSyncSnapshot(),
  filename: `back-pain-relief-backup-${new Date().toISOString().slice(0, 10)}.json`,
});
