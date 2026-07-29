/* pretext-flow.js — Mirror-ball text wrapping.
   Post text flows around a sphere that follows the cursor, using pretext's
   layoutNextLine() for per-line variable-width layout.

   This effect is deliberately desktop-only. It is a hover decoration: it
   tracks a pointer that a touch screen does not have, and the previous
   version bound it to touchstart/touchmove, so on a phone every scroll
   gesture dragged the ball and forced a full re-layout of every paragraph
   in the post. On touch the text is now simply left alone — which is also
   the version that stays selectable and reflows natively. */
(function () {
  var content = document.querySelector('.post-content[data-flow-content]');
  if (!content) return;

  var FXok = !!window.FX;

  /* Gate before doing any work at all: no fine pointer, a narrow screen, or
     a reduced-motion preference all mean the plain document is the better
     rendering. */
  var wantFlow = FXok
    ? (FX.canHover && !FX.isSmall && !FX.reduceMotion)
    : window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!wantFlow) return;

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function lerp(a, b, t)    { return a + (b - a) * t; }

  var RADIUS       = 43;   // half of visual ball (--size: 86px)
  var SHAPE_MARGIN = 14;   // breathing room between ball edge and text
  var EFF_R        = RADIUS + SHAPE_MARGIN;

  /* Loaded lazily and off the critical path — the post is fully readable
     without it, so nothing waits on the network. */
  import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm')
    .then(initFlow)
    .catch(function (e) {
      console.warn('[pretext-flow] Could not load @chenglou/pretext:', e);
    });

  function initFlow(pt) {
    content.style.position = 'relative';

    var ball = document.createElement('div');
    ball.className = 'flow-mirror-ball';
    ball.setAttribute('aria-hidden', 'true');
    ball.style.cssText = 'position:absolute;pointer-events:none;z-index:10;';
    content.appendChild(ball);

    var paragraphs = Array.prototype.slice.call(content.querySelectorAll('p'));
    if (!paragraphs.length) return;

    var cs = getComputedStyle(paragraphs[0]);
    var font = cs.fontSize + ' ' + cs.fontFamily;
    var lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.6;

    var paras = paragraphs.map(function (p) {
      var text = p.textContent || '';
      var hasInline = p.querySelector('a, strong, em, code, span, img, abbr');
      return {
        el:       p,
        text:     text,
        prepared: hasInline ? null : pt.prepareWithSegments(text, font),
        divs:     [],
        active:   0
      };
    });

    var targetX = EFF_R + 10, targetY = EFF_R + 10;
    var curX    = targetX,    curY    = targetY;
    var raf     = null;

    /* Paragraph offsets and container size are cached. Reading offsetTop in
       the render pass forced a synchronous layout on every animation frame,
       immediately after the previous frame had written to the same nodes. */
    var tops = [], cachedW = 0, cachedH = 0, metricsStale = true;

    function refreshMetrics() {
      cachedW = content.clientWidth;
      cachedH = content.scrollHeight;
      for (var i = 0; i < paras.length; i++) tops[i] = paras[i].el.offsetTop;
      metricsStale = false;
    }

    function hw(cy, y) {
      var d = y - cy;
      return Math.abs(d) < EFF_R ? Math.sqrt(EFF_R * EFF_R - d * d) : 0;
    }

    function render() {
      if (metricsStale) refreshMetrics();

      var W = cachedW, H = cachedH;
      var cx = clamp(curX, EFF_R, W - EFF_R);
      var cy = clamp(curY, EFF_R, H - EFF_R);

      ball.style.left = (cx - RADIUS) + 'px';
      ball.style.top  = (cy - RADIUS) + 'px';

      for (var pi = 0; pi < paras.length; pi++) {
        var pd = paras[pi];
        if (!pd.prepared) continue;

        var pTop = tops[pi];

        /* Paragraphs the ball cannot reach do not need relaying out at all. */
        var pBottom = pTop + (pd.active || 1) * lineHeight;
        var untouched = (pTop > cy + EFF_R + lineHeight) ||
                        (pBottom < cy - EFF_R - lineHeight);
        if (untouched && pd.laidOutClear) continue;

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
              ml   = Math.max(0, cx + h);
              maxW = Math.max(20, W - ml);
            } else {
              maxW = Math.max(20, leftSpace);
            }
          }

          var line = pt.layoutNextLine(pd.prepared, cursor, maxW);
          if (!line) break;

          lines.push({ t: line.text, m: ml });
          cursor = line.end;
          y += lineHeight;
        }

        pd.laidOutClear = untouched;

        var need = lines.length;
        while (pd.divs.length < need) pd.divs.push(document.createElement('div'));

        if (need !== pd.active) {
          pd.el.textContent = '';
          for (var j = 0; j < need; j++) pd.el.appendChild(pd.divs[j]);
          pd.active = need;
          metricsStale = true;   // line count changed, offsets moved
        }

        for (var k = 0; k < need; k++) {
          var div = pd.divs[k];
          var lt  = lines[k].t;
          var lm  = lines[k].m + 'px';
          if (div._pt !== lt) { div.textContent = lt; div._pt = lt; }
          if (div._pm !== lm) { div.style.marginLeft = lm; div._pm = lm; }
        }
      }
    }

    var onScreen = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
      }, { rootMargin: '100px 0px' }).observe(content);
    }

    function tick() {
      raf = null;
      var W = cachedW || content.clientWidth;
      var H = cachedH || content.scrollHeight;

      var tx = clamp(targetX, EFF_R, W - EFF_R);
      var ty = clamp(targetY, EFF_R, H - EFF_R);

      curX = lerp(curX, tx, 0.14);
      curY = lerp(curY, ty, 0.14);

      render();

      if (Math.abs(curX - tx) > 0.4 || Math.abs(curY - ty) > 0.4) {
        raf = requestAnimationFrame(tick);
      }
    }

    function schedule() {
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    }

    /* Mouse only. Touch never reaches here, so scrolling can never drag the
       ball or trigger a relayout. */
    content.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var b = content.getBoundingClientRect();
      targetX = e.clientX - b.left;
      targetY = e.clientY - b.top + content.scrollTop;
      schedule();
    });

    if (FXok) {
      FX.onResize(function () { metricsStale = true; schedule(); });
    } else {
      window.addEventListener('resize', function () { metricsStale = true; schedule(); });
    }

    refreshMetrics();
    render();
  }
})();
