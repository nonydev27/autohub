import { Clock } from 'lucide-react'
import BookmarkButton from './BookmarkButton'
import { timeAgo } from '../utils/format'

function NewsCard({ article, onOpen, saved, onToggleSave }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10">
      <button type="button" onClick={onOpen} className="flex flex-1 flex-col text-left">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-800">
          {article.image && (
            <img
              src={article.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
          <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-orange-300 backdrop-blur">
            {article.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="line-clamp-2 font-display text-lg leading-snug font-semibold group-hover:text-orange-300">
            {article.title}
          </h3>
          <p className="line-clamp-3 text-sm text-zinc-400">{article.description}</p>
          <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-zinc-500">
            <span className="font-medium text-zinc-300">{article.source}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <span className="ml-auto flex items-center gap-1">
              <Clock size={13} /> {article.readMinutes} min
            </span>
          </div>
        </div>
      </button>

      <BookmarkButton saved={saved} onToggle={onToggleSave} className="absolute top-3 right-3" />
    </article>
  )
}

export default NewsCard
