// =====================================================================
// FILE: src/components/MessageBubble.jsx   MOCKUP: src/assets/mockups/chat.svg
// =====================================================================
//
// WHAT THIS FILE DOES
//   Draws ONE chat message. ChatRoom draws one <MessageBubble /> per message.
//     your messages     → orange, on the right, labelled "You"
//     other people's    → grey, on the left, labelled with their name
//   It only receives data and shows it: no state, no Firebase. Easy one!
//
// HOW TO USE THIS FILE
//   The complete code is below, cut into PARTS. For each part: read the
//   code, read what each line means, then TYPE it yourself at the bottom
//   under ✍️.
//
// ---------------------------------------------------------------------
// PART 1 of 3 — Start the component and work out the label
// ---------------------------------------------------------------------
//   function MessageBubble({ message, isOwn }) {
//     const name = isOwn ? 'You' : message.userEmail?.split('@')[0]
//
//     const time = message.createdAt
//       ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       : ''
//
//   WHAT EACH LINE MEANS
//   • `{ message, isOwn }` are the PROPS: the inputs ChatRoom passes in:
//       <MessageBubble message={m} isOwn={true} />
//     message looks like: { id, content, userId, userEmail, createdAt }
//     isOwn is true if YOU sent it.
//   • name: if it's yours, 'You'. Otherwise the part of the email before
//     the @:  'kwame@gmail.com'.split('@') → ['kwame', 'gmail.com'],
//     and [0] takes the first item → 'kwame'.
//     The `?.` stops a crash if userEmail is missing.
//   • time: Firestore stores the time as a special Timestamp.
//       .toDate()                → turns it into a normal JS date
//       .toLocaleTimeString(...) → turns that into text like "14:05"
//     For a split second after YOU send, createdAt is still null (the
//     server hasn't filled it in). So: `message.createdAt ? ... : ''`
//     = "if there's a time, format it, otherwise use empty text".
//
// ---------------------------------------------------------------------
// PART 2 of 3 — Pick the colours
// ---------------------------------------------------------------------
//     const bubbleStyle = isOwn
//       ? 'bg-orange-500 text-white rounded-br-sm'
//       : 'bg-slate-200 text-slate-900 rounded-bl-sm'
//
//   WHAT IT MEANS
//   • Yours: orange with white text. rounded-br-sm makes the bottom-right
//     corner less round, so the bubble "points" at you.
//   • Others: grey with dark text, bottom-LEFT corner less round.
//
// ---------------------------------------------------------------------
// PART 3 of 3 — What's shown
// ---------------------------------------------------------------------
//     return (
//       <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
//         <span className="mb-1 text-xs text-slate-500">
//           {name}
//           {time && ` · ${time}`}
//         </span>
//         <p className={`max-w-[75%] break-words rounded-2xl px-4 py-2 ${bubbleStyle}`}>
//           {message.content}
//         </p>
//       </div>
//     )
//   }
//
//   export default MessageBubble
//
//   WHAT EACH LINE MEANS
//   • className={`...${...}...`} → a template string (backticks) so we can
//     mix fixed classes with ones that depend on isOwn.
//   • flex flex-col + items-end → pushes everything to the RIGHT.
//     items-start → to the LEFT.
//   • The small grey label shows "kwame · 13:58". `{time && ...}` only adds
//     " · 13:58" if there is a time.
//   • The bubble: max-w-[75%] = never wider than 75% of the chat.
//     break-words = very long words wrap instead of sticking out.
//     Then the colours from PART 2.
//   • {message.content} is the message text.
//
// 🧪 TEST IT (before ChatRoom works)
//   In ChatRoom's placeholder, return this instead of <p>Chat page</p>:
//     <MessageBubble isOwn={false} message={{ content: 'Hi', userEmail: 'a@b.com', createdAt: null }} />
//   (and import MessageBubble at the top of ChatRoom). Try isOwn={true} too.
//
// ✍️ TYPE PARTS 1 → 3 BELOW, IN ORDER
// ---------------------------------------------------------------------
