/* wave-ripple.js — Characters undulate with sine waves and respond to
   tap-generated ripples that radiate outward. Text stays readable
   throughout — a gentle, ambient effect. */
(function () {
  var wrap = document.querySelector('.wave-ripple[data-wave]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[wave-ripple] fx-runtime missing'); return; }

  var source = wrap.querySelector('.wave-source');
  var canvas = wrap.querySelector('.wave-canvas');
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

  var WAVE_AMP_X  = 3;
  var WAVE_AMP_Y  = 4;
  var WAVE_FREQ_X = 0.015;
  var WAVE_FREQ_Y = 0.02;
  var WAVE_SPEED  = 0.0015;

  var RIPPLE_AMP   = 18;
  var RIPPLE_SPEED = 180;
  var RIPPLE_WIDTH = 80;
  var RIPPLE_DECAY = 0.97;
  var MAX_RIPPLES  = 8;

  var HOVER_RADIUS = 80;
  var HOVER_PUSH   = 12;

  var COLORS = ['#4df', '#6ef', '#9ff', '#6df', '#3cf', '#7af'];

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  var cw   = FX.charWidth(ctx, font);

  var W, H, N = 0;
  var hx, hy, ch, row;
  /* Per-glyph draw positions, recomputed in step() and consumed by draw(). */
  var dxArr, dyArr, colorOf;

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
        if (c !== ' ' && c !== '\t') {
          data.push({ ch: c, hx: x + cw * 0.5, hy: yOff + lh * 0.5, row: li });
        }
        x += cw;
      }
      yOff += lh;
    }
    return { data: data, totalH: yOff };
  }

  function build() {
    var r = layoutText();
    H = Math.max(400, r.totalH + 60);
    FX.sizeCanvas(canvas, ctx, W, H);

    N = r.data.length;
    hx = new Float32Array(N); hy = new Float32Array(N);
    dxArr = new Float32Array(N); dyArr = new Float32Array(N);
    colorOf = new Uint8Array(N);
    ch = new Array(N);
    row = new Uint16Array(N);

    for (var i = 0; i < N; i++) {
      hx[i]  = r.data[i].hx;
      hy[i]  = r.data[i].hy;
      ch[i]  = r.data[i].ch;
      row[i] = r.data[i].row;
    }

    return N > 0;
  }

  if (!build()) { FX.fallback(wrap, 'nothing to lay out'); return; }

  /* ── State ─────────────────────────────────────────────────── */
  var ripples = [];
  var pointerX = -999, pointerY = -999;
  var time = 0;

  function addRipple(x, y) {
    if (ripples.length >= MAX_RIPPLES) ripples.shift();
    ripples.push({ x: x, y: y, radius: 0, amp: RIPPLE_AMP });
  }

  /* ── Update ────────────────────────────────────────────────── */
  function step(dt) {
    time += dt;

    for (var ri = ripples.length - 1; ri >= 0; ri--) {
      var rip = ripples[ri];
      rip.radius += RIPPLE_SPEED * (dt / 1000);
      rip.amp *= RIPPLE_DECAY;
      if (rip.amp < 0.3) ripples.splice(ri, 1);
    }

    var nRip = ripples.length;
    var hovering = pointerX > 0;

    for (var i = 0; i < N; i++) {
      var x = hx[i], y = hy[i];

      var dx = Math.sin(x * WAVE_FREQ_X + time * WAVE_SPEED) * WAVE_AMP_X;
      var dy = Math.sin(y * WAVE_FREQ_Y + time * WAVE_SPEED * 0.7 + x * 0.01) * WAVE_AMP_Y
             + Math.sin(row[i] * 0.5 + time * WAVE_SPEED * 1.3) * WAVE_AMP_Y * 0.5;

      for (var r2 = 0; r2 < nRip; r2++) {
        var rp = ripples[r2];
        var rdx = x - rp.x, rdy = y - rp.y;
        var dist2 = rdx * rdx + rdy * rdy;

        /* Cheap reject before the square root: only glyphs near the ring
           can be displaced at all. */
        var lo = rp.radius - RIPPLE_WIDTH;
        var hi = rp.radius + RIPPLE_WIDTH;
        if (dist2 > hi * hi || (lo > 0 && dist2 < lo * lo)) continue;

        var dist = Math.sqrt(dist2);
        if (dist < 0.001) continue;
        var ringDist = Math.abs(dist - rp.radius);
        if (ringDist >= RIPPLE_WIDTH) continue;

        /* dx/dist and dy/dist are the unit vector — no atan2/cos/sin needed. */
        var eff = rp.amp * (1 - ringDist / RIPPLE_WIDTH) / dist;
        dx += rdx * eff;
        dy += rdy * eff;
      }

      if (hovering) {
        var mdx = x - pointerX, mdy = y - pointerY;
        var md2 = mdx * mdx + mdy * mdy;
        if (md2 < HOVER_RADIUS * HOVER_RADIUS && md2 > 1) {
          var md = Math.sqrt(md2);
          var pushF = (1 - md / HOVER_RADIUS) * HOVER_PUSH / md;
          dx += mdx * pushF;
          dy += mdy * pushF;
        }
      }

      dxArr[i] = x + dx;
      dyArr[i] = y + dy;

      var disp = Math.sqrt(dx * dx + dy * dy);
      var ci = (disp * 0.25) | 0;
      colorOf[i] = ci < COLORS.length ? ci : COLORS.length - 1;
    }
    return true;
  }

  /* ── Render ────────────────────────────────────────────────── */
  function draw() {
    var band = FX.band(canvas);
    ctx.clearRect(0, band.y0, W, band.y1 - band.y0);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    /* Glyphs are drawn in layout order and the fill/shadow state is only
       touched when the colour actually changes from the previous glyph.
       Grouping by colour instead looked cheaper on paper but measured
       ~3x slower: neighbouring glyphs nearly always share a colour, so the
       per-glyph assignments were already no-ops, while reordering the draws
       destroyed the spatial locality the rasteriser depends on. */
    var last = -1;
    if (GLOW) ctx.shadowBlur = 3;
    for (var i = 0; i < N; i++) {
      if (dyArr[i] < band.y0 || dyArr[i] > band.y1) continue;
      var c = colorOf[i];
      if (c !== last) {
        last = c;
        ctx.fillStyle = COLORS[c];
        if (GLOW) ctx.shadowColor = COLORS[c];
      }
      ctx.fillText(ch[i], dxArr[i], dyArr[i]);
    }
    if (GLOW) ctx.shadowBlur = 0;
  }

  /* Initial settled paint. */
  for (var i0 = 0; i0 < N; i0++) { dxArr[i0] = hx[i0]; dyArr[i0] = hy[i0]; colorOf[i0] = 0; }
  draw();

  var loop = FX.loop(canvas, { step: step, draw: draw });

  /* ── Interaction ───────────────────────────────────────────── */
  /* Ripples now come from the unified tap path, so touch and mouse behave
     identically; dragging a finger disturbs the surface the way hovering
     a mouse does. */
  FX.pointer(canvas, {
    onTap:       function (x, y) { addRipple(x, y); loop.wake(); },
    onDoubleTap: function (x, y) {
      addRipple(x, y);
      ripples.forEach(function (r) { r.amp = RIPPLE_AMP; });
      loop.wake();
    },
    onHover:     function (x, y) { pointerX = x; pointerY = y; },
    onDragStart: function (x, y) { addRipple(x, y); loop.wake(); },
    onDragMove:  function (x, y) { pointerX = x; pointerY = y; },
    onDragEnd:   function () { pointerX = -999; pointerY = -999; },
    onHoverEnd:  function () { pointerX = -999; pointerY = -999; }
  });

  FX.controls(wrap, {
    loop: loop,
    onRead: function () {},
    hint: {
      hover: 'click to send ripples · hover to disturb',
      touch: 'tap to send ripples · drag sideways to disturb'
    }
  });

  FX.onResize(function () {
    build();
    ripples.length = 0;
    loop.wake();
  });
})();
