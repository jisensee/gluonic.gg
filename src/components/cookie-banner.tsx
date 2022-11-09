import { useEffect, useState } from 'react'
import { Button } from 'react-daisyui'

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const alreadyAccepted = !!localStorage.getItem('acceptedCookies')
    setVisible(!alreadyAccepted)
  }, [])
  const onAccept = () => {
    localStorage.setItem('acceptedCookies', 'true')
    setVisible(false)
  }
  return visible ? (
    <div className='fixed bottom-0 flex w-full flex-row items-center justify-between gap-x-3 bg-base-300 p-3'>
      {
        "This website uses cookies only for authentication purposes if you actively sign in. That's it."
      }
      <Button onClick={onAccept} color='primary'>
        I understand
      </Button>
    </div>
  ) : null
}
