import { Link } from 'react-router-dom'
import { Car } from 'lucide-react'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-400 text-zinc-950 shadow-lg shadow-orange-500/30">
        <Car size={20} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Auto<span className="text-orange-500">Hub</span>
      </span>
    </Link>
  )
}

export default Logo
