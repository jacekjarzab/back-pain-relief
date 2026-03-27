import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { generateDailyRoutine, shouldRegenerateRoutine } from './routineGenerator';
import { defaultPreferences, DailyRoutine } from '../models/types';

describe('routineGenerator', () => {
  it('produces deterministic routines at the expected workout size', () => {
    const first = generateDailyRoutine('2026-03-27', defaultPreferences);
    const second = generateDailyRoutine('2026-03-27', defaultPreferences);

    expect(first).toEqual(second);
    expect(first.exercises).toHaveLength(6);
    expect(first.id).toContain('2026-03-27');
    expect(first.exercises.every((we) => we.completed === false)).toBe(true);
  });

  it('knows when to regenerate a routine', () => {
    expect(shouldRegenerateRoutine(null)).toBe(true);

    const today = dayjs().format('YYYY-MM-DD');
    const freshRoutine: DailyRoutine = {
      id: 'routine-current',
      date: today,
      exercises: [] as DailyRoutine['exercises'],
      completed: false,
      totalDuration: 0,
    };

    expect(shouldRegenerateRoutine(freshRoutine)).toBe(false);

    const staleRoutine: DailyRoutine = {
      ...freshRoutine,
      id: 'routine-stale',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    };

    expect(shouldRegenerateRoutine(staleRoutine)).toBe(true);
  });
});
