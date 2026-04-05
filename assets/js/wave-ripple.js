/* wave-ripple.js — Characters undulate with sine waves and
   respond to click-generated ripples that radiate outward.
   Text remains loosely readable throughout — a gentle, ambient effect. */
(async function () {

  var wrap = document.querySelector('.wave-ripple[data-wave]');
  if (!wrap) return;

  /* ── Device detection ──────────────────────────────────────── */
  var isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  var GLOW = isMobile ? 0 : 1;

  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) { console.warn('[wave-ripple] pretext unavailable:', e); return; }

  var source = wrap.querySelector('.wave-source');
  if (!source) return;
  var canvas = wrap.querySelector('.wave-canvas');
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

  /* Ambient wave */
  var WAVE_AMP_X    = 3;       // horizontal wave amplitude (px)
  var WAVE_AMP_Y    = 4;       // vertical wave amplitude (px)
  var WAVE_FREQ_X   = 0.015;   // horizontal spatial frequency
  var WAVE_FREQ_Y   = 0.02;    // vertical spatial frequency
  var WAVE_SPEED    = 0.0015;  // wave animation speed

  /* Click ripples */
  var RIPPLE_AMP    = 18;      // max ripple displacement (px)
  var RIPPLE_SPEED  = 180;     // ripple expansion speed (px/s)
  var RIPPLE_WIDTH  = 80;      // ripple ring width (px)
  var RIPPLE_DECAY  = 0.97;    // amplitude decay per frame
  var MAX_RIPPLES   = 8;

  /* Mouse hover disturbance */
  var HOVER_RADIUS  = 80;
  var HOVER_PUSH    = 12;      // push strength (px)

  /* Colours — ocean-inspired gradient */
  var COLORS = ['#4df', '#6ef', '#9ff', '#6df', '#3cf', '#7af'];

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  ctx.font = font;
  var cw   = ctx.measureText('M').width;

  var dpr = window.devicePixelRatio || 1;
  var W, H;

  function sizeCanvas(textH) {
    W = wrap.clientWidth || 760;
    H = textH ? Math.max(400, textH + 60) : Math.max(400, window.innerHeight * 0.65);
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
          data.push({ ch: ch, hx: x + cw * 0.5, hy: yOff + lh * 0.5, row: li });
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

  var hx  = new Float32Array(N);
  var hy  = new Float32Array(N);
  var ch  = new Array(N);
  var row = new Uint16Array(N);

  for (var i = 0; i < N; i++) {
    hx[i]  = charData[i].hx;
    hy[i]  = charData[i].hy;
    ch[i]  = charData[i].ch;
    row[i] = charData[i].row;
  }
  charData = null;

  /* ── Ripple state ──────────────────────────────────────────── */
  var ripples = []; // { x, y, radius, amp }

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

  /* Click → spawn ripple */
  canvas.addEventListener('click', function (e) {
    var r = canvas.getBoundingClientRect();
    var rx = e.clientX - r.left;
    var ry = e.clientY - r.top;
    if (ripples.length >= MAX_RIPPLES) ripples.shift();
    ripples.push({ x: rx, y: ry, radius: 0, amp: RIPPLE_AMP });
  });

  canvas.addEventListener('touchstart', function (e) {
    if (e.touches[0]) {
      var r = canvas.getBoundingClientRect();
      var rx = e.touches[0].clientX - r.left;
      var ry = e.touches[0].clientY - r.top;
      if (ripples.length >= MAX_RIPPLES) ripples.shift();
      ripples.push({ x: rx, y: ry, radius: 0, amp: RIPPLE_AMP });
    }
  }, { passive: true });

  /* ── Animation ─────────────────────────────────────────────── */
  var time = 0;
  var lastT = 0;

  function animate(ts) {
    var dt = lastT ? (ts - lastT) : 16;
    lastT = ts;
    if (dt > 50) dt = 50;
    time += dt;

    // Update ripples
    for (var ri = ripples.length - 1; ri >= 0; ri--) {
      var rip = ripples[ri];
      rip.radius += RIPPLE_SPEED * (dt / 1000);
      rip.amp *= RIPPLE_DECAY;
      if (rip.amp < 0.3) ripples.splice(ri, 1);
    }

    // Draw
    ctx.clearRect(0, 0, W, H);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (var i = 0; i < N; i++) {
      var x = hx[i];
      var y = hy[i];

      // Ambient wave displacement
      var waveX = Math.sin(x * WAVE_FREQ_X + time * WAVE_SPEED) * WAVE_AMP_X;
      var waveY = Math.sin(y * WAVE_FREQ_Y + time * WAVE_SPEED * 0.7 + x * 0.01) * WAVE_AMP_Y;

      // Row-based phase offset for cascading effect
      waveY += Math.sin(row[i] * 0.5 + time * WAVE_SPEED * 1.3) * WAVE_AMP_Y * 0.5;

      var dx = waveX;
      var dy = waveY;

      // Ripple displacement
      for (var ri = 0; ri < ripples.length; ri++) {
        var rip = ripples[ri];
        var rdx = x - rip.x;
        var rdy = y - rip.y;
        var dist = Math.sqrt(rdx * rdx + rdy * rdy);
        var ringDist = Math.abs(dist - rip.radius);

        if (ringDist < RIPPLE_WIDTH) {
          var rippleEffect = rip.amp * (1 - ringDist / RIPPLE_WIDTH);
          var angle = Math.atan2(rdy, rdx);
          dx += Math.cos(angle) * rippleEffect;
          dy += Math.sin(angle) * rippleEffect;
        }
      }

      // Mouse hover push
      if (mouseX > 0) {
        var mdx = x - mouseX;
        var mdy = y - mouseY;
        var md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < HOVER_RADIUS && md > 1) {
          var pushF = (1 - md / HOVER_RADIUS) * HOVER_PUSH;
          dx += (mdx / md) * pushF;
          dy += (mdy / md) * pushF;
        }
      }

      // Colour based on displacement magnitude
      var disp = Math.sqrt(dx * dx + dy * dy);
      var colorIdx = Math.min(Math.floor(disp / 4), COLORS.length - 1);

      ctx.fillStyle = COLORS[colorIdx];
      if (GLOW) { ctx.shadowColor = COLORS[colorIdx]; ctx.shadowBlur = 2 + disp * 0.3; }
      ctx.fillText(ch[i], x + dx, y + dy);
    }
    if (GLOW) ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
  }

  // Initial draw then start
  ctx.clearRect(0, 0, W, H);
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS[0];
  if (GLOW) { ctx.shadowColor = COLORS[0]; ctx.shadowBlur = 3; }
  for (var i = 0; i < N; i++) ctx.fillText(ch[i], hx[i], hy[i]);
  if (GLOW) ctx.shadowBlur = 0;

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
      hx  = new Float32Array(N);
      hy  = new Float32Array(N);
      ch  = new Array(N);
      row = new Uint16Array(N);
      for (var i = 0; i < N; i++) {
        hx[i]  = r.data[i].hx;
        hy[i]  = r.data[i].hy;
        ch[i]  = r.data[i].ch;
        row[i] = r.data[i].row;
      }
    }, 300);
  });

})();
