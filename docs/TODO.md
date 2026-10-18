# AutoHub — TODO

✅ **All the code is written.** How every file works is explained in `docs/TUTOR.md`.
What's left is the setup only you can do (it needs your accounts), testing, and launching.

---

## Phase 1 — Firebase (≈ 15 min)

Free "Spark" plan, no credit card needed.

- [x] Create a project at https://console.firebase.google.com
- [x] Register a web app (`</>` icon) and copy its six config values into `.env.local`
- [ ] **Build → Authentication → Get started → Sign-in method → Email/Password → Enable** (only the first switch)
- [ ] **Build → Firestore Database → Create database** (pick a nearby location, production mode)
- [ ] ⚠ **Firestore Database → Rules**: delete what's there, paste ALL of `firestore.rules`, click **Publish**
  - Do this again even if you published rules before: the new version adds chat rooms and the garage. Without it, chat and the garage will show "Missing or insufficient permissions".

## Phase 2 — Live news (optional, ≈ 5 min)

Without this, the News page shows built-in demo stories (with a yellow banner).

- [ ] Sign up at https://gnews.io and copy your API key
- [ ] Add `VITE_GNEWS_API_KEY=your_key` to `.env.local`
- [ ] Restart `npm run dev`

## Phase 3 — Test it (≈ 20 min)

Run `npm run dev` and work through the **Testing checklist** in `docs/TUTOR.md` section 11. The important ones:

- [ ] Sign up with your name → it shows in the navbar
- [ ] Chat between a normal window and an incognito window (two accounts), in a couple of rooms
- [ ] Diagnose → symptom → Run diagnosis → **Ask in Repair Help** lands in chat with text ready
- [ ] News: filter, search, bookmark, open a story
- [ ] Garage: try a sample VIN → check recalls → save it → refresh → still there
- [ ] Check it at phone size (F12 → device toolbar)
- [ ] `npm run lint` and `npm run build` both pass

## Phase 4 — Ship it (≈ 30 min)

- [ ] Commit & push to GitHub
- [ ] Deploy on Vercel or Netlify (import the repo, framework = Vite)
  - Add every variable from `.env.local` in the hosting dashboard's Environment Variables
  - Page-refresh rewrites are already included (`vercel.json`, `public/_redirects`)
- [ ] Firebase **Authentication → Settings → Authorized domains → Add domain**: your live domain (e.g. `autohub.vercel.app`)
- [ ] Add the live link and a few screenshots to `README.md`

---

## Stretch ideas

- Profile page: change your display name (`updateProfile`) and see your message count
- Typing indicator: a `rooms/{room}/typing/{uid}` document set while typing, shown with `onSnapshot`
- Reactions on messages (needs an `update` rule that only allows changing a `reactions` field)
- Service reminders in the Garage: store last service mileage and show "oil change due in 1,200 km"
- Code-split pages with `React.lazy` to shrink the first download
