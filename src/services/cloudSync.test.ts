import { describe, expect, it } from 'vitest';
import { defaultPreferences, defaultProgress } from '../models/types';
import {
  chooseCloudSyncSnapshot,
  createCloudSyncSnapshot,
  parseCloudSyncSnapshot,
  serializeCloudSyncSnapshot,
} from '../models/cloudSync';

const createBaseState = () => ({
  preferences: defaultPreferences,
  progress: defaultProgress,
  todayRoutine: null,
  routineHistory: [],
});

describe('cloud sync snapshot helpers', () => {
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
});
