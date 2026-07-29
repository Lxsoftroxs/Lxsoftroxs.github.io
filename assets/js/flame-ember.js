/* flame-ember.js — Characters ignite and rise as embers on turbulent heat,
   then cool and settle back into readable text. */
(function () {
  var wrap = document.querySelector('.flame-ember[data-flame]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[flame-ember] fx-runtime missing'); return; }

  var source = wrap.querySelector('.flame-source');
  var canvas = wrap.querySelector('.flame-canvas');
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

  var READ_MS   = 6000;
  var BURN_MS   = 12000;
  var REFORM_MS = 4000;

  var RISE_SPEED = -0.8;
  var TURBULENCE = 0.4;
  var TURB_FREQ  = 0.003;
  var DAMPING    = 0.99;
  var HEAT_PUSH  = 0.3;

  var FLAME_COLORS = [
    { r: 255, g: 255, b: 200 },
    { r: 255, g: 220, b: 100 },
    { r: 255, g: 160, b: 40  },
    { r: 255, g: 90,  b: 20  },
    { r: 220, g: 40,  b: 10  },
    { r: 160, g: 20,  b: 20  }
  ];

  var BLOW_RADIUS = 100;
  var BLOW_FORCE  = 2;

  /* The palette is quantised into fixed steps and the rgb() strings are built
     once at startup. The old draw loop interpolated a colour object and
     concatenated a new string for every character on every frame. */
  var SHADES = 24;
  var SHADE_STR = new Array(SHADES);
  (function bakePalette() {
    for (var s = 0; s < SHADES; s++) {
      var t = (s / (SHADES - 1)) * (FLAME_COLORS.length - 1);
      var i = Math.floor(t);
      var frac = t - i;
      var a = FLAME_COLORS[i];
      var b = FLAME_COLORS[Math.min(i + 1, FLAME_COLORS.length - 1)];
      SHADE_STR[s] = 'rgb(' + Math.round(a.r + (b.r - a.r) * frac) + ',' +
                              Math.round(a.g + (b.g - a.g) * frac) + ',' +
                              Math.round(a.b + (b.b - a.b) * frac) + ')';
    }
  })();

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  var cw   = FX.charWidth(ctx, font);

  var W, H, N = 0;
  var px, py, vx, vy, hx, hy, ch, emberDelay, turbPhase, shadeOf;

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
    emberDelay = new Float32Array(N);
    turbPhase  = new Float32Array(N);
    shadeOf    = new Uint8Array(N);

    for (var i = 0; i < N; i++) {
      px[i] = hx[i] = r.data[i].hx;
      py[i] = hy[i] = r.data[i].hy;
      vx[i] = vy[i] = 0;
      ch[i] = r.data[i].ch;
      emberDelay[i] = Math.random() * 0.5;
      turbPhase[i]  = Math.random() * Math.PI * 2;
    }
    return N > 0;
  }

  if (!build()) { FX.fallback(wrap, 'nothing to lay out'); return; }

  /* ── State ─────────────────────────────────────────────────── */
  var PHASE_READ = 0, PHASE_BURN = 1, PHASE_REFORM = 2;
  var phase = PHASE_READ;
  var phaseTime = 0;
  var time = 0;
  var pointerX = -999, pointerY = -999;

  function shadeFor(ratio) {
    var s = (ratio * (SHADES - 1) + 0.5) | 0;
    return s < 0 ? 0 : (s >= SHADES ? SHADES - 1 : s);
  }

  /* ── Update ────────────────────────────────────────────────── */
  function step(dt) {
    phaseTime += dt;
    time += dt;

    if (phase === PHASE_READ) {
      var moving = false;
      for (var i = 0; i < N; i++) {
        var ddx = hx[i] - px[i], ddy = hy[i] - py[i];
        if (ddx * ddx + ddy * ddy > 0.01) moving = true;
        px[i] += ddx * 0.1;
        py[i] += ddy * 0.1;
        vx[i] = vy[i] = 0;
        shadeOf[i] = shadeFor(0.3);
      }
      if (phaseTime > READ_MS) {
        for (var j = 0; j < N; j++) emberDelay[j] = (1 - (hy[j] / H) * 0.5) * 0.5;
        phase = PHASE_BURN;
        phaseTime = 0;
        return true;
      }
      /* Settled and warm — nothing to repaint. */
      return moving;
    }

    if (phase === PHASE_BURN) {
      var progress = phaseTime / BURN_MS;
      var dts = dt / 1000;
      var dtf = dt / 16;
      var blowing = pointerX > 0;

      for (var k = 0; k < N; k++) {
        if (progress - emberDelay[k] < 0) {
          px[k] += (hx[k] - px[k]) * 0.1;
          py[k] += (hy[k] - py[k]) * 0.1;
          shadeOf[k] = shadeFor(1 - py[k] / H);
          continue;
        }

        vy[k] += RISE_SPEED * dts - HEAT_PUSH * dts * (1 - py[k] / H);
        vx[k] += Math.sin(time * TURB_FREQ + turbPhase[k]) * TURBULENCE * dtf;

        if (blowing) {
          var mdx = px[k] - pointerX, mdy = py[k] - pointerY;
          var md2 = mdx * mdx + mdy * mdy;
          if (md2 < BLOW_RADIUS * BLOW_RADIUS && md2 > 1) {
            var md = Math.sqrt(md2);
            var bf = BLOW_FORCE * (1 - md / BLOW_RADIUS) / md;
            vx[k] += mdx * bf;
            vy[k] += mdy * bf;
          }
        }

        vx[k] *= DAMPING; vy[k] *= DAMPING;
        px[k] += vx[k];   py[k] += vy[k];

        if (py[k] < -lh) {
          py[k] = H + lh;
          vx[k] = (Math.random() - 0.5) * 0.5;
          vy[k] = RISE_SPEED * (0.5 + Math.random());
        }
        if (px[k] < 0) px[k] = 0;
        if (px[k] > W) px[k] = W;

        shadeOf[k] = shadeFor(1 - py[k] / H);
      }

      if (phaseTime > BURN_MS) { phase = PHASE_REFORM; phaseTime = 0; }
      return true;
    }

    /* PHASE_REFORM */
    var t = Math.min(phaseTime / REFORM_MS, 1);
    var kk = 0.04 + t * 0.18;
    for (var m = 0; m < N; m++) {
      vx[m] += (hx[m] - px[m]) * kk;
      vy[m] += (hy[m] - py[m]) * kk;
      vx[m] *= 0.82; vy[m] *= 0.82;
      px[m] += vx[m]; py[m] += vy[m];
      shadeOf[m] = shadeFor((1 - py[m] / H) * (1 - t) + 0.3 * t);
    }
    if (phaseTime > REFORM_MS) {
      for (var n = 0; n < N; n++) { px[n] = hx[n]; py[n] = hy[n]; vx[n] = vy[n] = 0; }
      phase = PHASE_READ;
      phaseTime = 0;
    }
    return true;
  }

  /* ── Draw ──────────────────────────────────────────────────── */
  function draw() {
    var band = FX.band(canvas);
    ctx.clearRect(0, band.y0, W, band.y1 - band.y0);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    /* Drawn in layout order, changing colour state only when the quantised
       shade actually changes. Grouping by shade instead reorders the draws
       and measures slower — see the note in wave-ripple.js. */
    var blur = phase === PHASE_BURN ? 6 : 3;
    if (GLOW) ctx.shadowBlur = blur;
    var last = -1;
    for (var i = 0; i < N; i++) {
      if (py[i] < band.y0 || py[i] > band.y1) continue;
      var s = shadeOf[i];
      if (s !== last) {
        last = s;
        ctx.fillStyle = SHADE_STR[s];
        if (GLOW) ctx.shadowColor = SHADE_STR[s];
      }
      ctx.fillText(ch[i], px[i], py[i]);
    }
    if (GLOW) ctx.shadowBlur = 0;
  }

  for (var i0 = 0; i0 < N; i0++) shadeOf[i0] = shadeFor(0.3);
  draw();

  var loop = FX.loop(canvas, { step: step, draw: draw });

  /* ── Interaction ───────────────────────────────────────────── */
  function ignite() {
    for (var i = 0; i < N; i++) {
      vy[i] = RISE_SPEED * (2 + Math.random() * 3);
      vx[i] = (Math.random() - 0.5) * 3;
      emberDelay[i] = Math.random() * 0.2;
    }
    phase = PHASE_BURN;
    phaseTime = 0;
  }

  function reform() { phase = PHASE_REFORM; phaseTime = 0; }

  /* Blowing on the embers is a drag now, so it works with a finger. */
  FX.pointer(canvas, {
    onTap:       function () { ignite(); loop.play(); loop.wake(); },
    onDoubleTap: function () { reform(); loop.play(); loop.wake(); },
    onHover:     function (x, y) { pointerX = x; pointerY = y; },
    onDragStart: function (x, y) { pointerX = x; pointerY = y; loop.play(); },
    onDragMove:  function (x, y) { pointerX = x; pointerY = y; },
    onDragEnd:   function () { pointerX = -999; pointerY = -999; },
    onHoverEnd:  function () { pointerX = -999; pointerY = -999; }
  });

  FX.controls(wrap, {
    loop: loop,
    onReplay: function () { ignite(); loop.wake(); },
    onRead: function () {},
    hint: {
      hover: 'click to ignite · hover to blow · double-click to reform',
      touch: 'tap to ignite · drag sideways to blow · double-tap to reform'
    }
  });

  FX.onResize(function () {
    build();
    phase = PHASE_READ;
    phaseTime = 0;
    loop.wake();
  });
})();
