# Cloud Sync Plan

Goal: add optional Google Drive cloud backup/sync while keeping offline-first local storage as the primary source of truth.

## Checklist

- [x] Define a versioned snapshot schema for sync payloads.
- [x] Add a sync service that can export/import local app state.
- [x] Add Google Drive auth/connect flow.
- [x] Persist one app-owned backup file in Google Drive.
- [x] Implement manual backup and restore actions.
- [x] Add automatic push/pull sync on app start and after data changes.
- [x] Add conflict handling with a clear merge rule for v1.
- [x] Expose cloud sync controls in Settings.
- [x] Add tests for serialization, restore, and conflict cases.
- [x] Verify web PWA and Capacitor mobile behavior.

## Initial Decisions

- Keep `@ionic/storage` as the local cache/source of truth for offline use.
- Store one JSON snapshot in Google Drive, not multiple loose files.
- Use a schema version and timestamps so future migrations are possible.
- Start with last-write-wins conflict handling, then improve later if needed.
- Prefer user-owned Google Drive storage over a custom backend.

## Data In Snapshot

- `preferences`
- `progress`
- `todayRoutine`
- `routineHistory`
- `schemaVersion`
- `deviceId`
- `updatedAt`

## Delivery Phases

1. Storage and snapshot serialization
2. Google Drive connection and file management
3. Manual backup/restore UI
4. Automatic sync and conflict handling
5. Tests, polish, and release checks
