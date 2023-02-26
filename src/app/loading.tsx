import Image from 'next/image'

export default async function Loading() {
  return (
    <div className='flex flex-row items-center justify-center py-20'>
      <div className='relative h-64 w-64'>
        <Image
          src='/gluonic-logo-small.svg'
          className='animate-ping'
          alt='Gluonic logo'
          fill
        />
      </div>
    </div>
  )
}
