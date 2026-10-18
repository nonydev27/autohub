import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import Home from './pages/Home'
import ChatRoom from './pages/ChatRoom'
import NewsFeed from './pages/NewsFeed'
import Diagnose from './pages/Diagnose'
import Garage from './pages/Garage'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="chat" element={<Navigate to="/chat/general" replace />} />
        <Route path="chat/:roomId" element={<ChatRoom />} />
        <Route path="news" element={<NewsFeed />} />
        <Route path="diagnose" element={<Diagnose />} />
        <Route path="garage" element={<Garage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
