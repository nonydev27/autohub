// =====================================================================
// FILE: src/main.jsx  — the very first JS file that runs
// =====================================================================
//
// WHAT THIS FILE DOES
//   index.html has an empty <div id="root"></div> and loads this file.
//   This file puts your React app inside that div.
//
//   You need to WRAP <App /> in two "providers". A provider gives a
//   feature to everything inside it:
//     BrowserRouter → makes pages/links work (<Routes>, <NavLink>, <Navigate>)
//     AuthProvider  → makes useAuth() work
//
// HOW TO USE THIS FILE
//   The finished code is at the bottom of this file. The PARTS below
//   explain it piece by piece, line by line.
//
// ---------------------------------------------------------------------
// THE FINISHED CODE (new lines marked ← NEW)
// ---------------------------------------------------------------------
//   import { StrictMode } from 'react'
//   import { createRoot } from 'react-dom/client'
//   import { BrowserRouter } from 'react-router-dom'           ← NEW
//   import './index.css'
//   import App from './App.jsx'
//   import { AuthProvider } from './context/AuthContext'       ← NEW
//
//   createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <BrowserRouter>                                        ← NEW
//         <AuthProvider>                                       ← NEW
//           <App />
//         </AuthProvider>                                      ← NEW
//       </BrowserRouter>                                       ← NEW
//     </StrictMode>,
//   )
//
//   WHAT EACH LINE MEANS
//   • document.getElementById('root') finds the empty div in index.html.
//   • createRoot(...).render(...) draws your app inside it.
//   • The ORDER of wrappers matters: outer ones are available to inner
//     ones. BrowserRouter is outside AuthProvider so that everything,
//     including the auth code, can use routing.
//   • Every opening tag <X> needs its closing tag </X>, in reverse order
//     (like brackets in maths).
//   • StrictMode runs some code twice while developing, to catch bugs.
//     If you see a console.log printed twice, that's why. It's normal.
//
// ✅ FINISHED CODE
// =====================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
