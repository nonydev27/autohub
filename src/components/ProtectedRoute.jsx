// =====================================================================
// FILE: src/components/ProtectedRoute.jsx
// =====================================================================
//
// WHAT THIS FILE DOES
//   A "bouncer". If nobody is logged in, it sends you to the /auth page.
//   If someone is logged in, it shows whatever is inside it.
//   App.jsx will use it like this:
//       <ProtectedRoute><ChatRoom /></ProtectedRoute>
//
// HOW TO USE THIS FILE
//   The finished code is at the bottom of this file. The PARTS below
//   explain it piece by piece, line by line.
//
// ---------------------------------------------------------------------
// THE CODE
// ---------------------------------------------------------------------
//   import { Navigate } from 'react-router-dom'
//   import { useAuth } from '../context/AuthContext'
//
//   function ProtectedRoute({ children }) {
//     const { user } = useAuth()
//
//     if (!user) return <Navigate to="/auth" replace />
//
//     return children
//   }
//
//   export default ProtectedRoute
//
//   WHAT EACH LINE MEANS
//   • Navigate is a component that changes the page as soon as it's shown.
//   • useAuth comes from your AuthContext file.
//   • `{ children }` = whatever is between <ProtectedRoute> and
//     </ProtectedRoute>. For the chat route, that's <ChatRoom />.
//   • `const { user } = useAuth()` takes `user` out of the noticeboard.
//     The { } here means "pull out the property called user".
//   • `if (!user)` → "if there is no user (logged out)".
//     Then `return <Navigate to="/auth" replace />` sends them to /auth.
//     `replace` means the browser's Back button won't bring them back
//     to the blocked page.
//   • Otherwise, `return children` shows the protected page.
//   • `export default ProtectedRoute` lets App.jsx import it WITHOUT
//     curly braces:  import ProtectedRoute from './components/ProtectedRoute'
//     (export default = "this file's main thing"; one per file.)
//
// 🧪 TEST IT (once App.jsx is done)
//   While logged out, type localhost:5173/chat in the address bar.
//   You should land on /auth.
//
// ✅ FINISHED CODE — this is the code from the parts above, put together.
// ---------------------------------------------------------------------

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/auth" replace />

  return children
}

export default ProtectedRoute
