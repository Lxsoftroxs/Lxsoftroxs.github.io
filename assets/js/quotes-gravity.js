/* quotes-gravity.js — N-body gravity simulation where every letter is a
   particle, with spatial-hash acceleration for the pairwise forces.
   Characters scatter, orbit, cluster, then slowly reform into readable
   quotes — an endless gravitational ballet of words. */
(function () {

  /* ── Early exit ────────────────────────────────────────────── */
  var wrap = document.querySelector('.quotes-gravity[data-quotes]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[quotes-gravity] fx-runtime missing'); return; }

  var GLOW = !FX.isSmall;

  /* ── DOM ────────────────────────────────────────────────────── */
  var source = wrap.querySelector('.quote-source');
  var canvas = wrap.querySelector('.gravity-canvas');
  if (!source || !canvas) { FX.fallback(wrap, 'missing source or canvas'); return; }

  var ctx = canvas.getContext('2d');
  if (!ctx) { FX.fallback(wrap, 'no 2d context'); return; }

  /* ── Parse quotes into separate groups ─────────────────────── */
  var quoteEls = source.querySelectorAll('p');
  var quotes = [];
  for (var qi = 0; qi < quoteEls.length; qi++) {
    var t = FX.readText(quoteEls[qi]);
    if (t) quotes.push(t);
  }
  if (!quotes.length) { FX.fallback(wrap, 'no quotes'); return; }

  /* ── Neon palette — one colour per quote ───────────────────── */
  var COLORS = [
    '#6df', '#f7a', '#af6', '#d8f', '#fd6',
    '#6ff', '#fa8', '#88f', '#f88', '#8f8', '#f8d'
  ];

  /* ══════════════════════════════════════════════════════════════
     CONFIGURATION — tweak these to adjust the simulation feel
     ══════════════════════════════════════════════════════════════ */

  /* -- Font --------------------------------------------------- */
  var FONT_SIZE    = FX.fontSize(13);
  var FONT_FAMILY  = '"Courier New", Courier, monospace';
  var LINE_HEIGHT  = 1.7;                          // multiplier of FONT_SIZE
  var TEXT_PADDING  = 10;                           // px padding inside canvas

  /* -- Physics ------------------------------------------------ */
  var G_BASE       = 800;       // gravitational constant (pairwise)
  var SOFTENING    = 80;        // softening term prevents singularity (r² + SOFTENING)
  var REPULSE_R    = 12;        // repulsion cutoff radius (px)
  var REPULSE_K    = 2000;      // repulsion strength
  var DAMPING      = 0.97;      // velocity damping per frame (0 = frozen, 1 = frictionless)
  var SAME_QUOTE_G = 2.5;       // gravity multiplier for characters in the same quote
  var DT           = 0.5;       // integration timestep

  /* -- Homing spring ------------------------------------------ */
  var HOME_MAX     = 0.25;      // max homing spring constant (read phase)
  var HOME_FLOOR   = 0.12;      // min homing fraction during drift (keeps some structure)

  /* -- Cluster & containment ---------------------------------- */
  var CLUSTER_K    = 0.15;      // attraction to own quote's centre of mass
  var CENTER_K     = 0.003;     // weak pull toward canvas centre (prevents escape)

  /* -- Interaction -------------------------------------------- */
  var MOUSE_FORCE  = 12000;     // mouse/touch attraction strength
  var SCATTER_VEL  = 8;         // base velocity added on scatter-click

  /* -- Phase timing (ms) -------------------------------------- */
  var READ_MS      = 8000;      // hold readable text
  var DRIFT_MS     = 14000;     // gravitational drift duration
  var DRIFT_EASE   = 3000;      // ms to ease gravity in at start of drift
  var REFORM_MS    = 5000;      // spring back to readable

  /* -- Spatial hash ------------------------------------------- */
  var CELL         = 160;       // hash cell size in px

  /* -- Boundary ----------------------------------------------- */
  var EDGE_PAD     = 5;         // soft-bounce distance from canvas edge
  var BOUNCE_DAMP  = -0.5;      // velocity multiplier on edge bounce

  /* ══════════════════════════════════════════════════════════════ */

  /* ── Font metrics ──────────────────────────────────────────── */
  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  var cw   = FX.charWidth(ctx, font);

  /* ── Canvas sizing ─────────────────────────────────────────── */
  var W, H;

  function sizeCanvas(textH) {
    W = wrap.clientWidth || 760;
    H = textH ? Math.max(500, textH + 40) : Math.max(500, window.innerHeight * 0.7);
    FX.sizeCanvas(canvas, ctx, W, H);
  }

  sizeCanvas();

  /* ── Lay out all quotes and map characters ─────────────────── */
  var N = 0;

  function layoutQuotes() {
    var data = [];
    var yOff = TEXT_PADDING * 2;
    var cols = Math.max(1, Math.floor((W - TEXT_PADDING * 2) / cw));

    for (var qi = 0; qi < quotes.length; qi++) {
      var lines = FX.wrapMono(quotes[qi], cols);

      for (var li = 0; li < lines.length; li++) {
        var lineText = lines[li];
        var x = TEXT_PADDING;

        for (var ci = 0; ci < lineText.length; ci++) {
          var ch = lineText[ci];
          if (ch !== ' ' && ch !== '\t') {
            data.push({
              ch:   ch,
              qIdx: qi,
              hx:   x + cw * 0.5,
              hy:   yOff + lh * 0.5
            });
          }
          x += cw;
        }
        yOff += lh;
      }
      yOff += lh;   // gap between quotes
    }
    return { data: data, totalH: yOff };
  }

  var result   = layoutQuotes();
  var charData = result.data;

  sizeCanvas(result.totalH);

  N = charData.length;
  if (!N) { FX.fallback(wrap, 'nothing to lay out'); return; }

  /* ── Particle arrays (typed for speed) ─────────────────────── */
  var px     = new Float32Array(N);   // position x
  var py     = new Float32Array(N);   // position y
  var vx     = new Float32Array(N);   // velocity x
  var vy     = new Float32Array(N);   // velocity y
  var hx     = new Float32Array(N);   // home x
  var hy     = new Float32Array(N);   // home y
  var ch     = new Array(N);          // character
  var qi_arr = new Uint8Array(N);     // quote index

  /* Pre-allocated acceleration buffers (avoid per-frame GC) */
  var ax = new Float32Array(N);
  var ay = new Float32Array(N);

  for (var i = 0; i < N; i++) {
    var d = charData[i];
    px[i] = hx[i] = d.hx;
    py[i] = hy[i] = d.hy;
    vx[i] = vy[i] = 0;
    ch[i] = d.ch;
    qi_arr[i] = d.qIdx;
  }
  charData = null;

  /* ── Mutable physics state (updated each frame by phase) ───── */
  var G        = 0;
  var homeCur  = HOME_MAX;
  var clusterK = 0;

  /* ── Spatial hash ──────────────────────────────────────────── */
  var hashMap = new Map();

  function cellKey(cx, cy) { return (cx + 5000) * 10001 + (cy + 5000); }

  function buildHash() {
    hashMap.clear();
    for (var i = 0; i < N; i++) {
      var cx  = Math.floor(px[i] / CELL);
      var cy  = Math.floor(py[i] / CELL);
      var key = cellKey(cx, cy);
      var bucket = hashMap.get(key);
      if (!bucket) { bucket = []; hashMap.set(key, bucket); }
      bucket.push(i);
    }
  }

  /* ── Per-quote centre of mass (updated each frame) ─────────── */
  var nQuotes = quotes.length;
  var comX = new Float32Array(nQuotes);
  var comY = new Float32Array(nQuotes);
  var comN = new Uint16Array(nQuotes);

  function updateCOM() {
    comX.fill(0); comY.fill(0); comN.fill(0);
    for (var i = 0; i < N; i++) {
      var q = qi_arr[i];
      comX[q] += px[i];
      comY[q] += py[i];
      comN[q]++;
    }
    for (var q = 0; q < nQuotes; q++) {
      if (comN[q]) { comX[q] /= comN[q]; comY[q] /= comN[q]; }
    }
  }

  /* ── Physics step ──────────────────────────────────────────── */
  function physics() {
    buildHash();
    updateCOM();

    var midX = W * 0.5;
    var midY = H * 0.5;

    // Zero acceleration buffers
    ax.fill(0);
    ay.fill(0);

    // --- Pairwise gravity + repulsion via spatial hash ---
    for (var i = 0; i < N; i++) {
      var cx = Math.floor(px[i] / CELL);
      var cy = Math.floor(py[i] / CELL);

      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          var bucket = hashMap.get(cellKey(cx + dx, cy + dy));
          if (!bucket) continue;

          for (var bi = 0; bi < bucket.length; bi++) {
            var j = bucket[bi];
            if (j <= i) continue;   // each pair processed once

            var ddx = px[j] - px[i];
            var ddy = py[j] - py[i];
            var r2  = ddx * ddx + ddy * ddy;

            if (r2 < 0.1) continue; // skip overlapping particles

            // FIX: Normalize force direction so gravity falls off as 1/r²
            var r    = Math.sqrt(r2);
            var nx   = ddx / r;
            var ny   = ddy / r;
            var gMul = (qi_arr[i] === qi_arr[j]) ? SAME_QUOTE_G : 1;
            var f    = G * gMul / (r2 + SOFTENING);

            ax[i] += f * nx;   ay[i] += f * ny;
            ax[j] -= f * nx;   ay[j] -= f * ny;

            // Short-range repulsion (prevents collapse)
            if (r2 < REPULSE_R * REPULSE_R) {
              var rf = -REPULSE_K / (r2 + 10);
              ax[i] += rf * nx;   ay[i] += rf * ny;
              ax[j] -= rf * nx;   ay[j] -= rf * ny;
            }
          }
        }
      }
    }

    // --- Per-particle forces: homing, cluster, centre pull, mouse ---
    for (var i = 0; i < N; i++) {
      var q = qi_arr[i];

      // Homing spring (toward readable text position)
      ax[i] += homeCur * (hx[i] - px[i]);
      ay[i] += homeCur * (hy[i] - py[i]);

      // Cluster attraction (toward own quote's centre of mass)
      ax[i] += clusterK * (comX[q] - px[i]);
      ay[i] += clusterK * (comY[q] - py[i]);

      // Weak global centre pull (prevents particles escaping to edges)
      ax[i] += CENTER_K * (midX - px[i]);
      ay[i] += CENTER_K * (midY - py[i]);

      // Mouse / touch attraction
      if (mouseDown && mouseX > 0) {
        var mdx = mouseX - px[i];
        var mdy = mouseY - py[i];
        var mr2 = mdx * mdx + mdy * mdy + 400;
        var mf  = MOUSE_FORCE / mr2;
        ax[i] += mf * mdx;
        ay[i] += mf * mdy;
      }

      // Integrate (semi-implicit Euler)
      vx[i] = (vx[i] + ax[i] * DT) * DAMPING;
      vy[i] = (vy[i] + ay[i] * DT) * DAMPING;
      px[i] += vx[i] * DT;
      py[i] += vy[i] * DT;

      // Soft boundary bounce
      if (px[i] < EDGE_PAD)     { px[i] = EDGE_PAD;     vx[i] *= BOUNCE_DAMP; }
      if (px[i] > W - EDGE_PAD) { px[i] = W - EDGE_PAD; vx[i] *= BOUNCE_DAMP; }
      if (py[i] < EDGE_PAD)     { py[i] = EDGE_PAD;     vy[i] *= BOUNCE_DAMP; }
      if (py[i] > H - EDGE_PAD) { py[i] = H - EDGE_PAD; vy[i] *= BOUNCE_DAMP; }
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  function draw() {
    var band = FX.band(canvas);
    ctx.clearRect(0, band.y0, W, band.y1 - band.y0);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    /* Characters of one quote are contiguous in layout order, so walking in
       order and only touching fill/shadow state on a change gives one state
       change per quote while keeping the draws spatially ordered. The old
       version built a fresh bucket object and N array entries every frame
       and drew them out of order. */
    if (GLOW) ctx.shadowBlur = 3;
    var last = -1;
    for (var i = 0; i < N; i++) {
      if (py[i] < band.y0 || py[i] > band.y1) continue;
      var ci = qi_arr[i] % COLORS.length;
      if (ci !== last) {
        last = ci;
        ctx.fillStyle = COLORS[ci];
        if (GLOW) ctx.shadowColor = COLORS[ci];
      }
      ctx.fillText(ch[i], px[i], py[i]);
    }

    if (GLOW) ctx.shadowBlur = 0;
  }

  /* ── Phase management ──────────────────────────────────────── */
  var PHASE_READ   = 0;
  var PHASE_DRIFT  = 1;
  var PHASE_REFORM = 2;

  var phase     = PHASE_READ;
  var phaseTime = 0;

  function updatePhase(dt) {
    phaseTime += dt;

    if (phase === PHASE_READ) {
      // Characters held perfectly readable — no gravity
      homeCur  = HOME_MAX;
      G        = 0;
      clusterK = 0;
      if (phaseTime > READ_MS) { phase = PHASE_DRIFT; phaseTime = 0; }

    } else if (phase === PHASE_DRIFT) {
      // Ease gravity in, ease homing down (but keep a floor for structure)
      var tIn = Math.min(phaseTime / DRIFT_EASE, 1);
      G        = G_BASE * tIn * tIn;
      homeCur  = HOME_MAX * (HOME_FLOOR + (1 - HOME_FLOOR) * (1 - tIn * tIn));
      clusterK = CLUSTER_K;
      if (phaseTime > DRIFT_MS) { phase = PHASE_REFORM; phaseTime = 0; }

    } else if (phase === PHASE_REFORM) {
      // Ease homing back up, gravity out
      var t = Math.min(phaseTime / REFORM_MS, 1);
      homeCur  = HOME_MAX * (HOME_FLOOR + (1 - HOME_FLOOR) * t * t);
      G        = G_BASE * (1 - t * t);
      clusterK = CLUSTER_K * (1 - t);
      if (phaseTime > REFORM_MS) { phase = PHASE_READ; phaseTime = 0; }
    }
  }

  /* ── Pointer state ─────────────────────────────────────────── */
  var mouseX    = -999;
  var mouseY    = -999;
  var mouseDown = false;

  /* ── First paint (readable) then start ─────────────────────── */
  homeCur  = HOME_MAX;
  G        = 0;
  clusterK = 0;
  draw();

  var loop = FX.loop(canvas, {
    step: function (dt) {
      updatePhase(dt);
      physics();
      return true;
    },
    draw: draw
  });

  /* ── Interaction ───────────────────────────────────────────── */
  /* Attraction was mousedown-only, so on a phone it was unreachable — the
     "drag to attract" hint described a gesture that did nothing. It is now a
     real drag, and horizontal drags are claimed while vertical ones stay with
     the page scroller. */
  function scatter() {
    for (var i = 0; i < N; i++) {
      var angle = Math.random() * Math.PI * 2;
      var mag   = SCATTER_VEL * (1 + Math.random());
      vx[i] += Math.cos(angle) * mag;
      vy[i] += Math.sin(angle) * mag;
    }
    phase     = PHASE_DRIFT;
    phaseTime = 0;
  }

  function reform() {
    phase     = PHASE_REFORM;
    phaseTime = 0;
  }

  FX.pointer(canvas, {
    onTap:       function () { scatter(); loop.play(); loop.wake(); },
    onDoubleTap: function () { reform();  loop.play(); loop.wake(); },
    onHover:     function (x, y) { mouseX = x; mouseY = y; },
    onDragStart: function (x, y) { mouseX = x; mouseY = y; mouseDown = true; loop.play(); },
    onDragMove:  function (x, y) { mouseX = x; mouseY = y; },
    onDragEnd:   function () { mouseDown = false; mouseX = -999; mouseY = -999; },
    onHoverEnd:  function () { mouseDown = false; mouseX = -999; mouseY = -999; }
  });

  FX.controls(wrap, {
    loop: loop,
    onReplay: function () { reform(); loop.wake(); },
    onRead: function () {},
    hint: {
      hover: 'drag to attract · click to scatter · double-click to reform',
      touch: 'drag sideways to attract · tap to scatter · double-tap to reform'
    }
  });

  /* ── Resize ────────────────────────────────────────────────── */
  FX.onResize(function () {
    W = wrap.clientWidth || 760;
    var r = layoutQuotes();
    sizeCanvas(r.totalH);

    // Reallocate acceleration buffers for potentially new N
    if (r.data.length !== N) {
      N      = r.data.length;
      px     = new Float32Array(N);
      py     = new Float32Array(N);
      vx     = new Float32Array(N);
      vy     = new Float32Array(N);
      hx     = new Float32Array(N);
      hy     = new Float32Array(N);
      ch     = new Array(N);
      qi_arr = new Uint8Array(N);
      ax     = new Float32Array(N);
      ay     = new Float32Array(N);

      for (var i = 0; i < N; i++) {
        var d = r.data[i];
        px[i] = hx[i] = d.hx;
        py[i] = hy[i] = d.hy;
        vx[i] = vy[i] = 0;
        ch[i] = d.ch;
        qi_arr[i] = d.qIdx;
      }
    } else {
      // Same count — just update home positions
      for (var i = 0; i < N; i++) {
        hx[i] = r.data[i].hx;
        hy[i] = r.data[i].hy;
      }
    }
    loop.wake();
  });

})();
