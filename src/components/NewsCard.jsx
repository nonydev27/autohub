// =====================================================================
// FILE: src/components/NewsCard.jsx      MOCKUP: src/assets/mockups/news.svg
// =====================================================================
//
// WHAT THIS FILE DOES
//   Shows ONE article as a card: picture, title, short description,
//   "Source · date", and a "Read more →" link that opens it in a new tab.
//   Like MessageBubble, it just shows what it's given.
//
// HOW TO USE THIS FILE
//   The complete code is below, cut into PARTS. For each part: read the
//   code, read what each line means, then TYPE it yourself at the bottom
//   under ✍️.
//
// ---------------------------------------------------------------------
// PART 1 of 2 — Start the component and format the date
// ---------------------------------------------------------------------
//   function NewsCard({ article }) {
//     const date = new Date(article.publishedAt).toLocaleDateString(undefined, {
//       month: 'short',
//       day: 'numeric',
//     })
//
//   WHAT EACH LINE MEANS
//   • `{ article }` is the prop NewsFeed passes in: <NewsCard article={a} />
//   • article.publishedAt is text like "2026-10-18T09:00:00Z".
//     new Date(...) turns it into a date, and toLocaleDateString(...)
//     turns that into short text like "Oct 18".
//     `undefined` means "use the visitor's language settings".
//
// ---------------------------------------------------------------------
// PART 2 of 2 — What's shown
// ---------------------------------------------------------------------
//     return (
//       <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg">
//         {article.image && (
//           <img src={article.image} alt={article.title} className="h-44 w-full object-cover" />
//         )}
//
//         <div className="flex flex-1 flex-col gap-2 p-4">
//           <h3 className="line-clamp-2 font-semibold">{article.title}</h3>
//           <p className="line-clamp-3 text-sm text-slate-500">{article.description}</p>
//
//           <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-400">
//             <span>
//               {article.source?.name} · {date}
//             </span>
//             <a
//               href={article.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="font-medium text-orange-600 hover:underline"
//             >
//               Read more →
//             </a>
//           </div>
//         </div>
//       </article>
//     )
//   }
//
//   export default NewsCard
//
//   WHAT EACH LINE MEANS
//   • <article> is just a div with a meaningful name.
//     overflow-hidden → the picture's corners get cut to the card's
//     rounded corners. hover:shadow-lg → bigger shadow on mouse-over,
//     `transition` animates it.
//   • {article.image && <img ... />} → only show a picture IF the article
//     has one (otherwise you'd get a broken-image icon).
//     h-44 = 176px tall, w-full = full width,
//     object-cover = fill the box without squashing (crops the edges).
//     alt = text for screen readers or if the picture fails.
//   • line-clamp-2 / line-clamp-3 → cut the text after 2 / 3 lines with "…"
//     so all cards stay a similar size.
//   • mt-auto on the footer pushes it to the BOTTOM of the card, so the
//     footers line up even when titles are different lengths.
//   • article.source?.name → the site's name (`?.` in case it's missing).
//   • The link: href = where it goes. target="_blank" = new tab.
//     rel="noopener noreferrer" = a safety rule whenever you use _blank.
//     It's a normal <a>, not NavLink, because it goes to ANOTHER website.
//
// ✍️ TYPE PARTS 1 → 2 BELOW, IN ORDER
// ---------------------------------------------------------------------
