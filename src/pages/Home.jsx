import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, limitToLast, onSnapshot, orderBy, query } from 'firebase/firestore'
import { ArrowRight, Lightbulb, MessageCircle, Stethoscope } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { getNews } from '../services/newsApi'
import { PHOTO } from '../data/photos'
import { TIPS } from '../data/tips'
import Avatar from '../components/Avatar'
import { dayOfYear, greeting, photo, timeAgo } from '../utils/format'

const TILES = [
  { to: '/chat', title: 'Chat rooms', text: 'Talk shop with the crew', image: PHOTO.cockpit },
  { to: '/news', title: 'Auto news', text: 'Today’s top stories', image: PHOTO.porsche },
  { to: '/diagnose', title: 'Diagnostics bay', text: 'Decode warning lights', image: PHOTO.engine },
  { to: '/garage', title: 'My garage', text: 'VIN lookup & recalls', image: PHOTO.garage },
]

function Home() {
  const { user } = useAuth()
  const [now] = useState(() => new Date())
  const [stories, setStories] = useState([])
  const [latest, setLatest] = useState([])

  useEffect(() => {
    let active = true
    getNews().then((result) => {
      if (active) setStories(result.articles.slice(0, 4))
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'rooms', 'general', 'messages'), orderBy('createdAt'), limitToLast(4))
    return onSnapshot(
      q,
      (snapshot) => setLatest(snapshot.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))),
      () => setLatest([]),
    )
  }, [])

  const tip = TIPS[dayOfYear(now) % TIPS.length]
  const firstName = user.name.split(' ')[0]
  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <img src={photo(PHOTO.road, 1800)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="relative max-w-xl animate-fade-up px-6 py-14 sm:px-10 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">{dateLabel}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-bold sm:text-5xl">
            {greeting(now.getHours())}, {firstName} 👋
          </h1>
          <p className="mt-3 text-zinc-300">
            The AutoHub crew is online. Catch up on the news, help someone fix their ride, or find out what that light on
            your dash really means.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-zinc-950 shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              <MessageCircle size={18} /> Join the chat
            </Link>
            <Link
              to="/diagnose"
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              <Stethoscope size={18} /> Diagnose a problem
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TILES.map((tile, index) => (
          <Link
            key={tile.to}
            to={tile.to}
            className="group relative h-36 animate-fade-up overflow-hidden rounded-2xl border border-white/10 sm:h-44"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <img
              src={photo(tile.image, 600)}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="flex items-center justify-between font-display font-semibold">
                {tile.title}
                <ArrowRight size={16} className="text-orange-400 transition group-hover:translate-x-1" />
              </p>
              <p className="text-xs text-zinc-400">{tile.text}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Top stories</h2>
            <Link to="/news" className="flex items-center gap-1 text-sm text-orange-400 hover:gap-2">
              All news <ArrowRight size={15} />
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {stories.length === 0 &&
              [1, 2, 3].map((n) => <li key={n} className="my-3 h-20 animate-pulse rounded-xl bg-white/5" />)}
            {stories.map((story) => (
              <li key={story.id}>
                <Link to="/news" state={{ openId: story.id }} className="group flex gap-4 py-3">
                  <img
                    src={story.image}
                    alt=""
                    loading="lazy"
                    className="size-20 shrink-0 rounded-xl bg-zinc-800 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-orange-400">{story.category}</p>
                    <p className="line-clamp-2 font-medium group-hover:text-orange-300">{story.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {story.source} · {timeAgo(story.publishedAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-linear-to-br from-orange-500/20 via-zinc-900 to-zinc-900 p-6">
            <Lightbulb size={80} className="absolute -top-3 -right-3 text-orange-500/10" />
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">
              <Lightbulb size={14} /> Mechanic tip of the day
            </p>
            <h3 className="mt-3 font-display text-lg font-semibold">{tip.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{tip.text}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <span className="size-2 animate-pulse rounded-full bg-emerald-400" /> Live in General
              </h2>
              <Link to="/chat/general" className="text-sm text-orange-400 hover:underline">
                Open
              </Link>
            </div>
            {latest.length === 0 ? (
              <p className="text-sm text-zinc-500">It’s quiet in here. Be the first to say hi 👋</p>
            ) : (
              <ul className="space-y-3">
                {latest.map((message) => (
                  <li key={message.id} className="flex gap-3">
                    <Avatar name={message.userName || 'Driver'} seed={message.userId} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">
                        <span className="font-medium text-zinc-300">
                          {message.userId === user.uid ? 'You' : message.userName}
                        </span>
                        {message.createdAt && ` · ${timeAgo(message.createdAt.toDate())}`}
                      </p>
                      <p className="truncate text-sm text-zinc-300">{message.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
