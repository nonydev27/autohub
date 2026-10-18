import { NavLink } from 'react-router-dom'
import { ROOMS } from '../data/rooms'

function RoomList() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col gap-1 rounded-2xl border border-white/10 bg-zinc-900/60 p-3 md:flex">
        <p className="px-3 pt-2 pb-3 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">Rooms</p>
        {ROOMS.map((room) => (
          <NavLink
            key={room.id}
            to={`/chat/${room.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? 'bg-orange-500/10 text-orange-300' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{room.emoji}</span>
            <span className="font-medium">{room.name}</span>
          </NavLink>
        ))}
      </aside>

      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto md:hidden">
        {ROOMS.map((room) => (
          <NavLink
            key={room.id}
            to={`/chat/${room.id}`}
            className={({ isActive }) =>
              `shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${
                isActive ? 'border-orange-500/40 bg-orange-500/10 text-orange-300' : 'border-white/10 text-zinc-400'
              }`
            }
          >
            {room.emoji} {room.name}
          </NavLink>
        ))}
      </div>
    </>
  )
}

export default RoomList
