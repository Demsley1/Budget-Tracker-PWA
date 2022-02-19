const CACHE_NAME = 'budget-tracker-cache-v1';
const DATA_CACHE_NAME = 'budget-data-cache-v1';

const FILES_TO_CACHE = [
    '/',
    '../index.html',
    '../css/styles.css',
    '/manifest.json',
    '../js/idb.js',
    '../js/index.js',
    '../icons/icon-72x72.png',
    '../icons/icon-96x96.png',
    '../icons/icon-128x128.png',
    '../icons/icon-144x144.png',
    '../icons/icon-152x152.png',
    '../icons/icon-192x192.png',
    '../icons/icon-384x384.png',
    '../icons/icon-512x512.png'
];

// Install the service worker
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("success");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// listen to activate event and clear cache storage if already populated
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('removing old cache data: ', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    console.log('fetch request: '+ e.request.url)
    if(e.request.url.includes('/api/')){
        e.respondWith(
            caches.open(DATA_CACHE_NAME)
            .then(cache => {
                return fetch(e.request)
                .then(response => {
                    if(response.status === 200){
                        cache.put(e.request.url, response.clone());
                    }
                    return response;
                }).catch(err => {
                    console.log("Network is Offline")
                    return alert("User is offline right now!! Data is being saved to the local storage until you get back online, then it will be sent to the server.")
                })
            }).catch(err => console.log(err))
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(request => {
            if(request){
                return request || fetch(e.request) 
            }
        })
    )
})
