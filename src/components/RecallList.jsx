import { ShieldAlert, ShieldCheck } from 'lucide-react'

function RecallList({ recalls }) {
  if (recalls.status === 'loading') {
    return <div className="mt-6 h-24 animate-pulse rounded-2xl bg-white/5" />
  }

  if (recalls.status === 'error') {
    return <p className="mt-6 text-sm text-red-300">{recalls.error}</p>
  }

  if (recalls.status !== 'done') return null

  if (recalls.items.length === 0) {
    return (
      <p className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        <ShieldCheck size={18} /> No safety recalls found for this model. 🎉
      </p>
    )
  }

  return (
    <div className="mt-6">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300">
        <ShieldAlert size={18} /> {recalls.items.length} safety recall{recalls.items.length > 1 ? 's' : ''} found
      </p>
      <ul className="space-y-3">
        {recalls.items.map((recall) => (
          <li key={recall.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">{recall.component}</p>
              <p className="text-xs text-zinc-500">
                #{recall.id} · {recall.date}
              </p>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{recall.summary}</p>
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer text-orange-400">What’s the fix?</summary>
              <p className="mt-2 text-zinc-300">{recall.remedy}</p>
              {recall.consequence && <p className="mt-2 text-zinc-500">Risk: {recall.consequence}</p>}
            </details>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-zinc-500">
        Recalls are listed per model and year. Ask a dealer whether your exact car (by VIN) still needs the work.
      </p>
    </div>
  )
}

export default RecallList
