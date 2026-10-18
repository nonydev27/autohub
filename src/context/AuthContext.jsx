import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

function toProfile(firebaseUser) {
  if (!firebaseUser) return null
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(toProfile(firebaseUser))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    user,
    signOut: () => signOut(auth),
    refreshUser: () => setUser(toProfile(auth.currentUser)),
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-white/10 border-t-orange-500" />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
