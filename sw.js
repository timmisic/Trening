// Offline cache for Trening. Bump VERSION when you redeploy changed files.
const VERSION = 'trening-v8';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png',
  './img/Barbell_Bench_Press_-_Medium_Grip-0.jpg',
  './img/Barbell_Bench_Press_-_Medium_Grip-1.jpg',
  './img/Barbell_Deadlift-0.jpg',
  './img/Barbell_Deadlift-1.jpg',
  './img/Barbell_Incline_Bench_Press_-_Medium_Grip-0.jpg',
  './img/Barbell_Incline_Bench_Press_-_Medium_Grip-1.jpg',
  './img/Butterfly-0.jpg',
  './img/Butterfly-1.jpg',
  './img/Cable_Crunch-0.jpg',
  './img/Cable_Crunch-1.jpg',
  './img/Cable_Rope_Overhead_Triceps_Extension-0.jpg',
  './img/Cable_Rope_Overhead_Triceps_Extension-1.jpg',
  './img/Dumbbell_Bicep_Curl-0.jpg',
  './img/Dumbbell_Bicep_Curl-1.jpg',
  './img/Face_Pull-0.jpg',
  './img/Face_Pull-1.jpg',
  './img/Hammer_Curls-0.jpg',
  './img/Hammer_Curls-1.jpg',
  './img/Hanging_Leg_Raise-0.jpg',
  './img/Hanging_Leg_Raise-1.jpg',
  './img/Leg_Extensions-0.jpg',
  './img/Leg_Extensions-1.jpg',
  './img/Leg_Press-0.jpg',
  './img/Leg_Press-1.jpg',
  './img/Lying_Leg_Curls-0.jpg',
  './img/Lying_Leg_Curls-1.jpg',
  './img/Plank-0.jpg',
  './img/Plank-1.jpg',
  './img/Reverse_Machine_Flyes-0.jpg',
  './img/Reverse_Machine_Flyes-1.jpg',
  './img/Romanian_Deadlift-0.jpg',
  './img/Romanian_Deadlift-1.jpg',
  './img/Seated_Cable_Rows-0.jpg',
  './img/Seated_Cable_Rows-1.jpg',
  './img/Seated_Dumbbell_Press-0.jpg',
  './img/Seated_Dumbbell_Press-1.jpg',
  './img/Side_Lateral_Raise-0.jpg',
  './img/Side_Lateral_Raise-1.jpg',
  './img/Split_Squat_with_Dumbbells-0.jpg',
  './img/Split_Squat_with_Dumbbells-1.jpg',
  './img/Standing_Calf_Raises-0.jpg',
  './img/Standing_Calf_Raises-1.jpg',
  './img/Triceps_Pushdown-0.jpg',
  './img/Triceps_Pushdown-1.jpg',
  './img/Underhand_Cable_Pulldowns-0.jpg',
  './img/Underhand_Cable_Pulldowns-1.jpg',
  './img/Wide-Grip_Lat_Pulldown-0.jpg',
  './img/Wide-Grip_Lat_Pulldown-1.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from cache first (works offline); refresh the cache in the background when online.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      const network = fetch(e.request).then(res => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) cache.put(e.request, res.clone());
        return res;
      }).catch(() => null);
      if (cached) return cached;
      const res = await network;
      if (res) return res;
      if (e.request.mode === 'navigate') return cache.match('./index.html');
      return new Response('', { status: 504 });
    })
  );
});
