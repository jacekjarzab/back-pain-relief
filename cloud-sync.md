# Cloud Sync

Google Drive cloud backup/sync is implemented for `back-pain-relief` while keeping offline-first local storage as the source of truth.

## Status

- [x] Versioned snapshot schema for sync payloads
- [x] Sync service that exports/imports local app state
- [x] Google Drive auth/connect flow
- [x] One app-owned backup file in Google Drive
- [x] Manual backup and restore actions
- [x] Automatic push/pull sync on app start and after data changes
- [x] Conflict handling with a clear v1 merge rule
- [x] Cloud sync controls in Settings
- [x] Tests for serialization, restore, and conflict cases
- [ ] Verify web PWA and mobile behavior on real devices

## Current Behavior

- Local `@ionic/storage` data stays authoritative for offline use.
- One JSON snapshot is stored in Google Drive app data as `back-pain-relief-sync.json`.
- Snapshot payload includes:
  - `preferences`
  - `progress`
  - `todayRoutine`
  - `routineHistory`
  - `schemaVersion`
  - `snapshotId`
  - `deviceId`
  - `exportedAt`
  - `updatedAt`
  - `source`
- Sync resolution is last-write-wins by `updatedAt`, with `exportedAt` as the tie-breaker.
- Settings includes connect, sync now, backup now, restore from Drive, disconnect, and status messaging.

## Operational Note

- Google Drive sync requires `VITE_GOOGLE_CLIENT_ID` in the app environment.
