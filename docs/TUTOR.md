# AutoHub — The Tutor 🎓

This guide explains **everything** about the project: what you're building, how the pieces fit, what each file does, and the React/Supabase ideas you need. Read sections 1–4 once before you start, then use the rest as a reference while you code.

> Checklist of what to do, in order → `docs/TODO.md`
> Detailed lessons + examples for each file → the comments at the top of that file
> What it should look like → `src/assets/mockups/` (open the `.svg` files in your browser)

---

## 1. What you're building

**AutoHub** is a small web app for mechanics and car people:

| Feature | What the user sees | What powers it |
|---|---|---|
| Sign up / Log in | Email + password form | Supabase Auth |
| Community chat | Messages appear instantly for everyone | Supabase Database + Realtime |
| Daily news | Grid of the latest automotive articles | GNews API |

The tech:

- **React**: builds the UI out of components
- **Vite**: the dev server and build tool (`npm run dev`)
- **React Router**: switches pages without reloading
- **Supabase**: a hosted backend. You get a Postgres database, login system and live updates without writing a server.
- **Tailwind CSS**: you style elements by adding classes like `bg-white p-4 rounded-xl`
- **lucide-react**: icon components (`<Car />`, `<Send />`)

---

## 2. The big picture

```
                    ┌──────────────────────────── Browser ────────────────────────────┐
                    │                                                                 │
 index.html ──► main.jsx ──► BrowserRouter ──► AuthProvider ──► App.jsx               │
                    │                              │              │                   │
                    │                    knows who's logged in    ├─ Navbar           │
                    │                              │              └─ Routes           │
                    │                              │                  ├─ /auth  Auth  │
                    │                              │                  ├─ /chat  ChatRoom ──► MessageBubble
                    │                              │                  └─ /news  NewsFeed ──► NewsCard
                    └──────────────────────────────┼──────────────────────┼──────┼────────────┘
                                                   │                      │      │
                                         supabaseClient.js ◄──────────────┘  newsApi.js
                                                   │                             │
                                          ┌────────▼────────┐             ┌──────▼──────┐
                                          │    SUPABASE     │             │  GNews API  │
                                          │ Auth · Database │             │  (articles) │
                                          │    · Realtime   │             └─────────────┘
                                          └─────────────────┘
```

**How a chat message travels:**

```
You type "hello" → handleSend() → supabase.from('messages').insert(...)
      → Supabase saves the row → Realtime broadcasts "new row!"
      → every open ChatRoom (yours too) receives payload.new
      → setMessages(prev => [...prev, payload.new]) → bubble appears
```

**How login works:**

```
Auth.jsx calls signInWithPassword → Supabase returns a session (saved in localStorage)
      → onAuthStateChange fires in AuthContext → session state updates
      → App.jsx re-renders: user exists → Navbar shows, /auth redirects to /chat
```

After a page refresh, `getSession()` reads the saved session, so you stay logged in.

---

## 3. Folder & file map

```
autohub/
├── .env.example            Template for your secrets (copy → .env.local)
├── .env.local              YOUR keys. Git-ignored. Never commit.
├── index.html              The single HTML page. Has <div id="root">.
├── vite.config.js          Vite plugins (you'll add Tailwind here)
├── docs/
│   ├── TODO.md             Step-by-step checklist
│   └── TUTOR.md            This file
├── supabase/
│   └── schema.sql          Database setup SQL (run in Supabase dashboard)
└── src/
    ├── main.jsx            Entry point: wraps App in Router + AuthProvider
    ├── App.jsx             Routes: which URL shows which page
    ├── index.css           Global CSS (just the Tailwind import)
    ├── supabaseClient.js   Creates the one Supabase connection
    ├── context/
    │   └── AuthContext.jsx Tracks the logged-in user; exposes useAuth()
    ├── services/
    │   └── newsApi.js      fetchCarNews(): calls GNews, returns articles
    ├── pages/              Full screens, one per route
    │   ├── Auth.jsx        Login / sign-up form
    │   ├── ChatRoom.jsx    Live chat
    │   └── NewsFeed.jsx    News grid
    ├── components/         Smaller reusable pieces
    │   ├── Navbar.jsx          Top bar
    │   ├── ProtectedRoute.jsx  Redirects logged-out users
    │   ├── MessageBubble.jsx   One chat message
    │   └── NewsCard.jsx        One article card
    └── assets/mockups/     Design mockups (auth, chat, news, chat-mobile)
```

