// =====================================================================
// FILE: src/firebase.js
// =====================================================================
//
// WHAT THIS FILE DOES
//   Connects your app to YOUR Firebase project, once, and hands out two
//   tools the rest of the app uses:
//     auth → the login system
//     db   → the database (Firestore)
//   Other files get them with:   import { auth, db } from '../firebase'
//
// HOW TO USE THIS FILE
//   The finished code is at the bottom of this file. The PARTS below
//   explain it piece by piece, line by line.
//
// ---------------------------------------------------------------------
// PART 1 of 4 — Imports
// ---------------------------------------------------------------------
//   import { initializeApp } from 'firebase/app'
//   import { getAuth } from 'firebase/auth'
//   import { getFirestore } from 'firebase/firestore'
//
//   WHAT EACH LINE MEANS
//   • `import { x } from 'package'` borrows the function x from a package
//     you installed (it's in node_modules). The { } means "the one named x".
//   • initializeApp → connects to a Firebase project
//   • getAuth       → gives you the login tool for that project
//   • getFirestore  → gives you the database tool for that project
//
// ---------------------------------------------------------------------
// PART 2 of 4 — Your project's settings
// ---------------------------------------------------------------------
//   const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   }
//
//   WHAT EACH LINE MEANS
//   • `const firebaseConfig = { ... }` makes an OBJECT: a bundle of
//     "name: value" pairs separated by commas.
//   • `import.meta.env.VITE_...` reads a value from your .env.local file.
//     So instead of writing your project id in the code, you write it
//     once in .env.local:   VITE_FIREBASE_PROJECT_ID=autohub-1234
//   • Names MUST start with VITE_ or Vite won't let the browser see them.
//   • These values are NOT secret. Anyone can see them in the browser.
//     What protects your data is firestore.rules.
//
// ---------------------------------------------------------------------
// PART 3 of 4 — Stop early with a clear message if .env.local is missing
// ---------------------------------------------------------------------
//   if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
//     throw new Error('Firebase config is missing — check .env.local and restart npm run dev')
//   }
//
//   WHAT EACH LINE MEANS
//   • `!x` means "x is empty / missing".  `||` means "or".
//     So: "if the apiKey is missing OR the projectId is missing..."
//   • `throw new Error('...')` stops the app and shows that message in
//     the browser console (F12). Much easier to understand than a
//     confusing Firebase error later.
//
// ---------------------------------------------------------------------
// PART 4 of 4 — Connect and share the tools
// ---------------------------------------------------------------------
//   const app = initializeApp(firebaseConfig)
//
//   export const auth = getAuth(app)
//   export const db = getFirestore(app)
//
//   WHAT EACH LINE MEANS
//   • initializeApp(firebaseConfig) connects using your settings and
//     gives back the connection, which we call `app`.
//   • getAuth(app) / getFirestore(app) take that connection and give
//     you the login tool and the database tool.
//   • `export` lets other files import them. Because it's
//     `export const auth`, other files write  import { auth } from ...
//     (with curly braces, using the exact same name).
//
// 🧪 TEST IT
//   Add  console.log(auth, db)  at the very bottom, run `npm run dev`,
//   open the app, press F12 → Console. You should see two objects.
//   Delete the console.log afterwards.
//
// ❌ COMMON MISTAKES
//   - "Firebase config is missing" → .env.local isn't in the project ROOT
//     (next to package.json), a name is misspelled, or you didn't restart
//     `npm run dev` after editing it.
//
// ✅ FINISHED CODE — this is the code from the parts above, put together.
// ---------------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase config is missing — check .env.local and restart npm run dev')
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
