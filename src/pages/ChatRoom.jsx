import { Navigate, useLocation, useParams } from 'react-router-dom'
import { ROOMS } from '../data/rooms'
import RoomList from '../components/RoomList'
import ChatPanel from '../components/ChatPanel'

function ChatRoom() {
  const { roomId } = useParams()
  const location = useLocation()
  const room = ROOMS.find((r) => r.id === roomId)

  if (!room) return <Navigate to="/chat/general" replace />

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] max-w-7xl flex-col gap-3 p-3 sm:p-4 md:h-[calc(100dvh-4rem)] md:flex-row md:gap-4 md:p-6">
      <RoomList />
      <ChatPanel key={room.id} room={room} initialDraft={location.state?.draft ?? ''} />
    </div>
  )
}

export default ChatRoom
