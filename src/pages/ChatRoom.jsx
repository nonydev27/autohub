// =====================================================================
// FILE: src/pages/ChatRoom.jsx     MOCKUPS: chat.svg, chat-mobile.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// The live chat. Two jobs:
//   1. LISTEN to the `messages` collection. Firestore sends you all the
//      existing messages right away, then sends the list again every time
//      someone adds one. (History + realtime in ONE listener.)
//   2. A form that adds a new document when you hit Send.
//
//   You type → addDoc to Firestore → Firestore notifies every listener →
//   EVERY open browser (including yours) gets the new list → `messages` state.
//
// Take it one job at a time and test after each.
//
// ---------------------------------------------------------------------
// LESSON 1 — Building a query
// ---------------------------------------------------------------------
//   import { collection, query, orderBy, limit } from 'firebase/firestore'
//
//   const q = query(
//     collection(db, 'messages'),     // which collection
//     orderBy('createdAt', 'asc'),    // oldest first
//     limit(100),                     // optional
//   )
//   A query is just a description. Nothing is fetched until you use it.
//
// ---------------------------------------------------------------------
// LESSON 2 — Writing a document
// ---------------------------------------------------------------------
//   import { addDoc, serverTimestamp } from 'firebase/firestore'
//
//   await addDoc(collection(db, 'messages'), {
//     content: 'Hello',
//     userId: user.uid,              // ⚠ uid, not id
//     userEmail: user.email,
//     createdAt: serverTimestamp(),  // Firebase fills in the real time
//   })
//   Firestore makes up a unique id for the document automatically.
//   It THROWS on failure, so use try/catch.
//
//   If you get "Missing or insufficient permissions" → your rules in
//   firestore.rules aren't published, or userId doesn't match the logged-in user.
//
// ---------------------------------------------------------------------
// LESSON 3 — Realtime: onSnapshot
// ---------------------------------------------------------------------
//   import { onSnapshot } from 'firebase/firestore'
//
//   const unsubscribe = onSnapshot(
//     q,
//     (snapshot) => {
//       // runs NOW with every matching doc, then AGAIN after every change
//       console.log(snapshot.docs.length, 'messages')
//     },
//     (err) => console.log(err.message),   // optional: runs if it fails
//   )
//
//   // Stop listening (put this in the useEffect cleanup):
//   unsubscribe()
//
// ---------------------------------------------------------------------
// LESSON 4 — Turning a snapshot into a plain array
// ---------------------------------------------------------------------
//   snapshot.docs        → list of documents
//   doc.id               → the auto-generated id
//   doc.data()           → the fields: { content, userId, userEmail, createdAt }
//
//   const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//   setMessages(list)
//
//   `...doc.data()` = "spread": copies every field into the new object.
//   Because Firestore gives you the WHOLE list each time, you just replace
//   the state — no need to push/append anything yourself.
//
// ---------------------------------------------------------------------
// LESSON 5 — Rendering a list with .map()
// ---------------------------------------------------------------------
//   const fruits = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Mango' }]
//   <ul>
//     {fruits.map((f) => <li key={f.id}>{f.name}</li>)}
//   </ul>
//   `key` must be unique per item — use the document id.
//
// ---------------------------------------------------------------------
// LESSON 6 — useRef: grab a real DOM element (for auto-scroll)
// ---------------------------------------------------------------------
//   const bottomRef = useRef(null)
//   <div ref={bottomRef} />                         ← put at the END of the list
//
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])                                  ← runs every time messages change
//
// ---------------------------------------------------------------------
// EXAMPLE — a live "comments" box (same pattern, different collection)
// ---------------------------------------------------------------------
//   function Comments() {
//     const [comments, setComments] = useState([])
//
//     useEffect(() => {
//       const q = query(collection(db, 'comments'), orderBy('createdAt'))
//       const unsubscribe = onSnapshot(q, (snapshot) => {
//         setComments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
//       })
//       return unsubscribe
//     }, [])
//
//     return <div>{comments.map((c) => <p key={c.id}>{c.text}</p>)}</div>
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. Imports: useEffect, useRef, useState, { db } from '../firebase',
//             { addDoc, collection, limit, onSnapshot, orderBy, query,
//               serverTimestamp } from 'firebase/firestore',
//             { useAuth }, MessageBubble, { Send } from 'lucide-react'
// 2. const { user } = useAuth()
//    State: messages ([]), newMessage (''), loading (true), error ('')
//    const bottomRef = useRef(null)
// 3. useEffect #1 (deps []) — build the query (Lesson 1), onSnapshot (Lesson 3):
//      success → setMessages(list) (Lesson 4); setLoading(false)
//      error   → setError(err.message); setLoading(false)
//      return unsubscribe
// 4. useEffect #2 — auto-scroll when messages change (Lesson 6)
// 5. handleSend(e):
//      e.preventDefault()
//      const text = newMessage.trim(); if (!text) return
//      try { addDoc (Lesson 2); setNewMessage('') } catch (err) { setError(err.message) }
//      ⚠ DON'T add the message to state here — onSnapshot already does it.
// 6. JSX (match chat.svg):
//      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col p-4">
//        header card: "Community Chat" + small green dot "Live"
//        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-white p-4">
//          loading / error / "No messages yet — say hi! 👋"
//          messages.map → <MessageBubble key={m.id} message={m} isOwn={m.userId === user.uid} />
//          <div ref={bottomRef} />
//        </div>
//        <form className="mt-3 flex gap-2"> input (flex-1) + orange Send button </form>
//      </div>
//   h-[calc(100vh-4rem)] = full screen height minus the 4rem (64px) navbar.
// 7. export default ChatRoom
//
// HOW TO TEST
//   Open the app in a normal window AND an incognito window, log in as two
//   different users, chat. Messages must appear on both without refreshing.
//
// IF IT DOESN'T WORK
//   - "Missing or insufficient permissions" → publish your firestore.rules
//     (Firebase console → Firestore Database → Rules → Publish)
//   - Nothing shows at all → did you create the Firestore database?
//   - Check Firestore Database → Data: is there a `messages` collection?
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

