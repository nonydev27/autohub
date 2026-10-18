// =====================================================================
// FILE: src/components/ProtectedRoute.jsx
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// A "bouncer" component. If nobody is logged in, it redirects to /auth.
// If someone is, it just shows whatever is inside it.
//   Usage in App.jsx:  <ProtectedRoute><ChatRoom /></ProtectedRoute>
//
// ---------------------------------------------------------------------
// LESSON — props and `children`
// ---------------------------------------------------------------------
// Props are inputs to a component, like function arguments:
//   <Greeting name="Karl" />
//   function Greeting({ name }) { return <p>Hi {name}</p> }
//
// `children` is a special prop = what's between the tags:
//   <Card><p>Inside!</p></Card>
//   function Card({ children }) {
//     return <div className="rounded bg-white p-4">{children}</div>
//   }
//
// A component can return early, like any function:
//   function AdminOnly({ isAdmin, children }) {
//     if (!isAdmin) return <p>Not allowed</p>
//     return children
//   }
//
// <Navigate to="/somewhere" replace /> redirects as soon as it renders.
// `replace` means the Back button won't bring you back to the blocked page.
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION  (≈ 6 lines — it's AdminOnly with useAuth)
// ---------------------------------------------------------------------
// 1. import { Navigate } from 'react-router-dom'
//    import { useAuth } from '../context/AuthContext'
// 2. function ProtectedRoute({ children })
// 3. const { user } = useAuth()
// 4. if (!user) return <Navigate to="/auth" replace />
// 5. return children
// 6. export default ProtectedRoute
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

