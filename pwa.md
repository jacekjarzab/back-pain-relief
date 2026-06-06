# PWA Release Plan

Goal: make Back Pain Relief installable and usable on a mobile phone as a proper PWA, with a clean home-screen experience and acceptable offline behavior.

## Checklist

- [x] Fix web app identity
  - [x] Replace starter manifest values with app-specific `name`, `short_name`, colors, and `start_url`
  - [x] Update document title and mobile meta tags in `index.html`
  - [x] Verify the app name/icon shown in browser install prompts

- [x] Add PWA assets
  - [x] Generate proper app icons for at least 192x192 and 512x512
  - [x] Add maskable icons if possible
  - [x] Ensure `public/manifest.json` references files that actually exist

- [x] Add offline support
  - [x] Register a service worker for production builds
  - [x] Precache the app shell and static assets
  - [x] Confirm the app opens when revisited offline after first load

- [ ] Validate mobile UX
  - [ ] Check layout on a narrow phone viewport
  - [ ] Confirm bottom navigation, workout cards, and timers are touch-friendly
  - [ ] Make sure safe-area insets and scrolling work on iPhone Safari

- [x] Keep native mobile path intact
  - [x] Confirm Capacitor builds still work for Android/iOS shells
  - [x] Leave local notifications behavior intact for native builds
  - [x] Document what works in web PWA vs native app

- [x] Test and release
  - [x] Run production build and fix any warnings that affect mobile
  - [ ] Test install flow in Chrome on Android
  - [ ] Test Add to Home Screen in Safari on iPhone
  - [ ] Verify the deployed site serves over HTTPS

## Manual phone checks still needed

- Install flow on Android Chrome
- Add to Home Screen flow on iPhone Safari
- Offline relaunch after the first visit
- Narrow viewport / safe-area touch pass on a real phone

## Done Criteria

- The app can be installed from a mobile browser.
- The installed app launches in standalone mode.
- The app is usable on a phone without network after the first visit.
- Native Android/iOS builds still compile.
