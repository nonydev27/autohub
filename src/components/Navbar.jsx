// Navbar — top bar shown on every page once logged in.
//
// TODO:
// 1. Import NavLink from 'react-router-dom', icons from 'lucide-react'
//    (Car, MessageCircle, Newspaper, LogOut), and useAuth
//
// 2. Left side: Car icon + "AutoHub"
//
// 3. Middle: NavLink to "/chat" (Chat) and "/news" (News)
//    NavLink's className can be a function: ({ isActive }) => isActive ? '...' : '...'
//    → use it to highlight the current page
//
// 4. Right side: user.email (hide on small screens: `hidden sm:inline`)
//    and a Logout button that calls signOut() from useAuth
//
// 5. Style: flex, justify-between, items-center, padding, border-bottom or shadow
//
// 6. export default Navbar
