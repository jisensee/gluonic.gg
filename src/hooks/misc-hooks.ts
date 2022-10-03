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
