import { MOCK_NEWS } from '../data/mockNews'

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY

const CATEGORY_KEYWORDS = [
  ['Electric', /\b(ev|evs|electric|battery|batteries|charging|charger|hybrid)\b/i],
  ['Motorsport', /\b(race|racing|formula|f1|rally|motorsport|track|grand prix|nascar)\b/i],
  ['Safety', /\b(recall|recalls|safety|crash|airbag|tire|tyre)\b/i],
  ['Classics', /\b(classic|vintage|restor\w*|heritage)\b/i],
  ['Tech', /\b(software|autonomous|self-driving|tech|ai|chip|update)\b/i],
  ['Maintenance', /\b(repair|mechanic|maintenance|oil|brake|engine|service)\b/i],
]

function categorize(text) {
  const match = CATEGORY_KEYWORDS.find(([, pattern]) => pattern.test(text))
  return match ? match[0] : 'Industry'
}

function normalize(article) {
  const text = `${article.title} ${article.description ?? ''}`
  const content = (article.content ?? '').replace(/\s*\.{3}\s*\[\d+ chars\]$/, '…')
  return {
    id: article.url,
    title: article.title,
    description: article.description ?? '',
    body: [content || article.description || ''],
    category: categorize(text),
    source: article.source?.name ?? 'Unknown source',
    author: '',
    image: article.image,
    publishedAt: article.publishedAt,
    readMinutes: Math.max(2, Math.round(text.split(' ').length / 40)),
    url: article.url,
    isDemo: false,
  }
}

async function loadNews() {
  if (!API_KEY) {
    return { articles: MOCK_NEWS, isDemo: true, reason: 'No GNews API key in .env.local' }
  }

  try {
    const params = new URLSearchParams({
      q: 'automotive OR "car repair" OR mechanic OR "electric vehicle"',
      lang: 'en',
      max: '10',
      apikey: API_KEY,
    })
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`)
    if (!res.ok) throw new Error(`GNews answered with error ${res.status}`)
    const data = await res.json()
    if (!data.articles?.length) throw new Error('GNews returned no articles')
    return { articles: data.articles.map(normalize), isDemo: false, reason: '' }
  } catch (err) {
    console.warn('Live news failed, showing demo stories instead:', err.message)
    return { articles: MOCK_NEWS, isDemo: true, reason: err.message }
  }
}

let cached = null

export function getNews() {
  cached ??= loadNews()
  return cached
}

export const NEWS_CATEGORIES = ['All', 'Electric', 'Maintenance', 'Tech', 'Safety', 'Classics', 'Motorsport', 'Industry']
