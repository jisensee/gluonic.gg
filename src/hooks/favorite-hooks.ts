import { Reducer, useReducer, useEffect, useState } from 'react'
import { useToggleFavoriteProjectMutation } from '@/generated/graphql-hooks'

export type FavoriteState = {
  favorited: boolean
  count: number
}
type ToggleAction = { type: 'toggle' }
type MergeAction = { type: 'merge'; favorited: boolean }
type FavoriteAction = ToggleAction | MergeAction

const correctCount = (
  count: number,
  favorited: boolean,
  actualFavorited: boolean
) => {
  if (favorited === actualFavorited) {
    return count
  }
  return actualFavorited ? count + 1 : count - 1
}

const favoriteStateReducer: Reducer<FavoriteState, FavoriteAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'merge':
      return {
        favorited: action.favorited,
        count: correctCount(state.count, state.favorited, action.favorited),
      }
    case 'toggle':
      return {
        favorited: !state.favorited,
        count: state.favorited ? state.count - 1 : state.count + 1,
      }
  }
}

export const useFavoriteState = (
  serverState: FavoriteState,
  serverToggle?: () => void
) => {
  const [localState, dispatchFavAction] = useReducer(
    favoriteStateReducer,
    serverState
  )
  useEffect(() => {
    if (serverState?.favorited !== undefined) {
      dispatchFavAction({ type: 'merge', favorited: serverState.favorited })
    }
  }, [serverState.favorited])

  return {
    localFavoriteState: localState,
    toggleFavorite: serverToggle
      ? () => {
        dispatchFavAction({ type: 'toggle' })
        serverToggle()
      }
      : undefined,
  }
}

export const useFavoriteProjectsList = (favoritedProjectIds?: string[]) => {
  const { mutateAsync } = useToggleFavoriteProjectMutation()
  const [favoritedProjects, setFavoritedProjects] =
    useState(favoritedProjectIds)
  const updateFavorite = favoritedProjects
    ? (projectId: string, favorited: boolean) =>
      setFavoritedProjects((prev) => {
        const old = prev ?? []
        if (favorited) {
          return [...old, projectId]
        } else {
          return old.filter((id) => id !== projectId)
        }
      })
    : undefined

  return {
    isFavorited: (projectId: string) =>
      favoritedProjects?.includes(projectId) ?? false,
    toggleFavorite: favoritedProjectIds
      ? (projectId: string) => {
        mutateAsync({ projectId }).then((v) =>
          updateFavorite?.(projectId, v.toggleFavoriteProject)
        )
      }
      : undefined,
  }
}
