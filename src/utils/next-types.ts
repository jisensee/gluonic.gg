import { Metadata } from 'next/types'
import { ReactNode } from 'react'

export type NextPageParams<RouteParams> = {
  params: RouteParams
}

export type GenerateMetadata<RouteParams> = (
  params: NextPageParams<RouteParams>
) => Promise<Metadata>

export type NextPage<RouteParams> = (
  params: NextPageParams<RouteParams>
) => Promise<ReactNode>
