import { ArrowRight, Clock } from 'lucide-react'
import BookmarkButton from './BookmarkButton'
import { timeAgo } from '../utils/format'

function FeaturedStory({ article, onOpen, saved, onToggleSave }) {
  return (
    <article className="group relative mb-8 overflow-hidden rounded-3xl border border-white/10">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative h-80 sm:h-[26rem]">
          {article.image && (
            <img
              src={article.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-orange-500 px-2.5 py-1 font-semibold text-zinc-950">Top story</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-zinc-200 backdrop-blur">{article.category}</span>
            </div>
            <h2 className="mt-4 max-w-3xl font-display text-2xl leading-tight font-bold sm:text-4xl">{article.title}</h2>
            <p className="mt-3 line-clamp-2 max-w-2xl text-zinc-300">{article.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
              <span className="font-medium text-zinc-200">{article.source}</span>
              <span>{timeAgo(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {article.readMinutes} min read
              </span>
              <span className="flex items-center gap-1 font-medium text-orange-400 transition group-hover:gap-2">
                Read story <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </button>
      <BookmarkButton saved={saved} onToggle={onToggleSave} className="absolute top-5 right-5" />
    </article>
  )
}

export default FeaturedStory
