// service-worker.js
const CACHE_NAME = 'perpus-ganesha-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/fonts/OpenDyslexic-Regular.otf',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_NOTIFICATIONS') {
    // Handle notification settings update
    const notificationSettings = event.data.data;
    console.log('Updated notification settings:', notificationSettings);
    
    // Store notification settings
    self.notificationSettings = notificationSettings;
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Get the notification data
  const data = event.notification.data;

  // Navigate to the appropriate page based on notification type
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there's already a window open
      for (let client of windowClients) {
        if (client.url === data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(data.url);
      }
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const settings = self.notificationSettings || {};

  // Check if this type of notification is enabled
  if (data.type === 'borrowing' && !settings.borrowing) return;
  if (data.type === 'returning' && !settings.returning) return;
  if (data.type === 'events' && !settings.events) return;

  const options = {
    body: data.message,
    icon: '/icon.png',
    badge: '/badge.png',
    data: { 
      type: data.type,
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Perpustakaan Ganesha', options)
  );
});