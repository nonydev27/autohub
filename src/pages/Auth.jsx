// Auth page — one form that does both Sign Up and Log In.
//
// TODO:
// 1. State: email, password, isSignUp (boolean toggle), error, loading
//
// 2. handleSubmit(e):
//    - e.preventDefault()
//    - set loading true, clear error
//    - if isSignUp → supabase.auth.signUp({ email, password })
//      else       → supabase.auth.signInWithPassword({ email, password })
//    - both return { data, error } — if error, show error.message
//    - set loading false
//    - no need to redirect manually: AuthContext sees the new session and
//      App.jsx sends the user to /chat
//
// 3. JSX:
//    - AutoHub logo/title (lucide `Car` icon + text)
//    - email input (type="email", required)
//    - password input (type="password", required, minLength 6 — Supabase's minimum)
//    - submit button: text "Sign Up" or "Log In", disabled while loading
//    - red error text if error
//    - small button/link to toggle isSignUp ("Don't have an account? Sign up")
//
// 4. Style: center a card on the page (flex, items-center, justify-center, min-h-screen)
//
// 5. export default Auth
