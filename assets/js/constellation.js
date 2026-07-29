/* constellation.js — Characters are stars that drift gently and form
   constellations by drawing faint lines between nearby characters.
   Stars pulse, drift, then reform into readable text. */
(function () {
  var wrap = document.querySelector('.constellation[data-constellation]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[constellation] fx-runtime missing'); return; }

  var source = wrap.querySelector('.constellation-source');
  var canvas = wrap.querySelector('.constellation-canvas');
  if (!source || !canvas) { FX.fallback(wrap, 'missing source or canvas'); return; }

  var allText = FX.readText(source);
  if (!allText) { FX.fallback(wrap, 'no text'); return; }

  var ctx = canvas.getContext('2d');
  if (!ctx) { FX.fallback(wrap, 'no 2d context'); return; }

  /* ══════════════════════════════════════════════════════════════
     CONFIGURATION
     ══════════════════════════════════════════════════════════════ */
  var GLOW        = !FX.isSmall;
  var FONT_SIZE   = FX.fontSize(14);
  var FONT_FAMILY = '"Courier New", Courier, monospace';
  var LINE_HEIGHT = 1.7;
  var PADDING     = 10;

  var READ_MS   = 7000;
  var DRIFT_MS  = 12000;
  var REFORM_MS = 4000;

  var DRIFT_VEL = 0.3;
  var DAMPING   = 0.995;
  var REFORM_K  = 0.08;

  var LINE_DIST    = 60;
  var LINE_OPACITY = 0.25;
  var LINE_WIDTH   = 0.6;

  var STAR_COLORS = ['#fff', '#def', '#fde', '#efd', '#ffd',
                     '#ddf', '#fdd', '#dff', '#fef', '#eff'];
  var PULSE_SPEED = 0.002;
  var PULSE_MIN   = 0.5;
  var PULSE_MAX   = 1.0;

  var MOUSE_RADIUS  = 120;
  var MOUSE_ATTRACT = 0.02;

  var CELL = 70;

  /* Lines are bucketed into a few opacity bands. Each band becomes one
     Path2D and one stroke() call, replacing a beginPath/stroke pair per
     connection — on a busy frame that was thousands of draw calls. */
  var ALPHA_BANDS = 4;

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  var cw   = FX.charWidth(ctx, font);

  var W, H, N = 0;
  var px, py, vx, vy, hx, hy, ch, pulseOffset, colorIdx;

  function layoutText() {
    W = wrap.clientWidth || 760;
    var lines = FX.wrapMono(allText, Math.max(1, Math.floor((W - PADDING * 2) / cw)));
    var data = [];
    var yOff = PADDING * 2;
    for (var li = 0; li < lines.length; li++) {
      var lineText = lines[li];
      var x = PADDING;
      for (var ci = 0; ci < lineText.length; ci++) {
        var c = lineText[ci];
        if (c !== ' ' && c !== '\t') data.push({ ch: c, hx: x + cw * 0.5, hy: yOff + lh * 0.5 });
        x += cw;
      }
      yOff += lh;
    }
    return { data: data, totalH: yOff };
  }

  function build() {
    var r = layoutText();
    H = Math.max(400, r.totalH + 40);
    FX.sizeCanvas(canvas, ctx, W, H);

    N = r.data.length;
    px = new Float32Array(N); py = new Float32Array(N);
    vx = new Float32Array(N); vy = new Float32Array(N);
    hx = new Float32Array(N); hy = new Float32Array(N);
    ch = new Array(N);
    pulseOffset = new Float32Array(N);
    colorIdx = new Uint8Array(N);

    for (var i = 0; i < N; i++) {
      px[i] = hx[i] = r.data[i].hx;
      py[i] = hy[i] = r.data[i].hy;
      vx[i] = vy[i] = 0;
      ch[i] = r.data[i].ch;
      pulseOffset[i] = Math.random() * Math.PI * 2;
      colorIdx[i] = Math.floor(Math.random() * STAR_COLORS.length);
    }

    /* Reusable buckets, sized to the grid, so nothing is allocated per frame. */
    gridCells = null;

    /* Star colours are random but fixed for the life of the effect, so
       consecutive stars almost never share one and per-glyph change detection
       would fire on nearly every character. Instead the indices are grouped by
       colour once, here, and the draw loop walks that order — ten fill/shadow
       changes per frame, with no per-frame bucketing work. */
    buildColorOrder();
    return N > 0;
  }

  var colorOrder = null;           // indices grouped by colour
  var colorStart = null;           // where each colour's run begins

  function buildColorOrder() {
    var counts = new Uint32Array(STAR_COLORS.length);
    for (var i = 0; i < N; i++) counts[colorIdx[i]]++;

    colorStart = new Uint32Array(STAR_COLORS.length + 1);
    for (var c = 0; c < STAR_COLORS.length; c++) colorStart[c + 1] = colorStart[c] + counts[c];

    var cursor = colorStart.slice(0, STAR_COLORS.length);
    colorOrder = new Uint32Array(N);
    for (var j = 0; j < N; j++) colorOrder[cursor[colorIdx[j]]++] = j;
  }

  var gridCells = null, gridCols = 0, gridRows = 0;

  /* A flat array-of-arrays bucket grid, reused every frame. The old version
     built a fresh Map plus N array pushes on each draw. */
  function buildHash() {
    var wantCols = Math.ceil(W / CELL) + 1;
    var wantRows = Math.ceil(H / CELL) + 1;
    if (!gridCells || wantCols !== gridCols || wantRows !== gridRows) {
      gridCols = wantCols; gridRows = wantRows;
      gridCells = new Array(gridCols * gridRows);
      for (var g = 0; g < gridCells.length; g++) gridCells[g] = [];
    } else {
      for (var k = 0; k < gridCells.length; k++) gridCells[k].length = 0;
    }
    for (var i = 0; i < N; i++) {
      var cx = px[i] / CELL | 0;
      var cy = py[i] / CELL | 0;
      if (cx < 0) cx = 0; else if (cx >= gridCols) cx = gridCols - 1;
      if (cy < 0) cy = 0; else if (cy >= gridRows) cy = gridRows - 1;
      gridCells[cy * gridCols + cx].push(i);
    }
  }

  if (!build()) { FX.fallback(wrap, 'nothing to lay out'); return; }

  /* ── State ─────────────────────────────────────────────────── */
  var PHASE_READ = 0, PHASE_DRIFT = 1, PHASE_REFORM = 2;
  var phase = PHASE_READ;
  var phaseTime = 0;
  var time = 0;
  var pointerX = -999, pointerY = -999;

  /* ── Update ────────────────────────────────────────────────── */
  function step(dt) {
    phaseTime += dt;
    time += dt;

    if (phase === PHASE_READ) {
      var settled = true;
      for (var i = 0; i < N; i++) {
        var ddx = hx[i] - px[i], ddy = hy[i] - py[i];
        if (ddx * ddx + ddy * ddy > 0.01) settled = false;
        px[i] += ddx * 0.1;
        py[i] += ddy * 0.1;
        vx[i] = vy[i] = 0;
      }
      if (phaseTime > READ_MS) {
        for (var j = 0; j < N; j++) {
          vx[j] = (Math.random() - 0.5) * DRIFT_VEL * 2;
          vy[j] = (Math.random() - 0.5) * DRIFT_VEL * 2;
        }
        phase = PHASE_DRIFT;
        phaseTime = 0;
      }
      /* Stars still twinkle while settled, so keep repainting. */
      return true;
    }

    if (phase === PHASE_DRIFT) {
      var attracting = pointerX > 0;
      for (var k = 0; k < N; k++) {
        if (attracting) {
          var mdx = pointerX - px[k], mdy = pointerY - py[k];
          var md2 = mdx * mdx + mdy * mdy;
          if (md2 < MOUSE_RADIUS * MOUSE_RADIUS && md2 > 1) {
            var md = Math.sqrt(md2);
            vx[k] += (mdx / md) * MOUSE_ATTRACT;
            vy[k] += (mdy / md) * MOUSE_ATTRACT;
          }
        }
        vx[k] *= DAMPING; vy[k] *= DAMPING;
        px[k] += vx[k];   py[k] += vy[k];

        if (px[k] < 5)     { px[k] = 5;     vx[k] *= -0.5; }
        if (px[k] > W - 5) { px[k] = W - 5; vx[k] *= -0.5; }
        if (py[k] < 5)     { py[k] = 5;     vy[k] *= -0.5; }
        if (py[k] > H - 5) { py[k] = H - 5; vy[k] *= -0.5; }
      }
      if (phaseTime > DRIFT_MS) { phase = PHASE_REFORM; phaseTime = 0; }
      return true;
    }

    /* PHASE_REFORM */
    var t = Math.min(phaseTime / REFORM_MS, 1);
    var kk = REFORM_K + t * 0.15;
    for (var m = 0; m < N; m++) {
      vx[m] += (hx[m] - px[m]) * kk;
      vy[m] += (hy[m] - py[m]) * kk;
      vx[m] *= 0.85; vy[m] *= 0.85;
      px[m] += vx[m]; py[m] += vy[m];
    }
    if (phaseTime > REFORM_MS) {
      for (var n = 0; n < N; n++) { px[n] = hx[n]; py[n] = hy[n]; vx[n] = vy[n] = 0; }
      phase = PHASE_READ;
      phaseTime = 0;
    }
    return true;
  }

  /* ── Draw ──────────────────────────────────────────────────── */
  var bandPaths = new Array(ALPHA_BANDS);

  function draw() {
    /* This canvas runs the full height of the post — several thousand pixels
       on a long one. Everything below is restricted to the visible slice. */
    var band = FX.band(canvas);
    ctx.clearRect(0, band.y0, W, band.y1 - band.y0);

    /* ── Constellation lines ── */
    buildHash();
    for (var b = 0; b < ALPHA_BANDS; b++) bandPaths[b] = new Path2D();

    /* Only scan hash rows overlapping the visible slice. */
    var rowFrom = Math.max(0, (band.y0 / CELL | 0) - 1);
    var rowTo   = Math.min(gridRows - 1, (band.y1 / CELL | 0) + 1);

    var lineDist2 = LINE_DIST * LINE_DIST;
    for (var cy = rowFrom; cy <= rowTo; cy++) {
      for (var cx = 0; cx < gridCols; cx++) {
        var cell = gridCells[cy * gridCols + cx];
        if (!cell.length) continue;

        /* Only scan forward neighbours so each pair is visited once. */
        for (var oy = 0; oy <= 1; oy++) {
          for (var ox = (oy === 0 ? 0 : -1); ox <= 1; ox++) {
            var nx = cx + ox, ny = cy + oy;
            if (nx < 0 || nx >= gridCols || ny >= gridRows) continue;
            var other = gridCells[ny * gridCols + nx];
            if (!other.length) continue;
            var same = (ox === 0 && oy === 0);

            for (var a = 0; a < cell.length; a++) {
              var i = cell[a];
              for (var bi = same ? a + 1 : 0; bi < other.length; bi++) {
                var j = other[bi];
                var ddx = px[j] - px[i], ddy = py[j] - py[i];
                var d2 = ddx * ddx + ddy * ddy;
                if (d2 >= lineDist2 || d2 <= 1) continue;

                var band = (Math.sqrt(d2) / LINE_DIST * ALPHA_BANDS) | 0;
                if (band >= ALPHA_BANDS) band = ALPHA_BANDS - 1;
                var path = bandPaths[band];
                path.moveTo(px[i], py[i]);
                path.lineTo(px[j], py[j]);
              }
            }
          }
        }
      }
    }

    ctx.lineWidth = LINE_WIDTH;
    for (var bp = 0; bp < ALPHA_BANDS; bp++) {
      var alpha = LINE_OPACITY * (1 - (bp + 0.5) / ALPHA_BANDS);
      ctx.strokeStyle = 'rgba(180, 220, 255, ' + alpha.toFixed(3) + ')';
      ctx.stroke(bandPaths[bp]);
    }

    /* ── Stars ── */
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    /* Walk the prebuilt colour groups: one fill/shadow change per colour.
       The twinkle alpha is inherently per-star, but shadowBlur is now
       constant rather than scaling with the pulse, so it is set once. */
    if (GLOW) ctx.shadowBlur = 4;
    for (var c = 0; c < STAR_COLORS.length; c++) {
      var from = colorStart[c], to = colorStart[c + 1];
      if (from === to) continue;
      ctx.fillStyle = STAR_COLORS[c];
      if (GLOW) ctx.shadowColor = STAR_COLORS[c];
      for (var k = from; k < to; k++) {
        var q = colorOrder[k];
        if (py[q] < band.y0 || py[q] > band.y1) continue;
        ctx.globalAlpha = PULSE_MIN + (PULSE_MAX - PULSE_MIN) *
                          (0.5 + 0.5 * Math.sin(time * PULSE_SPEED + pulseOffset[q]));
        ctx.fillText(ch[q], px[q], py[q]);
      }
    }
    ctx.globalAlpha = 1;
    if (GLOW) ctx.shadowBlur = 0;
  }

  draw();
  var loop = FX.loop(canvas, { step: step, draw: draw });

  /* ── Interaction ───────────────────────────────────────────── */
  function scatter(cx, cy) {
    for (var i = 0; i < N; i++) {
      var dx = px[i] - cx, dy = py[i] - cy;
      var d = Math.sqrt(dx * dx + dy * dy) + 1;
      var f = Math.min(8 / d, 3);
      vx[i] += (dx / d) * f * (1 + Math.random());
      vy[i] += (dy / d) * f * (1 + Math.random());
    }
    phase = PHASE_DRIFT;
    phaseTime = 0;
  }

  function reform() { phase = PHASE_REFORM; phaseTime = 0; }

  /* Attraction now works by dragging on touch, not just hovering a mouse. */
  FX.pointer(canvas, {
    onTap:       function (x, y) { scatter(x, y); loop.play(); loop.wake(); },
    onDoubleTap: function () { reform(); loop.play(); loop.wake(); },
    onHover:     function (x, y) { pointerX = x; pointerY = y; },
    onDragStart: function (x, y) { pointerX = x; pointerY = y; loop.play(); },
    onDragMove:  function (x, y) { pointerX = x; pointerY = y; },
    onDragEnd:   function () { pointerX = -999; pointerY = -999; },
    onHoverEnd:  function () { pointerX = -999; pointerY = -999; }
  });

  FX.controls(wrap, {
    loop: loop,
    onReplay: function () { reform(); loop.wake(); },
    onRead: function () {},
    hint: {
      hover: 'hover to attract · click to scatter · double-click to reform',
      touch: 'drag sideways to attract · tap to scatter · double-tap to reform'
    }
  });

  FX.onResize(function () {
    build();
    phase = PHASE_READ;
    phaseTime = 0;
    loop.wake();
  });
})();
