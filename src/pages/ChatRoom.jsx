// ChatRoom — real-time community chat. The hardest file, take it step by step.
//
// TODO:
// 1. State: messages (array), newMessage (string), loading, error
//    Get `user` from useAuth()
//    Create a ref with useRef(null) for the bottom of the message list
//
// 2. useEffect #1 (on mount) — load history:
//    supabase.from('messages').select('*').order('created_at', { ascending: true })
//    → setMessages(data), handle error, set loading false
//    (Optional: .limit(100) so it doesn't load forever later)
//
// 3. useEffect #2 (on mount) — realtime subscription:
//    supabase.channel('messages-room')
//      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
//          (payload) => add payload.new to the END of messages)
//      .subscribe()
//    Cleanup: return () => supabase.removeChannel(channel)
//    Tip: use the functional form setMessages(prev => [...prev, payload.new])
//         or you'll lose messages
//
// 4. useEffect #3 (runs when `messages` changes) — auto-scroll:
//    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//
// 5. handleSend(e):
//    - preventDefault, ignore if newMessage.trim() is empty
//    - supabase.from('messages').insert({ content, user_id: user.id, user_email: user.email })
//    - clear the input on success
//    - DON'T add it to state yourself — the realtime listener will do it
//      (otherwise you'll see your message twice)
//
// 6. JSX:
//    - header "Community Chat"
//    - scrollable list (fixed height or flex-1 + overflow-y-auto)
//      map messages → <MessageBubble key={m.id} message={m} isOwn={m.user_id === user.id} />
//    - empty <div ref={bottomRef} /> at the end of the list
//    - form at the bottom: text input + send button (lucide `Send` icon)
//    - "Loading messages..." / error text / "No messages yet — say hi!"
//
// 7. export default ChatRoom
//
// If realtime doesn't work: check you ran step 5 in supabase/schema.sql.
