'use client'

import type { FC } from 'react'
import { useState } from 'react'
import type { FavoriteState } from '@/hooks/favorite-hooks'
import { useFavoriteState } from '@/hooks/favorite-hooks'
import { FavoriteButton } from '@/components/favorite-button'
import { trpc } from '@/utils/trpc'

type FavoritesProps = {
  state: FavoriteState
  projectId: string
  canFavorite: boolean
}

export const Favorites: FC<FavoritesProps> = ({
  state: { favorited, count },
  projectId,
  canFavorite,
}) => {
  const { mutateAsync } = trpc.project.toggleFavorite.useMutation()
  const [serverFavorited, setServerFavorited] = useState(favorited)
  const { localFavoriteState, toggleFavorite } = useFavoriteState(
    {
      favorited: serverFavorited,
      count,
    },
    canFavorite
      ? () => mutateAsync({ projectId: projectId }).then(setServerFavorited)
      : undefined
  )

  return <FavoriteButton state={localFavoriteState} onToggle={toggleFavorite} />
}
