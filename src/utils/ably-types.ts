import { Realtime } from 'ably/promises'

export type GameOrProject = {
  id: string
  key: string
  name: string
}

export type NewGameProject = {
  type: 'newGameProject'
  project: GameOrProject
  game: GameOrProject
}

export type NewProjectPost = {
  type: 'newProjectPost'
  project: GameOrProject
  game: GameOrProject
  post: {
    id: string
    title: string
    authorName: string
  }
}

export type SubscriptionMessage = NewGameProject | NewProjectPost

export const AblyChannels = {
  subscriptions: 'subscriptions',
}

export const publishSubscriptionMessage = async (
  message: SubscriptionMessage
) => {
  const client = new Realtime(process.env.ABLY_PUBLISH_KEY ?? '')
  await client.channels
    .get(AblyChannels.subscriptions)
    .publish(message.type, message)
}
