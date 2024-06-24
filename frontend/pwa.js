// Trigger version check
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage({
        type: 'APP_VERSION_CHECK',
        version: '0.0.5' // Replace with your app's current version
      });
    });
  }

  
  // Handle update available message from service worker
navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_AVAILABLE') {
      if (confirm('A new version of the app is available. Refresh now?')) {
        window.location.reload();
      }
    }
  });