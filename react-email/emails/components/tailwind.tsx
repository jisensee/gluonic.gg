import { FC, PropsWithChildren } from 'react'
import { Tailwind as ETailwind } from '@react-email/tailwind'

export const Tailwind: FC<PropsWithChildren> = ({ children }) => (
  <ETailwind
    config={{
      theme: {
        colors: {
          primary: '#dca54c',
          'primary-content': '#3b2500',
          secondary: '#00aed6',
          accent: '#00c7b2',
          neutral: '#171618',
          'base-content': '#b4b4b9',
          'base-100': '#09090b',
          'base-200': '#171618',
          'base-300': '#2e2d2f',
          info: '#66c6ff',
          success: '#87d039',
          warning: '#e2d562',
          error: '#ff6f6f',
        },
      },
    }}
  >
    {children}
  </ETailwind>
)
