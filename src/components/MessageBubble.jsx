// =====================================================================
// FILE: src/components/MessageBubble.jsx   MOCKUP: src/assets/mockups/chat.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// Shows ONE chat message. ChatRoom loops over all messages and renders
// one <MessageBubble /> per message. Your messages = orange, on the right.
// Other people's = grey, on the left.
//
// ---------------------------------------------------------------------
// LESSON 1 — "Presentational" components
// ---------------------------------------------------------------------
// No state, no fetching. It just takes props and returns JSX.
// These are the easiest components — great for practising.
//
// ---------------------------------------------------------------------
// LESSON 2 — Building className conditionally
// ---------------------------------------------------------------------
// Template strings (backticks) let you mix text and JS with ${ }:
//
//   const color = isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//   <div className={`rounded px-3 py-2 ${color}`}>...</div>
//
// ---------------------------------------------------------------------
// LESSON 3 — Formatting strings and dates
// ---------------------------------------------------------------------
//   'karl@gmail.com'.split('@')        // ['karl', 'gmail.com']
//   'karl@gmail.com'.split('@')[0]     // 'karl'
//
//   const d = new Date('2026-10-18T14:05:00Z')
//   d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })   // "14:05"
//
// ---------------------------------------------------------------------
// EXAMPLE — a notification pill (same idea)
// ---------------------------------------------------------------------
//   function Notice({ notice, isUrgent }) {
//     const style = isUrgent ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-800'
//     return (
//       <div className={`flex flex-col ${isUrgent ? 'items-end' : 'items-start'}`}>
//         <span className="mb-1 text-xs text-slate-500">{notice.author.split('@')[0]}</span>
//         <p className={`max-w-[75%] rounded-2xl px-4 py-2 ${style}`}>{notice.text}</p>
//       </div>
//     )
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. function MessageBubble({ message, isOwn })
//    message = { id, content, user_id, user_email, created_at }
// 2. const name = isOwn ? 'You' : message.user_email?.split('@')[0]
// 3. const time = formatted created_at (Lesson 3)
// 4. Outer div: flex flex-col + items-end (own) or items-start (others)
//      small label:  name · time   (text-xs text-slate-500)
//      bubble:       max-w-[75%] rounded-2xl px-4 py-2
//                    own → bg-orange-500 text-white rounded-br-sm
//                    others → bg-slate-200 text-slate-900 rounded-bl-sm
//                    add `break-words` so long words don't overflow
// 5. export default MessageBubble
//
// HOW TO TEST
//   Before ChatRoom works, render it with fake data in ChatRoom:
//   <MessageBubble isOwn={false} message={{ content: 'Hi', user_email: 'a@b.com', created_at: new Date().toISOString() }} />
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

