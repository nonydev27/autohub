import { Bookmark, BookmarkCheck } from 'lucide-react'

function BookmarkButton({ saved, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={saved ? 'Remove from saved' : 'Save for later'}
      className={`flex size-9 items-center justify-center rounded-full backdrop-blur transition ${
        saved ? 'bg-orange-500 text-zinc-950' : 'bg-black/50 text-white hover:bg-black/70'
      } ${className}`}
    >
      {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
    </button>
  )
}

export default BookmarkButton
