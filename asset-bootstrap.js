// Discover the first screen's photo while the application bundle is still loading.
(() => {
  const base = new URL('.', document.currentScript.src)
  if (!location.pathname.startsWith(base.pathname)) return

  const path = location.pathname.slice(base.pathname.length).replace(/\/+$/, '')
  const photos = {
    '': ['trainer-home.jpg', 'image/jpeg'],
    app: ['trainer-home.jpg', 'image/jpeg'],
    profile: ['profile-gym.avif', 'image/avif'],
    access: ['access-athlete.avif', 'image/avif'],
    'billing/return': ['access-athlete.avif', 'image/avif'],
  }
  const photo = Object.hasOwn(photos, path) ? photos[path] : null
  if (!photo) return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.setAttribute('as', 'image')
  link.href = new URL(`brand/${photo[0]}`, base).href
  link.type = photo[1]
  link.setAttribute('fetchpriority', 'high')
  document.head.append(link)
})()
