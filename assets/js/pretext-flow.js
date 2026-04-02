/* pretext-flow.js — Mirror-ball text wrapping using chenglou's pretext library.
   Uses pretext's layoutNextLine() for per-line variable-width layout,
   enabling smooth text flow around the cursor-following sphere. */
(async function () {
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function lerp(a, b, t)    { return a + (b - a) * t; }

  var RADIUS       = 43;   // half of visual ball (--size: 86px)
  var SHAPE_MARGIN = 14;   // breathing room between ball edge and text
  var EFF_R        = RADIUS + SHAPE_MARGIN;

  /* ── Load pretext from CDN ─────────────────────────────────── */
  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) {
    console.warn('[pretext-flow] Could not load @chenglou/pretext:', e);
    return;                          // graceful degradation: no wrapping
  }

  /* ── Initialise the interactive flow on a content element ──── */
  function initFlow(content) {
    content.style.position = 'relative';

    /* Visual ball */
    var ball = document.createElement('div');
    ball.className = 'flow-mirror-ball';
    ball.setAttribute('aria-hidden', 'true');
    ball.style.cssText = 'position:absolute;pointer-events:none;z-index:10;';
    content.appendChild(ball);

    /* Collect paragraphs */
    var paragraphs = Array.from(content.querySelectorAll('p'));
    if (!paragraphs.length) return;

    /* Detect font metrics from the first paragraph */
    var cs = getComputedStyle(paragraphs[0]);
    var font = cs.fontSize + ' ' + cs.fontFamily;
    var lineHeight =
      parseFloat(cs.lineHeight) ||
      parseFloat(cs.fontSize) * 1.6;

    /* Prepare each paragraph with pretext */
    var paras = paragraphs.map(function (p) {
      var text = p.textContent || '';
      var hasInline = p.querySelector('a, strong, em, code, span, img, abbr');
      return {
        el:       p,
        text:     text,
        prepared: hasInline ? null : pt.prepareWithSegments(text, font),
        divs:     [],          // reusable line <div> pool
        active:   0,           // how many divs are currently in use
      };
    });

    /* ── Pointer state ───────────────────────────────────────── */
    var targetX = EFF_R + 10, targetY = EFF_R + 10;
    var curX    = targetX,    curY    = targetY;
    var raf     = null;

    /* Half-width of the exclusion circle at vertical offset y from centre */
    function hw(cy, y) {
      var d = y - cy;
      return Math.abs(d) < EFF_R
        ? Math.sqrt(EFF_R * EFF_R - d * d)
        : 0;
    }

    /* ── Core layout + render pass ───────────────────────────── */
    function render() {
      var W = content.clientWidth;
      var H = content.scrollHeight;
      var cx = clamp(curX, EFF_R, W - EFF_R);
      var cy = clamp(curY, EFF_R, H - EFF_R);

      /* Position the visual ball */
      ball.style.left = (cx - RADIUS) + 'px';
      ball.style.top  = (cy - RADIUS) + 'px';

      /* Batch-read paragraph tops (single forced layout) */
      var tops = [];
      for (var i = 0; i < paras.length; i++) tops[i] = paras[i].el.offsetTop;

      /* Layout each paragraph */
      for (var pi = 0; pi < paras.length; pi++) {
        var pd = paras[pi];
        if (!pd.prepared) continue;     // skip rich-HTML paragraphs

        var pTop = tops[pi];
        var lines = [];
        var cursor = { segmentIndex: 0, graphemeIndex: 0 };
        var y = pTop;

        for (var safety = 0; safety < 500; safety++) {
          var mid = y + lineHeight * 0.5;
          var h   = hw(cy, mid);

          var maxW = W, ml = 0;
          if (h > 0) {
            var leftSpace  = cx - h;
            var rightSpace = W - (cx + h);

            if (rightSpace >= leftSpace) {
              /* More room on the right → indent from left */
              ml   = Math.max(0, cx + h);
              maxW = Math.max(20, W - ml);
            } else {
              /* More room on the left → shrink max-width */
              maxW = Math.max(20, leftSpace);
            }
          }

          var line = pt.layoutNextLine(pd.prepared, cursor, maxW);
          if (!line) break;

          lines.push({ t: line.text, m: ml });
          cursor = line.end;
          y += lineHeight;
        }

        /* ── Efficient DOM update ────────────────────────────── */
        var need = lines.length;

        /* Grow div pool if necessary */
        while (pd.divs.length < need) {
          var d = document.createElement('div');
          pd.divs.push(d);
        }

        /* If line count changed, rebuild children */
        if (need !== pd.active) {
          pd.el.textContent = '';          // clear
          for (var j = 0; j < need; j++) pd.el.appendChild(pd.divs[j]);
          pd.active = need;
        }

        /* Patch text + margin only when changed */
        for (var k = 0; k < need; k++) {
          var div = pd.divs[k];
          var lt  = lines[k].t;
          var lm  = lines[k].m + 'px';
          if (div._pt !== lt) { div.textContent = lt; div._pt = lt; }
          if (div._pm !== lm) { div.style.marginLeft = lm; div._pm = lm; }
        }
      }
    }

    /* ── Animation loop ──────────────────────────────────────── */
    function tick() {
      raf = null;
      var W = content.clientWidth;
      var H = content.scrollHeight;

      var tx = clamp(targetX, EFF_R, W - EFF_R);
      var ty = clamp(targetY, EFF_R, H - EFF_R);

      curX = lerp(curX, tx, 0.14);
      curY = lerp(curY, ty, 0.14);

      render();

      if (Math.abs(curX - tx) > 0.4 || Math.abs(curY - ty) > 0.4) {
        raf = requestAnimationFrame(tick);
      }
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(tick); }

    function onPointer(px, py) {
      var b = content.getBoundingClientRect();
      targetX = px - b.left;
      targetY = py - b.top + content.scrollTop;
      schedule();
    }

    /* ── Event listeners ─────────────────────────────────────── */
    content.addEventListener('mousemove', function (e) {
      onPointer(e.clientX, e.clientY);
    });
    content.addEventListener('touchstart', function (e) {
      if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    content.addEventListener('touchmove', function (e) {
      if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('resize', schedule);

    /* Initial render */
    render();
  }

  /* ── Bootstrap ─────────────────────────────────────────────── */
  var el = document.querySelector('.post-content[data-flow-content]');
  if (el) initFlow(el);
})();
