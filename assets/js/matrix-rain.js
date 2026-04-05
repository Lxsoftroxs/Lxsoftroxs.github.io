/* matrix-rain.js — Matrix-style falling character rain.
   Text is readable, then characters slide down in columns like
   the iconic Matrix digital rain, then reform back into readable text. */
(async function () {

  var wrap = document.querySelector('.matrix-rain[data-matrix]');
  if (!wrap) return;

  /* ── Device detection ──────────────────────────────────────── */
  var isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  var GLOW = isMobile ? 0 : 1;  // disable shadowBlur on mobile

  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) { console.warn('[matrix-rain] pretext unavailable:', e); return; }

  var source = wrap.querySelector('.matrix-source');
  if (!source) return;
  var canvas = wrap.querySelector('.matrix-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  /* ── Parse text ────────────────────────────────────────────── */
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
  var READ_MS     = 6000;
  var RAIN_MS     = 10000;
  var REFORM_MS   = 3000;

  /* Rain settings */
  var RAIN_SPEED_MIN = 1.5;
  var RAIN_SPEED_MAX = 4.5;
  var TRAIL_LENGTH   = 8;     // number of trailing afterimages
  var TRAIL_FADE     = 0.12;  // opacity step per trail char

  /* Colours */
  var COLOR_BRIGHT = '#aff';  // lead character
  var COLOR_BODY   = '#0f8';  // main rain green
  var COLOR_DIM    = '#052';  // trail fade

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

  /* ── Layout text with pretext ──────────────────────────────── */
  var N = 0;
  var maxW = W - PADDING * 2;

  function layoutText() {
    var data = [];
    var yOff = PADDING * 2;
    maxW = W - PADDING * 2;
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
  var hx = new Float32Array(N);
  var hy = new Float32Array(N);
  var ch = new Array(N);
  var rainSpeed = new Float32Array(N);  // per-character fall speed
  var rainPhase = new Float32Array(N);  // stagger start (0-1)

  var charPool = allText.replace(/\s/g, '').split('');
  function rndChar() { return charPool[Math.floor(Math.random() * charPool.length)]; }

  for (var i = 0; i < N; i++) {
    var d = charData[i];
    px[i] = hx[i] = d.hx;
    py[i] = hy[i] = d.hy;
    ch[i] = d.ch;
    rainSpeed[i] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
    rainPhase[i] = Math.random();
  }
  charData = null;

  /* ── Phase state ───────────────────────────────────────────── */
  var PHASE_READ   = 0;
  var PHASE_RAIN   = 1;
  var PHASE_REFORM = 2;

  var phase     = PHASE_READ;
  var phaseTime = 0;

  /* ── Render ────────────────────────────────────────────────── */
  function draw() {
    // Translucent clear for trail effect during rain
    if (phase === PHASE_RAIN) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.clearRect(0, 0, W, H);
    }

    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (var i = 0; i < N; i++) {
      if (phase === PHASE_RAIN) {
        // Rain characters cycle through random glyphs
        var displayChar = (Math.random() < 0.03) ? rndChar() : ch[i];

        // Lead character — bright
        ctx.fillStyle = COLOR_BRIGHT;
        if (GLOW) { ctx.shadowColor = COLOR_BRIGHT; ctx.shadowBlur = 6; }
        ctx.fillText(displayChar, px[i], py[i]);
        if (GLOW) ctx.shadowBlur = 0;
      } else {
        // Read / reform — steady cyan glow
        ctx.fillStyle = COLOR_BODY;
        if (GLOW) { ctx.shadowColor = COLOR_BODY; ctx.shadowBlur = 3; }
        ctx.fillText(ch[i], px[i], py[i]);
        if (GLOW) ctx.shadowBlur = 0;
      }
    }
  }

  /* ── Update ────────────────────────────────────────────────── */
  function update(dt) {
    phaseTime += dt;

    if (phase === PHASE_READ) {
      // Characters at home positions
      for (var i = 0; i < N; i++) {
        px[i] = hx[i];
        py[i] = hy[i];
      }
      if (phaseTime > READ_MS) { phase = PHASE_RAIN; phaseTime = 0; }

    } else if (phase === PHASE_RAIN) {
      var progress = phaseTime / RAIN_MS;

      for (var i = 0; i < N; i++) {
        // Stagger: each character starts falling at a different time
        var localT = progress - rainPhase[i] * 0.4;
        if (localT < 0) continue;

        // Fall downward, wrap around
        py[i] += rainSpeed[i] * (dt / 16);
        if (py[i] > H + lh) {
          py[i] = -lh;
        }

        // Slight horizontal wobble
        px[i] += (Math.random() - 0.5) * 0.3;
      }

      if (phaseTime > RAIN_MS) { phase = PHASE_REFORM; phaseTime = 0; }

    } else if (phase === PHASE_REFORM) {
      var t = Math.min(phaseTime / REFORM_MS, 1);
      var ease = t * t * (3 - 2 * t); // smoothstep

      for (var i = 0; i < N; i++) {
        // Lerp back to home position
        px[i] += (hx[i] - px[i]) * ease * 0.15;
        py[i] += (hy[i] - py[i]) * ease * 0.15;
      }

      if (phaseTime > REFORM_MS) {
        // Snap to home
        for (var i = 0; i < N; i++) { px[i] = hx[i]; py[i] = hy[i]; }
        phase = PHASE_READ;
        phaseTime = 0;
        // Re-randomize rain params for variety
        for (var i = 0; i < N; i++) {
          rainSpeed[i] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
          rainPhase[i] = Math.random();
        }
      }
    }
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

  /* ── Interactions ───────────────────────────────────────────── */
  var lastClickTime = 0;

  canvas.addEventListener('click', function (e) {
    var now = e.timeStamp || Date.now();
    if (now - lastClickTime < 350) return;
    lastClickTime = now;

    // Glitch: randomize positions slightly and start rain
    for (var i = 0; i < N; i++) {
      py[i] += (Math.random() - 0.3) * 40;
      rainSpeed[i] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN) * 1.5;
      rainPhase[i] = Math.random() * 0.3;
    }
    phase = PHASE_RAIN;
    phaseTime = 0;
  });

  canvas.addEventListener('dblclick', function () {
    lastClickTime = 0;
    phase = PHASE_REFORM;
    phaseTime = 0;
  });

  /* ── Resize ────────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      W = wrap.clientWidth || 760;
      var r = layoutText();
      sizeCanvas(r.totalH);
      if (r.data.length !== N) {
        N = r.data.length;
        px = new Float32Array(N);
        py = new Float32Array(N);
        hx = new Float32Array(N);
        hy = new Float32Array(N);
        ch = new Array(N);
        rainSpeed = new Float32Array(N);
        rainPhase = new Float32Array(N);
      }
      for (var i = 0; i < N && i < r.data.length; i++) {
        px[i] = hx[i] = r.data[i].hx;
        py[i] = hy[i] = r.data[i].hy;
        ch[i] = r.data[i].ch;
        rainSpeed[i] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
        rainPhase[i] = Math.random();
      }
      phase = PHASE_READ;
      phaseTime = 0;
    }, 300);
  });

})();
