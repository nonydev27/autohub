import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// TODO:
// 1. Import BrowserRouter from 'react-router-dom'
// 2. Import AuthProvider from './context/AuthContext'
// 3. Wrap <App /> like this: StrictMode > BrowserRouter > AuthProvider > App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
