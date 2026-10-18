import { avatarColor, initials } from '../utils/format'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
}

function Avatar({ name, seed, size = 'md' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-zinc-950 ${SIZES[size]} ${avatarColor(seed ?? name)}`}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

export default Avatar
