import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Car, Eye, EyeOff, MessageCircle, Newspaper, Stethoscope, Warehouse } from 'lucide-react'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { PHOTO } from '../data/photos'
import { photo } from '../utils/format'

const FRIENDLY_ERRORS = {
  'auth/invalid-credential': 'Wrong email or password',
  'auth/email-already-in-use': 'That email already has an account — try logging in',
  'auth/weak-password': 'Password must be at least 6 characters',
  'auth/invalid-email': 'That email address looks wrong',
  'auth/too-many-requests': 'Too many tries — wait a minute and try again',
  'auth/network-request-failed': 'No internet connection',
}

const FEATURES = [
  { icon: MessageCircle, text: 'Live chat rooms with mechanics and car people' },
  { icon: Newspaper, text: 'Fresh automotive stories every day' },
  { icon: Stethoscope, text: 'Decode warning lights and diagnose symptoms' },
  { icon: Warehouse, text: 'Look up any VIN and check for safety recalls' },
]

const INPUT =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-zinc-500 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none'

function Auth() {
  const { refreshUser } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(user, { displayName: name.trim() })
        refreshUser()
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(FRIENDLY_ERRORS[err.code] ?? err.message)
      setLoading(false)
    }
  }

  function switchMode(signUp) {
    setIsSignUp(signUp)
    setError('')
  }

  let buttonText = isSignUp ? 'Create account' : 'Log in'
  if (loading) buttonText = 'Please wait...'

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={photo(PHOTO.silhouette, 1600)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <h2 className="animate-fade-up font-display text-5xl leading-tight font-bold">
            Your garage.
            <br />
            Your crew.
            <br />
            <span className="bg-linear-to-r from-orange-500 to-amber-300 bg-clip-text text-transparent">
              Your news.
            </span>
          </h2>
          <ul className="mt-8 space-y-3">
            {FEATURES.map(({ icon: Icon, text }, index) => (
              <li
                key={text}
                className="flex animate-fade-up items-center gap-3 text-zinc-300"
                style={{ animationDelay: `${150 + index * 100}ms` }}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-orange-400 backdrop-blur">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden p-6">
        <img
          src={photo(PHOTO.silhouette, 900)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 lg:hidden"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/40 to-zinc-950 lg:hidden" />

        <div className="relative w-full max-w-sm animate-fade-up">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-amber-400 text-zinc-950 shadow-xl shadow-orange-500/30">
              <Car size={30} />
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold">
              Auto<span className="text-orange-500">Hub</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400">Connect, chat &amp; catch up on auto news</p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-white/5 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`rounded-lg py-2 transition ${!isSignUp ? 'bg-white/10 text-white shadow' : 'text-zinc-400'}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`rounded-lg py-2 transition ${isSignUp ? 'bg-white/10 text-white shadow' : 'text-zinc-400'}`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
                Your name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kwame Mensah"
                  maxLength={40}
                  className={INPUT}
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={INPUT}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
              Password
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`${INPUT} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 py-3 font-semibold text-zinc-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:opacity-50"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth
