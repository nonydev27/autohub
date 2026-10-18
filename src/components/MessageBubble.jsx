import { Trash2 } from 'lucide-react'
import Avatar from './Avatar'
import { clockTime } from '../utils/format'

function MessageBubble({ message, isOwn, showHeader, onDelete }) {
  const name = message.userName || 'Driver'
  const time = message.createdAt ? clockTime(message.createdAt.toDate()) : ''

  const bubbleStyle = isOwn
    ? 'bg-linear-to-br from-orange-500 to-amber-500 text-zinc-950'
    : 'bg-white/10 text-zinc-100'
  const corner = showHeader ? (isOwn ? 'rounded-tr-md' : 'rounded-tl-md') : ''

  return (
    <div className={`group flex gap-3 ${isOwn ? 'flex-row-reverse' : ''} ${showHeader ? 'mt-4' : 'mt-1'}`}>
      <div className="w-9 shrink-0">{showHeader && <Avatar name={name} seed={message.userId} />}</div>

      <div className={`flex max-w-[75%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {showHeader && (
          <span className="mb-1 text-xs text-zinc-500">
            <span className="font-medium text-zinc-300">{isOwn ? 'You' : name}</span>
            {time && ` · ${time}`}
          </span>
        )}
        <div className={`flex items-center gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <p className={`rounded-2xl px-4 py-2 text-sm break-words whitespace-pre-wrap ${bubbleStyle} ${corner}`}>
            {message.content}
          </p>
          {isOwn && (
            <button
              onClick={onDelete}
              title="Delete message"
              className="rounded p-1 text-zinc-600 transition hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
