self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = {};
  }

  const title = typeof payload.title === 'string' && payload.title.trim()
    ? payload.title
    : 'Feriwala';

  const body = typeof payload.body === 'string' && payload.body.trim()
    ? payload.body
    : 'You have a new notification.';

  const url = typeof payload.url === 'string' && payload.url.trim()
    ? payload.url
    : '/admin/orders';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { url, orderId: payload.orderId ?? null },
      tag: typeof payload.orderId === 'string' ? `order-${payload.orderId}` : 'feriwala-order',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || '/admin/orders';

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        if ('focus' in client) {
          try {
            await client.focus();
          } catch (error) {}
        }

        if ('navigate' in client && client.url) {
          try {
            const current = new URL(client.url);
            const target = new URL(targetUrl, self.location.origin);
            if (current.origin === target.origin) {
              await client.navigate(target.toString());
              return;
            }
          } catch (error) {}
        }
      }

      await self.clients.openWindow(new URL(targetUrl, self.location.origin).toString());
    })()
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(Promise.resolve());
});
