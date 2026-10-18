// =====================================================================
// FILE: src/pages/ChatRoom.jsx     MOCKUPS: chat.svg, chat-mobile.svg
// =====================================================================
//
// WHAT THIS FILE DOES
// -------------------
// The live chat. Three jobs:
//   1. On load, fetch old messages from the `messages` table.
//   2. Listen for NEW rows (realtime) and add them to the screen instantly.
//   3. A form that inserts a new row when you hit Send.
//
//   You type → INSERT into Supabase → Supabase broadcasts "new row!" →
//   EVERY open browser (including yours) gets it → added to `messages` state.
//
// Take it one job at a time and test after each.
//
// ---------------------------------------------------------------------
// LESSON 1 — Reading from a table
// ---------------------------------------------------------------------
//   const { data, error } = await supabase
//     .from('messages')                          // which table
//     .select('*')                               // which columns (* = all)
//     .order('created_at', { ascending: true })  // oldest first
//     .limit(100)                                // optional
//
//   data  → an array of row objects: [{ id, content, user_email, ... }, ...]
//
// ---------------------------------------------------------------------
// LESSON 2 — Writing to a table
// ---------------------------------------------------------------------
//   const { error } = await supabase
//     .from('messages')
//     .insert({ content: 'Hello', user_id: user.id, user_email: user.email })
//
//   If you get "new row violates row-level security policy" → your INSERT
//   policy is missing, or user_id doesn't match the logged-in user.
//
// ---------------------------------------------------------------------
// LESSON 3 — Realtime: listening for new rows
// ---------------------------------------------------------------------
//   const channel = supabase
//     .channel('any-name-you-like')
//     .on(
//       'postgres_changes',
//       { event: 'INSERT', schema: 'public', table: 'messages' },
//       (payload) => {
//         console.log('New row!', payload.new)   // payload.new = the inserted row
//       }
//     )
//     .subscribe()
//
//   // Stop listening (put this in the useEffect cleanup):
//   supabase.removeChannel(channel)
//
// ---------------------------------------------------------------------
// LESSON 4 — Adding to an array in state (the right way)
// ---------------------------------------------------------------------
//   setItems([...items, newItem])            ✗ risky inside listeners: `items`
//                                              may be an OLD copy (stale)
//   setItems((prev) => [...prev, newItem])   ✓ React gives you the latest value
//
//   `...prev` = "spread": copies everything from prev into the new array.
//   NEVER do items.push(x) — React won't notice the change.
//
// ---------------------------------------------------------------------
// LESSON 5 — Rendering a list with .map()
// ---------------------------------------------------------------------
//   const fruits = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Mango' }]
//   <ul>
//     {fruits.map((f) => <li key={f.id}>{f.name}</li>)}
//   </ul>
//   `key` must be unique per item — use the row id.
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
// EXAMPLE — a live "comments" box (same pattern, different table)
// ---------------------------------------------------------------------
//   function Comments() {
//     const [comments, setComments] = useState([])
//
//     useEffect(() => {
//       async function load() {
//         const { data } = await supabase.from('comments').select('*').order('created_at')
//         setComments(data ?? [])
//       }
//       load()
//
//       const channel = supabase
//         .channel('comments-live')
//         .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' },
//             (payload) => setComments((prev) => [...prev, payload.new]))
//         .subscribe()
//
//       return () => supabase.removeChannel(channel)
//     }, [])
//
//     return <div>{comments.map((c) => <p key={c.id}>{c.text}</p>)}</div>
//   }
//
// ---------------------------------------------------------------------
// STEPS FOR YOUR VERSION
// ---------------------------------------------------------------------
// 1. Imports: useEffect, useRef, useState, { supabase }, { useAuth },
//             MessageBubble, { Send } from 'lucide-react'
// 2. const { user } = useAuth()
//    State: messages ([]), newMessage (''), loading (true), error ('')
//    const bottomRef = useRef(null)
// 3. useEffect #1 — load history (Lesson 1), set loading false
// 4. useEffect #2 — realtime subscribe + cleanup (Lessons 3 & 4)
//    (You can combine #1 and #2 into one effect like the example.)
// 5. useEffect #3 — auto-scroll when messages change (Lesson 6)
// 6. handleSend(e):
//      e.preventDefault()
//      const text = newMessage.trim(); if (!text) return
//      insert (Lesson 2); if error → setError; else setNewMessage('')
//      ⚠ DON'T add the message to state here — the realtime listener does it,
//        otherwise you'll see your own message twice.
// 7. JSX (match chat.svg):
//      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col p-4">
//        header card: "Community Chat" + small green dot "Live"
//        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-white p-4">
//          loading / error / "No messages yet — say hi! 👋"
//          messages.map → <MessageBubble key={m.id} message={m} isOwn={m.user_id === user.id} />
//          <div ref={bottomRef} />
//        </div>
//        <form className="mt-3 flex gap-2"> input (flex-1) + orange Send button </form>
//      </div>
//   h-[calc(100vh-4rem)] = full screen height minus the 4rem (64px) navbar.
// 8. export default ChatRoom
//
// HOW TO TEST
//   Open the app in a normal window AND an incognito window, log in as two
//   different users, chat. Messages must appear on both without refreshing.
//
// IF REALTIME DOESN'T WORK
//   - Did you run `alter publication supabase_realtime add table messages;`?
//   - Supabase dashboard → Database → Publications → supabase_realtime → messages ON
//   - Is there a SELECT policy? Realtime only sends rows you're allowed to read.
//
// ✍️ WRITE YOUR CODE BELOW
// ---------------------------------------------------------------------