**Pages vs components:** a *page* is a whole screen tied to a URL. A *component* is a building block that pages use. **Services** are plain JS (no React) that talk to outside APIs. **Context** is shared state.

### What each file does, in one breath

| File | Job | Depends on | Used by |
|---|---|---|---|
| `supabaseClient.js` | Connect to Supabase once | `.env.local` | AuthContext, Auth, ChatRoom |
| `AuthContext.jsx` | Hold `user`, offer `signOut`, provide `useAuth()` | supabaseClient | main.jsx, App, Navbar, ProtectedRoute, ChatRoom |
| `main.jsx` | Start React, wrap with providers | AuthContext, App | index.html |
| `App.jsx` | Routing + show Navbar when logged in | all pages, Navbar, ProtectedRoute | main.jsx |
| `ProtectedRoute.jsx` | Block pages if logged out | useAuth | App |
| `Auth.jsx` | Sign up / log in | supabaseClient | App |
| `Navbar.jsx` | Navigation + logout | useAuth, NavLink | App |
| `ChatRoom.jsx` | Load, listen, send messages | supabaseClient, useAuth, MessageBubble | App |
| `MessageBubble.jsx` | Draw one message | (props only) | ChatRoom |
| `newsApi.js` | Fetch articles | `.env.local` | NewsFeed |
| `NewsFeed.jsx` | Load + show articles | newsApi, NewsCard | App |
| `NewsCard.jsx` | Draw one article | (props only) | NewsFeed |

**Build order** (each one only depends on things above it):
`supabaseClient → AuthContext → main.jsx → ProtectedRoute → Auth → App → Navbar → MessageBubble → ChatRoom → newsApi → NewsCard → NewsFeed`

---

## 4. React crash course (only what you need)

### 4.1 Components & JSX

```jsx
function Welcome({ name }) {               // a component = a function
  return <h1 className="text-xl">Hi {name}</h1>   // returns JSX
}
export default Welcome

// using it:
<Welcome name="Karl" />
```

- Component names start with a **Capital letter**.
- `class` → `className`, `for` → `htmlFor`.
- `{ }` drops JavaScript into JSX: `{user.email}`, `{2 + 2}`, `{isOpen && <Menu />}`.
- Return **one** parent element. Use `<> </>` if you need a wrapper with no div.

### 4.2 Props: inputs to a component

```jsx
<MessageBubble message={m} isOwn={true} />
function MessageBubble({ message, isOwn }) { ... }   // "destructuring" props
```

Props flow **down** (parent → child). A child can't change its props.

### 4.3 State: data that changes

```jsx
const [text, setText] = useState('')   // value + setter + initial value
setText('hi')                          // triggers a re-render
```

- Never change state directly (`messages.push(x)` ❌). Always call the setter with a **new** value.
- Arrays: `setList(prev => [...prev, item])`.

### 4.4 Effects: side jobs after rendering

```jsx
useEffect(() => {
  // runs after the component appears
  return () => { /* cleanup when it disappears */ }
}, [])   // [] = once · [x] = whenever x changes · no array = every render (avoid)
```

You'll use effects to fetch data, subscribe to realtime/auth changes, and auto-scroll.

### 4.5 Refs: grab a DOM element

```jsx
const boxRef = useRef(null)
<div ref={boxRef} />
boxRef.current.scrollIntoView()
```

### 4.6 Context: share data without prop-drilling

```
createContext() → <Ctx.Provider value={...}> wraps the app → useContext(Ctx) anywhere
```

Your `useAuth()` is just a nice wrapper around `useContext(AuthContext)`.

### 4.7 Lists

```jsx
{items.map(item => <Row key={item.id} item={item} />)}
```

`key` must be unique and stable, so use the database id or the article url.

### 4.8 Events & forms

```jsx
<input value={text} onChange={e => setText(e.target.value)} />
<form onSubmit={handleSubmit}>   // and call e.preventDefault() inside!
<button onClick={signOut}>       // pass the function, don't call it
```

### 4.9 Conditional rendering

```jsx
{loading && <p>Loading…</p>}
{error ? <p>{error}</p> : <List />}
if (!user) return <Navigate to="/auth" />   // early return
```

### 4.10 async / await

```js
async function load() {
  try {
    const res = await fetch(url)   // wait for the network
    const data = await res.json()
  } catch (err) {
    console.log(err.message)
  }
}
```

