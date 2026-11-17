/* Service worker: makes the app open offline.
   Change CACHE_VERSION whenever you edit index.html so phones pick up the new copy. */
const CACHE_VERSION = 'byaz-v7';
const FONT_CACHE = 'byaz-fonts';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './hero-art.png', './empty-art.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION && k !== FONT_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: use the saved copy if there is one, refresh it in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(req).then((hit) => {
          const net = fetch(req)
            .then((res) => { cache.put(req, res.clone()); return res; })
            .catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  // The app's own files: show the saved copy at once, update it in the background.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE_VERSION).then((cache) =>
        cache.match(req, { ignoreSearch: true }).then((hit) => {
          const net = fetch(req)
            .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
            .catch(() => hit || cache.match('./index.html'));
          return hit || net;
        })
      )
    );
  }
});
