(function () {
  function optimizeImages() {
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
    });

    const hero = document.querySelector('.post-content img, .page-content img');
    if (hero) {
      hero.setAttribute('loading', 'eager');
      hero.setAttribute('fetchpriority', 'high');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImages);
  } else {
    optimizeImages();
  }
})();
