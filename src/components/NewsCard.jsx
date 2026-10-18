// NewsCard — displays ONE news article.
//
// TODO:
// 1. Props: { article }
//    article = { title, description, url, image, publishedAt, source: { name } }
//
// 2. Show:
//    - image on top (only if article.image exists), object-cover, fixed height
//    - title (bold, maybe line-clamp-2)
//    - description (smaller, grey, line-clamp-3)
//    - footer: source.name · formatted publishedAt date
//    - "Read more" link → <a href={url} target="_blank" rel="noopener noreferrer">
//
// 3. Style: white card, rounded, shadow, overflow-hidden, hover:shadow-lg
//
// 4. export default NewsCard
