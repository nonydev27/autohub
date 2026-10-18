// =====================================================================
// FILE: src/services/newsApi.js
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// Holds ONE function, fetchCarNews(), that calls the GNews API and
// returns an array of articles. No React in here — just plain JavaScript.
// Keeping API code separate means the page stays simple and you could
// swap to a different news API later by editing only this file.
//
// API docs: https://gnews.io/docs/v4#search-endpoint  (free: 100 requests/day)
//
// ---------------------------------------------------------------------
// LESSON 1 — fetch()
// ---------------------------------------------------------------------
//   const response = await fetch('https://api.example.com/jokes')
//   if (!response.ok) {                       // ok is false for 401, 403, 429, 500...
//     throw new Error(`Request failed: ${response.status}`)
//   }
//   const data = await response.json()        // turn the body into a JS object
//
//   Unlike Firebase, fetch does NOT throw on a 401/404/500 — it only throws
//   if the network is down. So check response.ok yourself and `throw` —
//   the page will `catch` it.
//
// ---------------------------------------------------------------------
// LESSON 2 — Building a URL with query parameters
// ---------------------------------------------------------------------
//   const params = new URLSearchParams({
//     q: 'pizza OR pasta',
//     lang: 'en',
//     max: '5',
//   })
//   const url = `https://api.example.com/search?${params}`
//   // → https://api.example.com/search?q=pizza+OR+pasta&lang=en&max=5
//   URLSearchParams handles spaces/quotes/special characters for you.
//
// ---------------------------------------------------------------------
// LESSON 3 — async functions return Promises
// ---------------------------------------------------------------------
//   export async function getJokes() { ...; return data.jokes }
//   // somewhere else:
//   const jokes = await getJokes()
//
// ---------------------------------------------------------------------
// EXAMPLE — a weather service (same shape as yours)
// ---------------------------------------------------------------------
//   const KEY = import.meta.env.VITE_WEATHER_KEY
//
//   export async function fetchWeather(city) {
//     const params = new URLSearchParams({ q: city, appid: KEY })
//     const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)
//     if (!res.ok) throw new Error('Could not load weather')
//     const data = await res.json()
//     return data
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. const API_KEY = import.meta.env.VITE_GNEWS_API_KEY
// 2. export async function fetchCarNews()
//      params: q = 'automotive OR "car repair" OR mechanic'
//              lang = 'en', max = '10', apikey = API_KEY
//      url:    https://gnews.io/api/v4/search?${params}
//      fetch → check res.ok → res.json() → return data.articles
//
// WHAT COMES BACK (one article):
//   {
//     title: "5 Signs Your Brake Pads Need Replacing",
//     description: "Squealing, grinding and ...",
//     url: "https://site.com/article",
//     image: "https://site.com/photo.jpg",
//     publishedAt: "2026-10-18T09:00:00Z",
//     source: { name: "MotorTrend", url: "..." }
//   }
//
// HOW TO TEST
//   Paste the full URL (with your key) in the browser address bar first —
//   you'll see the raw JSON. Then call it from NewsFeed and console.log it.
//
// SAVE YOUR DAILY LIMIT
//   Every page refresh = 1 request. While styling, temporarily return a
//   hard-coded array instead of calling fetch:
//     return [{ title: 'Test', description: '...', url: '#', image: '', publishedAt: new Date().toISOString(), source: { name: 'Test' } }]
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

