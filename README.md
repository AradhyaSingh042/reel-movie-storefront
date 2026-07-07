# Reel — short-form show storefront

Netflix-style storefront UI built for the JS developer assessment. Not a
Netflix clone by design.

## Stack

- React 18 + TypeScript, built with Vite
- Tailwind CSS
- TanStack Query (`useInfiniteQuery` for the catalogue, cache persisted to
  localStorage for offline access)
- Zustand (+ `persist` middleware for watchlist/history)
- React Router v6
- Firebase Auth (email/password only — no Firestore, auth was the only
  requirement)
- anime.js for transitions/micro-interactions

## Running it

```bash
npm install
cp .env.example .env   # then fill in your own Firebase project config
npm run dev
```

You need a Firebase project with **Email/Password** sign-in enabled
(Authentication → Sign-in method → Email/Password) for sign up / sign in to
work. Nothing else in Firebase is used.
