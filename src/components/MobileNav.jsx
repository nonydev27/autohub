import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from '../data/navLinks'

const linkClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
    isActive ? 'text-orange-400' : 'text-zinc-500'
  }`

function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t border-white/10 bg-zinc-950/90 backdrop-blur-lg md:hidden">
      {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={linkClass}>
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav
