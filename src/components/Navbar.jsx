// =====================================================================
// FILE: src/components/Navbar.jsx    MOCKUP: src/assets/mockups/chat.svg (top bar)
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// The top bar: logo on the left, Chat/News links in the middle,
// the user's email + Logout button on the right.
//
// ---------------------------------------------------------------------
// LESSON 1 — Link vs NavLink vs <a>
// ---------------------------------------------------------------------
//   <a href="/news">       → full page reload (DON'T use for your own pages)
//   <Link to="/news">      → switches page instantly, no reload
//   <NavLink to="/news">   → same as Link, but knows if it's the CURRENT page
//
//   NavLink's className can be a FUNCTION that receives { isActive }:
//     <NavLink
//       to="/news"
//       className={({ isActive }) =>
//         isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100'
//       }
//     >
//       News
//     </NavLink>
//
// ---------------------------------------------------------------------
// LESSON 2 — Icons with lucide-react
// ---------------------------------------------------------------------
//   import { Car } from 'lucide-react'
//   <Car size={20} />                 ← an SVG icon, behaves like any component
//   <Car className="h-5 w-5 text-orange-500" />
//   Browse names at https://lucide.dev/icons
//
// ---------------------------------------------------------------------
// LESSON 3 — onClick
// ---------------------------------------------------------------------
//   <button onClick={doSomething}>         ← pass the function (no brackets!)
//   <button onClick={() => doSomething(5)}> ← wrap it if you need arguments
//   <button onClick={doSomething()}>       ✗ WRONG: runs immediately on render
//
// ---------------------------------------------------------------------
// LESSON 4 — Tailwind layout for a nav bar
// ---------------------------------------------------------------------
//   flex             → children in a row
//   items-center     → vertically centered
//   justify-between  → push first child left, last child right
//   gap-2            → space between children
//   hidden sm:inline → hidden on phones, visible from 640px wide up
//
// ---------------------------------------------------------------------
// EXAMPLE — a footer bar with the same building blocks
// ---------------------------------------------------------------------
//   function Footer() {
//     const { user, signOut } = useAuth()
//     return (
//       <footer className="flex items-center justify-between border-t bg-white px-6 py-3">
//         <span className="flex items-center gap-2 font-bold">
//           <Car className="h-5 w-5 text-orange-500" /> AutoHub
//         </span>
//         <NavLink to="/help" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
//           Help
//         </NavLink>
//         <button onClick={signOut} className="flex items-center gap-1 text-sm">
//           <LogOut size={16} /> {user.email}
//         </button>
//       </footer>
//     )
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION  (your imports are already at the bottom ✔)
// ---------------------------------------------------------------------
// 1. Also import { useAuth } from '../context/AuthContext'
// 2. function Navbar() { const { user, signOut } = useAuth() ... }
// 3. <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
//      LEFT:   orange rounded square with <Car /> + "AutoHub" (font-bold)
//      MIDDLE: two NavLinks (MessageCircle + "Chat", Newspaper + "News")
//              with the isActive className trick
//      RIGHT:  <span className="hidden sm:inline">{user?.email}</span>
//              <button onClick={signOut}><LogOut /> Logout</button>
// 4. export default Navbar
//
// TIP: write the class string for links once in a const and reuse it
//      for both NavLinks so they always look the same.
//
// HOW TO TEST
//   Click Chat/News → URL changes, highlighted link moves, no page reload.
//   Click Logout → you land on /auth (App.jsx redirects because user is null).
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

import { NavLink } from "react-router-dom";
import { Car, MessageCircle, Newspaper, LogOut } from "lucide-react";
import { useAuth } from '../context/AuthContext'

function Navbar(){
    const {user,signOut} = useAuth()

    return(
        <nav>
            
        </nav>
    )
}

export default Navbar()