`useEffect(async () => …)` is **not allowed**. Define an async function inside the effect and call it.

---

## 5. Supabase explained

### 5.1 What you get
- **Auth**: stores users and handles passwords and sessions. You call `supabase.auth.*`.
- **Database**: a real Postgres database. You call `supabase.from('table').select/insert/...`.
- **Realtime**: pushes database changes to the browser through `supabase.channel(...)`.

### 5.2 The `{ data, error }` pattern
Every Supabase call returns an object. It doesn't throw:
```js
const { data, error } = await supabase.from('messages').select('*')
if (error) { /* show error.message */ }
```

### 5.3 The `messages` table

| column | type | meaning |
|---|---|---|
| id | uuid | unique id (auto) |
| content | text | the message |
| user_id | uuid | who sent it (links to auth.users) |
| user_email | text | shown in the bubble |
| created_at | timestamptz | when (auto) |

### 5.4 Row Level Security (RLS): why it matters
Your anon key is visible to anyone who opens DevTools. RLS rules make that safe:
- **SELECT policy**: only logged-in users can read messages.
- **INSERT policy**: you can only insert rows where `user_id` is **your** id (`auth.uid() = user_id`), so nobody can post as someone else.

RLS also affects realtime. Supabase only sends you new rows you're allowed to SELECT.

### 5.5 Dashboard settings you must change
1. **Authentication → Providers → Email → Confirm email: OFF** (for testing)
2. **SQL Editor**: run your `supabase/schema.sql`
3. **Database → Publications → supabase_realtime**: `messages` must be ON
4. Later, when you deploy: **Authentication → URL Configuration**, add your live URL

---

## 6. The News API (GNews)

- Sign up at https://gnews.io, copy your API key into `.env.local` as `VITE_GNEWS_API_KEY`.
- Endpoint: `https://gnews.io/api/v4/search?q=...&lang=en&max=10&apikey=KEY`
- Free tier: **100 requests/day**. Each page load uses one, so use fake data while styling (see `newsApi.js`).
- Why not NewsAPI.org? Its free plan refuses requests from deployed websites (it works only on localhost).

Response shape:
```json
{
  "totalArticles": 1234,
  "articles": [
    { "title": "...", "description": "...", "url": "...", "image": "...",
      "publishedAt": "2026-10-18T09:00:00Z", "source": { "name": "MotorTrend" } }
  ]
}
```

---

## 7. Tailwind cheat sheet (matches the mockups)

### Design tokens used in the mockups

| Use | Tailwind class | Hex |
|---|---|---|
| Page background | `bg-slate-100` | #f1f5f9 |
| Cards / navbar | `bg-white` | #ffffff |
| Main colour (buttons, own bubbles) | `bg-orange-500` / hover `bg-orange-600` | #f97316 / #ea580c |
| Active nav link | `bg-orange-50 text-orange-600` | #fff7ed |
| Other people's bubbles | `bg-slate-200` | #e2e8f0 |
| Main text | `text-slate-900` | #0f172a |
| Muted text | `text-slate-500` | #64748b |
| Borders | `border-slate-200` / inputs `border-slate-300` | |
| Error | `text-red-600` | #dc2626 |
| Live dot | `bg-green-500` | #22c55e |

### The classes you'll use 90% of the time

| Want | Class |
|---|---|
| Row of items | `flex items-center gap-2` |
| Space between left & right | `flex justify-between` |
| Column | `flex flex-col` |
| Center on screen | `flex min-h-screen items-center justify-center` |
| Padding / margin | `p-4 px-6 py-2 mt-3 mx-auto` |
| Width limits | `w-full max-w-sm max-w-3xl max-w-6xl` |
| Rounded / shadow | `rounded-lg rounded-2xl shadow-sm shadow-lg` |
| Text | `text-sm text-xl font-semibold font-bold` |
| Hover / focus | `hover:bg-orange-600 focus:border-orange-500 focus:outline-none` |
| Disabled look | `disabled:opacity-50` |
| Responsive | `sm:` (≥640px) `md:` (≥768px) `lg:` (≥1024px) e.g. `hidden sm:inline` |
| Scroll area | `flex-1 overflow-y-auto` |
| Grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| Clamp text | `line-clamp-2` |

Tailwind docs search is excellent: https://tailwindcss.com/docs

