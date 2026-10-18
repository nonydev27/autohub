// NewsFeed — daily automotive / mechanic news.
//
// TODO:
// 1. State: articles (array), loading (true), error (null)
//
// 2. useEffect on mount:
//    - call fetchCarNews() from '../services/newsApi'
//    - save the articles, or save the error message if it throws
//    - set loading false in both cases (try / catch / finally)
//    - useEffect can't be async directly — define an async function inside and call it
//
// 3. JSX:
//    - header "Today's Auto News" (lucide `Newspaper` icon) + today's date
//      (new Date().toLocaleDateString())
//    - if loading → "Loading news..."
//    - if error   → error message (+ optional "Try again" button)
//    - else       → responsive grid (grid, sm:grid-cols-2, lg:grid-cols-3, gap)
//                   map articles → <NewsCard key={a.url} article={a} />
//
// 4. export default NewsFeed
