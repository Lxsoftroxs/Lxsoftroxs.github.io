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
  var MIN_RUN      = 48;   // narrower than this, a gap gets no text at all

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

    /* Pull the next run of text that fits in `maxW`, advancing the shared
       cursor. Returns null when the paragraph is exhausted (st.done) or when
       the gap is too narrow to fit even one more grapheme — the caller then
       tries the other side of the ball, or drops to the next row. */
    function takeRun(prepared, st, maxW, fullW, cleanOnly) {
      var line = pt.layoutNextLine(prepared, st.cursor, maxW);
      if (!line) {
        /* Nothing came back. That only means the paragraph is finished if the
           full column width comes back empty too — a narrow gap must never be
           mistaken for the end of the text. */
        if (maxW >= fullW || exhausted(prepared, st, fullW)) st.done = true;
        return null;
      }

      var end = line.end;
      if (end.segmentIndex  === st.cursor.segmentIndex &&
          end.graphemeIndex === st.cursor.graphemeIndex) return null;

      /* A non-zero grapheme index means the break landed inside a word.
         pretext does that when the run is narrower than the word it has to
         place; next to the ball it reads as a typo, so the gap is left empty
         and the word moves down to the first row that can hold it whole. */
      if (cleanOnly && end.graphemeIndex !== 0) return null;

      st.cursor = end;
      return line.text;
    }

    function exhausted(prepared, st, W) {
      return !pt.layoutNextLine(prepared, st.cursor, W);
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
        var st = { cursor: { segmentIndex: 0, graphemeIndex: 0 }, done: false };
        var y = pTop;

        for (var safety = 0; safety < 500 && !st.done; safety++) {
          var mid = y + lineHeight * 0.5;
          var h   = hw(cy, mid);
          var runs = [];

          if (h <= 0) {
            var full = takeRun(pd.prepared, st, W, W);
            if (full === null) break;
            runs.push({ t: full, x: 0, w: W });
          } else {
            /* The ball cuts this row in two. Fill the gap to its left, then
               continue the *same* row in the gap to its right, so the text
               closes around the ball instead of only clearing whichever
               side happened to be roomier. */
            var leftW  = clamp(cx - h, 0, W);
            var rightX = clamp(cx + h, 0, W);
            var rightW = Math.max(0, W - rightX);

            if (leftW >= MIN_RUN) {
              var lt = takeRun(pd.prepared, st, leftW, W, true);
              if (lt !== null) runs.push({ t: lt, x: 0, w: leftW });
            }
            if (!st.done && rightW >= MIN_RUN) {
              var rt = takeRun(pd.prepared, st, rightW, W, true);
              if (rt !== null) runs.push({ t: rt, x: rightX, w: rightW });
            }

            if (!runs.length) {
              /* Neither gap took anything: hold the row open and let the
                 text resume below the ball. */
              if (st.done || exhausted(pd.prepared, st, W)) break;
              runs.push({ t: ' ', x: 0, w: W });
            }
          }

          lines.push(runs);
          y += lineHeight;
        }

        pd.laidOutClear = untouched;

        var need = lines.length;
        while (pd.divs.length < need) pd.divs.push(newLine());

        if (need !== pd.active) {
          pd.el.textContent = '';
          for (var j = 0; j < need; j++) pd.el.appendChild(pd.divs[j]);
          pd.active = need;
          metricsStale = true;   // line count changed, offsets moved
        }

        for (var k = 0; k < need; k++) writeLine(pd.divs[k], lines[k]);
      }
    }

    function newLine() {
      var div = document.createElement('div');
      div._spans = [];
      div._n = -1;
      return div;
    }

    /* A row can carry two runs — one either side of the ball — so each line
       element holds a span per run, sized to its gap and offset from the end
       of the previous one. Spans are reused; only what actually changed is
       written back to the DOM. */
    function writeLine(div, runs) {
      var spans = div._spans;
      while (spans.length < runs.length) {
        var s = document.createElement('span');
        s.style.cssText = 'display:inline-block;vertical-align:top;white-space:pre';
        spans.push(s);
      }

      if (div._n !== runs.length) {
        div.textContent = '';
        for (var i = 0; i < runs.length; i++) div.appendChild(spans[i]);
        div._n = runs.length;
      }

      var prevEnd = 0;
      for (var j = 0; j < runs.length; j++) {
        var r = runs[j], sp = spans[j];
        var ml = Math.max(0, r.x - prevEnd);
        if (sp._t  !== r.t) { sp.textContent   = r.t;         sp._t  = r.t; }
        if (sp._ml !== ml)  { sp.style.marginLeft = ml + 'px'; sp._ml = ml; }
        if (sp._w  !== r.w) { sp.style.width      = r.w + 'px'; sp._w = r.w; }
        prevEnd = r.x + r.w;
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
