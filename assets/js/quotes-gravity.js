/* quotes-gravity.js — N-body gravity simulation where every letter is a
   particle.  Uses @chenglou/pretext to compute the initial character grid,
   then runs pairwise gravitational physics with spatial-hash acceleration.
   Characters scatter, orbit, cluster, then slowly reform into readable
   quotes — an endless gravitational ballet of words. */
(async function () {
  /* ── Early exit ────────────────────────────────────────────── */
  var wrap = document.querySelector('.quotes-gravity[data-quotes]');
  if (!wrap) return;

  /* ── Load pretext ──────────────────────────────────────────── */
  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) {
    console.warn('[quotes-gravity] pretext unavailable:', e);
    return;
  }

  /* ── DOM ────────────────────────────────────────────────────── */
  var source = wrap.querySelector('.quote-source');
  if (!source) return;

  var canvas = wrap.querySelector('.gravity-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  /* ── Parse quotes into separate groups ─────────────────────── */
  var quoteEls = source.querySelectorAll('p');
  var quotes = [];
  for (var qi = 0; qi < quoteEls.length; qi++) {
    var t = quoteEls[qi].innerText.trim();
    if (t) quotes.push(t);
  }
  if (!quotes.length) return;

  /* ── Neon palette — one colour per quote ───────────────────── */
  var COLORS = [
    '#6df', '#f7a', '#af6', '#d8f', '#fd6',
    '#6ff', '#fa8', '#88f', '#f88', '#8f8', '#f8d'
  ];

  /* ── Font metrics ──────────────────────────────────────────── */
  var fontSize = 13;
  var font = fontSize + 'px "Courier New", Courier, monospace';
  var lh = Math.round(fontSize * 1.7);
  ctx.font = font;
  var cw = ctx.measureText('M').width;

  /* ── Canvas sizing ─────────────────────────────────────────── */
  var dpr = window.devicePixelRatio || 1;
  var W, H;

  function sizeCanvas(textH) {
    W = wrap.clientWidth || 760;
    // If we know the text height, use it; otherwise use a default
    H = textH ? Math.max(500, textH + 40) : Math.max(500, window.innerHeight * 0.7);
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  // Initial size to get W for text layout
  sizeCanvas();

  /* ── Use pretext to layout all quotes and map characters ───── */
  var N = 0;            // total particle count
  var maxW = W - 20;    // text area width with small padding

  function layoutQuotes() {
    var data = [];
    var yOff = 20;
    maxW = W - 20;
    for (var qi = 0; qi < quotes.length; qi++) {
      var text = quotes[qi];
      var prepared = pt.prepareWithSegments(text, font, { whiteSpace: 'pre-wrap' });
      var layout = pt.layoutWithLines(prepared, maxW, lh);
      for (var li = 0; li < layout.lines.length; li++) {
        var lineText = layout.lines[li].text;
        var x = 10;
        for (var ci = 0; ci < lineText.length; ci++) {
          var ch = lineText[ci];
          if (ch !== ' ' && ch !== '\t') {
            data.push({ ch: ch, qIdx: qi, hx: x + cw * 0.5, hy: yOff + lh * 0.5 });
          }
          x += cw;
        }
        yOff += lh;
      }
      yOff += lh;   // gap between quotes
    }
    return { data: data, totalH: yOff };
  }

  var result = layoutQuotes();
  var charData = result.data;

  // Now resize canvas to fit all text
  sizeCanvas(result.totalH);

  N = charData.length;
  if (!N) return;

  /* ── Particle arrays (typed for speed) ─────────────────────── */
  var px = new Float32Array(N);   // position x
  var py = new Float32Array(N);   // position y
  var vx = new Float32Array(N);   // velocity x
  var vy = new Float32Array(N);   // velocity y
  var hx = new Float32Array(N);   // home x
  var hy = new Float32Array(N);   // home y
  var ch = new Array(N);          // character
  var qi_arr = new Uint8Array(N); // quote index

  for (var i = 0; i < N; i++) {
    var d = charData[i];
    px[i] = hx[i] = d.hx;
    py[i] = hy[i] = d.hy;
    vx[i] = vy[i] = 0;
    ch[i] = d.ch;
    qi_arr[i] = d.qIdx;
  }
  charData = null; // free

  /* ── Physics constants ─────────────────────────────────────── */
  var G           = 6000;       // gravitational constant (pairwise)
  var G_BASE      = 6000;       // base gravity (used during drift)
  var SOFTENING   = 80;       // softening term (r^2 + SOFTENING)
  var REPULSE_R   = 12;       // repulsion cutoff distance
  var REPULSE_K   = 2000;     // repulsion strength
  var DAMPING     = 0.97;     // velocity damping per frame
  var HOME_BASE   = 0;        // current homing spring constant
  var HOME_MAX    = 0.25;     // max homing spring constant (strong enough to resist gravity)
  var CLUSTER_K   = 0.15;     // attraction to own quote's center of mass
  var CENTER_K    = 0.003;    // weak pull toward canvas centre (prevents escape)
  var MOUSE_FORCE = 12000;    // mouse attraction strength
  var SCATTER_VEL = 4;        // velocity added on scatter-click
  var DT          = 0.5;      // integration timestep

  /* ── Spatial hash ──────────────────────────────────────────── */
  var CELL = 160;             // larger cells → more pairwise interactions
  var hashMap = new Map();

  function cellKey(cx, cy) { return (cx + 5000) * 10001 + (cy + 5000); }

  function buildHash() {
    hashMap.clear();
    for (var i = 0; i < N; i++) {
      var cx = Math.floor(px[i] / CELL);
      var cy = Math.floor(py[i] / CELL);
      var key = cellKey(cx, cy);
      var bucket = hashMap.get(key);
      if (!bucket) { bucket = []; hashMap.set(key, bucket); }
      bucket.push(i);
    }
  }

  /* ── Per-quote centre of mass (updated each frame) ─────────── */
  var nQuotes = quotes.length;
  var comX = new Float32Array(nQuotes);  // centre-of-mass x
  var comY = new Float32Array(nQuotes);  // centre-of-mass y
  var comN = new Uint16Array(nQuotes);   // count per quote

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

    var midX = W * 0.5, midY = H * 0.5;

    // Accumulators
    var ax = new Float32Array(N);
    var ay = new Float32Array(N);

    // Pairwise gravity + repulsion via spatial hash
    for (var i = 0; i < N; i++) {
      var cx = Math.floor(px[i] / CELL);
      var cy = Math.floor(py[i] / CELL);

      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          var bucket = hashMap.get(cellKey(cx + dx, cy + dy));
          if (!bucket) continue;

          for (var bi = 0; bi < bucket.length; bi++) {
            var j = bucket[bi];
            if (j <= i) continue;    // each pair once

            var ddx = px[j] - px[i];
            var ddy = py[j] - py[i];
            var r2  = ddx * ddx + ddy * ddy;

            // Gravity (attractive) — stronger for same-quote particles
            var gMul = (qi_arr[i] === qi_arr[j]) ? 2.5 : 1;
            var f = G * gMul / (r2 + SOFTENING);
            ax[i] += f * ddx;   ay[i] += f * ddy;
            ax[j] -= f * ddx;   ay[j] -= f * ddy;

            // Short-range repulsion (prevents collapse)
            if (r2 < REPULSE_R * REPULSE_R && r2 > 0.1) {
              var rf = -REPULSE_K / (r2 + 10);
              ax[i] += rf * ddx;   ay[i] += rf * ddy;
              ax[j] -= rf * ddx;   ay[j] -= rf * ddy;
            }
          }
        }
      }
    }

    // Per-particle forces: homing, cluster attraction, centre pull, mouse
    for (var i = 0; i < N; i++) {
      var q = qi_arr[i];

      // Homing spring (toward text position)
      ax[i] += HOME_BASE * (hx[i] - px[i]);
      ay[i] += HOME_BASE * (hy[i] - py[i]);

      // Cluster attraction (toward own quote's centre of mass)
      ax[i] += CLUSTER_K * (comX[q] - px[i]);
      ay[i] += CLUSTER_K * (comY[q] - py[i]);

      // Weak global centre pull (prevents particles escaping to edges)
      ax[i] += CENTER_K * (midX - px[i]);
      ay[i] += CENTER_K * (midY - py[i]);

      // Mouse attraction
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
      if (px[i] < 5)     { px[i] = 5;     vx[i] *= -0.5; }
      if (px[i] > W - 5) { px[i] = W - 5; vx[i] *= -0.5; }
      if (py[i] < 5)     { py[i] = 5;     vy[i] *= -0.5; }
      if (py[i] > H - 5) { py[i] = H - 5; vy[i] *= -0.5; }
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (var i = 0; i < N; i++) {
      var color = COLORS[qi_arr[i] % COLORS.length];
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      ctx.fillText(ch[i], px[i], py[i]);
    }
    ctx.shadowBlur = 0;
  }

  /* ── Phase management ──────────────────────────────────────── */
  var PHASE_READ   = 0;
  var PHASE_DRIFT  = 1;
  var PHASE_REFORM = 2;

  var phase     = PHASE_READ;
  var phaseTime = 0;
  var readMs    = 8000;    // hold readable text
  var driftMs   = 14000;   // gravitational drift (cluster + centre keep it bounded)
  var reformMs  = 5000;    // spring back to readable

  function updatePhase(dt) {
    phaseTime += dt;

    if (phase === PHASE_READ) {
      HOME_BASE = HOME_MAX;
      G = 0;                  // no gravity during read — characters stay put
      CLUSTER_K = 0;
      if (phaseTime > readMs) { phase = PHASE_DRIFT; phaseTime = 0; }
    } else if (phase === PHASE_DRIFT) {
      // Ease gravity in and homing out over 3 seconds
      var tIn = Math.min(phaseTime / 3000, 1);
      G = G_BASE * tIn * tIn;
      // Keep a meaningful homing floor so characters don't fully scatter
      HOME_BASE = HOME_MAX * (0.08 + 0.92 * (1 - tIn * tIn));
      CLUSTER_K = 0.15;
      if (phaseTime > driftMs) { phase = PHASE_REFORM; phaseTime = 0; }
    } else if (phase === PHASE_REFORM) {
      // Ease homing back in, gravity out
      var t = Math.min(phaseTime / reformMs, 1);
      HOME_BASE = HOME_MAX * (0.08 + 0.92 * t * t);
      G = G_BASE * (1 - t * t);
      CLUSTER_K = 0.15 * (1 - t);
      if (phaseTime > reformMs) { phase = PHASE_READ; phaseTime = 0; }
    }
  }

  /* ── Mouse state ───────────────────────────────────────────── */
  var mouseX = -999, mouseY = -999;
  var mouseDown = false;

  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', function () { mouseX = -999; mouseDown = false; });
  canvas.addEventListener('mousedown', function () { mouseDown = true; });
  canvas.addEventListener('mouseup', function ()   { mouseDown = false; });

  canvas.addEventListener('touchstart', function (e) {
    if (e.touches[0]) {
      var r = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - r.left;
      mouseY = e.touches[0].clientY - r.top;
      mouseDown = true;
    }
  }, { passive: true });
  canvas.addEventListener('touchmove', function (e) {
    if (e.touches[0]) {
      var r = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - r.left;
      mouseY = e.touches[0].clientY - r.top;
    }
  }, { passive: true });
  canvas.addEventListener('touchend', function () { mouseDown = false; }, { passive: true });

  /* Click → scatter burst */
  canvas.addEventListener('click', function () {
    for (var i = 0; i < N; i++) {
      var angle = Math.random() * Math.PI * 2;
      vx[i] += Math.cos(angle) * SCATTER_VEL * (1 + Math.random());
      vy[i] += Math.sin(angle) * SCATTER_VEL * (1 + Math.random());
    }
    phase = PHASE_DRIFT;
    phaseTime = 0;
  });

  /* Double-click → reform immediately */
  canvas.addEventListener('dblclick', function () {
    phase = PHASE_REFORM;
    phaseTime = 0;
  });

  /* ── Animation loop ────────────────────────────────────────── */
  var lastT = 0;

  function animate(ts) {
    var dt = lastT ? (ts - lastT) : 16;
    lastT = ts;
    if (dt > 50) dt = 50;   // cap to prevent spiral on tab-switch

    updatePhase(dt);
    physics();
    draw();

    requestAnimationFrame(animate);
  }

  /* ── First paint (readable) then go ────────────────────────── */
  HOME_BASE = HOME_MAX;
  G = 0;            // start with no gravity so text stays readable
  CLUSTER_K = 0;
  draw();
  requestAnimationFrame(animate);

  /* ── Resize ────────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Temporarily update W for layout calculation
      W = wrap.clientWidth || 760;
      var r = layoutQuotes();
      sizeCanvas(r.totalH);
      // Update home positions (particle count stays the same)
      for (var i = 0; i < N && i < r.data.length; i++) {
        hx[i] = r.data[i].hx;
        hy[i] = r.data[i].hy;
      }
    }, 300);
  });
})();
