import { Activity, Droplets, Flame, Gauge, Volume2 } from 'lucide-react'

export const SYMPTOM_GROUPS = [
  { id: 'noise', label: 'Noises', icon: Volume2 },
  { id: 'smell', label: 'Smells', icon: Flame },
  { id: 'leak', label: 'Leaks', icon: Droplets },
  { id: 'performance', label: 'Performance', icon: Gauge },
  { id: 'feel', label: 'Steering & feel', icon: Activity },
]

export const URGENCY = {
  low: { label: 'Low urgency', className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
  medium: { label: 'Check soon', className: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
  high: { label: 'Fix before driving far', className: 'bg-red-500/15 text-red-300 ring-red-500/30' },
}

export const DIFFICULTY = {
  DIY: 'bg-emerald-500/15 text-emerald-300',
  Moderate: 'bg-amber-500/15 text-amber-300',
  Pro: 'bg-red-500/15 text-red-300',
}

export const SYMPTOMS = [
  {
    id: 'squeal-braking',
    label: 'Squealing when braking',
    group: 'noise',
    urgency: 'medium',
    causes: [
      { name: 'Worn brake pads', chance: 70, difficulty: 'Moderate', cost: '$100–300', fix: 'Replace the pads on that axle. Check disc thickness at the same time.' },
      { name: 'Glazed pads or discs', chance: 20, difficulty: 'Moderate', cost: '$80–250', fix: 'Scuff or replace the pads and re-bed them with a few firm stops.' },
      { name: 'Missing anti-squeal shims or grease', chance: 10, difficulty: 'DIY', cost: '$10–40', fix: 'Fit new shims and apply brake grease to the pad backs and contact points.' },
    ],
  },
  {
    id: 'grind-braking',
    label: 'Grinding when braking',
    group: 'noise',
    urgency: 'high',
    causes: [
      { name: 'Pads worn down to metal', chance: 75, difficulty: 'Moderate', cost: '$250–600', fix: 'Replace pads and discs. Metal-on-metal contact quickly ruins the discs.' },
      { name: 'Seized brake caliper', chance: 15, difficulty: 'Pro', cost: '$200–500', fix: 'Free or replace the caliper and bleed the brakes.' },
      { name: 'Stone or debris caught in the brake', chance: 10, difficulty: 'DIY', cost: '$0–50', fix: 'Remove the wheel and clear debris between the disc and dust shield.' },
    ],
  },
  {
    id: 'click-turning',
    label: 'Clicking when turning',
    group: 'noise',
    urgency: 'medium',
    causes: [
      { name: 'Worn outer CV joint', chance: 80, difficulty: 'Moderate', cost: '$150–450', fix: 'Replace the CV joint or the whole driveshaft. Check the rubber boot for splits.' },
      { name: 'Worn strut top mount', chance: 20, difficulty: 'Pro', cost: '$150–400', fix: 'Replace the top mount and bearing; get an alignment afterwards.' },
    ],
  },
  {
    id: 'whine-speed',
    label: 'Humming that rises with speed',
    group: 'noise',
    urgency: 'medium',
    causes: [
      { name: 'Worn wheel bearing', chance: 60, difficulty: 'Pro', cost: '$150–400', fix: 'Replace the hub bearing on the noisy side. The hum often changes when weaving left/right.' },
      { name: 'Uneven tire wear', chance: 30, difficulty: 'DIY', cost: '$0–60', fix: 'Inspect tread for cupping, rotate the tires and check alignment.' },
      { name: 'Differential wear', chance: 10, difficulty: 'Pro', cost: '$300–1,500', fix: 'Check the diff oil level and condition; a specialist can confirm.' },
    ],
  },
  {
    id: 'burning-oil',
    label: 'Burning oil smell',
    group: 'smell',
    urgency: 'medium',
    causes: [
      { name: 'Leaking valve cover gasket', chance: 60, difficulty: 'DIY', cost: '$50–250', fix: 'Replace the gasket and clean oil off the exhaust manifold.' },
      { name: 'Oil spilled during an oil change', chance: 25, difficulty: 'DIY', cost: '$0', fix: 'It usually burns off within a few drives. Wipe what you can reach.' },
      { name: 'Clogged PCV valve', chance: 15, difficulty: 'DIY', cost: '$15–60', fix: 'Replace the PCV valve and its hose.' },
    ],
  },
  {
    id: 'sweet-smell',
    label: 'Sweet, syrupy smell',
    group: 'smell',
    urgency: 'high',
    causes: [
      { name: 'Leaking coolant hose', chance: 50, difficulty: 'DIY', cost: '$30–150', fix: 'Find the wet or crusty hose, replace it and top up with the correct coolant.' },
      { name: 'Leaking heater core', chance: 30, difficulty: 'Pro', cost: '$500–1,200', fix: 'Look for a damp passenger footwell or foggy windscreen. Replacement is labour-heavy.' },
      { name: 'Head gasket failure', chance: 20, difficulty: 'Pro', cost: '$1,000–2,500', fix: 'Check for white exhaust smoke and milky oil. A pressure test confirms it.' },
    ],
  },
  {
    id: 'rotten-egg',
    label: 'Rotten egg smell',
    group: 'smell',
    urgency: 'medium',
    causes: [
      { name: 'Failing catalytic converter', chance: 60, difficulty: 'Pro', cost: '$400–2,000', fix: 'Fix the root cause (often misfires or rich running) before replacing the converter.' },
      { name: 'Engine running rich', chance: 25, difficulty: 'Moderate', cost: '$50–400', fix: 'Read codes and check oxygen sensors and fuel trims.' },
      { name: 'Overcharging battery', chance: 15, difficulty: 'Moderate', cost: '$150–600', fix: 'Test charging voltage; above ~14.8 V points to a faulty alternator regulator.' },
    ],
  },
  {
    id: 'green-puddle',
    label: 'Green, pink or orange puddle',
    group: 'leak',
    urgency: 'high',
    causes: [
      { name: 'Coolant hose or clamp', chance: 50, difficulty: 'DIY', cost: '$20–150', fix: 'Tighten or replace the clamp or hose, then refill and bleed the system.' },
      { name: 'Water pump seal', chance: 30, difficulty: 'Pro', cost: '$300–750', fix: 'Replace the water pump — often done together with the timing belt.' },
      { name: 'Cracked radiator', chance: 20, difficulty: 'Moderate', cost: '$250–700', fix: 'Replace the radiator and refill with fresh coolant.' },
    ],
  },
  {
    id: 'dark-puddle',
    label: 'Brown or black puddle',
    group: 'leak',
    urgency: 'medium',
    causes: [
      { name: 'Loose drain plug or oil filter', chance: 35, difficulty: 'DIY', cost: '$0–30', fix: 'Check both are tight; replace the drain plug washer.' },
      { name: 'Oil pan gasket', chance: 35, difficulty: 'Moderate', cost: '$150–400', fix: 'Replace the gasket and re-torque the pan bolts to spec.' },
      { name: 'Rear main seal', chance: 30, difficulty: 'Pro', cost: '$600–1,500', fix: 'The gearbox has to come out — keep the oil topped up until it’s repaired.' },
    ],
  },
  {
    id: 'rough-idle',
    label: 'Rough or shaky idle',
    group: 'performance',
    urgency: 'medium',
    causes: [
      { name: 'Vacuum leak', chance: 35, difficulty: 'DIY', cost: '$10–150', fix: 'Listen for hissing and inspect intake hoses for cracks.' },
      { name: 'Worn spark plugs or coil', chance: 35, difficulty: 'DIY', cost: '$40–250', fix: 'Replace plugs; swap coils between cylinders to see if a misfire moves.' },
      { name: 'Dirty throttle body', chance: 20, difficulty: 'DIY', cost: '$10–20', fix: 'Clean it with throttle body cleaner and a soft cloth.' },
      { name: 'Clogged fuel injector', chance: 10, difficulty: 'Pro', cost: '$150–500', fix: 'Try a fuel system cleaner first; injectors can be tested and cleaned.' },
    ],
  },
  {
    id: 'no-start-click',
    label: 'Clicks but won’t start',
    group: 'performance',
    urgency: 'high',
    causes: [
      { name: 'Weak or flat battery', chance: 65, difficulty: 'DIY', cost: '$0–200', fix: 'Jump start, then test the battery. Replace it if it won’t hold 12.4 V+.' },
      { name: 'Corroded or loose terminals', chance: 20, difficulty: 'DIY', cost: '$0–20', fix: 'Clean with baking soda and water, then tighten the clamps.' },
      { name: 'Failing starter motor', chance: 15, difficulty: 'Pro', cost: '$250–600', fix: 'A single loud click with a good battery points to the starter or its solenoid.' },
    ],
  },
  {
    id: 'shake-highway',
    label: 'Shaking at highway speed',
    group: 'feel',
    urgency: 'medium',
    causes: [
      { name: 'Wheels out of balance', chance: 60, difficulty: 'Pro', cost: '$40–80', fix: 'Have all four wheels balanced at a tire shop.' },
      { name: 'Damaged or bulging tire', chance: 25, difficulty: 'Pro', cost: '$80–250', fix: 'Inspect sidewalls for bulges and replace the damaged tire.' },
      { name: 'Worn suspension or steering parts', chance: 15, difficulty: 'Pro', cost: '$150–600', fix: 'Check tie rod ends and control arm bushes for play.' },
    ],
  },
  {
    id: 'pulls-side',
    label: 'Car pulls to one side',
    group: 'feel',
    urgency: 'low',
    causes: [
      { name: 'Wheel alignment out', chance: 55, difficulty: 'Pro', cost: '$60–120', fix: 'Get a four-wheel alignment, especially after hitting a pothole.' },
      { name: 'Uneven tire pressures', chance: 30, difficulty: 'DIY', cost: '$0', fix: 'Set all tires to the pressure on the door sticker.' },
      { name: 'Sticking brake caliper', chance: 15, difficulty: 'Pro', cost: '$200–500', fix: 'If one wheel is much hotter after a drive, the caliper is dragging.' },
    ],
  },
]
