import { useState } from 'react'
import { Gauge, Stethoscope } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import WarningLights from '../components/WarningLights'
import SymptomChecker from '../components/SymptomChecker'

const TABS = [
  { id: 'lights', label: 'Warning lights', icon: Gauge },
  { id: 'symptoms', label: 'Symptom checker', icon: Stethoscope },
]

function Diagnose() {
  const [tab, setTab] = useState('lights')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Diagnostics bay"
        title="What’s your car telling you?"
        subtitle="Tap a dashboard light to decode it, or pick a symptom and run a quick diagnosis."
      />

      <div className="mb-6 inline-flex rounded-xl bg-white/5 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === id ? 'bg-white/10 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'lights' ? <WarningLights /> : <SymptomChecker />}
    </div>
  )
}

export default Diagnose
