// =====================================================================
// FILE: src/pages/Auth.jsx          MOCKUP: src/assets/mockups/auth.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// One card with an email + password form. A toggle switches between
// "Log In" and "Sign Up" mode. On success, Supabase stores the session,
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
// LESSON 3 — async / await and Supabase's { data, error } pattern
// ---------------------------------------------------------------------
// Network calls take time. `await` pauses the function until it finishes.
// Supabase never throws for normal failures; it RETURNS an error:
//
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: 'me@test.com',
//     password: 'secret123',
//   })
//   if (error) {
//     console.log(error.message)   // e.g. "Invalid login credentials"
//   }
//
//   signUp takes the exact same shape: supabase.auth.signUp({ email, password })
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
//       const { error } = await supabase.from('subscribers').insert({ email })
//       if (error) setError(error.message)
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
// 1. Imports: useState, { supabase }, { Car } from 'lucide-react'
// 2. State: email, password, isSignUp (false), error (''), loading (false)
// 3. handleSubmit:
//      preventDefault → loading on, error cleared
//      const { error } = isSignUp ? await signUp(...) : await signInWithPassword(...)
//      if error → setError(error.message)
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
//   Sign up with a fake email (e.g. test1@test.com). Check Supabase →
//   Authentication → Users. If nothing happens, did you disable "Confirm email"?
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

