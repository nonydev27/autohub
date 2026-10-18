// =====================================================================
// FILE: src/context/AuthContext.jsx
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// Keeps track of "who is logged in" and makes that available to ANY
// component without passing props through every level.
//   Navbar needs the user's email, ChatRoom needs user.id, ProtectedRoute
//   needs to know if anyone is logged in → they all call useAuth().
//
// ---------------------------------------------------------------------
// LESSON 1 — useState: data that changes and re-renders the screen
// ---------------------------------------------------------------------
//   const [count, setCount] = useState(0)
//   //      ^value  ^setter            ^starting value
//   setCount(5)   // React re-draws the component with count = 5
//
// Normal variables (`let x = 5`) do NOT re-render the screen. State does.
//
// ---------------------------------------------------------------------
// LESSON 2 — useEffect: run code AFTER the component appears
// ---------------------------------------------------------------------
//   useEffect(() => {
//     console.log('I run once, when the component first shows up')
//
//     return () => {
//       console.log('I run when the component disappears (cleanup)')
//     }
//   }, [])   // ← empty array = "only on mount". [x] = "whenever x changes"
//
// Use it for: fetching data, subscribing to events, timers.
// The cleanup function stops listeners so you don't get duplicates/leaks.
//
// ---------------------------------------------------------------------
// LESSON 3 — Context: "global" state for a part of the app
// ---------------------------------------------------------------------
// 3 pieces:
//   (a) create it:          const ThemeContext = createContext(null)
//   (b) provide a value:    <ThemeContext.Provider value={{ theme: 'dark' }}>
//                             {children}
//                           </ThemeContext.Provider>
//   (c) read it anywhere:   const { theme } = useContext(ThemeContext)
//
// A full mini example (a theme, NOT auth — yours follows the same shape):
//
//   import { createContext, useContext, useState } from 'react'
//
//   const ThemeContext = createContext(null)
//
//   export function ThemeProvider({ children }) {
//     const [theme, setTheme] = useState('light')
//     const toggle = () => setTheme(theme === 'light' ? 'dark' : 'light')
//
//     return (
//       <ThemeContext.Provider value={{ theme, toggle }}>
//         {children}
//       </ThemeContext.Provider>
//     )
//   }
//
//   export function useTheme() {
//     return useContext(ThemeContext)
//   }
//
//   // In any component:   const { theme, toggle } = useTheme()
//
// `children` = whatever you put between the opening and closing tags:
//   <ThemeProvider><App /></ThemeProvider>   → children is <App />
//
// ---------------------------------------------------------------------
// LESSON 4 — The two Firebase auth calls you need here
// ---------------------------------------------------------------------
//   import { onAuthStateChanged, signOut } from 'firebase/auth'
//
//   // 1. "Tell me who's logged in — now AND whenever it changes"
//   //    Firebase saves the login in the browser, so after a refresh it
//   //    calls this right away with the saved user (or null).
//   const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//     console.log(firebaseUser)   // null if logged out, else { uid, email, ... }
//   })
//   unsubscribe()                 // call this in your useEffect cleanup
//
//   // 2. Log out
//   signOut(auth)
//
// ⚠ Firebase users have `uid`, not `id`:   user.uid   user.email
//
// The FIRST time onAuthStateChanged fires, Firebase has finished checking
// for a saved login. That's the moment to set loading to false.
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. Imports: createContext, useContext, useEffect, useState from 'react'
//             { onAuthStateChanged, signOut } from 'firebase/auth'
//             { auth } from '../firebase'
// 2. const AuthContext = createContext(null)
// 3. export function AuthProvider({ children }) {
//      - state: user (null), loading (true)
//      - useEffect (empty deps []):
//          • const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//              setUser(firebaseUser); setLoading(false)
//            })
//          • return unsubscribe        ← it IS the cleanup function
//      - const logout = () => signOut(auth)
//      - const value = { user, signOut: logout }
//      - if (loading) return a centered "Loading..." <div>
//      - otherwise return the Provider wrapping {children}
//    }
// 4. export function useAuth() { return useContext(AuthContext) }
//
//   Why `logout` and not `signOut`? The name signOut is already taken by
//   the Firebase import. Other files still call it as `signOut` from useAuth().
//
// HOW TO TEST
//   In App.jsx temporarily do:  const { user } = useAuth(); console.log(user)
//   Logged out → null. After you log in (Auth page) → an object with email.
//
// COMMON MISTAKES
//   - "Cannot destructure property 'user' of useAuth()..." → you forgot to wrap
//     <App /> with <AuthProvider> in main.jsx
//   - ESLint warns "Fast refresh only works when a file only exports components".
//     That's because this file exports a hook too. It's only a warning — ignore it.
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

