// =====================================================================
// FILE: src/firebase.js
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// Connects to YOUR Firebase project ONCE and exports two objects:
//   auth → the login system   (used with signInWithEmailAndPassword, signOut, ...)
//   db   → the Firestore database (used with collection, addDoc, onSnapshot, ...)
// Every other file does:   import { auth, db } from '../firebase'
//
// ---------------------------------------------------------------------
// LESSON 1 — Environment variables (env vars)
// ---------------------------------------------------------------------
// Config doesn't belong in code. It lives in `.env.local`:
//
//     VITE_FIREBASE_API_KEY=AIzaSy...
//     VITE_FIREBASE_PROJECT_ID=autohub-1234
//
// Vite reads that file and gives you the values through `import.meta.env`:
//
//     const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
//     console.log(projectId)   // "autohub-1234"
//
// Rules:
//   - The name MUST start with VITE_ or Vite hides it from the browser.
//   - Restart `npm run dev` after editing .env.local.
//   - The Firebase apiKey is NOT a secret — it's fine in the browser.
//     Security comes from the Security Rules you write in firestore.rules.
//
// ---------------------------------------------------------------------
// LESSON 2 — Named exports vs default exports
// ---------------------------------------------------------------------
//   export const pi = 3.14          →  import { pi } from './math'     (curly braces)
//   export default function App(){} →  import App from './App'         (no braces)
//
// For this file we use NAMED exports, so other files import with { auth, db }.
//
// ---------------------------------------------------------------------
// LESSON 3 — Firebase's "modular" style
// ---------------------------------------------------------------------
// Firebase gives you plain FUNCTIONS, and you pass them the thing to act on:
//
//   import { initializeApp } from 'firebase/app'
//   import { getAuth } from 'firebase/auth'
//   import { getFirestore } from 'firebase/firestore'
//
//   const app = initializeApp(firebaseConfig)   // 1. connect to the project
//   const auth = getAuth(app)                   // 2. get the auth service
//   const db = getFirestore(app)                // 3. get the database service
//
// `firebaseConfig` is just an object with keys like apiKey, authDomain,
// projectId... Firebase shows you this exact object when you register a web app.
//
// ---------------------------------------------------------------------
// EXAMPLE — a different "config" module using the same idea
// ---------------------------------------------------------------------
//   const apiUrl = import.meta.env.VITE_API_URL
//   if (!apiUrl) {
//     throw new Error('VITE_API_URL is missing — check your .env.local')
//   }
//   export const config = { apiUrl }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. import initializeApp, getAuth, getFirestore (Lesson 3)
// 2. const firebaseConfig = {
//      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
//      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
//      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
//    }
// 3. If apiKey or projectId is missing, throw a helpful Error (like the example)
// 4. const app = initializeApp(firebaseConfig)
// 5. export const auth = getAuth(app)
//    export const db = getFirestore(app)
//
// HOW TO TEST
//   Temporarily put `console.log(auth, db)` at the bottom, open the app,
//   check the browser console (F12). You should see two objects. Remove it after.
//
// COMMON MISTAKES
//   - "auth/invalid-api-key" → .env.local missing, misnamed, or dev server not restarted
//   - .env.local placed inside src/ — it must be in the project ROOT (next to package.json)
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------
