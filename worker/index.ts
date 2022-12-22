self.addEventListener('notificationclick', (event: NotificationEvent) => {
  const url = event.notification.data.url as string | undefined
  console.log('notification click url', url)
  if (url) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(async (windowClients) => {
        const c = windowClients.at(0)
        if (c) {
          await c.focus()
          await c.navigate(url)
        }
      })
    )
  }
  event.notification.close()
})

export {}
