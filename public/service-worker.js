// set up a chache_name and data_cache_name for app files to be saved under in browser cache
const CACHE_NAME = 'budget-tracker-cache-v1';

// Select files that need to be cached to server for service worker to work, and their appropriate directories.
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/manifest.json',
    '/js/idb.js',
    '/js/index.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Install the service worker
self.addEventListener('install', function(e) {
    e.waitUntil(
        // open up a new cache with the choosen cache name
        caches.open(CACHE_NAME).then(cache => {
            console.log("success");
            // after installing the service worker add the files to cache array of files with the linked cache name.
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    // forces the waiting service-worker to become active
    self.skipWaiting();
});

// listen to activate event and clear cache storage if already populated
self.addEventListener('activate', function(e) {
    e.waitUntil(
        // opens up the cache storage existing in the browser when user logs into the site, and retrieves all caches and their names.
        caches.keys().then(keyList => {
            return Promise.all(
                // map and sort all key in the array of stored caches, then will delete all that dont match the variable keys indicated in this script file.
                keyList.map(key => {
                    if(key !== CACHE_NAME) {
                        console.log('removing old cache data: ', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // lets the newly installed service worker take control of all clients as soon as it is done installing.
    self.clients.claim();
});

// function to intercept fetch requests.
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(request => {
            if(request){
                return request
            } else {
                // needs to return otherwise error in promise.
                return fetch(e.request)
            }
        })
    )
})
