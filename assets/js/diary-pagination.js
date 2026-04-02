(function () {
  var BATCH = 12;
  var shown = 0;
  var photos = [];

  document.addEventListener('DOMContentLoaded', function () {
    photos = Array.from(document.querySelectorAll('.polaroid'));
    if (photos.length === 0) return;

    // Hide all photos initially
    photos.forEach(function(p) { p.style.display = 'none'; });

    // Create load-more button
    var btn = document.createElement('button');
    btn.id = 'load-more-diary';
    btn.textContent = 'Load more photos';
    btn.setAttribute('aria-label', 'Load more diary photos');
    document.querySelector('.diary-gallery').insertAdjacentElement('afterend', btn);

    function showNext() {
      var end = Math.min(shown + BATCH, photos.length);
      for (var i = shown; i < end; i++) {
        photos[i].style.display = '';
      }
      shown = end;
      if (shown >= photos.length) {
        btn.style.display = 'none';
      } else {
        btn.textContent = 'Load more photos (' + (photos.length - shown) + ' remaining)';
      }
    }

    btn.addEventListener('click', showNext);
    showNext(); // show first batch
  });
})();
