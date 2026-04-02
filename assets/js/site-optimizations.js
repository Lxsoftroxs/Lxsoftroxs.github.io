(function () {
  const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  function hydrateLazyImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  }

  function optimizeImages() {
    const lazyImages = Array.from(document.querySelectorAll('img'));

    lazyImages.forEach((img) => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
    });

    const hero = document.querySelector('.post-content img, .page-content img');
    if (hero) {
      hero.setAttribute('loading', 'eager');
      hero.setAttribute('fetchpriority', 'high');
      if (hero.getAttribute('src') === TRANSPARENT_PIXEL && hero.hasAttribute('data-src')) {
        hydrateLazyImage(hero);
      }
    }

    const deferred = lazyImages.filter((img) => img.hasAttribute('data-src'));
    if (!deferred.length) return;

    if (!('IntersectionObserver' in window)) {
      deferred.forEach(hydrateLazyImage);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateLazyImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '220px 0px 220px 0px',
      threshold: 0.01,
    });

    deferred.forEach((img) => observer.observe(img));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImages);
  } else {
    optimizeImages();
  }
})();
