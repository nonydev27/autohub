// ProtectedRoute — guards pages that need login.
// Usage in App.jsx: <ProtectedRoute><ChatRoom /></ProtectedRoute>
//
// TODO:
// 1. Takes { children } as a prop
// 2. Get `user` from useAuth()
// 3. If there's no user → return <Navigate to="/auth" replace />
// 4. Otherwise → return children
// 5. export default ProtectedRoute
//
// (That's it — about 5 lines of real code.)
