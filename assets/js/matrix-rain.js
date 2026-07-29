/* matrix-rain.js — Matrix-style falling character rain.
   Text is readable, then characters slide down in columns like the iconic
   digital rain, then reform back into readable text. */
(function () {
  var wrap = document.querySelector('.matrix-rain[data-matrix]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[matrix-rain] fx-runtime missing'); return; }

  var source = wrap.querySelector('.matrix-source');
  var canvas = wrap.querySelector('.matrix-canvas');
  if (!source || !canvas) { FX.fallback(wrap, 'missing source or canvas'); return; }

  var allText = source.innerText.trim();
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

  var READ_MS   = 6000;
  var RAIN_MS   = 10000;
  var REFORM_MS = 3000;

  var RAIN_SPEED_MIN = 1.5;
  var RAIN_SPEED_MAX = 4.5;

  var COLOR_BRIGHT = '#aff';
  var COLOR_BODY   = '#0f8';

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  var cw   = FX.charWidth(ctx, font);

  var W, H, N = 0;
  var px, py, hx, hy, ch, rainSpeed, rainPhase;

  var charPool = allText.replace(/\s/g, '').split('');
  function rndChar() { return charPool[Math.floor(Math.random() * charPool.length)]; }

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
    hx = new Float32Array(N); hy = new Float32Array(N);
    ch = new Array(N);
    rainSpeed = new Float32Array(N);
    rainPhase = new Float32Array(N);

    for (var i = 0; i < N; i++) {
      px[i] = hx[i] = r.data[i].hx;
      py[i] = hy[i] = r.data[i].hy;
      ch[i] = r.data[i].ch;
      rainSpeed[i] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
      rainPhase[i] = Math.random();
    }
    return N > 0;
  }

  if (!build()) { FX.fallback(wrap, 'nothing to lay out'); return; }

  /* ── Phase state ───────────────────────────────────────────── */
  var PHASE_READ = 0, PHASE_RAIN = 1, PHASE_REFORM = 2;
  var phase = PHASE_READ;
  var phaseTime = 0;

  /* ── Render ────────────────────────────────────────────────── */
  function draw() {
    /* Restrict the whole pass to the on-screen slice — on a long post the
       canvas is several thousand pixels tall and only a screenful shows. */
    var band = FX.band(canvas);
    var bh = band.y1 - band.y0;

    if (phase === PHASE_RAIN) {
      /* Translucent clear leaves the trail streaks. */
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, band.y0, W, bh);
    } else {
      ctx.clearRect(0, band.y0, W, bh);
    }

    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    /* Colour and shadow are constant across the pass, so they are set once
       here instead of being reassigned on every glyph. */
    if (phase === PHASE_RAIN) {
      ctx.fillStyle = COLOR_BRIGHT;
      if (GLOW) { ctx.shadowColor = COLOR_BRIGHT; ctx.shadowBlur = 6; }
      for (var i = 0; i < N; i++) {
        if (py[i] < band.y0 || py[i] > band.y1) continue;
        ctx.fillText(Math.random() < 0.03 ? rndChar() : ch[i], px[i], py[i]);
      }
    } else {
      ctx.fillStyle = COLOR_BODY;
      if (GLOW) { ctx.shadowColor = COLOR_BODY; ctx.shadowBlur = 3; }
      for (var j = 0; j < N; j++) {
        if (py[j] < band.y0 || py[j] > band.y1) continue;
        ctx.fillText(ch[j], px[j], py[j]);
      }
    }
    if (GLOW) ctx.shadowBlur = 0;
  }

  /* ── Update ────────────────────────────────────────────────── */
  function step(dt) {
    phaseTime += dt;

    if (phase === PHASE_READ) {
      /* Characters sit at home; nothing moves, so skip the repaint entirely
         for the six seconds this phase lasts. */
      if (phaseTime > READ_MS) { phase = PHASE_RAIN; phaseTime = 0; return true; }
      return false;
    }

    if (phase === PHASE_RAIN) {
      var progress = phaseTime / RAIN_MS;
      var scale = dt / 16;
      for (var i = 0; i < N; i++) {
        if (progress - rainPhase[i] * 0.4 < 0) continue;
        py[i] += rainSpeed[i] * scale;
        if (py[i] > H + lh) py[i] = -lh;
        px[i] += (Math.random() - 0.5) * 0.3;
      }
      if (phaseTime > RAIN_MS) { phase = PHASE_REFORM; phaseTime = 0; }
      return true;
    }

    /* PHASE_REFORM */
    var t = Math.min(phaseTime / REFORM_MS, 1);
    var ease = t * t * (3 - 2 * t);
    for (var k = 0; k < N; k++) {
      px[k] += (hx[k] - px[k]) * ease * 0.15;
      py[k] += (hy[k] - py[k]) * ease * 0.15;
    }
    if (phaseTime > REFORM_MS) {
      for (var m = 0; m < N; m++) {
        px[m] = hx[m]; py[m] = hy[m];
        rainSpeed[m] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN);
        rainPhase[m] = Math.random();
      }
      phase = PHASE_READ;
      phaseTime = 0;
    }
    return true;
  }

  draw();
  var loop = FX.loop(canvas, { step: step, draw: draw });

  /* ── Interaction ───────────────────────────────────────────── */
  function startRain() {
    for (var i = 0; i < N; i++) {
      py[i] += (Math.random() - 0.3) * 40;
      rainSpeed[i] = RAIN_SPEED_MIN + Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN) * 1.5;
      rainPhase[i] = Math.random() * 0.3;
    }
    phase = PHASE_RAIN;
    phaseTime = 0;
  }

  function reform() {
    phase = PHASE_REFORM;
    phaseTime = 0;
  }

  FX.pointer(canvas, {
    onTap:       function () { startRain(); loop.wake(); },
    onDoubleTap: function () { reform();    loop.wake(); }
  });

  FX.controls(wrap, {
    loop: loop,
    onReplay: function () { startRain(); loop.wake(); },
    onRead: function () {},
    hint: {
      hover: 'click to glitch · double-click to reform',
      touch: 'tap to glitch · double-tap to reform'
    }
  });

  FX.onResize(function () {
    build();
    phase = PHASE_READ;
    phaseTime = 0;
    loop.wake();
  });
})();
