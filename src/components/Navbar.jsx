import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { NAV_LINKS } from '../data/navLinks'
import Avatar from './Avatar'
import Logo from './Logo'

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
  }`

function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium leading-tight">{user.name}</p>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>
          <Avatar name={user.name} seed={user.uid} />
          <button
            onClick={signOut}
            title="Log out"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
