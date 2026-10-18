// AuthContext — shares the logged-in user with every component,
// so you don't have to pass `user` down through props.
//
// TODO:
// 1. createContext() and export a custom hook `useAuth()` that returns useContext(AuthContext)
//
// 2. Export an `AuthProvider` component that takes { children } and:
//    - has state: `session` (null at first) and `loading` (true at first)
//    - in a useEffect on mount:
//        a. call supabase.auth.getSession() → save the session, set loading false
//        b. call supabase.auth.onAuthStateChange((_event, session) => save session)
//           this fires on login, logout and token refresh
//        c. return a cleanup function that unsubscribes the listener
//           (onAuthStateChange returns { data: { subscription } })
//    - provides value: { session, user: session?.user, loading, signOut }
//      where signOut calls supabase.auth.signOut()
//
// 3. While `loading` is true, render a simple "Loading..." instead of children
//    (stops the app flashing the login page for logged-in users on refresh)
//
// Then go to main.jsx and wrap <App /> with <AuthProvider>.
