// =====================================================================
// FILE: src/supabaseClient.js
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// Creates ONE Supabase "client" object and exports it. A client is just
// an object that knows your project's address + key and has methods like
// supabase.auth.signUp(...) and supabase.from('messages').select(...).
// Every other file does:   import { supabase } from '../supabaseClient'
//
// ---------------------------------------------------------------------
// LESSON 1 — Environment variables (env vars)
// ---------------------------------------------------------------------
// Secrets/config don't belong in code. They live in `.env.local`:
//
//     VITE_SUPABASE_URL=https://abcd1234.supabase.co
//     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
//
// Vite reads that file and gives you the values through `import.meta.env`:
//
//     const url = import.meta.env.VITE_SUPABASE_URL
//     console.log(url)   // "https://abcd1234.supabase.co"
//
// Rules:
//   - The name MUST start with VITE_ or Vite hides it from the browser.
//   - Restart `npm run dev` after editing .env.local.
//   - The "anon" key is safe to ship to the browser — security comes from
//     the RLS policies you write in supabase/schema.sql.
//
// ---------------------------------------------------------------------
// LESSON 2 — Named exports vs default exports
// ---------------------------------------------------------------------
//   export const pi = 3.14          →  import { pi } from './math'     (curly braces)
//   export default function App(){} →  import App from './App'         (no braces)
//
// For this file we use a NAMED export, so other files import with { supabase }.
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
// 1. import { createClient } from '@supabase/supabase-js'
// 2. Read VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY into two consts
// 3. If either is missing, throw a helpful Error (like the example)
// 4. export const supabase = createClient(yourUrl, yourKey)
//
// HOW TO TEST
//   Temporarily put `console.log(supabase)` at the bottom, open the app,
//   check the browser console (F12). You should see a big object. Remove it after.
//
// COMMON MISTAKES
//   - "supabaseUrl is required" → .env.local missing, misnamed, or dev server not restarted
//   - .env.local placed inside src/ — it must be in the project ROOT (next to package.json)
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

