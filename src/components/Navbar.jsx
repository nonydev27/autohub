// =====================================================================
// FILE: src/components/Navbar.jsx    MOCKUP: src/assets/mockups/chat.svg (top bar)
// =====================================================================
//
// WHAT THIS FILE DOES
//   The bar across the top of every page, in three groups:
//     LEFT:   orange square with a car icon + "AutoHub"
//     MIDDLE: "Chat" and "News" links (the current page's link is orange)
//     RIGHT:  your email + a Logout button
//
// ✅ This file is FILLED IN for you. The code is at the bottom, with a
//    short comment above each piece. Read it top to bottom with the
//    explanations below. (Your start — the imports, useAuth line and
//    <nav> — was right; this finishes it.)
//
// ---------------------------------------------------------------------
// PIECE 1 — Imports
// ---------------------------------------------------------------------
//   • NavLink is a link to one of YOUR pages. It switches page instantly
//     without reloading (a normal <a href> would reload everything), AND
//     it knows whether it's the page you're on now.
//   • Car, MessageCircle, Newspaper, LogOut are icons. Use them like
//     tags: <Car size={20} />. Browse more at https://lucide.dev/icons
//   • useAuth gives us the user (for the email) and signOut.
//
// ---------------------------------------------------------------------
// PIECE 2 — linkClass: the styling for both links, written once
// ---------------------------------------------------------------------
//   • NavLink's className can be a FUNCTION. React Router calls it and
//     tells it { isActive }: true if this link is the page you're on.
//   • The text between ` ` (backticks) is a "template string": you can
//     put JavaScript inside it with ${ }.
//   • So: always use the first classes (layout, padding, round corners),
//     then ADD orange colours if active, or grey + hover effect if not.
//   • Writing it once means both links always look the same.
//
// ---------------------------------------------------------------------
// PIECE 3 — The component
// ---------------------------------------------------------------------
//   • const { user, signOut } = useAuth() → take both off the noticeboard.
//   • <nav ...> is the bar itself:
//       flex items-center      → children in a row, vertically centred
//       justify-between        → first group left, last group right,
//                                 middle group in between
//       h-16                   → 64px tall (ChatRoom relies on this!)
//       border-b border-slate-200 bg-white → white with a line underneath
//       px-4 sm:px-6           → side padding, a bit more on bigger screens
//   • It contains three <div>s = the three groups.
//
//   LEFT group
//   • A 36px orange rounded square (h-9 w-9 rounded-lg bg-orange-500)
//     with the white car icon centred inside.
//   • "AutoHub" text: `hidden sm:inline` = hidden on phones, shown from
//     640px wide and up (there's not enough room on a phone).
//
//   MIDDLE group
//   • Two NavLinks. `to="/chat"` is the address. className={linkClass}
//     passes the FUNCTION from PIECE 2 (no brackets after linkClass:
//     we give it to NavLink, NavLink calls it).
//
//   RIGHT group
//   • {user?.email} shows the email. The `?.` means "if user is null,
//     don't crash, just show nothing".
//   • onClick={signOut} → run signOut when clicked.
//     ⚠ NOT onClick={signOut()} — the brackets would log you out
//     immediately while the page is drawing!
//   • After logout, `user` becomes null, App.jsx hides the Navbar and
//     ProtectedRoute sends you to /auth. Nothing to do here.
//
// ---------------------------------------------------------------------
// PIECE 4 — export default Navbar
// ---------------------------------------------------------------------
//   • Lets App.jsx write:  import Navbar from './components/Navbar'
//     (This was the line missing from your version.)
//
// 🧪 TEST IT (once App.jsx, main.jsx and AuthContext are done)
//   Click Chat / News → the address changes, the orange highlight moves,
//   the page doesn't reload. Click Logout → you land on /auth.
//   Make the browser narrow (F12 → phone icon) → email and "AutoHub" hide.
// =====================================================================

// PIECE 1 — imports
import { NavLink } from 'react-router-dom'
import { Car, MessageCircle, Newspaper, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// PIECE 2 — shared style for the two links (orange when it's the current page)
const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100'
  }`

// PIECE 3 — the component
function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* LEFT: logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
          <Car size={20} />
        </div>
        <span className="hidden font-bold sm:inline">AutoHub</span>
      </div>

      {/* MIDDLE: page links */}
      <div className="flex items-center gap-1">
        <NavLink to="/chat" className={linkClass}>
          <MessageCircle size={18} /> Chat
        </NavLink>
        <NavLink to="/news" className={linkClass}>
          <Newspaper size={18} /> News
        </NavLink>
      </div>

      {/* RIGHT: email + logout */}
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">{user?.email}</span>
        <button
          onClick={signOut}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}

// PIECE 4 — so App.jsx can import it
export default Navbar
