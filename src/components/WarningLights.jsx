import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheck, CircleX, MessageCircle, Wrench } from 'lucide-react'
import { SEVERITY, WARNING_LIGHTS } from '../data/warningLights'

const COLORS = {
  red: {
    text: 'text-red-500',
    glow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]',
    badge: 'bg-red-500/15 text-red-300 ring-red-500/30',
  },
  amber: {
    text: 'text-amber-400',
    glow: 'drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]',
    badge: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  },
  blue: {
    text: 'text-sky-400',
    glow: 'drop-shadow-[0_0_12px_rgba(56,189,248,0.95)]',
    badge: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  },
}

function LightIcon({ light, size }) {
  if (light.text) {
    return (
      <span className="rounded-full border-2 border-current px-1.5 font-display text-xs font-black tracking-wider">
        {light.text}
      </span>
    )
  }
  const Icon = light.icon
  return <Icon size={size} strokeWidth={2.2} />
}

function WarningLights() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(WARNING_LIGHTS[0].id)
  const light = WARNING_LIGHTS.find((l) => l.id === selectedId)
  const color = COLORS[light.color]
  const severity = SEVERITY[light.color]

  function askCommunity() {
    navigate('/chat/repair', { state: { draft: `My ${light.name} warning light is on. ` } })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="rounded-3xl border border-white/10 bg-linear-to-b from-zinc-900 to-black p-5 shadow-2xl shadow-black/60 sm:p-7 lg:self-start">
        <div className="mb-6 flex items-center justify-between text-[11px] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
          <span>Instrument cluster</span>
          <span className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Ignition on
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {WARNING_LIGHTS.map((l) => {
            const c = COLORS[l.color]
            const active = l.id === selectedId
            return (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`flex flex-col items-center gap-3 rounded-2xl border px-2 py-4 transition ${
                  active ? 'border-white/20 bg-white/10' : 'border-transparent hover:bg-white/5'
                }`}
              >
                <span
                  className={`flex h-9 items-center transition ${c.text} ${
                    active ? `${c.glow} scale-110` : 'opacity-50'
                  }`}
                >
                  <LightIcon light={l} size={30} />
                </span>
                <span className={`text-center text-[11px] leading-tight ${active ? 'text-white' : 'text-zinc-500'}`}>
                  {l.name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 border-t border-white/5 pt-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-500" /> Stop now
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" /> Check soon
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-400" /> Information
          </span>
        </div>
      </div>

      <div key={light.id} className="animate-fade-up rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className={`flex size-16 items-center justify-center rounded-2xl bg-black ${color.text} ${color.glow}`}>
            <LightIcon light={light} size={34} />
          </span>
          <div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${color.badge}`}>{severity.label}</span>
            <h2 className="mt-2 font-display text-2xl font-bold">{light.name}</h2>
          </div>
        </div>

        <p className="mt-5 text-zinc-300">{light.meaning}</p>

        <h3 className="mt-6 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">Common causes</h3>
        <ul className="mt-2 space-y-1.5">
          {light.causes.map((cause) => (
            <li key={cause} className="flex items-center gap-2 text-sm text-zinc-300">
              <Wrench size={14} className="shrink-0 text-orange-400" /> {cause}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold text-white">What to do</h3>
          <p className="mt-1 text-sm text-zinc-300">{light.action}</p>
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-zinc-300">
          {light.color === 'red' ? (
            <CircleX size={18} className="mt-0.5 shrink-0 text-red-400" />
          ) : (
            <CircleCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          )}
          <span>
            <span className="font-semibold text-white">Can I keep driving? </span>
            {severity.canDrive}
          </span>
        </p>

        <button
          onClick={askCommunity}
          className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-300"
        >
          <MessageCircle size={16} /> Ask in Repair Help
        </button>
      </div>
    </div>
  )
}

export default WarningLights
