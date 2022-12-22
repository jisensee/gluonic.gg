'use client'

import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, ReactNode } from 'react'
import { Dropdown as DDropdown } from 'react-daisyui'
import { Link } from '../link'

export type DropdownItem = {
  text: ReactNode
  icon: IconDefinition
  onClick?: () => void
  href?: string
  className?: string
  hidden?: boolean
}
export type DropdownProps = {
  toggle: ReactNode
  items: DropdownItem[]
}
export const Dropdown: FC<DropdownProps> = ({ toggle, items }) => (
  <DDropdown>
    <DDropdown.Toggle color='ghost'>{toggle}</DDropdown.Toggle>
    <DDropdown.Menu className='right-0 w-fit whitespace-nowrap border border-primary bg-base-200'>
      {items.map((item, key) => {
        if (item.hidden) {
          return null
        }
        const content = (
          <>
            <FontAwesomeIcon icon={item.icon} fixedWidth />
            {item.text}
          </>
        )
        return (
          <li
            className=''
            key={key}
            onClick={() => {
              item.onClick?.()
              const activeElement = document.activeElement as HTMLElement
              activeElement?.blur()
            }}
          >
            {item.href ? (
              <Link
                className='flex flex-row items-center gap-x-3'
                href={item.href}
              >
                {content}
              </Link>
            ) : (
              <div className='flex flex-row items-center gap-x-3'>
                {content}
              </div>
            )}
          </li>
        )
      })}
    </DDropdown.Menu>
  </DDropdown>
)
