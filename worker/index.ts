console.log('setting up notification event listener')
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('got notification click', event.notification)
  const url = event.notification.data.url as string | undefined
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
