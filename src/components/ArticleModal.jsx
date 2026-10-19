import { useEffect } from 'react'
import { ExternalLink, Sparkles, X } from 'lucide-react'
import BookmarkButton from './BookmarkButton'
import { timeAgo } from '../utils/format'

function ArticleModal({ article, onClose, saved, onToggleSave }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <article
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-2xl animate-fade-up overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-900 sm:rounded-3xl"
      >
        <div className="relative h-56 sm:h-72">
          {article.image && <img src={article.image} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <BookmarkButton saved={saved} onToggle={onToggleSave} />
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="flex size-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-8 sm:px-10">
          <span className="text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">{article.category}</span>
          <h2 className="mt-2 font-display text-2xl leading-tight font-bold sm:text-3xl">{article.title}</h2>
          <p className="mt-3 text-sm text-zinc-500">
            {article.author && <span className="text-zinc-300">{article.author} · </span>}
            {article.source} · {timeAgo(article.publishedAt)} · {article.readMinutes} min read
          </p>

          <div className="mt-6 space-y-4 leading-relaxed text-zinc-300">
            {article.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

        
        </div>
      </article>
    </div>
  )
}

export default ArticleModal
