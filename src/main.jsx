// =====================================================================
// FILE: src/main.jsx  — the very first JS file that runs
// =====================================================================
//
// HOW THE APP STARTS
//   index.html has <div id="root"></div> and loads this file.
//   createRoot(...).render(...) puts your React app inside that div.
//
// WHAT YOU NEED TO ADD
//   "Wrappers" (providers) that give features to everything inside them:
//     - BrowserRouter → makes <Routes>, <NavLink>, <Navigate> work
//     - AuthProvider  → makes useAuth() work
//
//   Order matters: outer things are available to inner things.
//
//   EXAMPLE (with made-up providers):
//     <StrictMode>
//       <ThemeProvider>
//         <LanguageProvider>
//           <App />
//         </LanguageProvider>
//       </ThemeProvider>
//     </StrictMode>
//
// STEPS
//   1. import { BrowserRouter } from 'react-router-dom'
//   2. import { AuthProvider } from './context/AuthContext'
//   3. Nest:  StrictMode > BrowserRouter > AuthProvider > App
//
// NOTE: StrictMode runs effects twice in development on purpose (to catch
// missing cleanups). If you see a console.log twice, that's why — it's normal.
// =====================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
