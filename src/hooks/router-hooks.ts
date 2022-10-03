import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useIsPageLoading = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleEnd = () => setIsLoading(false)
    const handleError = () => setIsLoading(false)
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleEnd)
    router.events.on('routeChangeError', handleError)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleEnd)
      router.events.off('routeChangeError', handleError)
    }
  }, [])
  return isLoading
}
