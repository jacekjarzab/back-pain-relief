# Plan

We will harden the mobile/web security baseline by addressing the five medium-risk findings with minimal behavior changes first, then validating on Android/web to avoid regressions. The approach is to tighten platform configs, constrain external content, and protect persisted user data in a staged rollout.

## Scope
- In:
  - Restrict wildcard network access in Android Cordova config.
  - Add encrypted persistence path for sensitive local data.
  - Harden iframe embedding with strict host validation and sandboxing.
  - Disable or tightly scope Android app backup behavior.
  - Narrow Android `FileProvider` paths to least privilege.
  - Add verification steps (unit checks + build/smoke test).
- Out:
  - Full auth/session architecture changes.
  - Backend/API redesign.
  - Broad dependency vulnerability remediation (handled separately).

## Action items
[ ] Inventory current external domains and define an explicit allowlist (e.g., YouTube embed domains only), then replace `*` in `android/app/src/main/res/xml/config.xml` with specific origins.
[ ] Add a URL validation utility for embed sources (allow `https` + approved hosts/path patterns) and enforce it in `src/pages/Workout/Workout.tsx` and `src/pages/ExerciseDetail/ExerciseDetail.tsx` before rendering iframes.
[ ] Harden iframe attributes in those pages by adding restrictive `sandbox`, minimal `allow`, and `referrerPolicy`, with a safe fallback UI when validation fails.
[ ] Classify stored keys in `src/services/storage.ts` into low-sensitivity vs private data, then introduce encrypted storage for private keys (keystore-backed Capacitor plugin path) while keeping non-sensitive preferences in existing storage.
[ ] Add a storage migration step that reads old plaintext values once, writes encrypted replacements, and deletes old keys safely with idempotent guards.
[ ] Update `android/app/src/main/AndroidManifest.xml` to disable backup (`android:allowBackup="false"`) or explicitly configure backup/data-extraction rules to exclude private app data.
[ ] Reduce `FileProvider` exposure in `android/app/src/main/res/xml/file_paths.xml` by removing broad `external-path` usage and limiting to app-specific `cache-path`/`files-path` entries required by actual features.
[ ] Verify changes with `npm run lint`, `npm run test.unit`, `npm run build`, plus Android smoke checks (`npx cap sync android` and launch test) to confirm video playback, data persistence, and file-share paths still work.

## Open questions
- Should offline backup/restore remain supported, or can we enforce `allowBackup=false` for stronger privacy by default?
- Which exact video hosts must remain supported beyond YouTube embeds (if any)?
- Do you want all workout/progress history treated as sensitive (encrypted), or only selected fields (e.g., reminders/notes/history)?
