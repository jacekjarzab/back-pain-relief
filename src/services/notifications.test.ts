import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    schedule: vi.fn(async () => undefined),
    cancel: vi.fn(async () => undefined),
    addListener: vi.fn(() => ({ remove: vi.fn() })),
    requestPermissions: vi.fn(async () => ({ display: 'granted' })),
    checkPermissions: vi.fn(async () => ({ display: 'granted' })),
    getPending: vi.fn(async () => ({ notifications: [] })),
  },
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => true),
    getPlatform: vi.fn(() => 'android'),
  },
}));

import { notificationService } from './notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('schedules a daily reminder when notifications are available', async () => {
    const result = await notificationService.scheduleDailyReminder('08:30');

    expect(LocalNotifications.cancel).toHaveBeenCalled();
    expect(LocalNotifications.schedule).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('cancels pending reminders', async () => {
    await notificationService.cancelDailyReminder();

    expect(LocalNotifications.cancel).toHaveBeenCalledWith({ notifications: [{ id: 1 }] });
  });
});
