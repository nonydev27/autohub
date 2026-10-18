# AutoHub — TODO (start → finish)

Tick each box as you go. Time estimates assume ~10 hours total.
Every file in `src/` already has comments telling you what to write in it, with lessons and examples.
Read `docs/TUTOR.md` sections 1–4 first. Designs to copy: `src/assets/mockups/*.svg`.

---

## Phase 0 — Setup (≈ 45 min)

- [x] Scaffold Vite + React project
- [x] Install `@supabase/supabase-js`, `react-router-dom`, `lucide-react`
- [ ] Install Tailwind CSS (v4, Vite plugin):
  - `npm install tailwindcss @tailwindcss/vite`
  - In `vite.config.js`: import `tailwindcss` from `@tailwindcss/vite` and add `tailwindcss()` to the `plugins` array
  - In `src/index.css`: delete everything and put `@import "tailwindcss";` as the only line
  - Delete `src/App.css` and its import (you'll use Tailwind classes instead)
- [ ] Delete the demo images you won't use (`src/assets/hero.png`, `react.svg`, `vite.svg`)
- [ ] Copy `.env.example` → `.env.local` (it's already git-ignored, never commit it)

## Phase 1 — Supabase (≈ 45 min)

- [ ] Create a free project at https://supabase.com
- [ ] **Project Settings → API**: copy the Project URL and the `anon` public key into `.env.local`
- [ ] **Authentication → Providers → Email**: turn OFF "Confirm email" (saves you time while testing)
- [ ] **SQL Editor**: write and run the SQL described in `supabase/schema.sql`
  - messages table
  - Row Level Security (RLS) policies
  - add the table to the realtime publication
- [ ] **Table Editor**: check that the `messages` table exists and RLS is ON
- [ ] Write `src/supabaseClient.js`

## Phase 2 — Auth (≈ 1.5 h)

- [ ] `src/context/AuthContext.jsx` — keep track of the logged-in user everywhere
- [ ] Wrap `<App />` in `<AuthProvider>` and `<BrowserRouter>` inside `src/main.jsx`
- [ ] `src/pages/Auth.jsx` — sign up / log in form
- [ ] `src/components/ProtectedRoute.jsx` — bounce logged-out users to `/auth`
- [ ] `src/App.jsx` — set up the routes
- [ ] ✅ Test: sign up a new user → see them in Supabase **Authentication → Users**
- [ ] ✅ Test: log out, log back in, refresh page — you should stay logged in

## Phase 3 — Navbar (≈ 30 min)

- [ ] `src/components/Navbar.jsx` — links to Chat & News, shows user email, logout button
- [ ] ✅ Test: logout sends you back to `/auth`

## Phase 4 — Real-time chat (≈ 2.5 h) ← hardest part

- [ ] `src/components/MessageBubble.jsx` — one chat message
- [ ] `src/pages/ChatRoom.jsx`
  - [ ] load old messages on mount
  - [ ] subscribe to new INSERTs (realtime) + clean up on unmount
  - [ ] send-message form
  - [ ] auto-scroll to the bottom
- [ ] ✅ Test: open the app in TWO browsers (e.g. normal + incognito) with two users and chat between them. Messages must appear without refreshing.

## Phase 5 — News feed (≈ 1.5 h)

- [ ] Sign up for a free key at https://gnews.io and put it in `.env.local` as `VITE_GNEWS_API_KEY`
  - Why GNews and not NewsAPI.org? NewsAPI's free plan blocks requests from the browser once deployed (only works on localhost). GNews free tier works from the browser.
- [ ] `src/services/newsApi.js` — the function that calls the API
- [ ] `src/components/NewsCard.jsx` — one article card
- [ ] `src/pages/NewsFeed.jsx` — loading / error / list of cards
- [ ] ✅ Test: page shows car/mechanic news with images and working "Read more" links

## Phase 6 — Polish (≈ 1.5 h)

- [ ] Consistent colours/spacing with Tailwind (pick 1 main colour, e.g. orange or red for "auto")
- [ ] Looks OK on mobile (use browser DevTools device mode)
- [ ] Loading + error states everywhere (auth, chat, news)
- [ ] Disable the send/login buttons while a request is running
- [ ] Use `lucide-react` icons (e.g. `Car`, `MessageCircle`, `Newspaper`, `LogOut`, `Send`)
- [ ] Change `<title>` in `index.html` to "AutoHub"
- [ ] `npm run lint` — fix warnings
- [ ] `npm run build` — must finish with no errors

## Phase 7 — Ship it (≈ 30 min)

- [ ] Deploy to Vercel or Netlify (import the GitHub repo, framework = Vite)
  - Add the same env variables from `.env.local` in the hosting dashboard
  - Add a rewrite so refreshing `/chat` doesn't 404 (Vercel: `vercel.json` rewrites; Netlify: `public/_redirects` with `/* /index.html 200`)
- [ ] Supabase **Authentication → URL Configuration**: add your deployed URL
- [ ] Update `README.md` with live link + screenshots
- [ ] Commit & push

---

## If you're running out of time — cut in this order
1. Deployment (demo on localhost instead)
2. Mobile polish
3. Auto-scroll in chat
4. NewsCard images

**Never cut:** auth, real-time chat, news list. Those are the deliverable.

## Stretch goals (only if you finish early)
- Usernames / profiles table instead of showing emails
- Multiple chat rooms (add a `room` column to `messages`)
- Search box on the news page (change the `q` query)
- Typing indicator using Supabase Presence
