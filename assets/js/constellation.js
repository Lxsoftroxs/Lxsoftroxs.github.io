/* constellation.js — Characters are stars that drift gently and form
   constellations by drawing faint lines between nearby characters.
   Stars pulse, drift, then reform into readable text. */
(async function () {

  var wrap = document.querySelector('.constellation[data-constellation]');
  if (!wrap) return;

  /* ── Device detection ──────────────────────────────────────── */
  var isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  var GLOW = isMobile ? 0 : 1;

  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) { console.warn('[constellation] pretext unavailable:', e); return; }

  var source = wrap.querySelector('.constellation-source');
  if (!source) return;
  var canvas = wrap.querySelector('.constellation-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var allText = source.innerText.trim();
  if (!allText) return;

  /* ══════════════════════════════════════════════════════════════
     CONFIGURATION
     ══════════════════════════════════════════════════════════════ */
  var FONT_SIZE   = 14;
  var FONT_FAMILY = '"Courier New", Courier, monospace';
  var LINE_HEIGHT = 1.7;
  var PADDING     = 10;

  /* Phase timing (ms) */
  var READ_MS     = 7000;
  var DRIFT_MS    = 12000;
  var REFORM_MS   = 4000;

  /* Drift physics */
  var DRIFT_VEL   = 0.3;      // max random drift velocity
  var DAMPING     = 0.995;     // very slow velocity decay
  var HOME_SPRING = 0.0;       // homing during drift (0 = free float)
  var REFORM_K    = 0.08;      // spring constant during reform

  /* Constellation lines */
  var LINE_DIST     = 60;      // max distance for a connection line
  var LINE_OPACITY  = 0.25;    // base line opacity
  var LINE_WIDTH    = 0.6;

  /* Star appearance */
  var STAR_COLORS = [
    '#fff', '#def', '#fde', '#efd', '#ffd',
    '#ddf', '#fdd', '#dff', '#fef', '#eff'
  ];
  var PULSE_SPEED   = 0.002;   // twinkle speed
  var PULSE_MIN     = 0.5;     // min brightness multiplier
  var PULSE_MAX     = 1.0;

  /* Mouse */
  var MOUSE_RADIUS  = 120;
  var MOUSE_ATTRACT = 0.02;

  /* Spatial hash for line finding */
  var CELL = 70;

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  ctx.font = font;
  var cw   = ctx.measureText('M').width;

  var dpr = window.devicePixelRatio || 1;
  var W, H;

  function sizeCanvas(textH) {
    W = wrap.clientWidth || 760;
    H = textH ? Math.max(400, textH + 40) : Math.max(400, window.innerHeight * 0.65);
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();

  /* ── Layout ────────────────────────────────────────────────── */
  var N = 0;

  function layoutText() {
    var data = [];
    var yOff = PADDING * 2;
    var maxW = W - PADDING * 2;
    var prepared = pt.prepareWithSegments(allText, font, { whiteSpace: 'pre-wrap' });
    var layout   = pt.layoutWithLines(prepared, maxW, lh);
    for (var li = 0; li < layout.lines.length; li++) {
      var lineText = layout.lines[li].text;
      var x = PADDING;
      for (var ci = 0; ci < lineText.length; ci++) {
        var ch = lineText[ci];
        if (ch !== ' ' && ch !== '\t') {
          data.push({ ch: ch, hx: x + cw * 0.5, hy: yOff + lh * 0.5 });
        }
        x += cw;
      }
      yOff += lh;
    }
    return { data: data, totalH: yOff };
  }

  var result   = layoutText();
  var charData = result.data;
  sizeCanvas(result.totalH);
  N = charData.length;
  if (!N) return;

  /* ── Particle arrays ───────────────────────────────────────── */
  var px = new Float32Array(N);
  var py = new Float32Array(N);
  var vx = new Float32Array(N);
  var vy = new Float32Array(N);
  var hx = new Float32Array(N);
  var hy = new Float32Array(N);
  var ch = new Array(N);
  var pulseOffset = new Float32Array(N);  // random phase for twinkle
  var colorIdx    = new Uint8Array(N);

  for (var i = 0; i < N; i++) {
    var d = charData[i];
    px[i] = hx[i] = d.hx;
    py[i] = hy[i] = d.hy;
    vx[i] = vy[i] = 0;
    ch[i] = d.ch;
    pulseOffset[i] = Math.random() * Math.PI * 2;
    colorIdx[i] = Math.floor(Math.random() * STAR_COLORS.length);
  }
  charData = null;

  /* ── Spatial hash for constellation lines ──────────────────── */
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

  /* ── Phase state ───────────────────────────────────────────── */
  var PHASE_READ   = 0;
  var PHASE_DRIFT  = 1;
  var PHASE_REFORM = 2;

  var phase     = PHASE_READ;
  var phaseTime = 0;

  /* ── Mouse state ───────────────────────────────────────────── */
  var mouseX = -999, mouseY = -999;

  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', function () { mouseX = -999; });

  canvas.addEventListener('touchmove', function (e) {
    if (e.touches[0]) {
      var r = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - r.left;
      mouseY = e.touches[0].clientY - r.top;
    }
  }, { passive: true });
  canvas.addEventListener('touchend', function () { mouseX = -999; }, { passive: true });

  /* ── Interactions ──────────────────────────────────────────── */
  var lastClickTime = 0;

  canvas.addEventListener('click', function (e) {
    var now = e.timeStamp || Date.now();
    if (now - lastClickTime < 350) return;
    lastClickTime = now;

    // Scatter from click point
    var r = canvas.getBoundingClientRect();
    var cx = e.clientX - r.left;
    var cy = e.clientY - r.top;
    for (var i = 0; i < N; i++) {
      var dx = px[i] - cx;
      var dy = py[i] - cy;
      var d  = Math.sqrt(dx * dx + dy * dy) + 1;
      var f  = Math.min(8 / d, 3);
      vx[i] += (dx / d) * f * (1 + Math.random());
      vy[i] += (dy / d) * f * (1 + Math.random());
    }
    phase = PHASE_DRIFT;
    phaseTime = 0;
  });

  canvas.addEventListener('dblclick', function () {
    lastClickTime = 0;
    phase = PHASE_REFORM;
    phaseTime = 0;
  });

  /* ── Update ────────────────────────────────────────────────── */
  var time = 0;

  function update(dt) {
    phaseTime += dt;
    time += dt;

    if (phase === PHASE_READ) {
      for (var i = 0; i < N; i++) {
        px[i] += (hx[i] - px[i]) * 0.1;
        py[i] += (hy[i] - py[i]) * 0.1;
        vx[i] = vy[i] = 0;
      }
      if (phaseTime > READ_MS) {
        // Give each particle a small random drift velocity
        for (var i = 0; i < N; i++) {
          vx[i] = (Math.random() - 0.5) * DRIFT_VEL * 2;
          vy[i] = (Math.random() - 0.5) * DRIFT_VEL * 2;
        }
        phase = PHASE_DRIFT;
        phaseTime = 0;
      }

    } else if (phase === PHASE_DRIFT) {
      for (var i = 0; i < N; i++) {
        // Mouse attraction
        if (mouseX > 0) {
          var mdx = mouseX - px[i];
          var mdy = mouseY - py[i];
          var md  = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < MOUSE_RADIUS && md > 1) {
            vx[i] += (mdx / md) * MOUSE_ATTRACT;
            vy[i] += (mdy / md) * MOUSE_ATTRACT;
          }
        }

        vx[i] *= DAMPING;
        vy[i] *= DAMPING;
        px[i] += vx[i];
        py[i] += vy[i];

        // Soft boundaries
        if (px[i] < 5)     { px[i] = 5;     vx[i] *= -0.5; }
        if (px[i] > W - 5) { px[i] = W - 5; vx[i] *= -0.5; }
        if (py[i] < 5)     { py[i] = 5;     vy[i] *= -0.5; }
        if (py[i] > H - 5) { py[i] = H - 5; vy[i] *= -0.5; }
      }
      if (phaseTime > DRIFT_MS) { phase = PHASE_REFORM; phaseTime = 0; }

    } else if (phase === PHASE_REFORM) {
      var t = Math.min(phaseTime / REFORM_MS, 1);
      var k = REFORM_K + t * 0.15; // increasing spring strength

      for (var i = 0; i < N; i++) {
        vx[i] += (hx[i] - px[i]) * k;
        vy[i] += (hy[i] - py[i]) * k;
        vx[i] *= 0.85;
        vy[i] *= 0.85;
        px[i] += vx[i];
        py[i] += vy[i];
      }
      if (phaseTime > REFORM_MS) {
        for (var i = 0; i < N; i++) { px[i] = hx[i]; py[i] = hy[i]; vx[i] = vy[i] = 0; }
        phase = PHASE_READ;
        phaseTime = 0;
      }
    }
  }

  /* ── Draw ──────────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Build spatial hash for line drawing
    buildHash();

    // Draw constellation lines
    ctx.lineWidth = LINE_WIDTH;
    var lineDist2 = LINE_DIST * LINE_DIST;

    for (var i = 0; i < N; i++) {
      var cx = Math.floor(px[i] / CELL);
      var cy = Math.floor(py[i] / CELL);

      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          var bucket = hashMap.get(cellKey(cx + dx, cy + dy));
          if (!bucket) continue;
          for (var bi = 0; bi < bucket.length; bi++) {
            var j = bucket[bi];
            if (j <= i) continue;
            var ddx = px[j] - px[i];
            var ddy = py[j] - py[i];
            var d2  = ddx * ddx + ddy * ddy;
            if (d2 < lineDist2 && d2 > 1) {
              var alpha = LINE_OPACITY * (1 - Math.sqrt(d2) / LINE_DIST);
              ctx.strokeStyle = 'rgba(180, 220, 255, ' + alpha + ')';
              ctx.beginPath();
              ctx.moveTo(px[i], py[i]);
              ctx.lineTo(px[j], py[j]);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Draw star characters
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (var i = 0; i < N; i++) {
      var pulse = PULSE_MIN + (PULSE_MAX - PULSE_MIN) *
                  (0.5 + 0.5 * Math.sin(time * PULSE_SPEED + pulseOffset[i]));
      var color = STAR_COLORS[colorIdx[i]];

      ctx.globalAlpha = pulse;
      ctx.fillStyle = color;
      if (GLOW) { ctx.shadowColor = color; ctx.shadowBlur = 4 * pulse; }
      ctx.fillText(ch[i], px[i], py[i]);
    }
    ctx.globalAlpha = 1;
    if (GLOW) ctx.shadowBlur = 0;
  }

  /* ── Animation loop ────────────────────────────────────────── */
  var lastT = 0;
  function animate(ts) {
    var dt = lastT ? (ts - lastT) : 16;
    lastT = ts;
    if (dt > 50) dt = 50;
    update(dt);
    draw();
    requestAnimationFrame(animate);
  }

  draw();
  requestAnimationFrame(animate);

  /* ── Resize ────────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      W = wrap.clientWidth || 760;
      var r = layoutText();
      sizeCanvas(r.totalH);
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
      phase = PHASE_READ; phaseTime = 0;
    }, 300);
  });

})();
