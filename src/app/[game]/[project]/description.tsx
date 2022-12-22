'use client'

import classNames from 'classnames'
import { FC, useState } from 'react'
import { Button } from 'react-daisyui'
import { Markdown } from '@/components/markdown'

type DescriptionProps = {
  description: string
}

export const Description: FC<DescriptionProps> = ({
  description,
}: DescriptionProps) => {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  return (
    <div className='flex grow flex-col gap-y-3'>
      <h2>Description</h2>
      <Markdown.Display
        className={classNames({
          'max-md:max-h-40 max-md:overflow-hidden': !descriptionExpanded,
        })}
      >
        {description}
      </Markdown.Display>
      <Button
        className='md:hidden'
        color='ghost'
        onClick={() => setDescriptionExpanded((e) => !e)}
      >
        {descriptionExpanded ? 'Show less' : 'Show more'}
      </Button>
    </div>
  )
}
