const CACHE_NAME = 'cache-v2';
const URLS_TO_CACHE = [
    '/',
    '/index.produk.html'
];
const API_URLS = [];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
  );
  console.log('ServiceWorker installed');
});

// Activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return Promise.all(
              cacheNames.map(cacheName => {
                  if (!cacheWhitelist.includes(cacheName)) {
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});
  
self.addEventListener('fetch', event => {
  if (API_URLS.some(url => event.request.url.includes(url))) {
      event.respondWith(
          caches.match(event.request).then(async cachedResponse => {
              if (cachedResponse) {
                    return cachedResponse;
                } else {
                    const networkResponse = await fetch(event.request);
                    const responseClone = networkResponse.clone();
                    const modifiedResponse = new Response(responseClone.body, {
                        status: responseClone.status,
                        statusText: responseClone.statusText,
                        headers: {
                            ...responseClone.headers,
                            'X-From-Cache': 'false'
                        }
                    });
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(event.request, modifiedResponse);
                    return networkResponse;
                }
          })
      );
  } else {
      event.respondWith(
          caches.match(event.request).then(cachedResponse => {
              return cachedResponse || fetch(event.request);
          })
      );
  }
});

// Version check and update logic
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'APP_VERSION_CHECK') {
    const currentVersion = event.data.version;
    event.waitUntil(
      fetch('/manifest.json')
        .then(response => response.json())
        .then(manifest => {
          const latestVersion = manifest.version;
          if (currentVersion !== latestVersion) {
            // Prompt user to update
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: 'UPDATE_AVAILABLE' });
              });
            });
          }
        })
    );
  }
});

//handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); 
  var fullPath = self.location.origin + event.notification.data.path; 
  clients.openWindow(fullPath); 
});

//handle push event
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
      data = event.data.json();
  }
  const options = {
    body: data.body || 'Default body'
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Default title', options)
  );
});