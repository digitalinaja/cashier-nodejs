self.addEventListener('install', event => {
    console.log('ServiceWorker installed');
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
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