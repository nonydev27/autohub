import { Gauge, Trash2 } from 'lucide-react'
import { GARAGE_PHOTOS } from '../data/photos'
import { hashString, photo } from '../utils/format'

function VehicleCard({ vehicle, onOpen, onDelete }) {
  const image = photo(GARAGE_PHOTOS[hashString(vehicle.vin) % GARAGE_PHOTOS.length], 600)

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative h-32">
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />
        </div>
        <div className="p-4 pt-0">
          <p className="font-display text-lg font-semibold">{vehicle.nickname}</p>
          <p className="text-sm text-zinc-400">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-mono">{vehicle.vin}</span>
            {vehicle.mileage > 0 && (
              <span className="flex items-center gap-1">
                <Gauge size={13} /> {vehicle.mileage.toLocaleString()} km
              </span>
            )}
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Remove from garage"
        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur transition hover:text-red-400"
      >
        <Trash2 size={15} />
      </button>
    </article>
  )
}

export default VehicleCard
