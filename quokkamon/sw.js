const CACHE_NAME = 'quokkamon-shell-v4'
const APP_BASE = new URL('./', self.registration.scope)
const APP_SHELL = [
  APP_BASE.href,
  new URL('manifest.webmanifest', APP_BASE).href,
  new URL('favicon.svg', APP_BASE).href,
  new URL('icon-192.svg', APP_BASE).href,
  new URL('icon-512.svg', APP_BASE).href,
  new URL('icon-192.png', APP_BASE).href,
  new URL('icon-512.png', APP_BASE).href,
  new URL('icon-512-maskable.png', APP_BASE).href,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith('quokkamon-shell-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  const isAppAsset = /\.(?:css|js|svg|webmanifest)$/.test(url.pathname)

  if (request.method !== 'GET' || url.origin !== APP_BASE.origin || !url.pathname.startsWith(APP_BASE.pathname) || (!isAppAsset && request.mode !== 'navigate')) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        if (request.mode === 'navigate') {
          const appShell = await caches.match(APP_BASE.href)
          if (appShell) return appShell
        }
        return Response.error()
      }),
  )
})
