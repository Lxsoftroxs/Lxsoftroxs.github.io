(function () {
  const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  function hydrateLazyImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  }

  function optimizeImages() {
    const allImages = Array.from(document.querySelectorAll('img'));

    // Default all images to low-priority lazy loading
    allImages.forEach(function (img) {
      if (!img.hasAttribute('loading'))       img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding'))      img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
    });

    // Priority Hints: first 3 in-content images get high priority + eager load.
    // This directly improves Largest Contentful Paint (LCP).
    const prioritySelectors = [
      '.post-content img',
      '.page-content img',
      '.gallery img',
      '.diary-gallery img',
    ].join(', ');

    const priorityImages = Array.from(document.querySelectorAll(prioritySelectors)).slice(0, 3);
    priorityImages.forEach(function (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
      if (img.getAttribute('src') === TRANSPARENT_PIXEL && img.hasAttribute('data-src')) {
        hydrateLazyImage(img);
      }
    });

    // IntersectionObserver for remaining lazy images
    const deferred = allImages.filter(function (img) { return img.hasAttribute('data-src'); });
    if (!deferred.length) return;

    if (!('IntersectionObserver' in window)) {
      deferred.forEach(hydrateLazyImage);
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        hydrateLazyImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '300px 0px 300px 0px', // Start loading 300px before entering viewport
      threshold: 0,
    });

    deferred.forEach(function (img) { observer.observe(img); });
  }

  /**
   * Speculation Rules API (Chrome 120+)
   * Prerenders pages on moderate user intent (hover/pointer-near-link),
   * making in-site navigation feel near-instant.
   */
  function injectSpeculationRules() {
    if (!HTMLScriptElement.supports || !HTMLScriptElement.supports('speculationrules')) return;
    const script = document.createElement('script');
    script.type = 'speculationrules';
    script.textContent = JSON.stringify({
      prerender: [{
        where: {
          and: [
            { href_matches: '/*' },
            { not: { href_matches: '/assets/*' } },
            { not: { href_matches: '/secret/*' } },
            { not: { href_matches: '/encrypt/*' } },
          ],
        },
        eagerness: 'moderate', // prerender on hover, not just click
      }],
    });
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImages);
  } else {
    optimizeImages();
  }

  // Speculation Rules can be injected immediately (doesn't need DOM)
  injectSpeculationRules();
})();
