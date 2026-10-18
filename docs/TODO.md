# AutoHub — TODO (start → finish)

Tick each box as you go. Time estimates assume ~10 hours total.
Every file in `src/` already has comments telling you what to write in it, with lessons and examples.
Read `docs/TUTOR.md` sections 1–4 first. Designs to copy: `src/assets/mockups/*.svg`.

---

## Phase 0 — Setup (≈ 45 min)

- [x] Scaffold Vite + React project
- [x] Install `react-router-dom`, `lucide-react`
- [x] Install `firebase` (replaced Supabase)
- [ ] Install Tailwind CSS (v4, Vite plugin):
  - `npm install tailwindcss @tailwindcss/vite`
  - In `vite.config.js`: import `tailwindcss` from `@tailwindcss/vite` and add `tailwindcss()` to the `plugins` array
  - In `src/index.css`: delete everything and put `@import "tailwindcss";` as the only line
  - Delete `src/App.css` and its import (you'll use Tailwind classes instead)
- [ ] Delete the demo images you won't use (`src/assets/hero.png`, `react.svg`, `vite.svg`)
- [ ] Copy `.env.example` → `.env.local` (it's already git-ignored, never commit it)

## Phase 1 — Firebase (≈ 45 min)

Free "Spark" plan, no credit card needed.

- [ ] Go to https://console.firebase.google.com → **Create a project** (name it `autohub`; Google Analytics can be OFF)
- [ ] Project overview → click the **Web icon `</>`** → register an app (no need for Firebase Hosting)
  - copy the six values from the `firebaseConfig` it shows into `.env.local`
  - lost it? **Project settings (gear) → General → Your apps → SDK setup and configuration → Config**
- [ ] **Build → Authentication → Get started → Sign-in method → Email/Password → Enable** (only the first switch, not "Email link")
- [ ] **Build → Firestore Database → Create database**
  - pick a location close to you (can't be changed later)
  - choose **production mode** (everything locked until you write rules)
- [ ] Write the rules described in `firestore.rules`, paste them into **Firestore Database → Rules** → **Publish**
- [ ] Write `src/firebase.js`

## Phase 2 — Auth (≈ 1.5 h)

- [ ] `src/context/AuthContext.jsx` — keep track of the logged-in user everywhere
- [ ] Wrap `<App />` in `<AuthProvider>` and `<BrowserRouter>` inside `src/main.jsx`
- [ ] `src/pages/Auth.jsx` — sign up / log in form
- [ ] `src/components/ProtectedRoute.jsx` — bounce logged-out users to `/auth`
- [ ] `src/App.jsx` — set up the routes
- [ ] ✅ Test: sign up a new user → see them in Firebase console **Authentication → Users**
- [ ] ✅ Test: log out, log back in, refresh page — you should stay logged in

## Phase 3 — Navbar (≈ 30 min)

- [ ] `src/components/Navbar.jsx` — links to Chat & News, shows user email, logout button
- [ ] ✅ Test: logout sends you back to `/auth`

## Phase 4 — Real-time chat (≈ 2.5 h) ← hardest part

- [ ] `src/components/MessageBubble.jsx` — one chat message
- [ ] `src/pages/ChatRoom.jsx`
  - [ ] listen to the `messages` collection with `onSnapshot` (loads history AND live updates) + unsubscribe on unmount
  - [ ] send-message form
  - [ ] auto-scroll to the bottom
- [ ] ✅ Test: check **Firestore Database → Data** — your messages appear as documents
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
- [ ] Firebase **Authentication → Settings → Authorized domains → Add domain**: add your deployed domain (e.g. `autohub.vercel.app`)
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
- Usernames / a `users` collection instead of showing emails
- Multiple chat rooms (add a `room` field to messages and filter with `where('room', '==', ...)`)
- Search box on the news page (change the `q` query)
- Typing indicator (a `typing/{uid}` document you set/delete while typing, listened to with `onSnapshot`)
