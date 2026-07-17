/**
 * diary-virtual.js — virtual rendering for diary photos
 *
 * Only inserts <figure> elements into the DOM as they approach the viewport.
 * Photos that are far off-screen are never parsed or painted by the browser,
 * reducing initial DOM size from 87 nodes to ~12, and total layout work
 * proportionally.
 *
 * Uses IntersectionObserver on a sentinel div at the bottom of the gallery
 * (rootMargin: 600px) so the next batch is ready before the user reaches it.
 *
 * FIX (2026-07): images previously rendered as a 1px placeholder with the
 * real URL in data-src, relying on site-optimizations.js to swap it in.
 * That script snapshots the DOM once on DOMContentLoaded, so every
 * dynamically-inserted polaroid kept its placeholder forever (blank white
 * cards). We now set img.src directly — native loading="lazy" still defers
 * the network fetch until the image nears the viewport, and the virtual
 * batching above still keeps the DOM small, so nothing is lost.
 */
(function () {
  const BATCH       = 12;
  const ROOT_MARGIN = '600px';

  document.addEventListener('DOMContentLoaded', function () {
    const dataEl  = document.getElementById('diary-data');
    const gallery = document.getElementById('diary-gallery');
    if (!dataEl || !gallery) return;

    const photos = JSON.parse(dataEl.textContent);
    let nextIdx  = 0;

    function makePhoto(p) {
      const fig = document.createElement('figure');
      fig.className  = 'polaroid';
      fig.dataset.id = p.id;

      const img = document.createElement('img');
      img.src       = p.src;   // real URL; native lazy-loading defers the fetch
      img.alt       = p.caption;
      img.loading   = 'lazy';
      img.decoding  = 'async';
      img.width     = 360;
      img.height    = 360;

      const cap = document.createElement('figcaption');
      cap.textContent = p.caption;

      const btn = document.createElement('button');
      btn.className = 'like';
      btn.type      = 'button';
      btn.innerHTML = '❤ <span class="count">0</span>';

      fig.appendChild(img);
      fig.appendChild(cap);
      fig.appendChild(btn);
      return fig;
    }

    function insertBatch() {
      if (nextIdx >= photos.length) return;
      const end  = Math.min(nextIdx + BATCH, photos.length);
      const frag = document.createDocumentFragment();
      for (let i = nextIdx; i < end; i++) frag.appendChild(makePhoto(photos[i]));
      // Insert before the sentinel so observer still sees it at the bottom
      gallery.insertBefore(frag, sentinel);
      nextIdx = end;
    }

    // Sentinel div — sits after the gallery; IO fires when it's near the viewport
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    gallery.appendChild(sentinel);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) insertBatch();
      }, { rootMargin: ROOT_MARGIN });
      io.observe(sentinel);
    } else {
      // Fallback: dump everything at once
      while (nextIdx < photos.length) insertBatch();
    }

    // Insert first batch immediately so the page doesn't look empty
    insertBatch();
  });
})();
