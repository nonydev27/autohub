import { useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { Send } from 'lucide-react'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import MessageBubble from './MessageBubble'
import { millis } from '../utils/format'

const QUICK_EMOJIS = ['👍', '🔧', '🔥', '😂', '🚗', '⚡', '🙏']
const GROUP_WINDOW_MS = 5 * 60 * 1000

function ChatPanel({ room, initialDraft }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState(initialDraft)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'rooms', room.id, 'messages'), orderBy('createdAt'), limitToLast(150))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
        setMessages(list)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [room.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return

    setDraft('')
    try {
      await addDoc(collection(db, 'rooms', room.id, 'messages'), {
        content: text,
        userId: user.uid,
        userName: user.name,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      setError(err.message)
      setDraft(text)
    }
  }

  async function handleDelete(messageId) {
    if (!window.confirm('Delete this message for everyone?')) return
    try {
      await deleteDoc(doc(db, 'rooms', room.id, 'messages', messageId))
    } catch (err) {
      setError(err.message)
    }
  }

  function addEmoji(emoji) {
    setDraft((current) => current + emoji)
    inputRef.current?.focus()
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/5 text-2xl">{room.emoji}</span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-semibold">{room.name}</h1>
          <p className="truncate text-sm text-zinc-500">{room.description}</p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="size-8 animate-spin rounded-full border-4 border-white/10 border-t-orange-500" />
          </div>
        )}
        {error && (
          <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
        )}
        {!loading && !error && messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
            <span className="text-5xl">{room.emoji}</span>
            <p className="mt-3 font-medium text-zinc-300">No messages in {room.name} yet</p>
            <p className="text-sm">Be the first to say something 👋</p>
          </div>
        )}

        {messages.map((message, index) => {
          const previous = messages[index - 1]
          const grouped =
            previous &&
            previous.userId === message.userId &&
            millis(message.createdAt) - millis(previous.createdAt) < GROUP_WINDOW_MS

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.userId === user.uid}
              showHeader={!grouped}
              onDelete={() => handleDelete(message.id)}
            />
          )
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-3 sm:p-4">
        <div className="no-scrollbar mb-2 flex gap-1 overflow-x-auto">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="rounded-lg px-2 py-1 text-lg transition hover:scale-110 hover:bg-white/10"
            >
              {emoji}
            </button>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message #${room.name.toLowerCase()}...`}
            maxLength={1000}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-amber-400 px-4 font-semibold text-zinc-950 shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:opacity-40"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default ChatPanel
