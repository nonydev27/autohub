// =====================================================================
// FILE: src/pages/NewsFeed.jsx           MOCKUP: src/assets/mockups/news.svg
// =====================================================================
//
// WHAT THIS FILE DOES
//   When the page opens: call fetchCarNews(), then show a grid of NewsCards.
//   While waiting → "Loading news...". If it fails → red error + "Try again".
//
// HOW TO USE THIS FILE
//   The complete code is below, cut into PARTS. For each part: read the
//   code, read what each line means, then TYPE it yourself at the bottom
//   under ✍️.
//
// ---------------------------------------------------------------------
// PART 1 of 4 — Imports
// ---------------------------------------------------------------------
//   import { useEffect, useState } from 'react'
//   import { Newspaper } from 'lucide-react'
//   import { fetchCarNews } from '../services/newsApi'
//   import NewsCard from '../components/NewsCard'
//
//   WHAT IT MEANS
//   • fetchCarNews has { } because newsApi.js uses `export async function`
//     (a named export). NewsCard has none because it's `export default`.
//
// ---------------------------------------------------------------------
// PART 2 of 4 — State, and loading the news
// ---------------------------------------------------------------------
//   function NewsFeed() {
//     const [articles, setArticles] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const [attempt, setAttempt] = useState(0)
//
//     useEffect(() => {
//       async function load() {
//         try {
//           const result = await fetchCarNews()
//           setArticles(result)
//         } catch (err) {
//           setError(err.message)
//         } finally {
//           setLoading(false)
//         }
//       }
//       load()
//     }, [attempt])
//
//   WHAT EACH LINE MEANS
//   • articles → the list of news. loading → true until it arrives.
//     error → red text. attempt → a counter for the "Try again" button.
//   • useEffect(..., [attempt]) → run when the page opens, AND again
//     whenever `attempt` changes (that's how "Try again" works).
//   • Why a function `load` INSIDE the effect? Because you're not allowed
//     to write useEffect(async () => ...). So we make an async function
//     inside and call it right away with load().
//   • try → get the news and save it.
//     catch → if fetchCarNews threw an error (bad key, limit hit), save
//             its message.
//     finally → runs EITHER WAY, so loading always stops.
//   • (Don't close the { of NewsFeed yet.)
//
// ---------------------------------------------------------------------
// PART 3 of 4 — "Try again" and today's date
// ---------------------------------------------------------------------
//     function tryAgain() {
//       setLoading(true)
//       setError('')
//       setAttempt(attempt + 1)
//     }
//
//     const today = new Date().toLocaleDateString(undefined, {
//       weekday: 'long',
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric',
//     })
//
//   WHAT IT MEANS
//   • tryAgain shows "Loading..." again, clears the error, and adds 1 to
//     attempt → the useEffect from PART 2 runs again.
//   • new Date() = right now. The options make it look like
//     "Sunday, October 18, 2026".
//
// ---------------------------------------------------------------------
// PART 4 of 4 — What's shown
// ---------------------------------------------------------------------
//     return (
//       <main className="mx-auto max-w-6xl p-6">
//         <div className="flex items-center gap-3">
//           <Newspaper className="h-7 w-7 text-orange-500" />
//           <div>
//             <h1 className="text-2xl font-bold">Today's Auto News</h1>
//             <p className="text-sm text-slate-500">{today}</p>
//           </div>
//         </div>
//
//         {loading && <p className="mt-6 text-slate-500">Loading news...</p>}
//
//         {error && (
//           <div className="mt-6">
//             <p className="text-red-600">{error}</p>
//             <button
//               onClick={tryAgain}
//               className="mt-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
//             >
//               Try again
//             </button>
//           </div>
//         )}
//
//         <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {articles.map((a) => (
//             <NewsCard key={a.url} article={a} />
//           ))}
//         </div>
//       </main>
//     )
//   }
//
//   export default NewsFeed
//
//   WHAT EACH LINE MEANS
//   • <main> = the main content. mx-auto max-w-6xl = centred, not too wide.
//   • Header: newspaper icon next to the title and today's date.
//   • {loading && ...} / {error && ...} → only shown when true.
//     onClick={tryAgain} → no brackets, so it runs on click, not right away.
//   • The grid: grid-cols-1 on phones, sm:grid-cols-2 from 640px,
//     lg:grid-cols-3 from 1024px. gap-6 = space between cards.
//   • articles.map → one NewsCard per article. Articles have no id, so the
//     url (unique for every article) is used as the key.
//
// 🧪 TEST IT
//   You should see car news cards with pictures. "Read more" opens the
//   article in a new tab. Put a wrong key in .env.local (and restart) to
//   see the error + "Try again" button.
//
// ✍️ TYPE PARTS 1 → 4 BELOW, IN ORDER
// ---------------------------------------------------------------------
