// newsApi — the only file that talks to the news API.
// Keeping it separate means you can swap APIs later without touching the page.
//
// API: GNews — https://gnews.io/docs/v4#search-endpoint (free: 100 requests/day)
//
// TODO:
// 1. Read VITE_GNEWS_API_KEY from import.meta.env
//
// 2. Export an async function `fetchCarNews()` that:
//    - builds the URL: https://gnews.io/api/v4/search
//        q      = automotive OR "car repair" OR mechanic   (wrap with encodeURIComponent)
//        lang   = en
//        max    = 10
//        apikey = your key
//    - await fetch(url)
//    - if !response.ok → throw new Error('Could not load news')
//    - await response.json() and return data.articles
//
// Each article looks like:
//   { title, description, url, image, publishedAt, source: { name } }
//
// Tip: test the URL in your browser first to see the real JSON.
// Tip: if you burn through the daily limit while developing, temporarily
//      return a hard-coded array of 2–3 fake articles instead.
