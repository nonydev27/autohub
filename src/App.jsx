// =====================================================================
// FILE: src/App.jsx
// =====================================================================
//
// WHAT THIS FILE DOES
//   The "map" of the app: which web address shows which page.
//     /auth → Auth page     /chat → ChatRoom     /news → NewsFeed
//   It also shows the Navbar on top when someone is logged in.
//   (The app shows a blank page / error until you write this. That's expected.)
//
// HOW TO USE THIS FILE
//   The finished code is at the bottom of this file. The PARTS below
//   explain it piece by piece, line by line.
//
// ---------------------------------------------------------------------
// PART 1 of 3 — Imports
// ---------------------------------------------------------------------
//   import { Navigate, Route, Routes } from 'react-router-dom'
//   import { useAuth } from './context/AuthContext'
//   import Navbar from './components/Navbar'
//   import ProtectedRoute from './components/ProtectedRoute'
//   import Auth from './pages/Auth'
//   import ChatRoom from './pages/ChatRoom'
//   import NewsFeed from './pages/NewsFeed'
//
//   WHAT EACH LINE MEANS
//   • Routes, Route → decide which page to show for each address
//     Navigate      → sends you to another address
//   • Notice the path starts with `./` (this folder), not `../`, because
//     App.jsx is directly in src/.
//   • Your own components are imported WITHOUT { } because each of those
//     files uses `export default`.
//
// ---------------------------------------------------------------------
// PART 2 of 3 — Start the component
// ---------------------------------------------------------------------
//   function App() {
//     const { user } = useAuth()
//
//   WHAT IT MEANS
//   • Get the logged-in user (or null) from the noticeboard.
//
// ---------------------------------------------------------------------
// PART 3 of 3 — What's shown
// ---------------------------------------------------------------------
//     return (
//       <div className="min-h-screen bg-slate-100 text-slate-900">
//         {user && <Navbar />}
//
//         <Routes>
//           <Route path="/auth" element={user ? <Navigate to="/chat" replace /> : <Auth />} />
//           <Route path="/chat" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
//           <Route path="/news" element={<ProtectedRoute><NewsFeed /></ProtectedRoute>} />
//           <Route path="/" element={<Navigate to="/chat" replace />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     )
//   }
//
//   export default App
//
//   WHAT EACH LINE MEANS
//   • The outer div gives every page a light grey background
//     (bg-slate-100) and dark text (text-slate-900).
//   • {user && <Navbar />} → only show the Navbar IF someone is logged in.
//   • <Routes> looks at the address bar and shows ONE matching <Route>.
//     Things outside <Routes> (like the Navbar) are always shown.
//   • path="/auth": if already logged in, go to /chat instead.
//     Otherwise show the login page. (This is how you "get moved" to
//     the chat right after logging in: `user` changes, App redraws,
//     and this line sends you on.)
//   • path="/chat" and "/news": wrapped in ProtectedRoute, so logged-out
//     users are sent to /auth.
//   • path="/" (the home address) → go to /chat.
//   • path="*" means "any other address" → go home.
//
// 🧪 TEST IT
//   Logged out: visiting /chat should land you on /auth.
//   Logged in: visiting /auth should land you on /chat.
//
// ✅ FINISHED CODE — this is the code from the parts above, put together.
// ---------------------------------------------------------------------

import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import ChatRoom from './pages/ChatRoom'
import NewsFeed from './pages/NewsFeed'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {user && <Navbar />}

      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/chat" replace /> : <Auth />} />
        <Route path="/chat" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsFeed /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
