import { DailyRoutine, UserPreferences, UserProgress } from './types';

export const CLOUD_SYNC_SCHEMA_VERSION = 1 as const;

export type CloudSyncSource = 'local' | 'google-drive';

export interface CloudSyncState {
  preferences: UserPreferences;
  progress: UserProgress;
  todayRoutine: DailyRoutine | null;
  routineHistory: DailyRoutine[];
}

export interface CloudSyncSnapshot extends CloudSyncState {
  schemaVersion: typeof CLOUD_SYNC_SCHEMA_VERSION;
  snapshotId: string;
  deviceId: string;
  exportedAt: string;
  updatedAt: string;
  source: CloudSyncSource;
}

export interface CloudSyncSelection {
  chosen: CloudSyncSnapshot;
  localWins: boolean;
  reason: 'local-newer' | 'remote-newer' | 'local-tie-break' | 'remote-tie-break';
}

export const BACKUP_FILE_NAME = 'back-pain-relief-sync.json';

const isIsoDate = (value: string): boolean => !Number.isNaN(Date.parse(value));

export const toIsoTimestamp = (value?: string | Date): string => {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' && isIsoDate(value)) return new Date(value).toISOString();
  return new Date().toISOString();
};

export const createSnapshotId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `snapshot-${Math.random().toString(36).slice(2)}-${Date.now()}`;

export const createCloudSyncSnapshot = (
  state: CloudSyncState,
  options?: {
    deviceId?: string;
    exportedAt?: string | Date;
    updatedAt?: string | Date;
    source?: CloudSyncSource;
    snapshotId?: string;
  }
): CloudSyncSnapshot => {
  const exportedAt = toIsoTimestamp(options?.exportedAt);
  return {
    schemaVersion: CLOUD_SYNC_SCHEMA_VERSION,
    snapshotId: options?.snapshotId ?? createSnapshotId(),
    deviceId: options?.deviceId ?? 'unknown-device',
    exportedAt,
    updatedAt: toIsoTimestamp(options?.updatedAt ?? exportedAt),
    source: options?.source ?? 'local',
    preferences: state.preferences,
    progress: state.progress,
    todayRoutine: state.todayRoutine,
    routineHistory: [...state.routineHistory],
  };
};

export const normalizeCloudSyncSnapshot = (input: unknown): CloudSyncSnapshot | null => {
  if (!input || typeof input !== 'object') return null;

  const candidate = input as Partial<CloudSyncSnapshot>;

  if (candidate.schemaVersion !== CLOUD_SYNC_SCHEMA_VERSION) return null;
  if (!candidate.snapshotId || typeof candidate.snapshotId !== 'string') return null;
  if (!candidate.deviceId || typeof candidate.deviceId !== 'string') return null;
  if (!candidate.exportedAt || typeof candidate.exportedAt !== 'string') return null;
  if (!candidate.updatedAt || typeof candidate.updatedAt !== 'string') return null;
  if (!isIsoDate(candidate.exportedAt) || !isIsoDate(candidate.updatedAt)) return null;
  if (!candidate.preferences || !candidate.progress) return null;
  if (!Array.isArray(candidate.routineHistory)) return null;

  return {
    schemaVersion: CLOUD_SYNC_SCHEMA_VERSION,
    snapshotId: candidate.snapshotId,
    deviceId: candidate.deviceId,
    exportedAt: new Date(candidate.exportedAt).toISOString(),
    updatedAt: new Date(candidate.updatedAt).toISOString(),
    source: candidate.source === 'google-drive' ? 'google-drive' : 'local',
    preferences: candidate.preferences as UserPreferences,
    progress: candidate.progress as UserProgress,
    todayRoutine: (candidate.todayRoutine ?? null) as DailyRoutine | null,
    routineHistory: candidate.routineHistory as DailyRoutine[],
  };
};

export const serializeCloudSyncSnapshot = (snapshot: CloudSyncSnapshot): string =>
  JSON.stringify(snapshot, null, 2);

export const parseCloudSyncSnapshot = (content: string): CloudSyncSnapshot | null => {
  try {
    return normalizeCloudSyncSnapshot(JSON.parse(content));
  } catch {
    return null;
  }
};

const compareTimestamps = (left: string, right: string): number => {
  const leftTime = new Date(left).getTime();
  const rightTime = new Date(right).getTime();
  return leftTime - rightTime;
};

export const chooseCloudSyncSnapshot = (
  localSnapshot: CloudSyncSnapshot,
  remoteSnapshot: CloudSyncSnapshot
): CloudSyncSelection => {
  const updatedAtComparison = compareTimestamps(localSnapshot.updatedAt, remoteSnapshot.updatedAt);
  if (updatedAtComparison > 0) {
    return {
      chosen: localSnapshot,
      localWins: true,
      reason: 'local-newer',
    };
  }

  if (updatedAtComparison < 0) {
    return {
      chosen: remoteSnapshot,
      localWins: false,
      reason: 'remote-newer',
    };
  }

  const exportedAtComparison = compareTimestamps(localSnapshot.exportedAt, remoteSnapshot.exportedAt);
  if (exportedAtComparison >= 0) {
    return {
      chosen: localSnapshot,
      localWins: true,
      reason: 'local-tie-break',
    };
  }

  return {
    chosen: remoteSnapshot,
    localWins: false,
    reason: 'remote-tie-break',
  };
};
