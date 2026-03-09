self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through fetch listener to satisfy PWA requirements
});
