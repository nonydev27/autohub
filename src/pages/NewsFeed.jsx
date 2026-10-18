// =====================================================================
// FILE: src/pages/NewsFeed.jsx           MOCKUP: src/assets/mockups/news.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// When the page opens: call fetchCarNews(), then show a grid of NewsCards.
// While waiting → "Loading...". If it fails → an error message.
//
// ---------------------------------------------------------------------
// LESSON 1 — The loading / error / data pattern (used in almost every app)
// ---------------------------------------------------------------------
//   const [items, setItems]     = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError]     = useState('')
//
//   if (loading) return <p>Loading...</p>
//   if (error)   return <p className="text-red-600">{error}</p>
//   return <List items={items} />
//
// ---------------------------------------------------------------------
// LESSON 2 — try / catch / finally
// ---------------------------------------------------------------------
//   try {
//     const result = await somethingThatMightFail()   // if this throws...
//     setItems(result)
//   } catch (err) {
//     setError(err.message)                           // ...we land here
//   } finally {
//     setLoading(false)                               // runs either way
//   }
//
// ---------------------------------------------------------------------
// LESSON 3 — Async inside useEffect
// ---------------------------------------------------------------------
//   useEffect(() => {            ✗ useEffect(async () => ...)  is NOT allowed
//     async function load() {
//       ...try/catch/finally here...
//     }
//     load()
//   }, [])
//
// ---------------------------------------------------------------------
// LESSON 4 — Responsive grid with Tailwind
// ---------------------------------------------------------------------
//   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//   1 column on phones, 2 from 640px, 3 from 1024px.
//
// ---------------------------------------------------------------------
// EXAMPLE — a recipes page (identical structure)
// ---------------------------------------------------------------------
//   function Recipes() {
//     const [recipes, setRecipes] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//
//     useEffect(() => {
//       async function load() {
//         try {
//           setRecipes(await fetchRecipes())
//         } catch (err) {
//           setError(err.message)
//         } finally {
//           setLoading(false)
//         }
//       }
//       load()
//     }, [])
//
//     return (
//       <main className="mx-auto max-w-6xl p-6">
//         <h1 className="text-2xl font-bold">Recipes</h1>
//         {loading && <p>Loading...</p>}
//         {error && <p className="text-red-600">{error}</p>}
//         <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
//         </div>
//       </main>
//     )
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. Imports: useEffect, useState, { fetchCarNews }, NewsCard, { Newspaper }
// 2. State: articles, loading, error (Lesson 1)
// 3. useEffect → load() with try/catch/finally (Lessons 2 & 3)
// 4. JSX (match news.svg):
//      <main className="mx-auto max-w-6xl p-6">
//        header: Newspaper icon + "Today's Auto News"
//                + date: new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
//        loading / error / grid of <NewsCard key={a.url} article={a} />
//      (articles have no id, so the url is a good unique key)
// 5. export default NewsFeed
//
// BONUS: a "Try again" button on error that calls load() again
//        (move load() outside the useEffect so the button can reach it).
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

