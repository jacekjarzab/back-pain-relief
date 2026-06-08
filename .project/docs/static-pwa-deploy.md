# Static PWA Deploy Checklist

Goal: deploy the app as a static PWA only, with no native store release for now.

## Checklist

- [x] Set the production site URL and confirm HTTPS is enforced.
- [x] Choose the host and configure SPA fallback to `index.html`.
- [x] Build the app with `npm run build` and confirm `dist/` is generated.
- [x] Upload or connect the `dist/` output to the hosting provider.
- [x] Verify `public/manifest.json` and service worker assets are served from the deployed origin.
- [x] Confirm the app opens at `/dashboard` and other client routes resolve after refresh.
- [x] Test install flow on Android Chrome.
- [x] Test Add to Home Screen flow on iPhone Safari.
- [x] Test offline relaunch after the first visit.
- [x] Verify Google OAuth settings allow the production origin for cloud sync.
- [x] Confirm cloud sync still connects and restores on the deployed site.
- [x] Check the deployed app in mobile and desktop browsers for layout regressions.

## Recommended Host Defaults

- Netlify: publish `dist/` and set a redirect rule to `/index.html` for all routes.
- Vercel: use the Vite build output and keep SPA rewrites enabled.
- Cloudflare Pages: publish `dist/` and enable single-page app fallback.

## Done Criteria

- The app is reachable over HTTPS.
- The PWA installs from a browser.
- Refreshing a client route does not break navigation.
- Offline relaunch works after the first load.
- Cloud sync works on the production origin.
