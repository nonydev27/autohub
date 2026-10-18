import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, RotateCcw, ScanLine } from 'lucide-react'
import { DIFFICULTY, SYMPTOM_GROUPS, SYMPTOMS, URGENCY } from '../data/symptoms'

const SCAN_STEPS = ['Reading symptom pattern…', 'Matching against common faults…', 'Estimating repair costs…']
const SCAN_TIME_MS = 1800

function SymptomChecker() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null)
  const [phase, setPhase] = useState('idle')
  const timer = useRef(null)
  const symptom = SYMPTOMS.find((s) => s.id === selectedId)

  useEffect(() => () => clearTimeout(timer.current), [])

  function choose(id) {
    clearTimeout(timer.current)
    setSelectedId(id)
    setPhase('idle')
  }

  function runDiagnosis() {
    setPhase('scanning')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPhase('done'), SCAN_TIME_MS)
  }

  function askCommunity() {
    navigate('/chat/repair', { state: { draft: `My car has this problem: ${symptom.label.toLowerCase()}. ` } })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="font-display text-lg font-semibold">1. What do you notice?</h2>
        {SYMPTOM_GROUPS.map(({ id, label, icon: Icon }) => (
          <div key={id}>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              <Icon size={14} /> {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.filter((s) => s.group === id).map((s) => (
                <button
                  key={s.id}
                  onClick={() => choose(s.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    s.id === selectedId
                      ? 'border-orange-500 bg-orange-500/15 text-orange-200'
                      : 'border-white/10 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col rounded-3xl border border-white/10 bg-linear-to-b from-zinc-900 to-black p-6">
        <h2 className="font-display text-lg font-semibold">2. Run the diagnosis</h2>

        {!symptom && (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center text-zinc-500">
            <ScanLine size={48} className="text-zinc-700" />
            <p className="mt-4">Pick a symptom on the left to get started.</p>
          </div>
        )}

        {symptom && phase === 'idle' && (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <p className="text-zinc-400">Selected symptom</p>
            <p className="mt-1 font-display text-2xl font-bold">{symptom.label}</p>
            <button
              onClick={runDiagnosis}
              className="mt-8 flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-zinc-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              <ScanLine size={18} /> Run diagnosis
            </button>
          </div>
        )}

        {symptom && phase === 'scanning' && (
          <div className="flex flex-1 flex-col justify-center py-12">
            <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 w-1/3 animate-scan rounded-full bg-linear-to-r from-transparent via-orange-500 to-transparent" />
            </div>
            <ul className="mt-6 space-y-2 font-mono text-sm text-emerald-300">
              {SCAN_STEPS.map((step, index) => (
                <li key={step} className="animate-fade-up" style={{ animationDelay: `${index * 500}ms` }}>
                  &gt; {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {symptom && phase === 'done' && (
          <div className="mt-4 animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-xl font-bold">{symptom.label}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${URGENCY[symptom.urgency].className}`}>
                {URGENCY[symptom.urgency].label}
              </span>
            </div>

            <ol className="mt-5 space-y-4">
              {symptom.causes.map((cause, index) => (
                <li key={cause.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">
                      <span className="mr-2 text-zinc-500">#{index + 1}</span>
                      {cause.name}
                    </p>
                    <span className="font-display text-lg font-bold text-orange-400">{cause.chance}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                      style={{ width: `${cause.chance}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">{cause.fix}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${DIFFICULTY[cause.difficulty]}`}>
                      {cause.difficulty === 'DIY' ? 'DIY friendly' : cause.difficulty}
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-zinc-300">Typical cost {cause.cost}</span>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-4 text-xs text-zinc-500">
              Rough guide only — likelihoods and costs are typical ranges, not a replacement for an inspection by a mechanic.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={askCommunity}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:brightness-110"
              >
                <MessageCircle size={16} /> Ask in Repair Help
              </button>
              <button
                onClick={runDiagnosis}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-white/30"
              >
                <RotateCcw size={16} /> Run again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SymptomChecker
