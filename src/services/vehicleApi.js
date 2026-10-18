const VPIC_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues'
const RECALLS_URL = 'https://api.nhtsa.gov/recalls/recallsByVehicle'

export const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/

function titleCase(text = '') {
  return text.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function describeEngine(result) {
  const parts = []
  if (result.DisplacementL) parts.push(`${Number(result.DisplacementL).toFixed(1)} L`)
  if (result.EngineCylinders) parts.push(`${result.EngineCylinders}-cylinder`)
  return parts.join(' · ')
}

export async function decodeVin(vin) {
  const res = await fetch(`${VPIC_URL}/${vin}?format=json`)
  if (!res.ok) throw new Error(`The VIN service answered with error ${res.status}`)

  const data = await res.json()
  const result = data.Results?.[0]
  if (!result?.Make || !result?.ModelYear) {
    throw new Error('No vehicle found for that VIN. Double-check it and try again.')
  }

  const specs = [
    ['Body', result.BodyClass],
    ['Engine', describeEngine(result)],
    ['Power', result.EngineHP ? `${Math.round(Number(result.EngineHP))} hp` : ''],
    ['Fuel', result.FuelTypePrimary],
    ['Electrified', result.ElectrificationLevel],
    ['Drive', result.DriveType],
    ['Gearbox', result.TransmissionStyle],
    ['Doors', result.Doors],
    ['Built in', titleCase(result.PlantCountry).replace(/\(\w+\)/, (code) => code.toUpperCase())],
  ].filter(([, value]) => value)

  return {
    vin,
    year: result.ModelYear,
    make: titleCase(result.Make),
    model: result.Model,
    trim: result.Trim,
    specs,
  }
}

export async function getRecalls({ make, model, year }) {
  const params = new URLSearchParams({ make, model, modelYear: year })
  const res = await fetch(`${RECALLS_URL}?${params}`)
  if (!res.ok) throw new Error(`The recalls service answered with error ${res.status}`)

  const data = await res.json()
  return (data.results ?? []).map((recall) => ({
    id: recall.NHTSACampaignNumber,
    component: titleCase(recall.Component).replaceAll(':', ' › '),
    summary: recall.Summary,
    consequence: recall.Consequence,
    remedy: recall.Remedy,
    date: recall.ReportReceivedDate,
  }))
}