### Installing Tailwind v4 (Vite)
```bash
npm install tailwindcss @tailwindcss/vite
```
- `vite.config.js`: `import tailwindcss from '@tailwindcss/vite'`, then add `tailwindcss()` to `plugins`.
- `src/index.css`: replace everything with `@import "tailwindcss";`
- Delete `src/App.css`. There's no `tailwind.config.js` in v4.

---

## 8. Mockups

Open these in your browser (drag the file into a tab, or `xdg-open src/assets/mockups/chat.svg`):

| File | Shows |
|---|---|
| `auth.svg` | Login card, including the error state |
| `chat.svg` | Navbar + chat room with own/other bubbles + input |
| `chat-mobile.svg` | Same chat at phone width (email hidden in navbar) |
| `news.svg` | News page grid with cards |

The **purple notes** on the mockups name the file and suggest Tailwind classes. They aren't part of the UI.

---

## 9. Testing as you go

- **Browser console (F12 → Console):** use `console.log(x)` everywhere while learning. Errors show here in red.
- **Network tab:** see every request to Supabase or GNews and its response.
- **Two users:** test chat with a normal window and an incognito window.
- **Supabase Table Editor:** check that rows actually got inserted.
- `npm run lint`: finds mistakes such as unused variables and missing effect dependencies.
- `npm run build`: if this passes, you can deploy.

---

## 10. Common errors & fixes

| Error / symptom | Cause | Fix |
|---|---|---|
| Blank white page | JS error | Open the console and read the red error |
| `supabaseUrl is required` | env vars missing | `.env.local` in the project root, names start with `VITE_`, restart `npm run dev` |
| `useAuth()` returns undefined / can't destructure | No provider | Wrap `<App />` in `<AuthProvider>` in main.jsx |
| `useNavigate/NavLink may be used only in the context of a <Router>` | No router | Wrap in `<BrowserRouter>` in main.jsx |
| `new row violates row-level security policy` | Missing INSERT policy or wrong user_id | Check schema.sql step 2, insert `user_id: user.id` |
| Messages only show after refresh | Realtime not enabled | `alter publication supabase_realtime add table messages;` |
| My message appears twice | You added it to state AND realtime added it | Remove the manual `setMessages` in handleSend |
| Every message appears twice | Subscribed twice without cleanup | Return `() => supabase.removeChannel(channel)` from the effect |
| Sign-up "works" but can't log in | Email confirmation on | Turn off Confirm email in Supabase |
| News: 401/403 | Bad/missing API key | Check `VITE_GNEWS_API_KEY`, restart dev server |
| News: 429 | Daily limit hit | Use fake data until tomorrow |
| Page reloads on submit | Forgot `e.preventDefault()` | Add it first thing in handleSubmit |
| Each child in a list should have a unique "key" | Missing `key` | `key={m.id}` / `key={a.url}` |
| Things log twice in dev | React StrictMode | Normal in development, ignore |
| Refreshing `/chat` on the deployed site → 404 | Host doesn't know about client routes | Add a rewrite to `index.html` (see TODO Phase 7) |

---

## 11. Glossary

- **Component**: a function that returns UI.
- **Props**: inputs passed into a component.
- **State**: data inside a component that, when changed, re-draws it.
- **Hook**: a function starting with `use` (`useState`, `useEffect`, `useAuth`…). Only call hooks at the top level of a component, not inside `if` blocks or loops.
- **Effect**: code that runs after render (fetching, subscribing).
- **Context / Provider**: a way to share values with all components inside the provider.
- **Route**: a URL → page mapping.
- **Session**: proof you're logged in (a token Supabase stores for you).
- **RLS / Policy**: database rules about who can read/write which rows.
- **Channel / Subscription**: a live connection that tells you when data changes.
- **Env var**: a config value read from `.env.local`.
- **Promise / async / await**: how JavaScript handles things that take time.
- **MVP**: Minimum Viable Product, the smallest version that works end to end.

---

## 12. How to explain this project in your demo (30 seconds)

> "AutoHub is a React app for mechanics and car enthusiasts. Users sign up with Supabase Auth, then join a community chat that updates in real time through Supabase Realtime subscriptions on a Postgres table protected by row-level security. There's also a daily news page that pulls the latest automotive articles from the GNews API. It's built with Vite, React Router and Tailwind, and deployed on Vercel."

Be ready to explain: **how realtime works** (section 2), **why RLS matters** (5.4), and **what useEffect cleanup does** (4.4). Those are the questions interviewers and supervisors usually ask.
