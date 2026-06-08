import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultPreferences, defaultProgress } from '../models/types';
import {
  chooseCloudSyncSnapshot,
  createCloudSyncSnapshot,
  parseCloudSyncSnapshot,
  serializeCloudSyncSnapshot,
} from '../models/cloudSync';
const storageMocks = vi.hoisted(() => ({
  savePreferences: vi.fn(),
  saveProgress: vi.fn(),
  saveTodayRoutine: vi.fn(),
  clearTodayRoutine: vi.fn(),
  saveRoutineHistory: vi.fn(),
}));

vi.mock('./storage', () => ({
  storageService: storageMocks,
}));

import { restoreCloudSyncSnapshot } from './cloudSync';

const createBaseState = () => ({
  preferences: defaultPreferences,
  progress: defaultProgress,
  todayRoutine: null,
  routineHistory: [],
});

describe('cloud sync snapshot helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates and parses a snapshot', () => {
    const snapshot = createCloudSyncSnapshot(createBaseState(), {
      deviceId: 'device-1',
      exportedAt: '2026-06-07T08:00:00.000Z',
      updatedAt: '2026-06-07T08:00:00.000Z',
    });

    const json = serializeCloudSyncSnapshot(snapshot);
    const parsed = parseCloudSyncSnapshot(json);

    expect(parsed).not.toBeNull();
    expect(parsed?.schemaVersion).toBe(1);
    expect(parsed?.deviceId).toBe('device-1');
    expect(parsed?.preferences).toEqual(defaultPreferences);
    expect(parsed?.progress).toEqual(defaultProgress);
  });

  it('chooses the newest snapshot by updatedAt', () => {
    const local = createCloudSyncSnapshot(createBaseState(), {
      deviceId: 'local',
      exportedAt: '2026-06-07T08:00:00.000Z',
      updatedAt: '2026-06-07T08:00:00.000Z',
    });

    const remote = createCloudSyncSnapshot(createBaseState(), {
      deviceId: 'remote',
      exportedAt: '2026-06-07T09:00:00.000Z',
      updatedAt: '2026-06-07T09:00:00.000Z',
    });

    const result = chooseCloudSyncSnapshot(local, remote);

    expect(result.localWins).toBe(false);
    expect(result.reason).toBe('remote-newer');
    expect(result.chosen.deviceId).toBe('remote');
  });

  it('falls back to exportedAt when updatedAt matches', () => {
    const local = createCloudSyncSnapshot(createBaseState(), {
      deviceId: 'local',
      exportedAt: '2026-06-07T10:00:00.000Z',
      updatedAt: '2026-06-07T08:00:00.000Z',
    });

    const remote = createCloudSyncSnapshot(createBaseState(), {
      deviceId: 'remote',
      exportedAt: '2026-06-07T09:00:00.000Z',
      updatedAt: '2026-06-07T08:00:00.000Z',
    });

    const result = chooseCloudSyncSnapshot(local, remote);

    expect(result.localWins).toBe(true);
    expect(result.reason).toBe('local-tie-break');
    expect(result.chosen.deviceId).toBe('local');
  });

  it('restores snapshot data and clears the today routine when missing', async () => {
    const snapshot = createCloudSyncSnapshot(createBaseState(), {
      deviceId: 'restore-device',
      exportedAt: '2026-06-07T10:00:00.000Z',
      updatedAt: '2026-06-07T10:00:00.000Z',
    });

    await restoreCloudSyncSnapshot(snapshot);

    expect(storageMocks.savePreferences).toHaveBeenCalledWith(defaultPreferences);
    expect(storageMocks.saveProgress).toHaveBeenCalledWith(defaultProgress);
    expect(storageMocks.clearTodayRoutine).toHaveBeenCalledTimes(1);
    expect(storageMocks.saveRoutineHistory).toHaveBeenCalledWith([]);
    expect(storageMocks.saveTodayRoutine).not.toHaveBeenCalled();
  });
});
