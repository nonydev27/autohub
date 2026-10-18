// =====================================================================
// FILE: src/App.jsx
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// The "map" of the app: which URL shows which page.
//   /auth → Auth page     /chat → ChatRoom     /news → NewsFeed
// It also shows the Navbar on top when someone is logged in.
// (The app shows a blank page / error until you write this — that's expected.)
//
// ---------------------------------------------------------------------
// LESSON 1 — Components are functions that return JSX
// ---------------------------------------------------------------------
//   function Hello() {
//     return <h1 className="text-2xl">Hello!</h1>
//   }
//   export default Hello
//
//   JSX looks like HTML but:  class → className,  and you can drop JS in
//   with curly braces:  <p>{1 + 1}</p>  shows "2"
//   A component must return ONE parent element. Use <>...</> (a Fragment)
//   if you don't want an extra div.
//
// ---------------------------------------------------------------------
// LESSON 2 — Routing with react-router-dom
// ---------------------------------------------------------------------
//   import { Routes, Route, Navigate } from 'react-router-dom'
//
//   <Routes>
//     <Route path="/about"   element={<About />} />
//     <Route path="/contact" element={<Contact />} />
//     <Route path="/"        element={<Navigate to="/about" replace />} />   ← redirect
//     <Route path="*"        element={<Navigate to="/" replace />} />        ← anything else
//   </Routes>
//
//   Only ONE matching <Route> renders at a time. Things outside <Routes>
//   (like a Navbar) always render.
//
// ---------------------------------------------------------------------
// LESSON 3 — Conditional rendering
// ---------------------------------------------------------------------
//   {isLoggedIn && <Navbar />}                       → show only if true
//   {isLoggedIn ? <Dashboard /> : <LoginPage />}     → pick one of two
//
// ---------------------------------------------------------------------
// EXAMPLE — a small blog app's App.jsx (yours has the same shape)
// ---------------------------------------------------------------------
//   function App() {
//     const { user } = useAuth()
//     return (
//       <div className="min-h-screen bg-slate-100">
//         {user && <Header />}
//         <Routes>
//           <Route path="/login" element={user ? <Navigate to="/posts" replace /> : <Login />} />
//           <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
//           <Route path="*"      element={<Navigate to="/posts" replace />} />
//         </Routes>
//       </div>
//     )
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. Import Routes, Route, Navigate (react-router-dom), useAuth,
//    Navbar, ProtectedRoute, Auth, ChatRoom, NewsFeed
// 2. Get `user` from useAuth()
// 3. Outer <div className="min-h-screen bg-slate-100 text-slate-900">
// 4. {user && <Navbar />}
// 5. Routes:
//      /auth → if user, Navigate to /chat; else <Auth />
//      /chat → <ProtectedRoute><ChatRoom /></ProtectedRoute>
//      /news → <ProtectedRoute><NewsFeed /></ProtectedRoute>
//      /     → Navigate to /chat
//      *     → Navigate to /
// 6. export default App
//
// TIP: Build pages as tiny placeholders first, e.g.
//      export default function ChatRoom() { return <p>Chat page</p> }
//      so you can test routing before writing the real pages.
//
// HOW TO TEST
//   Logged out: visiting /chat should land you on /auth.
//   Logged in: visiting /auth should land you on /chat.
//
// MOCKUPS: src/assets/mockups/*.svg  (open them in your browser)
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

