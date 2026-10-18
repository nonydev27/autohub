import { House, MessageCircle, Newspaper, Stethoscope, Warehouse } from 'lucide-react'

export const NAV_LINKS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/diagnose', label: 'Diagnose', icon: Stethoscope },
  { to: '/garage', label: 'Garage', icon: Warehouse },
]
