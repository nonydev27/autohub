// =====================================================================
// FILE: src/pages/Auth.jsx          MOCKUP: src/assets/mockups/auth.svg
// =====================================================================
//
// WHAT THIS FILE DOES
//   The login page: a card with an email box, a password box and a
//   button. A link underneath switches between "Log In" and "Sign Up".
//   When login works, Firebase tells AuthContext, and App.jsx moves you
//   to /chat by itself. This file doesn't need to redirect anywhere.
//
// HOW TO USE THIS FILE
//   The complete code is below, cut into PARTS. For each part: read the
//   code, read what each line means, then TYPE it yourself at the bottom
//   under ✍️. Open the mockup in your browser to see what you're building.
//
// ---------------------------------------------------------------------
// PART 1 of 6 — Imports
// ---------------------------------------------------------------------
//   import { useState } from 'react'
//   import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
//   import { Car } from 'lucide-react'
//   import { auth } from '../firebase'
//
//   WHAT EACH LINE MEANS
//   • useState → values that change (what's typed, errors, loading...)
//   • createUserWithEmailAndPassword → makes a new account (sign up)
//   • signInWithEmailAndPassword     → logs into an existing account
//   • Car → the car icon, used as a component: <Car />
//   • auth → your login tool from src/firebase.js
//
// ---------------------------------------------------------------------
// PART 2 of 6 — Friendly error messages
// ---------------------------------------------------------------------
//   const friendlyErrors = {
//     'auth/invalid-credential': 'Wrong email or password',
//     'auth/email-already-in-use': 'That email already has an account',
//     'auth/weak-password': 'Password must be at least 6 characters',
//     'auth/invalid-email': 'That email address looks wrong',
//     'auth/too-many-requests': 'Too many tries — wait a minute and try again',
//   }
//
//   WHAT IT MEANS
//   • When something goes wrong, Firebase gives an error CODE like
//     'auth/invalid-credential'. That's ugly to show users, so this object
//     maps each code (left) to a nice sentence (right).
//   • It's outside the component because it never changes.
//
// ---------------------------------------------------------------------
// PART 3 of 6 — Start the component and its state
// ---------------------------------------------------------------------
//   function Auth() {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [isSignUp, setIsSignUp] = useState(false)
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)
//
//   WHAT EACH LINE MEANS
//   • Each line makes one changing value + the function to change it:
//       email, password → what's typed in the boxes (start empty: '')
//       isSignUp        → false = "Log In" mode, true = "Sign Up" mode
//       error           → the red error text ('' = no error)
//       loading         → true while we wait for Firebase
//   • (Don't close the { yet. PARTS 4 to 6 go inside this function.)
//
// ---------------------------------------------------------------------
// PART 4 of 6 — What happens when the form is submitted
// ---------------------------------------------------------------------
//     async function handleSubmit(e) {
//       e.preventDefault()
//       setLoading(true)
//       setError('')
//
//       try {
//         if (isSignUp) {
//           await createUserWithEmailAndPassword(auth, email, password)
//         } else {
//           await signInWithEmailAndPassword(auth, email, password)
//         }
//       } catch (err) {
//         setError(friendlyErrors[err.code] ?? err.message)
//       }
//
//       setLoading(false)
//     }
//
//     function toggleMode() {
//       setIsSignUp(!isSignUp)
//       setError('')
//     }
//
//   WHAT EACH LINE MEANS
//   • `async function` → a function allowed to use `await` (wait for
//     something slow, like the internet).
//   • `e` is the submit event. e.preventDefault() stops the browser's
//     old habit of RELOADING THE PAGE when a form is submitted. Forget
//     this line and the page flashes and nothing works.
//   • setLoading(true) → button shows "Please wait..." and is disabled.
//     setError('')     → clear any old error.
//   • try { ... } catch (err) { ... }
//       Run the code in try. If anything in it FAILS, jump to catch,
//       with the error in `err`.
//   • `if (isSignUp)` → in Sign Up mode make an account,
//     `else` → otherwise log in. `await` waits for Firebase's answer.
//     If it works, nothing else is needed: AuthContext notices.
//   • friendlyErrors[err.code] looks up the nice message for that code.
//     `?? err.message` → if there's no nice message for it, show
//     Firebase's own message instead.
//   • setLoading(false) → the button goes back to normal.
//   • toggleMode flips Log In ⇄ Sign Up. `!isSignUp` = the opposite
//     of isSignUp (true → false, false → true).
//
// ---------------------------------------------------------------------
// PART 5 of 6 — The button text
// ---------------------------------------------------------------------
//     let buttonText = isSignUp ? 'Sign Up' : 'Log In'
//     if (loading) buttonText = 'Please wait...'
//
//   WHAT IT MEANS
//   • `condition ? A : B` is a short if/else: "if isSignUp, 'Sign Up',
//     otherwise 'Log In'". This is called a ternary.
//   • `let` (not const) because we may change it on the next line.
//
// ---------------------------------------------------------------------
// PART 6 of 6 — What's shown on screen
// ---------------------------------------------------------------------
//     return (
//       <div className="flex min-h-screen items-center justify-center p-4">
//         <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
//           <div className="mb-6 flex flex-col items-center gap-2 text-center">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
//               <Car size={28} />
//             </div>
//             <h1 className="text-2xl font-bold">AutoHub</h1>
//             <p className="text-sm text-slate-500">Connect, chat &amp; catch up on auto news</p>
//           </div>
//
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <label className="flex flex-col gap-1 text-sm font-medium">
//               Email
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-orange-500 focus:outline-none"
//               />
//             </label>
//
//             <label className="flex flex-col gap-1 text-sm font-medium">
//               Password
//               <input
//                 type="password"
//                 required
//                 minLength={6}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-orange-500 focus:outline-none"
//               />
//             </label>
//
//             {error && <p className="text-sm text-red-600">{error}</p>}
//
//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
//             >
//               {buttonText}
//             </button>
//           </form>
//
//           <button
//             type="button"
//             onClick={toggleMode}
//             className="mt-4 w-full text-center text-sm text-slate-500"
//           >
//             {isSignUp ? 'Have an account? ' : "Don't have an account? "}
//             <span className="font-medium text-orange-600 hover:underline">
//               {isSignUp ? 'Log in' : 'Sign up'}
//             </span>
//           </button>
//         </div>
//       </div>
//     )
//   }
//
//   export default Auth
//
//   WHAT EACH LINE MEANS
//   • Outer div: centres the card on the screen (flex + items-center +
//     justify-center + min-h-screen). p-4 = padding so it doesn't touch
//     the edges on phones.
//   • Card div: w-full max-w-sm = full width but never wider than "small"
//     (24rem). rounded-2xl = round corners, bg-white, p-8 = big padding,
//     shadow-lg = a shadow.
//   • The orange square: h-12 w-12 = 48px square, bg-orange-500, and the
//     <Car /> icon inside, centred.
//   • `&amp;` is how you write the & symbol inside JSX text.
//   • <form onSubmit={handleSubmit}> → when the form is submitted (button
//     click or Enter key), run handleSubmit from PART 4.
//   • <label> wrapping the text AND the <input> links them, so clicking
//     the word "Email" puts the cursor in the box.
//   • The input boxes are "controlled":
//       value={email}                             → the box shows `email`
//       onChange={(e) => setEmail(e.target.value)}→ every keystroke saves
//                                                    the new text in `email`
//     e.target is the input box; e.target.value is the text in it.
//   • type="email" + required → the browser checks the email looks valid
//     and isn't empty. minLength={6} → password needs 6+ characters
//     (Firebase's minimum).
//   • `{error && <p>...</p>}` → only show the red text IF error isn't
//     empty. `&&` = "if the left is true, show the right".
//   • disabled={loading} → can't click twice while waiting.
//     disabled:opacity-50 → looks faded when disabled.
//   • The bottom button has type="button", which means "this button does
//     NOT submit a form". It's outside the form anyway, but it's a good
//     habit: a button INSIDE a form with no type will submit it.
//   • The text changes depending on the mode (ternary again).
//     "Don't..." uses double quotes because the text contains an apostrophe.
//   • The final `}` closes the Auth function from PART 3.
//   • `export default Auth` lets App.jsx do  import Auth from './pages/Auth'
//
// 🧪 TEST IT
//   Click "Sign up", sign up with a fake email (test1@test.com / 123456).
//   Check Firebase console → Authentication → Users: it's there.
//   Try a wrong password → you see "Wrong email or password".
//
// ❌ COMMON MISTAKES
//   - "auth/operation-not-allowed" → enable Email/Password in Firebase
//     console → Authentication → Sign-in method.
//   - Page reloads when you click the button → missing e.preventDefault().
//
// ✍️ TYPE PARTS 1 → 6 BELOW, IN ORDER
// ---------------------------------------------------------------------
