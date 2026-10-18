import { useState } from 'react'

const STORAGE_KEY = 'autohub:saved-articles'

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function useBookmarks() {
  const [saved, setSaved] = useState(loadSaved)

  function toggle(article) {
    const exists = saved.some((item) => item.id === article.id)
    const next = exists ? saved.filter((item) => item.id !== article.id) : [article, ...saved]
    setSaved(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (err) {
      console.warn('Could not save bookmarks:', err)
    }
  }

  function isSaved(id) {
    return saved.some((item) => item.id === id)
  }

  return { saved, toggle, isSaved }
}
