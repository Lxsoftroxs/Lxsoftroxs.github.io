// Diary photo likes — works with both static and dynamically inserted polaroids
(function () {
  'use strict';

  function initPolaroid(figure) {
    if (figure.dataset.likeInit) return; // already set up
    figure.dataset.likeInit = '1';

    const id  = figure.dataset.id;
    const btn = figure.querySelector('.like');
    const cnt = figure.querySelector('.count');
    if (!id || !btn || !cnt) return;

    const key = 'likes:' + id;
    cnt.textContent = localStorage.getItem(key) || 0;

    btn.addEventListener('click', function () {
      const n = (parseInt(localStorage.getItem(key)) || 0) + 1;
      localStorage.setItem(key, n);
      cnt.textContent = n;
      btn.classList.add('liked');
      setTimeout(function () { btn.classList.remove('liked'); }, 150);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Init any polaroids already in the DOM (static builds)
    document.querySelectorAll('.polaroid').forEach(initPolaroid);

    // Watch for polaroids inserted dynamically (diary-virtual.js)
    const gallery = document.getElementById('diary-gallery') || document.body;
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        mut.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('polaroid')) {
            initPolaroid(node);
          }
          // Also catch batch fragments whose children are polaroids
          node.querySelectorAll && node.querySelectorAll('.polaroid').forEach(initPolaroid);
        });
      });
    }).observe(gallery, { childList: true, subtree: true });
  });
})();
