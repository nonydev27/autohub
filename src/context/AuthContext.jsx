// =====================================================================
// FILE: src/context/AuthContext.jsx
// =====================================================================
//
// WHAT THIS FILE DOES
//   Remembers "who is logged in" and shares it with EVERY component.
//   The Navbar needs the email, ChatRoom needs the user's id, and
//   ProtectedRoute needs to know if anyone is logged in. They all just call:
//       const { user, signOut } = useAuth()
//
//   Think of it like a noticeboard at the top of the app: this file
//   writes "the user is Karl" on it, and any component can read it.
//
// HOW TO USE THIS FILE
//   The complete code is below, cut into PARTS. For each part: read the
//   code, read what each line means, then TYPE it yourself at the bottom
//   under ✍️.
//
// ---------------------------------------------------------------------
// PART 1 of 6 — Imports
// ---------------------------------------------------------------------
//   import { createContext, useContext, useEffect, useState } from 'react'
//   import { onAuthStateChanged, signOut } from 'firebase/auth'
//   import { auth } from '../firebase'
//
//   WHAT EACH LINE MEANS
//   • From React:
//       createContext → makes the "noticeboard"
//       useContext    → reads the noticeboard
//       useState      → a value that, when changed, redraws the screen
//       useEffect     → run some code once the component is on screen
//   • From Firebase:
//       onAuthStateChanged → "call me whenever someone logs in or out"
//       signOut            → logs the user out
//   • `auth` is the login tool you exported from src/firebase.js.
//     `../` means "go up one folder" (out of context/ into src/).
//
// ---------------------------------------------------------------------
// PART 2 of 6 — Create the noticeboard
// ---------------------------------------------------------------------
//   const AuthContext = createContext(null)
//
//   WHAT IT MEANS
//   • Makes an empty noticeboard. `null` = "nothing on it yet".
//
// ---------------------------------------------------------------------
// PART 3 of 6 — The Provider: the component that fills the noticeboard
// ---------------------------------------------------------------------
//   export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null)
//     const [loading, setLoading] = useState(true)
//
//   WHAT EACH LINE MEANS
//   • A component is just a function that returns what to show.
//   • `{ children }` = whatever is placed INSIDE it. In main.jsx you'll
//     write <AuthProvider><App /></AuthProvider>, so children is <App />.
//   • `const [user, setUser] = useState(null)`
//       user    → the current value (starts as null = nobody logged in)
//       setUser → the function you call to change it. Calling it makes
//                 React redraw everything that uses `user`.
//   • loading starts as true because, when the page first opens,
//     Firebase needs a moment to check if you were already logged in.
//
//   (Don't close the { yet. PARTS 4 and 5 go inside this function.)
//
// ---------------------------------------------------------------------
// PART 4 of 6 — Listen for login / logout
// ---------------------------------------------------------------------
//     useEffect(() => {
//       const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//         setUser(firebaseUser)
//         setLoading(false)
//       })
//       return unsubscribe
//     }, [])
//
//     const logout = () => signOut(auth)
//
//   WHAT EACH LINE MEANS
//   • useEffect(() => { ... }, [])  runs the code inside ONCE, right
//     after the component first appears. The `[]` at the end is what
//     makes it "only once".
//   • onAuthStateChanged(auth, (firebaseUser) => { ... })
//       "Firebase, every time the login state changes, run this function."
//       It ALSO runs immediately when the page opens:
//         - not logged in → firebaseUser is null
//         - logged in     → firebaseUser is an object: { uid, email, ... }
//   • setUser(firebaseUser) → put the user on the noticeboard
//   • setLoading(false)     → Firebase has answered, stop showing "Loading..."
//   • onAuthStateChanged gives back a function that STOPS listening. We
//     call it `unsubscribe` and `return` it. React runs a returned
//     function when the component goes away ("cleanup"), so we don't
//     leave a listener running in the background.
//   • `const logout = () => signOut(auth)` is a short function that logs
//     out. `() =>` is an "arrow function": a function with no name.
//     We call it logout because the name `signOut` is already used by
//     the Firebase import above.
//
// ---------------------------------------------------------------------
// PART 5 of 6 — What the Provider shows
// ---------------------------------------------------------------------
//     if (loading) {
//       return (
//         <div className="flex min-h-screen items-center justify-center text-slate-500">
//           Loading...
//         </div>
//       )
//     }
//
//     return (
//       <AuthContext.Provider value={{ user, signOut: logout }}>
//         {children}
//       </AuthContext.Provider>
//     )
//   }
//
//   WHAT EACH LINE MEANS
//   • While Firebase is still checking, show a centred "Loading..." and
//     nothing else. `return` stops the function there.
//   • The tag-like code is JSX: HTML-looking code inside JavaScript.
//     `className` is how you write the HTML `class` attribute in React.
//     The words in it are Tailwind classes (see TUTOR section 7):
//       flex items-center justify-center → centre the content
//       min-h-screen                     → at least the full screen height
//   • <AuthContext.Provider value={...}> puts `value` on the noticeboard
//     for everything inside it ({children} = your whole app).
//   • `value={{ user, signOut: logout }}`:
//       outer { } → "JavaScript goes here"
//       inner { } → an object
//       `user` is short for `user: user`
//       `signOut: logout` → other files call it signOut
//   • The final `}` closes the AuthProvider function from PART 3.
//
// ---------------------------------------------------------------------
// PART 6 of 6 — The useAuth() shortcut
// ---------------------------------------------------------------------
//   // eslint-disable-next-line react-refresh/only-export-components
//   export function useAuth() {
//     return useContext(AuthContext)
//   }
//
//   WHAT EACH LINE MEANS
//   • useAuth() reads the noticeboard. Any component can now write
//     const { user, signOut } = useAuth()
//   • The `// eslint-disable-next-line ...` comment is needed: the linter
//     doesn't like a file exporting a component AND a normal function,
//     and `npm run lint` fails without it. It's harmless here.
//
// 🧪 TEST IT (after main.jsx and App.jsx are done)
//   In App.jsx:  const { user } = useAuth(); console.log(user)
//   Logged out → null. After logging in → an object with your email.
//
// ❌ COMMON MISTAKES
//   - "Cannot destructure property 'user' of useAuth()" → <App /> isn't
//     wrapped in <AuthProvider> in main.jsx.
//   - Using user.id: Firebase calls it user.uid.
//
// ✍️ TYPE PARTS 1 → 6 BELOW, IN ORDER
// ---------------------------------------------------------------------
