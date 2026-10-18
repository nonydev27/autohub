// =====================================================================
// FILE: src/components/NewsCard.jsx      MOCKUP: src/assets/mockups/news.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// Shows ONE article as a card: image, title, short description,
// source + date, and a "Read more" link that opens the article in a new tab.
//
// ---------------------------------------------------------------------
// LESSON 1 — Images and external links in JSX
// ---------------------------------------------------------------------
//   <img src={product.photo} alt={product.name} className="h-44 w-full object-cover" />
//     object-cover = fill the box without stretching (crops the edges)
//     alt          = text for screen readers / if the image fails
//
//   <a href={product.link} target="_blank" rel="noopener noreferrer">View</a>
//     target="_blank"            → new tab
//     rel="noopener noreferrer"  → security best practice with _blank
//
// ---------------------------------------------------------------------
// LESSON 2 — Show something only if it exists
// ---------------------------------------------------------------------
//   {product.photo && <img src={product.photo} ... />}
//   Some articles have no image — this avoids a broken-image icon.
//
// ---------------------------------------------------------------------
// LESSON 3 — Dates & tidy text
// ---------------------------------------------------------------------
//   new Date('2026-10-18T09:00:00Z').toLocaleDateString()
//       → "10/18/2026" (format depends on the user's locale)
//   new Date(x).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
//       → "Oct 18"
//
//   Tailwind: line-clamp-2 → cut text after 2 lines with "…"
//
// ---------------------------------------------------------------------
// EXAMPLE — a product card (same layout as yours)
// ---------------------------------------------------------------------
//   function ProductCard({ product }) {
//     return (
//       <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg">
//         {product.photo && (
//           <img src={product.photo} alt={product.name} className="h-44 w-full object-cover" />
//         )}
//         <div className="flex flex-1 flex-col gap-2 p-4">
//           <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
//           <p className="line-clamp-3 text-sm text-slate-500">{product.blurb}</p>
//           <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-400">
//             <span>{product.brand}</span>
//             <a href={product.link} target="_blank" rel="noopener noreferrer"
//                className="font-medium text-orange-600 hover:underline">View →</a>
//           </div>
//         </div>
//       </article>
//     )
//   }
//   mt-auto pushes the footer to the bottom so all cards line up.
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. function NewsCard({ article })
// 2. Use: article.image, article.title, article.description,
//         article.source.name, article.publishedAt, article.url
// 3. Copy the layout idea from the example; footer = "Source · Oct 18" + "Read more →"
// 4. export default NewsCard
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

