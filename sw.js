const cachePrefix = `fitness-training-brand:${new URL(self.registration.scope).pathname}:`
const cacheName = `${cachePrefix}v1`
const publicPhotos = new Set([
  'trainer-home.jpg',
  'trainer-home.webp',
  'profile-gym.avif',
  'profile-gym.webp',
  'access-athlete.avif',
  'access-athlete.webp',
].map((name) => new URL(`brand/${name}`, self.registration.scope).href))

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        .filter((name) => name.startsWith(cachePrefix) && name !== cacheName)
        .map((name) => caches.delete(name))))
      .catch(() => undefined)
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || request.destination !== 'image' || !publicPhotos.has(request.url)) return

  const cache = caches.open(cacheName)
  const fresh = fetch(request)

  // Refresh only a requested public photo; never cache documents, API data or user uploads.
  event.waitUntil(Promise.all([cache, fresh]).then(async ([store, response]) => {
    if (response.status !== 200 || response.redirected ||
      !response.headers.get('content-type')?.startsWith('image/') ||
      /(?:no-store|private)/i.test(response.headers.get('cache-control') ?? '')) return
    await store.put(request, response.clone())
  }).catch(() => undefined))

  event.respondWith(cache.then((store) => store.match(request))
    .then((stored) => stored ?? fresh)
    .catch(() => fresh))
})
