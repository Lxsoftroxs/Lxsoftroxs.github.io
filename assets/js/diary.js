// Diary photo likes functionality
(function() {
  'use strict';

  const figures = document.querySelectorAll('.polaroid');

  figures.forEach(function(figure) {
    const id = figure.dataset.id;
    const btn = figure.querySelector('.like');
    const cnt = figure.querySelector('.count');
    const key = 'likes:' + id;

    // Load saved likes count
    cnt.textContent = localStorage.getItem(key) || 0;

    // Add click handler
    btn.addEventListener('click', function() {
      const currentCount = parseInt(localStorage.getItem(key)) || 0;
      const newCount = currentCount + 1;
      localStorage.setItem(key, newCount);
      cnt.textContent = newCount;
      btn.classList.add('liked');
      setTimeout(function() {
        btn.classList.remove('liked');
      }, 150);
    });
  });
})();
