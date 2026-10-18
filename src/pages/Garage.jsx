import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { CircleCheck, Plus, Search, ShieldAlert, Warehouse } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { decodeVin, getRecalls, VIN_PATTERN } from '../services/vehicleApi'
import { GARAGE_PHOTOS } from '../data/photos'
import { hashString, photo } from '../utils/format'
import PageHeader from '../components/PageHeader'
import RecallList from '../components/RecallList'
import VehicleCard from '../components/VehicleCard'

const SAMPLE_VINS = [
  { vin: '1HGCM82633A004352', label: 'Honda Accord' },
  { vin: 'WBA3A5G59DNP26082', label: 'BMW 328i' },
  { vin: '5YJSA1E26HF000337', label: 'Tesla Model S' },
  { vin: '1N4AL3AP8JC231503', label: 'Nissan Altima' },
]

const INPUT =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none'

function Garage() {
  const { user } = useAuth()
  const [vin, setVin] = useState('')
  const [lookup, setLookup] = useState({ status: 'idle', vehicle: null, error: '' })
  const [recalls, setRecalls] = useState({ status: 'idle', items: [], error: '' })
  const [vehicles, setVehicles] = useState([])
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [nickname, setNickname] = useState('')
  const [mileage, setMileage] = useState('')
  const [saving, setSaving] = useState(false)
  const [garageError, setGarageError] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'users', user.uid, 'vehicles'), orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snapshot) => setVehicles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setGarageError(err.message),
    )
  }, [user.uid])

  async function lookUp(value) {
    const clean = value.trim().toUpperCase()
    setVin(clean)
    setRecalls({ status: 'idle', items: [], error: '' })
    setShowSaveForm(false)

    if (!VIN_PATTERN.test(clean)) {
      setLookup({ status: 'error', vehicle: null, error: 'A VIN is exactly 17 letters and numbers (never I, O or Q).' })
      return
    }

    setLookup({ status: 'loading', vehicle: null, error: '' })
    try {
      const vehicle = await decodeVin(clean)
      setLookup({ status: 'done', vehicle, error: '' })
      setNickname(`My ${vehicle.model}`)
    } catch (err) {
      setLookup({ status: 'error', vehicle: null, error: err.message })
    }
  }

  async function checkRecalls() {
    const { make, model, year } = lookup.vehicle
    setRecalls({ status: 'loading', items: [], error: '' })
    try {
      const items = await getRecalls({ make, model, year })
      setRecalls({ status: 'done', items, error: '' })
    } catch (err) {
      setRecalls({ status: 'error', items: [], error: err.message })
    }
  }

  async function saveVehicle(e) {
    e.preventDefault()
    const { vehicle } = lookup
    setSaving(true)
    setGarageError('')
    try {
      await addDoc(collection(db, 'users', user.uid, 'vehicles'), {
        vin: vehicle.vin,
        nickname: nickname.trim() || vehicle.model,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        mileage: Number(mileage) || 0,
        createdAt: serverTimestamp(),
      })
      setShowSaveForm(false)
      setMileage('')
    } catch (err) {
      setGarageError(err.message)
    }
    setSaving(false)
  }

  async function removeVehicle(vehicle) {
    if (!window.confirm(`Remove ${vehicle.nickname} from your garage?`)) return
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'vehicles', vehicle.id))
    } catch (err) {
      setGarageError(err.message)
    }
  }

  const vehicle = lookup.vehicle
  const alreadySaved = vehicle && vehicles.some((v) => v.vin === vehicle.vin)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Your garage"
        title="VIN lookup & recalls"
        subtitle="Decode any 17-character VIN, check it for safety recalls and keep your cars in one place."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              lookUp(vin)
            }}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6"
          >
            <label className="text-sm font-medium text-zinc-300" htmlFor="vin">
              Vehicle Identification Number
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="e.g. 1HGCM82633A004352"
                maxLength={17}
                className={`${INPUT} font-mono tracking-wider uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case`}
              />
              <button
                type="submit"
                disabled={lookup.status === 'loading'}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 px-5 font-semibold text-zinc-950 transition hover:brightness-110 disabled:opacity-50"
              >
                <Search size={18} />
                <span className="hidden sm:inline">Decode</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Find it at the bottom of the windscreen on the driver’s side, or on the driver’s door frame. {vin.length}/17
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500">Try one:</span>
              {SAMPLE_VINS.map((sample) => (
                <button
                  key={sample.vin}
                  type="button"
                  onClick={() => lookUp(sample.vin)}
                  className="rounded-full border border-white/10 px-3 py-1 text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-300"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </form>

          {lookup.status === 'loading' && <div className="mt-6 h-72 animate-pulse rounded-3xl bg-white/5" />}

          {lookup.status === 'error' && (
            <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {lookup.error}
            </p>
          )}

          {vehicle && (
            <div key={vehicle.vin} className="mt-6 animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60">
              <div className="relative h-44">
                <img
                  src={photo(GARAGE_PHOTOS[hashString(vehicle.vin) % GARAGE_PHOTOS.length], 1200)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <p className="font-mono text-xs tracking-wider text-zinc-400">{vehicle.vin}</p>
                  <h2 className="font-display text-3xl font-bold">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>
                  {vehicle.trim && <p className="text-sm text-orange-300">{vehicle.trim}</p>}
                </div>
              </div>

              <div className="p-6">
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {vehicle.specs.map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-white/5 px-3 py-2.5">
                      <dt className="text-xs text-zinc-500">{label}</dt>
                      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={checkRecalls}
                    disabled={recalls.status === 'loading'}
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium transition hover:border-orange-500/50 hover:text-orange-300 disabled:opacity-50"
                  >
                    <ShieldAlert size={16} /> Check safety recalls
                  </button>
                  {alreadySaved ? (
                    <span className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
                      <CircleCheck size={16} /> In your garage
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowSaveForm(!showSaveForm)}
                      className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:brightness-110"
                    >
                      <Plus size={16} /> Save to my garage
                    </button>
                  )}
                </div>

                {showSaveForm && !alreadySaved && (
                  <form onSubmit={saveVehicle} className="mt-4 grid animate-fade-up gap-3 sm:grid-cols-[1fr_10rem_auto]">
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Nickname"
                      maxLength={30}
                      className={INPUT}
                    />
                    <input
                      type="number"
                      min="0"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="Mileage (km)"
                      className={INPUT}
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </form>
                )}

                <RecallList recalls={recalls} />
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 lg:self-start">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Warehouse size={20} className="text-orange-400" /> My garage
            <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-zinc-400">{vehicles.length}</span>
          </h2>

          {garageError && <p className="mt-4 text-sm text-red-300">{garageError}</p>}

          {vehicles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
              <p className="text-3xl">🚗</p>
              <p className="mt-2">No cars yet. Decode a VIN and save it here.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} onOpen={() => lookUp(v.vin)} onDelete={() => removeVehicle(v)} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Garage
