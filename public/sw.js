const CACHE_KEY = 'cinemaddict';
const CACHE_VERSION = '15';
const CACHE_NAME = `${CACHE_KEY}-${CACHE_VERSION}`;
const HTTP_OK_STATUS = 200;
const RESPONSE_SAFE_TYPE = 'basic';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        './',
        './index.html',
        './bundle.js',
        './css/main.css',
        './css/normalize.css',
        './fonts/OpenSans-Bold.woff2',
        './fonts/OpenSans-ExtraBold.woff2',
        './fonts/OpenSans-Regular.woff2',
        './favicon.ico',
        './images/emoji/angry.png',
        './images/emoji/puke.png',
        './images/emoji/sleeping.png',
        './images/emoji/smile.png',
        './images/icons/icon-favorite-active.svg',
        './images/icons/icon-favorite.svg',
        './images/icons/icon-watched-active.svg',
        './images/icons/icon-watched.svg',
        './images/icons/icon-watchlist-active.svg',
        './images/icons/icon-watchlist.svg',
        './images/posters/made-for-each-other.png',
        './images/posters/popeye-meets-sinbad.png',
        './images/posters/sagebrush-trail.jpg',
        './images/posters/santa-claus-conquers-the-martians.jpg',
        './images/posters/the-dance-of-life.jpg',
        './images/posters/the-great-flamarion.jpg',
        './images/posters/the-man-with-the-golden-arm.jpg',
        './images/background.png',
        './images/bitmap.png',
        './images/bitmap@2x.png',
        './images/bitmap@3x.png',
      ])),
  );
});

const handleFetch = (event) => {
  const { request } = event;

  event.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== HTTP_OK_STATUS || response.type !== RESPONSE_SAFE_TYPE) {
              return response;
            }

            const clonedResponse = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));

            return response;
          });
      }),
  );
};

self.addEventListener('fetch', handleFetch);

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(
        (keys) => Promise.all(
          keys.map((key) => {
            if(key.startsWith(CACHE_KEY) && key !== CACHE_NAME) {
              return caches.delete(key);
            }

            return null;
          })
            .filter((key) => key !== null),
        ),
      ),
  );
});
