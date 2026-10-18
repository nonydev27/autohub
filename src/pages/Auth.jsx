// =====================================================================
// FILE: src/pages/Auth.jsx          MOCKUP: src/assets/mockups/auth.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// One card with an email + password form. A toggle switches between
// "Log In" and "Sign Up" mode. On success, Firebase remembers the login,
// AuthContext notices, and App.jsx redirects to /chat automatically.
//
// ---------------------------------------------------------------------
// LESSON 1 — Controlled inputs (React owns the input's value)
// ---------------------------------------------------------------------
//   const [name, setName] = useState('')
//
//   <input
//     value={name}                              ← shows the state
//     onChange={(e) => setName(e.target.value)} ← updates state on every keystroke
//   />
//
//   `e` is the event; `e.target` is the input; `e.target.value` is the text.
//
// ---------------------------------------------------------------------
// LESSON 2 — Forms
// ---------------------------------------------------------------------
//   async function handleSubmit(e) {
//     e.preventDefault()        ← STOPS the browser reloading the page (very important!)
//     // ...do stuff
//   }
//   <form onSubmit={handleSubmit}>
//     <input ... />
//     <button type="submit">Go</button>   ← pressing Enter or clicking submits
//   </form>
//
// ---------------------------------------------------------------------
// LESSON 3 — async / await and try / catch
// ---------------------------------------------------------------------
// Network calls take time. `await` pauses the function until it finishes.
// Firebase THROWS an error when something goes wrong, so wrap it in try/catch:
//
//   import { signInWithEmailAndPassword } from 'firebase/auth'
//
//   try {
//     await signInWithEmailAndPassword(auth, 'me@test.com', 'secret123')
//     // success → onAuthStateChanged in AuthContext fires by itself
//   } catch (err) {
//     console.log(err.code)      // e.g. "auth/invalid-credential"
//     console.log(err.message)   // "Firebase: Error (auth/invalid-credential)."
//   }
//
//   Sign up has the same shape:
//     createUserWithEmailAndPassword(auth, email, password)
//
// err.message is ugly, so turn the common codes into friendly text:
//   const messages = {
//     'auth/invalid-credential': 'Wrong email or password',
//     'auth/email-already-in-use': 'That email already has an account',
//     'auth/weak-password': 'Password must be at least 6 characters',
//     'auth/invalid-email': 'That email address looks wrong',
//   }
//   setError(messages[err.code] ?? err.message)
//   ↑ `??` = "if the left side is undefined, use the right side"
//
// ---------------------------------------------------------------------
// LESSON 4 — Loading flags & toggles
// ---------------------------------------------------------------------
//   const [loading, setLoading] = useState(false)
//   setLoading(true);  await somethingSlow();  setLoading(false)
//   <button disabled={loading}>{loading ? 'Please wait...' : 'Submit'}</button>
//
//   const [isOpen, setIsOpen] = useState(false)
//   <button type="button" onClick={() => setIsOpen(!isOpen)}>Toggle</button>
//   ↑ type="button" so it doesn't submit the form!
//
// ---------------------------------------------------------------------
// EXAMPLE — a newsletter form (different purpose, same techniques)
// ---------------------------------------------------------------------
//   function Newsletter() {
//     const [email, setEmail] = useState('')
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)
//
//     async function handleSubmit(e) {
//       e.preventDefault()
//       setLoading(true)
//       setError('')
//       try {
//         await addDoc(collection(db, 'subscribers'), { email })
//       } catch (err) {
//         setError(err.message)
//       }
//       setLoading(false)
//     }
//
//     return (
//       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//         <input
//           type="email" required value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="rounded-lg border border-slate-300 px-3 py-2"
//         />
//         {error && <p className="text-sm text-red-600">{error}</p>}
//         <button disabled={loading} className="rounded-lg bg-orange-500 py-2 text-white">
//           {loading ? 'Saving...' : 'Subscribe'}
//         </button>
//       </form>
//     )
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. Imports: useState, { auth } from '../firebase',
//             { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth',
//             { Car } from 'lucide-react'
// 2. State: email, password, isSignUp (false), error (''), loading (false)
// 3. handleSubmit:
//      preventDefault → loading on, error cleared
//      try {
//        if (isSignUp) await createUserWithEmailAndPassword(auth, email, password)
//        else          await signInWithEmailAndPassword(auth, email, password)
//      } catch (err) → setError(friendly message, Lesson 3)
//      loading off
// 4. JSX (match the mockup):
//      <div className="flex min-h-screen items-center justify-center p-4">
//        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
//          logo (orange square with <Car />) + "AutoHub" + tagline
//          <form> email label+input, password label+input (minLength={6}),
//                 error text, submit button </form>
//          toggle button: "Don't have an account? Sign up" / "Have an account? Log in"
// 5. export default Auth
//
// HOW TO TEST
//   Sign up with a fake email (e.g. test1@test.com). Check Firebase console →
//   Authentication → Users. If you get "auth/operation-not-allowed", you
//   haven't enabled the Email/Password sign-in method yet.
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

