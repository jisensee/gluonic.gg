import { useEffect, useState } from 'react'

export const useCopyButton = (copyText: string, copiedText: string) => {
  const [buttonText, setButtonText] = useState(copyText)
  const onCopy = (data: string) => {
    navigator.clipboard.writeText(data)
    setButtonText(copiedText)
    setInterval(() => setButtonText(copyText), 3000)
  }

  return {
    onCopy,
    buttonText,
  }
}

export const useDynamicDocumentTitle = (title: string) =>
  useEffect(() => {
    document.title = title
  }, [title])

export const useEscapeKeyHandler = (onEscape: () => void) =>
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape()
      }
    }
    window.addEventListener('keydown', handleKey)

    return () => window.removeEventListener('keydown', handleKey)
  }, [onEscape])
