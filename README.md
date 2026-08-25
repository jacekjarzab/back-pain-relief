# Back Pain Relief

A mobile-first wellness app for daily back-care workouts. It creates personalized routines, guides users through exercises with timers, tracks progress, and can optionally back up app data to Google Drive.

> This app is not medical advice. Stop if an exercise causes sharp pain, and consult a qualified clinician for pain, injury, or uncertainty.

## Features

- Personalized daily routines based on focus areas, difficulty, and preferred workout length
- Guided workout timers, exercise instructions, tips, benefits, and video links
- Progress tracking for workouts, exercise totals, minutes, streaks, and completed days
- Daily reminders and haptic feedback in native iOS and Android builds
- Offline-first local storage and an installable PWA
- Optional Google Drive backup, restore, and automatic sync
- English and Polish interfaces

## Tech Stack

- Ionic React and React 19
- TypeScript and Vite
- Capacitor for iOS and Android shells
- Ionic Storage for local persistence
- Vite PWA for service-worker-based offline support
- Vitest and Cypress for unit and end-to-end tests

## Getting Started

### Prerequisites

- Node.js and npm
- Xcode for iOS development
- Android Studio for Android development

### Install and run

```bash
npm ci
npm run dev
```

The Vite development server runs on the URL printed in the terminal, typically `http://localhost:5173`.

## Configuration

Google Drive sync is optional. To enable it, create `.env.local` with a Google OAuth client ID:

```bash
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Do not commit local environment files. Configure the Google OAuth client to allow the development and production origins that will use the app.

## Commands

| Task | Command |
| --- | --- |
| Start the development server | `npm run dev` |
| Start and open the development server | `npm run ionic:serve` |
| Build for production | `npm run build` |
| Preview the production build | `npm run preview` |
| Run unit tests | `npm run test.unit` |
| Run end-to-end tests | `npm run test.e2e` |
| Run ESLint | `npm run lint` |
| Build through Ionic | `npm run ionic:build` |

`npm run test.unit` starts Vitest in watch mode. Cypress expects the app to be running at `http://localhost:5173`.

## Web and PWA Deployment

Build the app and deploy the generated `dist/` directory to an HTTPS static host:

```bash
npm run build
```

Configure the host to serve `index.html` as the fallback for client-side routes. The PWA service worker precaches the app shell and static assets; offline use is available after the first successful visit. Embedded exercise videos still require a network connection.

## Native Builds

The repository includes Capacitor projects for iOS and Android. Build web assets before syncing either native project:

```bash
npm run build
npx cap sync ios
npx cap sync android
```

Open the native projects with:

```bash
npx cap open ios
npx cap open android
```

## Data and Sync

Local device storage is the primary source of truth. Google Drive sync stores one versioned JSON backup in the user's app-specific Drive storage. Sync conflict resolution is timestamp-based, with the most recently updated snapshot winning.

Google access tokens are stored only for the current browser session, so reconnecting may be required after the session ends.

## Project Structure

```text
src/
  components/    Reusable UI components
  context/       Shared application state
  data/          Exercise catalog
  locales/       English and Polish translations
  models/        Type definitions and cloud-sync schema
  pages/         Routed Ionic screens
  services/      Storage, notifications, and cloud-sync services
  utils/         Routine generation and helpers
  theme/         Global Ionic theme variables
```

## Further Documentation

- `.project/docs/pwa.md` covers PWA release checks.
- `.project/docs/static-pwa-deploy.md` covers static-host deployment requirements.
- `.project/docs/cloud-sync.md` records the cloud-sync data model and decisions.
