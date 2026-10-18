# AutoHub — The Tutor 🎓

This guide explains **everything** in AutoHub: what it does, how the pieces fit together, every file, every important line, and the React / Firebase / Tailwind ideas behind them. The code files have no comments, so this is where all the explanation lives.

**How to read it**

1. Read sections 1–4 once, top to bottom. That's the big picture.
2. Read section 5 (React crash course) if any React word feels fuzzy.
3. Use section 7 (file by file) as a reference: open a file in your editor and its section here side by side.
4. Sections 10–13 are for when something breaks or you want to add features.

> Setup checklist (accounts, keys, deploy) → `docs/TODO.md`

---

## Contents

1. [What AutoHub is](#1-what-autohub-is)
2. [Running it](#2-running-it)
3. [The big picture](#3-the-big-picture)
4. [Folder & file map](#4-folder--file-map)
5. [React crash course](#5-react-crash-course)
6. [Firebase explained](#6-firebase-explained)
7. [File by file](#7-file-by-file)
8. [The design system (Tailwind)](#8-the-design-system-tailwind)
9. [External APIs & mock data](#9-external-apis--mock-data)
10. [How to add things](#10-how-to-add-things)
11. [Testing checklist](#11-testing-checklist)
12. [Common errors & fixes](#12-common-errors--fixes)
13. [Glossary](#13-glossary)
14. [Presenting the project](#14-presenting-the-project)

---

## 1. What AutoHub is

AutoHub is a dark, app-like web app for mechanics and car people. After logging in you get five sections:

| Section | What you can do | What powers it |
|---|---|---|
| **Home** | Greeting, quick-access tiles, top stories, a mechanic tip of the day, a live preview of the General chat | Firestore + news service + local data |
| **Chat** | Four live chat rooms (General, Repair Help, EV & Hybrids, Classics & Builds), avatars, quick emoji, delete your own messages | Firebase Auth + Cloud Firestore (`onSnapshot`) |
| **News** | Featured top story, category filters, search, bookmarks, an article reader pop-up | GNews API, with built-in demo stories when there's no key |
| **Diagnose** | A glowing instrument cluster: tap a warning light to decode it. A symptom checker that "scans" and ranks likely causes with cost and difficulty | Local data files |
| **Garage** | Decode any VIN, check the car for official safety recalls, save cars to "My garage" | NHTSA's free government APIs + Firestore |

Features talk to each other: from Diagnose you can press **Ask in Repair Help** and land in the chat with a message already typed for you.

The tech:

- **React**: builds the UI out of components.
- **Vite**: the dev server and build tool (`npm run dev`, `npm run build`).
- **React Router**: switches pages without reloading.
- **Firebase** (by Google, free Spark plan): login (Authentication) and a live database (Cloud Firestore).
- **Tailwind CSS v4**: styling with classes like `rounded-2xl bg-zinc-900 p-6`.
- **lucide-react**: icon components (`<Car />`, `<Send />`, `<Engine />`).
- **Unsplash**: the car photos (loaded straight from `images.unsplash.com`).

---

## 2. Running it

```bash
npm install        # once, downloads the packages
npm run dev        # starts the app at http://localhost:5173
npm run lint       # checks the code for mistakes
npm run build      # makes the production version in dist/
```

The app needs a `.env.local` file in the project root (next to `package.json`):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GNEWS_API_KEY=...        ← optional; without it you get demo stories
```

And in the Firebase console you must have: Email/Password sign-in **enabled**, a Firestore database **created**, and the rules from `firestore.rules` **published**. Full steps in `docs/TODO.md`.

> ⚠ After changing `.env.local`, stop `npm run dev` (Ctrl+C) and start it again. Vite only reads env files when it starts.

---

## 3. The big picture

### 3.1 How the app is wired

```
index.html
  └── main.jsx
        └── <BrowserRouter>                 makes routing work
              └── <AuthProvider>            knows who is logged in (useAuth)
                    └── <App>               decides which page to show
                          ├── /auth  → Auth (login / sign-up)
                          └── /      → ProtectedRoute → Layout
                                         ├── Navbar        (top bar, desktop links)
                                         ├── <Outlet/>     ← the current page goes here
                                         │     ├── /              Home
                                         │     ├── /chat/:roomId  ChatRoom → RoomList + ChatPanel → MessageBubble
                                         │     ├── /news          NewsFeed → FeaturedStory, NewsCard, ArticleModal
                                         │     ├── /diagnose      Diagnose → WarningLights / SymptomChecker
                                         │     └── /garage        Garage → RecallList, VehicleCard
                                         └── MobileNav     (bottom tab bar on phones)
```

Where the data comes from:

```
   firebase.js ──────► FIREBASE  (Auth: accounts · Firestore: chat messages + saved cars)
   services/newsApi.js ──► GNews API ──(fails / no key)──► data/mockNews.js
   services/vehicleApi.js ──► NHTSA vPIC (VIN decode) + NHTSA Recalls
   data/*.js ──► local content: rooms, warning lights, symptoms, tips, photos
   hooks/useBookmarks.js ──► the browser's localStorage (saved articles)
```

### 3.2 How logging in works

```
Auth.jsx calls signInWithEmailAndPassword(auth, email, password)
   → Firebase checks the password and remembers the login in the browser
   → onAuthStateChanged (in AuthContext) fires with the user
   → AuthContext turns it into { uid, email, name } and calls setUser
   → App re-renders: user exists → /auth redirects to / → Home appears
```

After a refresh, `onAuthStateChanged` fires again by itself with the remembered user, so you stay logged in.

### 3.3 How a chat message travels

```
You type "hello" in Repair Help → handleSend() in ChatPanel
   → addDoc(collection(db, 'rooms', 'repair', 'messages'), { content, userId, userName, createdAt })
   → Firestore checks firestore.rules, then saves it
   → every onSnapshot listener on rooms/repair/messages is told "the list changed"
     (yours AND everyone else's who has Repair Help open)
   → setMessages(newList) → the bubble appears everywhere
```

### 3.4 How the news decides real vs demo

```
NewsFeed / Home call getNews()
   → no VITE_GNEWS_API_KEY?          → return demo stories (data/mockNews.js)
   → key exists → fetch GNews
        → works                      → return real articles (tidied by normalize())
        → error (bad key, limit hit) → return demo stories + the reason
```

So the news page **always** shows something. A yellow banner tells you when you're looking at demo stories.

### 3.5 How a VIN lookup works

```
Garage: you type a VIN → lookUp()
   → check it's 17 valid characters (VIN_PATTERN)
   → decodeVin() calls NHTSA vPIC → { year, make, model, trim, specs }
   → "Check safety recalls" → getRecalls({ make, model, year }) → list of recalls
   → "Save to my garage" → addDoc(collection(db, 'users', uid, 'vehicles'), {...})
   → onSnapshot on your vehicles list → the card appears in "My garage"
```

---

## 4. Folder & file map

```
autohub/
├── .env.example            Template for your keys (copy → .env.local)
├── .env.local              YOUR keys. Git-ignored. Never commit.
├── index.html              The one HTML page: fonts, <title>, <div id="root">
├── vite.config.js          Vite plugins: React, Tailwind, React Compiler
├── eslint.config.js        Lint rules (npm run lint)
├── firestore.rules         Database security rules → paste into Firebase console
├── vercel.json             Makes page refreshes work on Vercel
├── public/_redirects       Same thing for Netlify
├── docs/
│   ├── TODO.md             Setup & launch checklist
│   └── TUTOR.md            This file
└── src/
    ├── main.jsx            Entry point: Router + AuthProvider around App
    ├── App.jsx             All the routes
    ├── index.css           Tailwind + fonts + custom animations
    ├── firebase.js         Connects to Firebase; exports auth and db
    ├── context/
    │   └── AuthContext.jsx Who is logged in → useAuth()
    ├── pages/              One per URL
    │   ├── Auth.jsx        Login / sign-up
    │   ├── Home.jsx        Dashboard
    │   ├── ChatRoom.jsx    Picks the room from the URL
    │   ├── NewsFeed.jsx    News with filters, search, bookmarks
    │   ├── Diagnose.jsx    Tabs: warning lights / symptom checker
    │   └── Garage.jsx      VIN lookup, recalls, saved cars
    ├── components/         Building blocks used by pages
    │   ├── Layout.jsx          Navbar + page + MobileNav
    │   ├── ProtectedRoute.jsx  Sends logged-out users to /auth
    │   ├── Navbar.jsx          Top bar
    │   ├── MobileNav.jsx       Bottom tab bar (phones)
    │   ├── Logo.jsx            The AutoHub logo
    │   ├── Avatar.jsx          Coloured circle with initials
    │   ├── PageHeader.jsx      Eyebrow + big title + subtitle
    │   ├── RoomList.jsx        Chat room sidebar / chips
    │   ├── ChatPanel.jsx       One live chat room
    │   ├── MessageBubble.jsx   One chat message
    │   ├── FeaturedStory.jsx   Big top-story banner
    │   ├── NewsCard.jsx        One article card
    │   ├── BookmarkButton.jsx  Save / unsave toggle
    │   ├── ArticleModal.jsx    Article reader pop-up
    │   ├── WarningLights.jsx   Instrument cluster + light details
    │   ├── SymptomChecker.jsx  Pick symptom → scan → causes
    │   ├── RecallList.jsx      Recall results
    │   └── VehicleCard.jsx     One car in "My garage"
    ├── services/           Plain JavaScript that talks to outside APIs
    │   ├── newsApi.js      getNews() with demo fallback
    │   └── vehicleApi.js   decodeVin(), getRecalls()
    ├── hooks/
    │   └── useBookmarks.js Saved articles in localStorage
    ├── data/               Content that lives in the app itself
    │   ├── mockNews.js     14 demo stories
    │   ├── rooms.js        The 4 chat rooms
    │   ├── warningLights.js 12 dashboard lights
    │   ├── symptoms.js     13 symptoms with ranked causes
    │   ├── tips.js         Mechanic tips of the day
    │   ├── navLinks.js     The 5 menu links
    │   └── photos.js       Unsplash photo ids
    └── utils/
        └── format.js       Small helpers: photo URLs, initials, time ago...
```

**Pages vs components vs services vs data:**
- A **page** is a whole screen tied to a URL.
- A **component** is a reusable building block.
- A **service** is plain JavaScript (no React) that fetches from an API.
- A **hook** is reusable React logic (its name starts with `use`).
- **data** files are just arrays/objects of content. To change the text of a warning light or add a chat room, you edit data, not components.

---

## 5. React crash course

### 5.1 Components & JSX

```jsx
function Welcome({ name }) {
  return <h1 className="text-xl">Hi {name}</h1>
}
export default Welcome

<Welcome name="Karl" />
```

- A component is a **function that returns JSX** (HTML-looking code). Names start with a **Capital letter**.
- `class` becomes `className`. `for` becomes `htmlFor`.
- `{ }` puts JavaScript into JSX: `{user.name}`, `{2 + 2}`.
- Return **one** parent element; use `<> </>` (a Fragment) if you don't want an extra div. `RoomList.jsx` does this.
- `export default X` → import without braces: `import X from './X'`.
  `export function y` / `export const y` → import with braces: `import { y } from './file'`.

### 5.2 Props

```jsx
<MessageBubble message={m} isOwn={true} showHeader={false} onDelete={() => handleDelete(m.id)} />
function MessageBubble({ message, isOwn, showHeader, onDelete }) { ... }
```

Props flow **down** from parent to child. A child can't change its props. To let a child "talk back", the parent passes a **function** as a prop (`onDelete`, `onOpen`, `onToggleSave`) and the child calls it.

`children` is a special prop: whatever is between the tags. `<ProtectedRoute><Layout /></ProtectedRoute>` → `children` is `<Layout />`.

### 5.3 State

```jsx
const [draft, setDraft] = useState('')
setDraft('hi')                       // React re-draws the component
setDraft((current) => current + '👍') // "updater" form: based on the latest value
```

- Never change state directly (`list.push(x)` ❌). Always call the setter with a **new** value.
- **Lazy initial state:** `useState(loadSaved)` or `useState(() => new Date())` runs the function only on the first render. Used in `useBookmarks` (read localStorage once) and `Home` (fix "now" once).
- **Grouped state:** when values always change together, keep them in one object:
  `const [lookup, setLookup] = useState({ status: 'idle', vehicle: null, error: '' })` (Garage).

### 5.4 Effects (and cleanup)

```jsx
useEffect(() => {
  const unsubscribe = onSnapshot(q, ...)   // start something
  return unsubscribe                        // cleanup: stop it
}, [room.id])                               // re-run when room.id changes
```

- `[]` = run once when the component appears. `[x]` = also whenever `x` changes.
- The returned function is the **cleanup**. React runs it before re-running the effect and when the component disappears. It stops listeners, timers and subscriptions, so you don't get duplicates or leaks.
- You **can't** write `useEffect(async () => ...)`. Do the async work inside, e.g. `getNews().then(...)`.
- The "**active flag**" pattern (NewsFeed, Home): if the page closes before the fetch finishes, don't set state on it:
  ```js
  let active = true
  getNews().then((result) => { if (active) setNews(result) })
  return () => { active = false }
  ```

### 5.5 Refs

```jsx
const bottomRef = useRef(null)
<div ref={bottomRef} />
bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
```

A ref holds a value that **doesn't** trigger a re-render. Two uses here:
- Point at a real DOM element (auto-scroll in chat, focusing the input after picking an emoji).
- Remember a timer id between renders (`timer` in SymptomChecker).

### 5.6 Context

```
createContext() → <AuthContext.Provider value={...}> wraps the app → useContext(AuthContext) anywhere inside
```

`useAuth()` is a small wrapper around `useContext(AuthContext)`. It avoids passing `user` through every component as a prop ("prop drilling").

### 5.7 Lists & keys

```jsx
{messages.map((m) => <MessageBubble key={m.id} message={m} />)}
```

`key` must be **unique and stable**: a document id, a URL, a slug. React uses it to know which item is which when the list changes.

### 5.8 Events & forms

```jsx
<input value={email} onChange={(e) => setEmail(e.target.value)} />   // "controlled" input
<form onSubmit={handleSubmit}>                                        // call e.preventDefault() inside!
<button onClick={signOut}>                                            // pass the function...
<button onClick={() => handleDelete(m.id)}>                           // ...or wrap it to add arguments
```

- `onClick={signOut()}` ❌ would run immediately while drawing.
- Inside a `<form>`, a button without `type` **submits**. Use `type="button"` for other buttons (the password eye, emoji buttons).
- `e.stopPropagation()` stops a click from also reaching the parent. `ArticleModal` uses it so clicking inside the article doesn't close it.

### 5.9 Conditional rendering

```jsx
{loading && <Spinner />}                         // show only if true
{isSignUp ? 'Create account' : 'Log in'}         // pick one of two
if (!room) return <Navigate to="/chat/general" replace />   // early return
```

### 5.10 Routing (React Router)

- `<Routes>` shows the **one** `<Route>` matching the URL.
- **Nested routes + `<Outlet />`**: in `App.jsx`, the `/` route renders `Layout`, and its children (`chat/:roomId`, `news`...) render **inside** Layout where `<Outlet />` is. That's how the Navbar stays on every page without repeating it.
- **URL parameters**: `path="chat/:roomId"` + `const { roomId } = useParams()` → visiting `/chat/repair` gives `roomId = 'repair'`.
- **Navigation state**: `navigate('/chat/repair', { state: { draft: '...' } })` sends data along with the navigation. The next page reads it with `useLocation().state`. Diagnose uses this to pre-fill the chat box. Home uses it to open a specific article on the news page (`<Link to="/news" state={{ openId }}>`).
- `<NavLink>` knows if it's the current page (`isActive`), so the menu can highlight it. `end` on the Home link means "only active on exactly `/`".
- `<Navigate to="..." replace />` redirects. `replace` means the Back button won't return to the blocked page.

### 5.11 The `key` trick to reset a component

```jsx
<ChatPanel key={room.id} room={room} />
```

When `key` changes, React throws the old component away and builds a fresh one, so all its state resets. Switching rooms gives a clean panel (empty list, spinner, fresh draft) without writing reset code. The same trick restarts the fade-in animation when you pick another warning light (`<div key={light.id} className="animate-fade-up">`).

### 5.12 Custom hooks

A function whose name starts with `use` and that uses other hooks. `useBookmarks()` bundles "saved list in state + save to localStorage + helpers" so any component can use it in one line.

### 5.13 async / await / try / catch / finally

```js
try {
  const vehicle = await decodeVin(clean)   // wait; if it throws, jump to catch
  setLookup({ status: 'done', vehicle, error: '' })
} catch (err) {
  setLookup({ status: 'error', vehicle: null, error: err.message })
}
```

- `fetch` does **not** throw on 404/500, so the services check `res.ok` and `throw` their own error.
- Firebase functions **do** throw, so we wrap them in `try/catch`.

### 5.14 Little JavaScript bits you'll see

| Code | Meaning |
|---|---|
| `a?.b` | "optional chaining": `undefined` instead of crashing if `a` is null |
| `a ?? b` | use `b` only if `a` is `null`/`undefined` |
| `x ??= y` | set `x` to `y` only if `x` is null/undefined (`newsApi.js` cache) |
| `{ ...obj, extra: 1 }` | copy all fields of `obj` into a new object |
| `[first, ...rest]` | take the first item, put the rest in an array |
| `` `Hi ${name}` `` | template string |
| `({ icon: Icon })` | destructure the `icon` property and rename it `Icon` (capital, so it can be used as `<Icon />`) |
| `array.find / filter / some / map / slice` | find one item / keep matching items / "is there any?" / transform each / take part |

---

## 6. Firebase explained

### 6.1 What you use

- **Authentication**: accounts, passwords and "who is logged in". Functions from `firebase/auth`.
- **Cloud Firestore**: a NoSQL database of **collections** (folders) and **documents** (records). Functions from `firebase/firestore`.

Everything here fits in the free Spark plan.

### 6.2 Where the data lives

```
rooms/                          (collection)
  general/                      (document — doesn't even need fields)
    messages/                   (sub-collection)
      aB3x9...                  { content, userId, userName, createdAt }
  repair/messages/...
  ev/messages/...
  classics/messages/...

users/
  {your uid}/
    vehicles/
      Kp2...                    { vin, nickname, year, make, model, mileage, createdAt }
```

- Sub-collections give each room its own message list, and each user their own cars. No extra database setup is needed: collections appear the first time something is saved into them.
- A path alternates collection / document / collection / document, which is why the code writes `collection(db, 'rooms', room.id, 'messages')` and `doc(db, 'rooms', room.id, 'messages', messageId)`.

### 6.3 The functions you use

| Function | What it does | Used in |
|---|---|---|
| `onAuthStateChanged(auth, cb)` | Calls `cb(user)` now and on every login/logout | AuthContext |
| `createUserWithEmailAndPassword` | Makes an account (also logs in) | Auth |
| `signInWithEmailAndPassword` | Logs in | Auth |
| `updateProfile(user, { displayName })` | Saves the user's name on their account | Auth |
| `signOut(auth)` | Logs out | AuthContext |
| `collection(db, ...path)` | Points at a collection | everywhere |
| `doc(db, ...path)` | Points at one document | delete message/car |
| `query(col, orderBy(...), limitToLast(n))` | Describes which documents, in what order | Chat, Home, Garage |
| `onSnapshot(query, onData, onError)` | Listens live; returns an unsubscribe function | Chat, Home, Garage |
| `addDoc(col, data)` | Adds a document with an auto id | send message, save car |
| `deleteDoc(docRef)` | Deletes a document | delete message, remove car |
| `serverTimestamp()` | "Use Google's clock" for this field | `createdAt` |

### 6.4 `serverTimestamp()` and `{ serverTimestamps: 'estimate' }`

When you send a message, Firestore shows it to you **instantly**, before the server has confirmed it. At that moment the server hasn't filled in the time yet, so `createdAt` would be `null`. Reading documents with:

```js
d.data({ serverTimestamps: 'estimate' })
```

gives a best-guess time instead of `null`, so bubbles always have a time and grouping works.

### 6.5 Errors

Firebase throws errors with a `code`. Auth codes look like `auth/invalid-credential`. `Auth.jsx` turns the common ones into friendly text with the `FRIENDLY_ERRORS` object. Firestore's most common error is `permission-denied` ("Missing or insufficient permissions"), which means the rules said no. See 7.8.

### 6.6 Is my Firebase config secret?

No. The `apiKey` etc. end up in the browser no matter what. Security comes from **Security Rules** (`firestore.rules`), which run on Google's servers and can't be bypassed from the browser.

---

## 7. File by file

Each section names the file, says what it does, then walks through the important code.

### 7.1 `index.html`

The one real HTML page. It loads the **Inter** (body text) and **Space Grotesk** (headings) fonts from Google Fonts, sets the tab title "AutoHub", sets the phone browser bar colour (`theme-color`), and has `<div id="root">` where React draws everything.

### 7.2 `src/index.css`

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ...;
  --font-display: "Space Grotesk", ...;
  --animate-fade-up: fade-up 0.5s ease-out both;
  --animate-scan: scan 1.4s ease-in-out infinite;
  @keyframes fade-up { ... }
  @keyframes scan { ... }
}
```

- `@import "tailwindcss"` switches Tailwind on.
- `@theme` adds your own design tokens. Each variable creates classes:
  - `--font-display` → the class `font-display` (headings use it).
  - `--animate-fade-up` → the class `animate-fade-up`: things slide up 12px and fade in.
  - `--animate-scan` → `animate-scan`: the light sweeping across the symptom scanner bar.
- `@keyframes` describe an animation from start (`from`) to end (`to`).
- `@utility no-scrollbar` creates a class that hides scrollbars on the sideways-scrolling chip rows.
- `body { @apply bg-zinc-950 ... }` uses Tailwind classes inside CSS to make the whole page dark.
- `color-scheme: dark` tells the browser to draw its own controls (scrollbars, date pickers) dark too.

### 7.3 `src/main.jsx`

```jsx
<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <App />
```

Starts React inside `#root` and wraps the app in providers. **Order matters**: outer wrappers are available to inner ones. `StrictMode` runs some code twice in development to catch bugs, so a `console.log` printing twice is normal.

### 7.4 `src/firebase.js`

```js
const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, ... }
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) throw new Error('Firebase config is missing ...')
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

- `import.meta.env.VITE_...` reads `.env.local`. Only names starting with `VITE_` reach the browser.
- If the config is missing, it **throws on purpose**. You'd see a white page with that message in the console (F12) instead of a confusing Firebase error later.
- Exports two tools: `auth` (login) and `db` (database).

### 7.5 `src/context/AuthContext.jsx`

```jsx
function toProfile(firebaseUser) {
  if (!firebaseUser) return null
  return { uid: firebaseUser.uid, email: firebaseUser.email,
           name: firebaseUser.displayName || firebaseUser.email.split('@')[0] }
}
```

Turns Firebase's big user object into a small plain one: `{ uid, email, name }`. If someone has no display name, the part of their email before the `@` is used.

```jsx
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(toProfile(firebaseUser))
    setLoading(false)
  })
  return unsubscribe
}, [])
```

Listens for login/logout for the whole life of the app. The first call happens straight away. Until then `loading` is true and a spinner shows instead of the app, so you never see the login page flash while Firebase checks.

```jsx
const value = {
  user,
  signOut: () => signOut(auth),
  refreshUser: () => setUser(toProfile(auth.currentUser)),
}
```

What every component gets from `useAuth()`:
- `user`: `{ uid, email, name }` or `null`.
- `signOut()`: logs out.
- `refreshUser()`: re-reads the current user. After sign-up, `Auth.jsx` saves your name with `updateProfile`, but Firebase doesn't announce that change. Calling `refreshUser()` builds a **new** profile object, so React notices and the Navbar shows your name immediately.

`eslint.config.js` has one extra rule setting (`allowExportNames: ['useAuth']`). The linter normally complains when a component file also exports a non-component; this tells it `useAuth` is fine.

### 7.6 `src/App.jsx`

```jsx
<Routes>
  <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index element={<Home />} />
    <Route path="chat" element={<Navigate to="/chat/general" replace />} />
    <Route path="chat/:roomId" element={<ChatRoom />} />
    <Route path="news" element={<NewsFeed />} />
    <Route path="diagnose" element={<Diagnose />} />
    <Route path="garage" element={<Garage />} />
  </Route>
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

- `/auth`: if already logged in, go home; otherwise show the login page. This is also how you "get moved" after logging in: `user` changes, App re-renders, this line redirects.
- The `/` route is the **layout route**: logged-out users are bounced by `ProtectedRoute`; logged-in users get `Layout`, and the child route renders inside its `<Outlet />`.
- `index` = the child shown at exactly `/`.
- `/chat` on its own redirects to `/chat/general`.
- `*` = any other URL → home.

### 7.7 Layout pieces

**`components/ProtectedRoute.jsx`**: `if (!user) return <Navigate to="/auth" replace />`, otherwise `return children`.

**`components/Layout.jsx`**: `Navbar` + `<main><Outlet /></main>` + `MobileNav`. `pb-16 md:pb-0` adds bottom padding on phones so content isn't hidden behind the bottom tab bar.

**`data/navLinks.js`**: one array describing the five menu entries (path, label, icon). Both menus read it, so they always match.

**`components/Navbar.jsx`**
- `sticky top-0 z-30` keeps it at the top while scrolling. `bg-zinc-950/80 backdrop-blur-lg` makes it see-through with a frosted-glass blur.
- `hidden md:flex` on the links: hidden on phones (MobileNav handles them), shown from 768px.
- `linkClass` is a **function** that NavLink calls with `{ isActive }`, returning orange classes for the current page.
- `NAV_LINKS.map(({ to, label, icon: Icon, end }) => ...)` renames `icon` to `Icon` so it can be drawn as `<Icon size={17} />`.
- Right side: name + email (only on large screens), avatar, logout button.

**`components/MobileNav.jsx`**: `fixed inset-x-0 bottom-0` sticks it to the bottom of the screen; `grid grid-cols-5` gives five equal tabs; `md:hidden` hides it on bigger screens.

**`components/Logo.jsx`**: the gradient square with a car and "Auto**Hub**", linking home.

**`components/Avatar.jsx`**: a circle with initials. `initials('Kwame Mensah')` → `KM`. `avatarColor(seed)` picks one of 8 colours from the user's id, so the **same person always gets the same colour**. Sizes come from a small `SIZES` object (`sm`, `md`, `lg`).

**`components/PageHeader.jsx`**: the "eyebrow" (small orange caps text), big title and subtitle used on every page. `children` lets a page put something on the right, e.g. the news search box.

### 7.8 `firestore.rules`

```
match /rooms/{roomId}/messages/{messageId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null
    && roomId in ['general', 'repair', 'ev', 'classics']
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.content is string
    && request.resource.data.content.size() > 0
    && request.resource.data.content.size() <= 1000
    && request.resource.data.userName is string
    && request.resource.data.userName.size() <= 40
    && request.resource.data.createdAt == request.time;
  allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
  allow update: if false;
}

match /users/{userId}/vehicles/{vehicleId} {
  allow read, delete: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId
    && request.resource.data.vin is string && request.resource.data.vin.size() == 17;
  allow update: if false;
}
```

Vocabulary:
- `{roomId}`, `{userId}` are **wildcards**: they match any id and give you its value.
- `request.auth` = the logged-in user (`null` if logged out). `request.auth.uid` = their id.
- `request.resource.data` = the document someone is **trying to save**.
- `resource.data` = the document **already saved** (used for delete).
- `request.time` = the server's time for this request.

Messages:
- **read**: logged-in users only. This also controls `onSnapshot`.
- **create**: only into the four known rooms, only as **yourself** (`userId` must be your uid), text between 1 and 1000 characters, a name up to 40 characters, and `createdAt` must equal the server time. That last check forces `serverTimestamp()`, so nobody can fake when they posted.
- **delete**: only your **own** messages (the saved message's `userId` is you).
- **update**: nobody.

Vehicles:
- Only **you** can read, add or remove cars under `users/{your uid}`. Nobody can see anyone else's garage.
- A saved car must have a 17-character VIN.

If the browser shows "Missing or insufficient permissions", either these rules aren't published, or the code tried something they forbid.

### 7.9 `src/utils/format.js`

| Helper | What it does | Example |
|---|---|---|
| `photo(id, width)` | Builds an Unsplash image URL at a given width (smaller = faster) | `photo(PHOTO.road, 1800)` |
| `initials(name)` | First letters of up to two words | `'kwame.mensah'` → `KM` |
| `hashString(text)` | Turns text into a number, always the same for the same text | used to pick colours/photos |
| `avatarColor(seed)` | A Tailwind colour class picked by hash | `'bg-sky-500'` |
| `timeAgo(date)` | "just now", "5m ago", "3h ago", "2d ago", or "Oct 12" | news & Home |
| `clockTime(date)` | "14:05" | chat bubbles |
| `greeting(hour)` | Good morning / afternoon / evening | Home hero |
| `dayOfYear(date)` | 1–366 | picks the tip of the day |
| `millis(timestamp)` | A Firestore timestamp → milliseconds (0 if missing) | message grouping |

### 7.10 Data files

All plain arrays/objects. Change these to change content without touching components.

- **`data/photos.js`**: `PHOTO` = named Unsplash photo ids (`road`, `engine`, `garage`...). `GARAGE_PHOTOS` = a pool of car photos; saved cars get one picked by hashing the VIN, so each car keeps the same picture.
- **`data/rooms.js`**: the four chat rooms: `id` (used in the URL and database path), `name`, `emoji`, `description`. The ids must match the list in `firestore.rules`.
- **`data/tips.js`**: mechanic tips; Home shows `TIPS[dayOfYear % TIPS.length]`, so the tip changes daily and cycles round.
- **`data/mockNews.js`**: 14 demo stories (evergreen explainers credited to made-up publications such as "Garage Journal"). Each has `hoursAgo`; the export turns that into a real `publishedAt` relative to *now*, so the stories always look fresh. Each one is marked `isDemo: true` with an empty `url`.
- **`data/warningLights.js`**: 12 lights. Each has `icon` (a lucide component) **or** `text` (for "ABS"), a `color` (`red` / `amber` / `blue`), `meaning`, `causes`, `action`. `SEVERITY` maps each colour to a label and the "Can I keep driving?" answer.
- **`data/symptoms.js`**: `SYMPTOM_GROUPS` (Noises, Smells, Leaks...), `SYMPTOMS` (each with an urgency and a list of `causes`, each cause with `chance` %, `difficulty`, `cost`, `fix`), plus `URGENCY` and `DIFFICULTY` colour classes.

### 7.11 `src/pages/Auth.jsx` — login / sign-up

Layout: a two-column grid on large screens (`lg:grid-cols-2`). Left: a full-height car photo with a dark gradient and the "Your garage. Your crew. Your news." headline plus feature list. Right: the form. On phones the photo becomes a faint background behind the form instead (`opacity-25 lg:hidden`).

State: `isSignUp`, `name`, `email`, `password`, `showPassword`, `error`, `loading`.

```js
if (isSignUp) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName: name.trim() })
  refreshUser()
} else {
  await signInWithEmailAndPassword(auth, email, password)
}
```

- Sign-up creates the account, saves the name on it, then refreshes the profile (see 7.5).
- On success there's nothing else to do: AuthContext notices the login and App redirects.
- On failure, `catch` shows `FRIENDLY_ERRORS[err.code] ?? err.message` and turns loading off.

Other details:
- The Log in / Sign up switch is a "segmented control": two buttons in a rounded box; the active one gets `bg-white/10`.
- The name field only renders when `isSignUp` is true.
- The eye button toggles `type={showPassword ? 'text' : 'password'}`.
- `INPUT` is a shared class string, so all inputs look identical.
- The headline gradient text: `bg-linear-to-r from-orange-500 to-amber-300 bg-clip-text text-transparent` paints a gradient and clips it to the letters.
- The feature list items fade in one after another using `style={{ animationDelay: `${150 + index * 100}ms` }}`.

### 7.12 `src/pages/Home.jsx` — the dashboard

- `const [now] = useState(() => new Date())` fixes the current time once, for the greeting, date and tip.
- **Effect 1**: `getNews()` → keep the first 4 stories (with the active-flag pattern).
- **Effect 2**: `onSnapshot` on the last 4 messages of `rooms/general/messages`: the "Live in General" box updates in real time. If it fails (e.g. rules not published) it just shows the quiet message.
- **Hero**: a photo with `bg-linear-to-r from-zinc-950 via-zinc-950/70 to-transparent` on top, so text on the left stays readable while the car shows on the right.
- **Tiles**: `TILES` array → four photo cards. `group` on the Link + `group-hover:scale-110` on the image = the photo zooms when you hover the card.
- **Top stories**: each row is `<Link to="/news" state={{ openId: story.id }}>`, so the news page opens with that article's reader already open.
- **Tip of the day** card and **Live in General** list (with `Avatar`s).

### 7.13 Chat

**`pages/ChatRoom.jsx`**
```jsx
const { roomId } = useParams()
const room = ROOMS.find((r) => r.id === roomId)
if (!room) return <Navigate to="/chat/general" replace />
...
<RoomList />
<ChatPanel key={room.id} room={room} initialDraft={location.state?.draft ?? ''} />
```
- Reads the room from the URL; unknown rooms redirect to General.
- `key={room.id}` resets the panel when you switch rooms (5.11).
- `initialDraft` is the pre-typed text sent from Diagnose (5.10).
- Height: `h-[calc(100dvh-8rem)]` on phones (screen height minus top bar and bottom tabs), `md:h-[calc(100dvh-4rem)]` on bigger screens (no bottom tabs). `dvh` = "dynamic viewport height", which behaves properly with phone browser toolbars.

**`components/RoomList.jsx`**: two versions in one component. A sidebar list for `md` and up (`hidden ... md:flex`), and a sideways-scrolling row of chips for phones (`md:hidden`). Both are `NavLink`s to `/chat/<id>`, so the current room is highlighted automatically.

**`components/ChatPanel.jsx`**: one live room.

```js
const q = query(collection(db, 'rooms', room.id, 'messages'), orderBy('createdAt'), limitToLast(150))
const unsubscribe = onSnapshot(q, (snapshot) => {
  const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
  setMessages(list)
  setLoading(false)
}, (err) => { setError(err.message); setLoading(false) })
return unsubscribe
```
- `orderBy('createdAt')` + `limitToLast(150)` = "the newest 150, shown oldest to newest".
- Firestore sends the **whole list** every time, so we **replace** state rather than appending. That's why we never add our own message manually: it would appear twice.

```js
await addDoc(collection(db, 'rooms', room.id, 'messages'), {
  content: text, userId: user.uid, userName: user.name, createdAt: serverTimestamp(),
})
```
- The box is cleared first (feels instant). If saving fails, the text is put back and the error shows.
- Each message stores `userName`, so bubbles can show names without looking anyone up.

Deleting: `deleteDoc(doc(db, 'rooms', room.id, 'messages', messageId))` after a `window.confirm`. The rules only allow it for your own messages.

**Message grouping**: if the previous message is from the same person and less than 5 minutes older, the bubble is "grouped": no avatar or name, smaller gap. That's how real chat apps keep conversations tidy:
```js
const grouped = previous && previous.userId === message.userId
  && millis(message.createdAt) - millis(previous.createdAt) < GROUP_WINDOW_MS
```

Quick emoji: `setDraft((current) => current + emoji)` then `inputRef.current?.focus()` puts the cursor back in the box.

The "Live" badge's pulsing dot uses two stacked spans: one with `animate-ping` (expanding ring) under a solid dot.

**`components/MessageBubble.jsx`**
- Your messages: `flex-row-reverse` (avatar on the right), orange gradient bubble. Others: left, `bg-white/10`.
- `showHeader` decides whether to draw avatar + name + time.
- `whitespace-pre-wrap` keeps line breaks; `break-words` wraps very long words.
- The delete button: always visible on phones, but on desktop only when you hover the message (`md:opacity-0 md:group-hover:opacity-100`).

### 7.14 News

**`services/newsApi.js`**

```js
let cached = null
export function getNews() {
  cached ??= loadNews()
  return cached
}
```
`getNews` returns the same **promise** every time. Home and News share **one** request per page load, which protects GNews's free limit of 100 requests a day.

`loadNews()`:
1. No key → `{ articles: MOCK_NEWS, isDemo: true, reason: 'No GNews API key in .env.local' }`.
2. Otherwise fetch GNews; if `!res.ok` or no articles → `throw`.
3. Success → `data.articles.map(normalize)`.
4. `catch` → demo stories plus the error as `reason` (shown in the yellow banner).

`normalize(article)` converts a GNews article into **the same shape as a demo story** (`id, title, description, body, category, source, image, publishedAt, readMinutes, url`), so every component works with both. It also:
- picks a **category** with `categorize()`, which tests the title/description against keyword patterns (`/\b(ev|electric|battery...)\b/i` → "Electric") and falls back to "Industry";
- trims GNews's `"... [1234 chars]"` ending from the content;
- estimates the read time.

**`hooks/useBookmarks.js`**
```js
const [saved, setSaved] = useState(loadSaved)
function toggle(article) { ...add or remove...; setSaved(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
function isSaved(id) { return saved.some((item) => item.id === id) }
return { saved, toggle, isSaved }
```
- `localStorage` is a small key–value store **in your browser**. It survives refreshes but isn't shared with other devices or users.
- It only stores text, so the list is turned into JSON with `JSON.stringify` and back with `JSON.parse`.
- Reading/writing is wrapped in `try/catch` because private browsing modes can block it.
- The **whole article** is saved, so the Saved tab works even when the live news has changed.

**`pages/NewsFeed.jsx`**
- `news` state: `{ loading, articles, isDemo, reason }`.
- When the news arrives, if the URL state carries `openId` (from Home), that article opens straight away.
- Filtering is calculated on every render (no extra state needed):
  ```js
  const source = showSaved ? saved : news.articles
  const visible = source.filter((a) =>
    (category === 'All' || a.category === category) &&
    (!term || `${a.title} ${a.description}`.toLowerCase().includes(term)))
  ```
- The **featured story** is the first visible article, shown only on "All" with no search and not in Saved. The grid shows the rest.
- `availableCategories` only shows chips for categories that actually have articles.
- While loading, six grey `animate-pulse` boxes ("skeletons") hold the layout.
- Empty states for "no search results" and "nothing saved yet".

**`components/FeaturedStory.jsx`** and **`components/NewsCard.jsx`**: both are an `<article>` containing a big `<button>` (open the article) and, separately, a `BookmarkButton` positioned over the corner (`absolute top-3 right-3`). A button can't go inside another button, which is why the bookmark sits next to the main button, not inside it. Hover effects: the card lifts (`hover:-translate-y-1`), its border turns orange, the photo zooms.

**`components/BookmarkButton.jsx`**: round button; filled orange with a check when saved.

**`components/ArticleModal.jsx`**: the reader pop-up.
- `fixed inset-0 z-50 bg-black/70 backdrop-blur-sm` = a dark blurred layer over everything. Clicking it calls `onClose`; clicking the article itself is stopped with `e.stopPropagation()`.
- The effect listens for the **Escape** key and sets `document.body.style.overflow = 'hidden'` so the page behind doesn't scroll. The cleanup removes both.
- On phones it slides up from the bottom (`items-end`, `rounded-t-3xl`); on larger screens it's centred (`sm:items-center`, `sm:rounded-3xl`).
- Real articles show a "Read the full story on …" link (`target="_blank" rel="noopener noreferrer"`: new tab, safely). Demo stories say they're demo stories.

### 7.15 Diagnose — the Diagnostics Bay

**`pages/Diagnose.jsx`**: page header + two tabs. `tab` state decides which component renders.

**`components/WarningLights.jsx`**
- `COLORS` maps `red` / `amber` / `blue` to three class sets: icon colour, **glow**, and badge style. The glow is a CSS drop-shadow in the light's colour:
  `drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]`. The square brackets let you write any value Tailwind doesn't have a class for.
- `LightIcon` draws either the lucide icon (`const Icon = light.icon; <Icon />`) or a little "ABS" badge for lights that have `text`.
- The cluster: a near-black gradient panel; unselected lights are dimmed (`opacity-50`); the selected one glows and grows (`scale-110`).
- The details card has `key={light.id}` so its fade-in replays for each new light.
- "Can I keep driving?" uses `SEVERITY[light.color].canDrive`, with a red ✗ or green ✓ icon.
- **Ask in Repair Help** → `navigate('/chat/repair', { state: { draft: `My ${light.name} warning light is on. ` } })`.

**`components/SymptomChecker.jsx`**
- `phase` is a tiny **state machine**: `'idle'` → `'scanning'` → `'done'`. The right panel shows something different for each.
- `runDiagnosis()` sets `'scanning'`, then a `setTimeout` switches to `'done'` after 1.8 s. The timer id lives in a ref (`timer`) so it can be cancelled if you pick another symptom, and the cleanup `useEffect(() => () => clearTimeout(timer.current), [])` cancels it if you leave the page.
- The "scan": a bar with a glowing strip moving across (`animate-scan`) and three terminal-style lines that fade in 0.5 s apart.
- Results: each cause gets a probability bar whose width is set with `style={{ width: `${cause.chance}%` }}`, a difficulty badge, a typical cost and a fix. A note reminds users it's a rough guide, not a replacement for a mechanic.
- The scanning effect is just for show: the result is looked up instantly from `symptoms.js`. It makes the tool feel like a real OBD scanner.

### 7.16 Garage

**`services/vehicleApi.js`**
- `VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/`: exactly 17 characters, letters and digits, **without I, O and Q** (VINs never use them, to avoid confusion with 1 and 0).
- `decodeVin(vin)` calls `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/<VIN>?format=json`. The answer has ~150 fields; we keep `year`, `make`, `model`, `trim`, and build a `specs` list of `[label, value]` pairs, dropping empty ones with `.filter(([, value]) => value)`. If there's no `Make`/`ModelYear`, the VIN wasn't recognised → throw a friendly error.
- `getRecalls({ make, model, year })` calls `https://api.nhtsa.gov/recalls/recallsByVehicle?make=…&model=…&modelYear=…` and keeps the campaign number, component, summary, consequence, remedy and date.
- `titleCase()` turns `HONDA` into `Honda`; the component path `AIR BAGS:FRONTAL` becomes `Air Bags › Frontal`.

**`pages/Garage.jsx`**
- `lookup` state: `{ status: 'idle' | 'loading' | 'done' | 'error', vehicle, error }`. `recalls` has the same idea.
- `lookUp(value)` cleans the input (trim + uppercase), validates, decodes, and pre-fills a nickname ("My Accord").
- Sample VIN chips call `lookUp` directly, so you can demo it in one click.
- **My garage** listens to `users/{uid}/vehicles` ordered newest first. Clicking a saved car looks its VIN up again; the bin icon deletes it after a confirm.
- `alreadySaved` hides the save button if this VIN is already in your garage.
- The result card's photo is chosen by hashing the VIN, the same way as `VehicleCard`, so a car looks the same in both places.

**`components/RecallList.jsx`**: renders by `status`: loading skeleton / error / "No safety recalls 🎉" / the list. Each recall uses a native `<details>` element for "What's the fix?". The browser handles opening and closing it, with no state needed. Recalls are per **model and year**, so the note tells users to confirm with a dealer for their exact VIN.

**`components/VehicleCard.jsx`**: photo, nickname, year/make/model, VIN in a monospace font, mileage with thousands separators (`toLocaleString()`).

### 7.17 Deploy helpers

- **`vercel.json`** and **`public/_redirects`**: on a deployed site, refreshing `/news` asks the server for a file called `news`, which doesn't exist. These files tell Vercel/Netlify to always serve `index.html` and let React Router handle the URL.

---

## 8. The design system (Tailwind)

### 8.1 Colour & style tokens

| Use | Classes |
|---|---|
| Page background | `bg-zinc-950` (near black) |
| Cards / panels | `bg-zinc-900/60` + `border border-white/10` + `rounded-2xl`/`rounded-3xl` |
| "Glass" surfaces | `bg-white/5` or `bg-white/10`, often with `backdrop-blur` |
| Main accent (buttons, own bubbles) | `bg-linear-to-r from-orange-500 to-amber-400 text-zinc-950` |
| Accent glow | `shadow-lg shadow-orange-500/25` |
| Active nav / chips | `bg-orange-500/10 text-orange-400` |
| Main text | `text-zinc-100` (set on body) |
| Muted text | `text-zinc-400`, quieter `text-zinc-500` |
| Eyebrow labels | `text-xs font-semibold tracking-[0.2em] uppercase text-orange-400` |
| Headings | `font-display` (Space Grotesk) + `font-bold` |
| Success / warning / danger | emerald / amber / red at `/10`–`/15` backgrounds with `-300` text |

`/10`, `/60` etc. mean **opacity**: `bg-white/10` = white at 10%. On a dark background, that's a subtle lighter surface.

### 8.2 Patterns used everywhere

| Want | Classes |
|---|---|
| Photo with readable text on top | parent `relative overflow-hidden`; `<img className="absolute inset-0 h-full w-full object-cover">`; overlay `<div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent">`; text `relative` |
| Zoom photo when hovering the card | `group` on the card, `transition group-hover:scale-105` on the img |
| Row / column | `flex items-center gap-2` / `flex flex-col` |
| Responsive grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| Custom column widths | `lg:grid-cols-[1.4fr_1fr]` |
| Hide on phones / show on phones | `hidden md:flex` / `md:hidden` |
| Fill leftover height and scroll | parent `flex flex-col` + child `flex-1 overflow-y-auto` (+ `min-h-0`) |
| Sideways scrolling chips | `flex gap-2 overflow-x-auto no-scrollbar` + `shrink-0` on chips |
| Truncate text | `truncate` (one line) or `line-clamp-2` / `line-clamp-3` |
| Loading skeleton | `animate-pulse rounded-2xl bg-white/5` |
| Spinner | `size-8 animate-spin rounded-full border-4 border-white/10 border-t-orange-500` |
| Fade in on appear | `animate-fade-up` (+ `style={{ animationDelay: '200ms' }}` to stagger) |
| Focus ring on inputs | `focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none` |
| Disabled look | `disabled:opacity-50` |
| Any custom value | square brackets: `h-[calc(100dvh-8rem)]`, `text-[11px]`, `drop-shadow-[0_0_12px_rgba(...)]` |

**Breakpoints**: `sm:` ≥ 640px, `md:` ≥ 768px, `lg:` ≥ 1024px. Classes without a prefix apply to phones first (mobile-first).

**Tailwind v4 notes**: no `tailwind.config.js`; customisation lives in `@theme` in `index.css`. Gradients are `bg-linear-to-r` (v3 called it `bg-gradient-to-r`). `size-9` = width and height 9 at once.

Tailwind finds class names by **reading your source files**, so always write full class names (`'bg-red-500'`), never build them from pieces (`'bg-' + color + '-500'` won't work). That's why `COLORS`, `URGENCY`, `AVATAR_COLORS` etc. list full class strings.

---

## 9. External APIs & mock data

| Service | Used for | Key needed? | Limits |
|---|---|---|---|
| Firebase Auth + Firestore | accounts, chat, saved cars | Firebase config in `.env.local` | free Spark plan (e.g. 50k reads / 20k writes per day) |
| GNews `gnews.io/api/v4/search` | live news | `VITE_GNEWS_API_KEY` (free sign-up) | 100 requests/day, 10 articles each |
| NHTSA vPIC `vpic.nhtsa.dot.gov` | VIN decoding | **no** | free, US government |
| NHTSA Recalls `api.nhtsa.gov` | safety recalls | **no** | free |
| Unsplash `images.unsplash.com` | photos | **no** (direct image links) | — |

**Why mock data?** So the app always looks complete: during development, when you've used up the GNews limit, or if the key is missing. The banner on the News page is honest about it, and the demo stories are general explainers credited to made-up outlets, not fake news about real companies.

**Why GNews and not NewsAPI.org?** NewsAPI's free plan blocks requests from deployed websites (it only works on localhost).

NHTSA data covers vehicles sold in the US, so some cars sold only in other markets may decode with fewer details. The four sample VINs always work.

---

## 10. How to add things

**A new chat room**
1. Add it to `src/data/rooms.js`: `{ id: 'offroad', name: 'Off-road', emoji: '🏔️', description: '...' }`.
2. Add `'offroad'` to the room list in `firestore.rules` and **publish** the rules again.

That's it: the sidebar, chips and routes all read `ROOMS`.

**A new demo story**: add an object to `stories` in `src/data/mockNews.js` (copy an existing one, change the `id`, text, `category`, `image` key from `PHOTO`, `hoursAgo`).

**A new warning light**: add an object to `WARNING_LIGHTS` in `src/data/warningLights.js`. Pick an icon from https://lucide.dev/icons, import it at the top, and set `color` to `red`, `amber` or `blue`.

**A new symptom**: add to `SYMPTOMS` in `src/data/symptoms.js` with a `group` from `SYMPTOM_GROUPS` and 2–4 `causes` whose `chance` values add up to 100.

**A new page**
1. Create `src/pages/MyPage.jsx` (copy the structure of `Diagnose.jsx`).
2. Add `<Route path="mypage" element={<MyPage />} />` inside the layout route in `App.jsx`.
3. Add it to `NAV_LINKS` in `src/data/navLinks.js` (MobileNav fits 5 nicely; for 6 change `grid-cols-5`).

**A new photo**: find it on unsplash.com, open the image, copy the part after `photo-` in its `images.unsplash.com/photo-…` address into `PHOTO` in `photos.js`.

---

## 11. Testing checklist

- [ ] Sign up with a name → your name and initials appear in the navbar.
- [ ] Log out, log in, refresh → still logged in.
- [ ] Visit `/garage` while logged out → sent to `/auth`.
- [ ] Chat: open two browsers (normal + incognito) with two accounts → messages appear instantly in both, in every room.
- [ ] Send several messages quickly → they group under one avatar.
- [ ] Delete your own message → it disappears for both users. You can't delete someone else's.
- [ ] Diagnose → pick a symptom → Run → results → **Ask in Repair Help** → chat opens with the text pre-filled.
- [ ] News: without a key → demo banner + stories. Filter, search, bookmark, refresh (bookmarks stay), open/close the reader (Escape works).
- [ ] Home → click a top story → News opens with that story's reader.
- [ ] Garage: sample VIN → specs → recalls → save → appears in My garage → refresh → still there → delete.
- [ ] Phone size (F12 → device toolbar): bottom tab bar, chat room chips, nothing cut off.
- [ ] `npm run lint` and `npm run build` pass.

Tools: **F12 → Console** for errors (red), **Network** tab to watch requests to Firebase/GNews/NHTSA, **Application → Local Storage** to see saved bookmarks, and the Firebase console **Firestore Database → Data** to see `rooms/` and `users/` fill up.

---

## 12. Common errors & fixes

| Symptom | Cause | Fix |
|---|---|---|
| White page; console says "Firebase config is missing" | No / wrong `.env.local` | Create it in the project root, names start with `VITE_FIREBASE_`, restart `npm run dev` |
| White page, other red error | A JS error | Read the console message; it names the file and line |
| `auth/operation-not-allowed` | Email/Password sign-in off | Firebase → Authentication → Sign-in method → Email/Password → Enable |
| "Wrong email or password" when it's right | Account was made with another password, or doesn't exist | Use Sign up, or reset in Firebase console → Authentication → Users |
| Chat spinner forever / "Missing or insufficient permissions" | Rules not published, or old rules still live | Paste the **current** `firestore.rules` → Publish |
| Old chat messages gone | Messages now live in `rooms/<room>/messages` (the old app used a single `messages` collection) | Expected. Old ones are still in the console under `messages` |
| Can't send in a new room you added | Room id not in the rules' list | Add it in `firestore.rules`, publish |
| Garage list error "permission-denied" | Rules for `users/{userId}/vehicles` missing | Publish the current rules |
| News shows the demo banner | No GNews key, bad key (401/403) or limit hit (429); the reason is in brackets | Add/fix `VITE_GNEWS_API_KEY` and restart, or wait until tomorrow |
| VIN "No vehicle found" | Typo, or a car not in the US database | Check the 17 characters; try a sample VIN |
| Name shows as email prefix | Account created before names existed | Sign up a new account, or set a display name in code with `updateProfile` |
| Login fails only on the deployed site (`auth/unauthorized-domain`) | Domain not allowed | Firebase → Authentication → Settings → Authorized domains → add it |
| Refreshing a page on the deployed site → 404 | Missing rewrite | `vercel.json` / `public/_redirects` must be deployed |
| Things log twice in development | React StrictMode | Normal, ignore |
| `npm run build` warns "chunks larger than 500 kB" | Firebase is big | Only a warning; the app works. Advanced fix: lazy-load pages with `React.lazy` |

---

## 13. Glossary

- **Component**: a function that returns UI.
- **Props**: inputs passed into a component.
- **State**: data inside a component that re-draws it when changed.
- **Hook**: a function starting with `use` (`useState`, `useEffect`, `useAuth`, `useBookmarks`). Only call hooks at the top level of a component, never inside `if`s or loops.
- **Effect / cleanup**: code that runs after rendering / the function that undoes it.
- **Context / Provider**: shares values with every component inside the provider.
- **Route / layout route / Outlet**: URL → page mapping / a route that wraps child routes / where the child appears.
- **Navigation state**: extra data passed along with `navigate()` or `<Link state>`.
- **Collection / document / sub-collection**: Firestore's folder / record / folder inside a record.
- **Listener / snapshot**: a live connection (`onSnapshot`) / the data at one moment.
- **Security Rules**: server-side rules about who may read/write which documents.
- **localStorage**: a small per-browser key–value store.
- **API**: a web address that returns data (usually JSON) instead of a page.
- **VIN**: Vehicle Identification Number, the car's unique 17-character id.
- **Recall**: an official notice that a model has a safety defect the maker must fix for free.
- **Mock / demo data**: realistic stand-in data used when real data isn't available.
- **Skeleton**: grey placeholder shapes shown while loading.
- **State machine**: a value that moves through fixed steps (`idle → scanning → done`).
- **Env var**: a config value read from `.env.local`.
- **MVP**: Minimum Viable Product.

---

## 14. Presenting the project

**30-second pitch**

> "AutoHub is a React app for mechanics and car enthusiasts. Users sign up with Firebase Authentication and get four real-time chat rooms backed by Cloud Firestore listeners, with security rules so nobody can post as someone else. There's a news feed from the GNews API that falls back to built-in stories so it never breaks. A Diagnostics Bay decodes dashboard warning lights and ranks likely causes for symptoms. A Garage uses the US government's NHTSA APIs to decode any VIN and check it for safety recalls. Features link together: a diagnosis can be sent straight to the Repair Help chat. It's built with Vite, React Router and Tailwind, and deployed on Vercel."

**Questions you'll likely get, and where the answer is**

| Question | Answer in |
|---|---|
| How does real-time chat work? | 3.3, 7.13 (`onSnapshot`) |
| How is it secured if the Firebase key is public? | 6.6, 7.8 |
| What does the useEffect cleanup do? | 5.4 |
| Why does each room have its own panel state? | 5.11 (`key` trick) |
| What happens if the news API fails? | 3.4, 7.14 |
| How do pages share the navbar? | 5.10, 7.6 (layout route + Outlet) |
| How do bookmarks survive a refresh? | 7.14 (`useBookmarks`, localStorage) |
| Where does the VIN data come from? | 7.16, 9 |
