import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bookmark, Search, Sparkles } from 'lucide-react'
import { getNews, NEWS_CATEGORIES } from '../services/newsApi'
import { useBookmarks } from '../hooks/useBookmarks'
import PageHeader from '../components/PageHeader'
import FeaturedStory from '../components/FeaturedStory'
import NewsCard from '../components/NewsCard'
import ArticleModal from '../components/ArticleModal'

function NewsFeed() {
  const location = useLocation()
  const openId = location.state?.openId
  const { saved, isSaved, toggle } = useBookmarks()
  const [news, setNews] = useState({ loading: true, articles: [], isDemo: false, reason: '' })
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [openArticle, setOpenArticle] = useState(null)

  useEffect(() => {
    let active = true
    getNews().then((result) => {
      if (!active) return
      setNews({ loading: false, ...result })
      if (openId) setOpenArticle(result.articles.find((a) => a.id === openId) ?? null)
    })
    return () => {
      active = false
    }
  }, [openId])

  const term = search.trim().toLowerCase()
  const source = showSaved ? saved : news.articles
  const visible = source.filter(
    (a) =>
      (category === 'All' || a.category === category) &&
      (!term || `${a.title} ${a.description}`.toLowerCase().includes(term)),
  )
  const showFeatured = !showSaved && category === 'All' && !term && visible.length > 0
  const featured = showFeatured ? visible[0] : null
  const grid = showFeatured ? visible.slice(1) : visible
  const availableCategories = NEWS_CATEGORIES.filter(
    (c) => c === 'All' || news.articles.some((a) => a.category === c),
  )

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader eyebrow={today} title="Today’s Auto News" subtitle="Stories for mechanics, builders and drivers.">
        <label className="relative w-full sm:w-72">
          <Search size={17} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 text-sm placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 focus:outline-none"
          />
        </label>
      </PageHeader>

      

      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
        {availableCategories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c)
              setShowSaved(false)
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
              category === c && !showSaved
                ? 'border-orange-500 bg-orange-500 font-semibold text-zinc-950'
                : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 w-px shrink-0 bg-white/10" />
        <button
          onClick={() => {
            setShowSaved(!showSaved)
            setCategory('All')
          }}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition ${
            showSaved
              ? 'border-orange-500 bg-orange-500 font-semibold text-zinc-950'
              : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
          }`}
        >
          <Bookmark size={14} /> Saved ({saved.length})
        </button>
      </div>

      {news.loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      )}

      {featured && (
        <FeaturedStory
          article={featured}
          onOpen={() => setOpenArticle(featured)}
          saved={isSaved(featured.id)}
          onToggleSave={() => toggle(featured)}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {grid.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onOpen={() => setOpenArticle(article)}
            saved={isSaved(article.id)}
            onToggleSave={() => toggle(article)}
          />
        ))}
      </div>

      {!news.loading && visible.length === 0 && (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-4xl">{showSaved ? '🔖' : '🔍'}</p>
          <p className="mt-3 font-medium text-zinc-300">
            {showSaved ? 'Nothing saved yet' : 'No stories match that'}
          </p>
          <p className="text-sm">
            {showSaved ? 'Tap the bookmark on any story to keep it here.' : 'Try another word or category.'}
          </p>
        </div>
      )}

      {openArticle && (
        <ArticleModal
          article={openArticle}
          onClose={() => setOpenArticle(null)}
          saved={isSaved(openArticle.id)}
          onToggleSave={() => toggle(openArticle)}
        />
      )}
    </div>
  )
}

export default NewsFeed
