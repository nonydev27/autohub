// App — decides which page shows for which URL.
// (The old Vite demo code was removed. The app won't render until you write this.)
//
// TODO:
// 1. Import Routes, Route, Navigate from 'react-router-dom'
//    (BrowserRouter goes in main.jsx, around <App />)
// 2. Import Navbar, ProtectedRoute, Auth, ChatRoom, NewsFeed and useAuth
// 3. Render <Navbar /> only when a user is logged in
// 4. Routes:
//      /auth  → <Auth />   (if already logged in, <Navigate to="/chat" /> instead)
//      /chat  → <ChatRoom /> wrapped in <ProtectedRoute>
//      /news  → <NewsFeed /> wrapped in <ProtectedRoute>
//      /      → <Navigate to="/chat" />
//      *      → <Navigate to="/" />   (unknown URLs)
// 5. Give the outer wrapper a background + min-h-screen with Tailwind
// 6. export default App
