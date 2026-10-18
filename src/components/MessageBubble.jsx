// MessageBubble — displays ONE chat message.
//
// TODO:
// 1. Props: { message, isOwn }
//    message = { id, content, user_email, created_at, user_id }
//
// 2. Show:
//    - sender: the part of user_email before the @ (email.split('@')[0])
//      or "You" if isOwn
//    - content
//    - time: new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//
// 3. Style:
//    - isOwn  → aligned right (ml-auto / self-end), main colour background, white text
//    - others → aligned left, grey background
//    - rounded, padding, max-w-xs or max-w-[75%] so long messages wrap
//
// 4. export default MessageBubble
