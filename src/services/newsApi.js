// =====================================================================
// FILE: src/services/newsApi.js
// =====================================================================
//
// WHAT THIS FILE DOES
//   Holds ONE function, fetchCarNews(), that asks the GNews website for
//   car news and gives back a list of articles. No React here, just plain
//   JavaScript. Keeping it separate keeps the page simple, and you could
//   switch to another news site later by changing only this file.
//
//   API docs: https://gnews.io/docs/v4#search-endpoint  (free: 100 requests/day)
//
// HOW TO USE THIS FILE
//   The finished code is at the bottom of this file. The PARTS below
//   explain it piece by piece, line by line.
//
// ---------------------------------------------------------------------
// PART 1 of 3 — Your API key
// ---------------------------------------------------------------------
//   const API_KEY = import.meta.env.VITE_GNEWS_API_KEY
//
//   WHAT IT MEANS
//   • Reads your GNews key from .env.local (same idea as firebase.js).
//
// ---------------------------------------------------------------------
// PART 2 of 3 — Build the web address
// ---------------------------------------------------------------------
//   export async function fetchCarNews() {
//     const params = new URLSearchParams({
//       q: 'automotive OR "car repair" OR mechanic',
//       lang: 'en',
//       max: '10',
//       apikey: API_KEY,
//     })
//
//   WHAT EACH LINE MEANS
//   • `export` → NewsFeed.jsx can import it with { fetchCarNews }.
//     `async` → it waits for the internet, so it uses `await` inside.
//   • URLSearchParams turns the object into the "?q=...&lang=en..." part
//     of a web address, and safely encodes spaces and quotes for you.
//       q      → what to search for
//       lang   → English articles only
//       max    → 10 articles (the free plan's maximum)
//       apikey → proves it's you
//   • (Don't close the { yet. PART 3 goes inside.)
//
// ---------------------------------------------------------------------
// PART 3 of 3 — Ask GNews and return the articles
// ---------------------------------------------------------------------
//     const res = await fetch(`https://gnews.io/api/v4/search?${params}`)
//
//     if (!res.ok) {
//       throw new Error(`Could not load news (error ${res.status})`)
//     }
//
//     const data = await res.json()
//     return data.articles
//   }
//
//   WHAT EACH LINE MEANS
//   • fetch(address) asks a website for data. `await` waits for the reply.
//     The backticks + ${params} glue the address and the params together.
//   • res.ok is false if GNews said no (401/403 = bad key, 429 = daily
//     limit used up). fetch does NOT fail by itself in that case, so we
//     `throw` our own error. NewsFeed will catch it and show it in red.
//     res.status is the number (401, 429...).
//   • res.json() reads the reply as a JavaScript object. It looks like:
//       { totalArticles: 1234, articles: [ {...}, {...} ] }
//   • `return data.articles` → give back just the list.
//     One article looks like:
//       { title, description, url, image, publishedAt, source: { name } }
//
// 🧪 TEST IT
//   Paste the full address into your browser, with your key:
//     https://gnews.io/api/v4/search?q=mechanic&lang=en&max=10&apikey=YOUR_KEY
//   You'll see the raw data. Then build NewsFeed.jsx to show it.
//
// 💡 SAVE YOUR DAILY LIMIT (100/day, each page refresh uses 1)
//   While styling NewsCard, put this as the FIRST line inside the function
//   so it returns fake data and never calls GNews. Delete it when done:
//     return [{ title: 'Test article', description: 'Some text...', url: 'https://example.com', image: '', publishedAt: new Date().toISOString(), source: { name: 'Test' } }]
//
// ✅ FINISHED CODE — this is the code from the parts above, put together.
// ---------------------------------------------------------------------

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY

export async function fetchCarNews() {
  const params = new URLSearchParams({
    q: 'automotive OR "car repair" OR mechanic',
    lang: 'en',
    max: '10',
    apikey: API_KEY,
  })

  const res = await fetch(`https://gnews.io/api/v4/search?${params}`)

  if (!res.ok) {
    throw new Error(`Could not load news (error ${res.status})`)
  }

  const data = await res.json()
  return data.articles
}
