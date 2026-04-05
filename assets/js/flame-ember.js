/* flame-ember.js — Characters rise like glowing embers from a fire.
   Text is readable, then characters lift off with turbulent motion,
   glow warm colours, and slowly drift back down to reform. */
(async function () {

  var wrap = document.querySelector('.flame-ember[data-flame]');
  if (!wrap) return;

  /* ── Device detection ──────────────────────────────────────── */
  var isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  var GLOW = isMobile ? 0 : 1;

  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) { console.warn('[flame-ember] pretext unavailable:', e); return; }

  var source = wrap.querySelector('.flame-source');
  if (!source) return;
  var canvas = wrap.querySelector('.flame-canvas');
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
  var READ_MS     = 6000;
  var BURN_MS     = 12000;
  var REFORM_MS   = 4000;

  /* Ember physics */
  var RISE_SPEED   = -0.8;    // base upward velocity (negative = up)
  var RISE_RAND    = 0.5;     // random variation in rise speed
  var TURBULENCE   = 0.4;     // horizontal wobble strength
  var TURB_FREQ    = 0.003;   // turbulence frequency
  var DAMPING      = 0.99;
  var HEAT_PUSH    = 0.3;     // acceleration from "heat" below

  /* Warm colour palette (bottom=white → orange → red → dim red at top) */
  var FLAME_COLORS = [
    { r: 255, g: 255, b: 200 },  // white-hot
    { r: 255, g: 220, b: 100 },  // bright yellow
    { r: 255, g: 160, b: 40  },  // orange
    { r: 255, g: 90,  b: 20  },  // deep orange
    { r: 220, g: 40,  b: 10  },  // red
    { r: 160, g: 20,  b: 20  },  // dim red
  ];

  /* Mouse — blow embers away */
  var BLOW_RADIUS = 100;
  var BLOW_FORCE  = 2;

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
  var emberDelay  = new Float32Array(N);  // stagger: when each ember ignites
  var turbPhase   = new Float32Array(N);  // random turbulence phase

  for (var i = 0; i < N; i++) {
    var d = charData[i];
    px[i] = hx[i] = d.hx;
    py[i] = hy[i] = d.hy;
    vx[i] = vy[i] = 0;
    ch[i] = d.ch;
    emberDelay[i] = Math.random() * 0.5;
    turbPhase[i]  = Math.random() * Math.PI * 2;
  }
  charData = null;

  /* ── Colour helper ─────────────────────────────────────────── */
  function getFlameColor(heightRatio) {
    // heightRatio: 0 = bottom (hot), 1 = top (cool)
    var t = Math.min(Math.max(heightRatio, 0), 1) * (FLAME_COLORS.length - 1);
    var idx = Math.floor(t);
    var frac = t - idx;
    if (idx >= FLAME_COLORS.length - 1) return FLAME_COLORS[FLAME_COLORS.length - 1];
    var a = FLAME_COLORS[idx];
    var b = FLAME_COLORS[idx + 1];
    return {
      r: Math.round(a.r + (b.r - a.r) * frac),
      g: Math.round(a.g + (b.g - a.g) * frac),
      b: Math.round(a.b + (b.b - a.b) * frac)
    };
  }

  /* ── Phase state ───────────────────────────────────────────── */
  var PHASE_READ   = 0;
  var PHASE_BURN   = 1;
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

    // Ignite: burst all embers upward
    for (var i = 0; i < N; i++) {
      vy[i] = RISE_SPEED * (2 + Math.random() * 3);
      vx[i] = (Math.random() - 0.5) * 3;
      emberDelay[i] = Math.random() * 0.2;
    }
    phase = PHASE_BURN;
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
        // Ignite from bottom — lower characters start first
        for (var i = 0; i < N; i++) {
          emberDelay[i] = (hy[i] / H) * 0.5; // bottom chars ignite first (inverted)
          emberDelay[i] = (1 - emberDelay[i]) * 0.5;
        }
        phase = PHASE_BURN;
        phaseTime = 0;
      }

    } else if (phase === PHASE_BURN) {
      var progress = phaseTime / BURN_MS;

      for (var i = 0; i < N; i++) {
        var localT = progress - emberDelay[i];
        if (localT < 0) {
          // Not yet ignited — hold position
          px[i] += (hx[i] - px[i]) * 0.1;
          py[i] += (hy[i] - py[i]) * 0.1;
          continue;
        }

        // Rise
        vy[i] += RISE_SPEED * (dt / 1000) - HEAT_PUSH * (dt / 1000) * (1 - py[i] / H);

        // Turbulence (sine-based wobble)
        var turb = Math.sin(time * TURB_FREQ + turbPhase[i]) * TURBULENCE;
        vx[i] += turb * (dt / 16);

        // Mouse — blow embers
        if (mouseX > 0) {
          var mdx = px[i] - mouseX;
          var mdy = py[i] - mouseY;
          var md  = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < BLOW_RADIUS && md > 1) {
            var bf = BLOW_FORCE * (1 - md / BLOW_RADIUS);
            vx[i] += (mdx / md) * bf;
            vy[i] += (mdy / md) * bf;
          }
        }

        vx[i] *= DAMPING;
        vy[i] *= DAMPING;
        px[i] += vx[i];
        py[i] += vy[i];

        // Wrap vertically: ember that rises off top reappears at bottom
        if (py[i] < -lh) {
          py[i] = H + lh;
          vx[i] = (Math.random() - 0.5) * 0.5;
          vy[i] = RISE_SPEED * (0.5 + Math.random());
        }

        // Horizontal bounds
        if (px[i] < 0) px[i] = 0;
        if (px[i] > W) px[i] = W;
      }

      if (phaseTime > BURN_MS) { phase = PHASE_REFORM; phaseTime = 0; }

    } else if (phase === PHASE_REFORM) {
      var t = Math.min(phaseTime / REFORM_MS, 1);
      var k = 0.04 + t * 0.18;

      for (var i = 0; i < N; i++) {
        vx[i] += (hx[i] - px[i]) * k;
        vy[i] += (hy[i] - py[i]) * k;
        vx[i] *= 0.82;
        vy[i] *= 0.82;
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
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (var i = 0; i < N; i++) {
      var heightRatio;
      if (phase === PHASE_BURN) {
        // Colour based on height: bottom = hot white, top = dim red
        heightRatio = 1 - (py[i] / H);
      } else if (phase === PHASE_REFORM) {
        // Cooling down: transition toward warm orange
        var t = Math.min(phaseTime / REFORM_MS, 1);
        heightRatio = (1 - (py[i] / H)) * (1 - t) + 0.3 * t;
      } else {
        heightRatio = 0.3; // warm orange during read
      }

      var fc = getFlameColor(heightRatio);
      var color = 'rgb(' + fc.r + ',' + fc.g + ',' + fc.b + ')';

      ctx.fillStyle = color;
      if (GLOW) { ctx.shadowColor = color; ctx.shadowBlur = phase === PHASE_BURN ? 6 : 3; }
      ctx.fillText(ch[i], px[i], py[i]);
    }
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
      emberDelay = new Float32Array(N);
      turbPhase  = new Float32Array(N);
      for (var i = 0; i < N; i++) {
        px[i] = hx[i] = r.data[i].hx;
        py[i] = hy[i] = r.data[i].hy;
        vx[i] = vy[i] = 0;
        ch[i] = r.data[i].ch;
        emberDelay[i] = Math.random() * 0.5;
        turbPhase[i]  = Math.random() * Math.PI * 2;
      }
      phase = PHASE_READ; phaseTime = 0;
    }, 300);
  });

})();
