// =====================================================================
// FILE: src/pages/ChatRoom.jsx     MOCKUPS: chat.svg, chat-mobile.svg
// =====================================================================
//
// WHAT THIS FILE DOES
//   The live chat. Two jobs:
//     1. LISTEN to the `messages` collection in Firestore. Firestore sends
//        all existing messages straight away, then sends the list again
//        every time anyone adds one. So old messages AND new ones come
//        from this one listener.
//     2. A form at the bottom: type a message, hit Send, it's saved.
//
//   How a message travels:
//   you hit Send → saved in Firestore → Firestore tells every open
//   browser (yours too) → their `messages` list updates → bubble appears.
//
// HOW TO USE THIS FILE
//   The complete code is below, cut into PARTS. For each part: read the
//   code, read what each line means, then TYPE it yourself at the bottom
//   under ✍️. This is the biggest file. Take a break between parts.
//
// ---------------------------------------------------------------------
// PART 1 of 6 — Imports
// ---------------------------------------------------------------------
//   import { useEffect, useRef, useState } from 'react'
//   import {
//     addDoc,
//     collection,
//     limitToLast,
//     onSnapshot,
//     orderBy,
//     query,
//     serverTimestamp,
//   } from 'firebase/firestore'
//   import { Send } from 'lucide-react'
//   import { db } from '../firebase'
//   import { useAuth } from '../context/AuthContext'
//   import MessageBubble from '../components/MessageBubble'
//
//   WHAT EACH LINE MEANS
//   • useRef → lets us grab a real element on the page (for auto-scroll).
//   • From Firestore (you can split a long import over several lines):
//       collection      → "the messages collection" (like a table)
//       query, orderBy, limitToLast → describe WHICH messages, in what order
//       onSnapshot      → listen to them live
//       addDoc          → save a new message
//       serverTimestamp → "use the server's clock for the time"
//   • db → your database tool from src/firebase.js
//
// ---------------------------------------------------------------------
// PART 2 of 6 — Start the component and its state
// ---------------------------------------------------------------------
//   function ChatRoom() {
//     const { user } = useAuth()
//     const [messages, setMessages] = useState([])
//     const [newMessage, setNewMessage] = useState('')
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const bottomRef = useRef(null)
//
//   WHAT EACH LINE MEANS
//   • user → who's logged in (we need user.uid and user.email).
//   • messages → the list of messages to show. [] = empty list at first.
//   • newMessage → what's typed in the box at the bottom.
//   • loading → true until the first messages arrive.
//   • error → a problem to show in red ('' = none).
//   • bottomRef → will point at an invisible div after the last message,
//     so we can scroll to it.
//   • (Don't close the { yet. PARTS 3 to 6 go inside this function.)
//
// ---------------------------------------------------------------------
// PART 3 of 6 — Listen to the messages (the realtime part!)
// ---------------------------------------------------------------------
//     useEffect(() => {
//       const q = query(collection(db, 'messages'), orderBy('createdAt'), limitToLast(100))
//
//       const unsubscribe = onSnapshot(
//         q,
//         (snapshot) => {
//           const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//           setMessages(list)
//           setLoading(false)
//         },
//         (err) => {
//           setError(err.message)
//           setLoading(false)
//         },
//       )
//
//       return unsubscribe
//     }, [])
//
//   WHAT EACH LINE MEANS
//   • useEffect(() => { ... }, []) → run once, when the chat page opens.
//   • q is a QUESTION for the database (nothing is fetched yet):
//       collection(db, 'messages') → "in the messages collection..."
//       orderBy('createdAt')       → "...sorted oldest to newest..."
//       limitToLast(100)           → "...give me the newest 100."
//   • onSnapshot(q, whenData, whenError) starts LISTENING:
//       whenData runs NOW with the current messages, then AGAIN every
//       time a message is added. It receives a `snapshot` (a photo of
//       the data at that moment).
//       whenError runs if it fails (e.g. your rules block it).
//   • snapshot.docs is the list of documents (messages). For each one,
//     doc.id is its id and doc.data() is its fields. This line:
//       snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//     turns every document into a plain object like
//       { id: 'aB3x', content: 'hi', userId: '...', userEmail: '...', createdAt: ... }
//     `.map` = "do this to every item and give me the new list".
//     `...doc.data()` = "copy all the fields in here" (the spread operator).
//     The ( ) around { } are needed so JS knows it's an object, not a
//     block of code.
//   • setMessages(list) → show the new list. We REPLACE the whole list
//     each time, because Firestore always sends the full list.
//   • return unsubscribe → stop listening when you leave the chat page.
//     Without it you'd keep extra listeners running in the background.
//
// ---------------------------------------------------------------------
// PART 4 of 6 — Auto-scroll to the newest message
// ---------------------------------------------------------------------
//     useEffect(() => {
//       bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//     }, [messages])
//
//   WHAT IT MEANS
//   • `[messages]` at the end → run this every time `messages` changes.
//   • bottomRef.current is the invisible div after the last message.
//     scrollIntoView scrolls the chat so it's visible. 'smooth' = animated.
//   • `?.` → don't crash if the div isn't there yet.
//
// ---------------------------------------------------------------------
// PART 5 of 6 — Sending a message
// ---------------------------------------------------------------------
//     async function handleSend(e) {
//       e.preventDefault()
//       const text = newMessage.trim()
//       if (!text) return
//
//       setNewMessage('')
//       try {
//         await addDoc(collection(db, 'messages'), {
//           content: text,
//           userId: user.uid,
//           userEmail: user.email,
//           createdAt: serverTimestamp(),
//         })
//       } catch (err) {
//         setError(err.message)
//         setNewMessage(text)
//       }
//     }
//
//   WHAT EACH LINE MEANS
//   • e.preventDefault() → stop the page from reloading on submit.
//   • .trim() removes spaces at the start and end. "   " becomes "".
//     `if (!text) return` → if it's empty, do nothing.
//   • setNewMessage('') → empty the box straight away (feels fast).
//   • addDoc(collection(db, 'messages'), { ... }) → save a new message.
//     Firestore makes up its id for you.
//       userId: user.uid  ← ⚠ Firebase calls it uid, not id. Your
//                           firestore.rules check this matches YOU.
//       createdAt: serverTimestamp() → Google's clock, not the user's
//                           (so someone with a wrong clock can't mess
//                           up the order).
//   • If saving fails: show the error, and put the text back in the box
//     so the user doesn't lose it.
//   • ⚠ We do NOT add the message to `messages` here. onSnapshot from
//     PART 3 sees the new message and updates the list by itself.
//     Adding it here too would show it twice.
//
// ---------------------------------------------------------------------
// PART 6 of 6 — What's shown
// ---------------------------------------------------------------------
//     return (
//       <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col p-4">
//         <div className="mb-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
//           <h1 className="font-semibold">Community Chat</h1>
//           <span className="flex items-center gap-2 text-sm text-slate-500">
//             <span className="h-2 w-2 rounded-full bg-green-500" /> Live
//           </span>
//         </div>
//
//         <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
//           {loading && <p className="text-center text-slate-500">Loading messages...</p>}
//           {error && <p className="text-center text-red-600">{error}</p>}
//           {!loading && !error && messages.length === 0 && (
//             <p className="text-center text-slate-500">No messages yet — say hi! 👋</p>
//           )}
//
//           {messages.map((m) => (
//             <MessageBubble key={m.id} message={m} isOwn={m.userId === user.uid} />
//           ))}
//
//           <div ref={bottomRef} />
//         </div>
//
//         <form onSubmit={handleSend} className="mt-3 flex gap-2">
//           <input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             maxLength={1000}
//             className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 focus:border-orange-500 focus:outline-none"
//           />
//           <button
//             type="submit"
//             disabled={!newMessage.trim()}
//             className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
//           >
//             <Send size={18} />
//             <span className="hidden sm:inline">Send</span>
//           </button>
//         </form>
//       </div>
//     )
//   }
//
//   export default ChatRoom
//
//   WHAT EACH LINE MEANS
//   • Outer div: centred (mx-auto), max width 3xl, a column (flex-col).
//     h-[calc(100vh-4rem)] = screen height (100vh) minus the navbar
//     (4rem = 64px = the navbar's h-16), so the chat exactly fills the
//     rest of the screen.
//   • Header card: title on the left, green dot + "Live" on the right.
//     The dot is just a tiny round span: h-2 w-2 rounded-full bg-green-500.
//   • Message area: flex-1 = "take all the leftover height".
//     overflow-y-auto = scroll inside this box when it's full.
//     space-y-3 = a gap between each bubble.
//   • Three possible notes: loading, error, or "No messages yet"
//     (that one only when NOT loading, NO error and the list is empty;
//     `&&` chains all three conditions).
//   • messages.map((m) => <MessageBubble ... />) draws one bubble per
//     message:
//       key={m.id}  → React needs a unique key for each item in a list
//       message={m} → pass the message in as a prop
//       isOwn={m.userId === user.uid} → true if you sent it
//                     (=== means "is exactly equal to")
//   • <div ref={bottomRef} /> → the invisible div PART 4 scrolls to.
//     It must be AFTER the bubbles.
//   • The form: the input takes the remaining width (flex-1), and is
//     "controlled" like in Auth.jsx. maxLength={1000} matches your rules.
//     The button is disabled while the box is empty.
//     "Send" text hides on phones; the icon stays.
//
// 🧪 TEST IT
//   1. Send a message. Check Firebase console → Firestore Database → Data:
//      there's a `messages` collection with your message.
//   2. Open the app in a normal window AND an incognito window, log in as
//      two different users, and chat. Messages must appear in both
//      without refreshing. 🎉
//
// ❌ IF IT DOESN'T WORK
//   - "Missing or insufficient permissions" → publish firestore.rules
//     (Firebase console → Firestore Database → Rules → Publish).
//   - All messages show as someone else's → you wrote user.id instead
//     of user.uid somewhere.
//   - Nothing at all → did you create the Firestore database?
//
// ✍️ TYPE PARTS 1 → 6 BELOW, IN ORDER
// ---------------------------------------------------------------------
