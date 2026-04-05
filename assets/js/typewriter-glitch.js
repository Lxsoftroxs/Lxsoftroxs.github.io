/* typewriter-glitch.js — Text appears character by character like a
   typewriter, with random "glitch" characters that cycle before settling.
   Periodically, sections of text corrupt and re-type themselves. */
(async function () {

  var wrap = document.querySelector('.typewriter-glitch[data-typewriter]');
  if (!wrap) return;

  /* ── Device detection ──────────────────────────────────────── */
  var isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  var GLOW = isMobile ? 0 : 1;

  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) { console.warn('[typewriter-glitch] pretext unavailable:', e); return; }

  var source = wrap.querySelector('.typewriter-source');
  if (!source) return;
  var canvas = wrap.querySelector('.typewriter-canvas');
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

  /* Typing speed */
  var TYPE_INTERVAL  = 25;     // ms per character typed
  var GLITCH_CYCLES  = 4;      // how many random chars before settling
  var GLITCH_SPEED   = 40;     // ms per glitch cycle
  var CURSOR_BLINK   = 500;    // cursor blink interval (ms)

  /* Phase timing (ms) */
  var HOLD_MS        = 5000;   // hold fully typed text
  var CORRUPT_MS     = 6000;   // corruption phase duration
  var RETYPE_MS      = 0;      // auto-calculated from char count

  /* Corruption */
  var CORRUPT_CHANCE = 0.15;   // fraction of chars corrupted per wave
  var CORRUPT_WAVES  = 3;      // number of corruption waves

  /* Glitch characters */
  var GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFabcdef';

  /* Colours */
  var COLOR_TYPED   = '#6df';  // settled character colour
  var COLOR_GLITCH  = '#f44';  // glitching character colour
  var COLOR_CURSOR  = '#6df';  // cursor colour
  var COLOR_CORRUPT = '#fa0';  // corrupted character colour

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

  RETYPE_MS = N * TYPE_INTERVAL + N * GLITCH_SPEED;

  var hx = new Float32Array(N);
  var hy = new Float32Array(N);
  var ch = new Array(N);

  /* Per-character state */
  var STATE_HIDDEN  = 0;
  var STATE_GLITCH  = 1;
  var STATE_TYPED   = 2;
  var STATE_CORRUPT = 3;

  var charState     = new Uint8Array(N);    // current state
  var glitchCounter = new Uint8Array(N);    // remaining glitch cycles
  var displayChar   = new Array(N);         // what to show right now

  function rndGlitch() { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]; }

  for (var i = 0; i < N; i++) {
    hx[i] = charData[i].hx;
    hy[i] = charData[i].hy;
    ch[i] = charData[i].ch;
    charState[i] = STATE_HIDDEN;
    displayChar[i] = '';
    glitchCounter[i] = 0;
  }
  charData = null;

  /* ── Phase state ───────────────────────────────────────────── */
  var PHASE_TYPE    = 0;
  var PHASE_HOLD    = 1;
  var PHASE_CORRUPT = 2;
  var PHASE_RETYPE  = 3;

  var phase      = PHASE_TYPE;
  var phaseTime  = 0;
  var typeIdx    = 0;            // next character to start typing
  var lastTypeT  = 0;            // time since last char typed
  var lastGlitch = 0;            // time since last glitch tick
  var corruptWave = 0;           // current corruption wave
  var lastCorruptT = 0;
  var cursorVisible = true;
  var lastCursorT   = 0;

  /* ── Update ────────────────────────────────────────────────── */
  function update(dt) {
    phaseTime += dt;
    lastCursorT += dt;

    // Blink cursor
    if (lastCursorT >= CURSOR_BLINK) {
      cursorVisible = !cursorVisible;
      lastCursorT = 0;
    }

    // Advance glitch counters
    lastGlitch += dt;
    if (lastGlitch >= GLITCH_SPEED) {
      lastGlitch = 0;
      for (var i = 0; i < N; i++) {
        if (charState[i] === STATE_GLITCH) {
          if (glitchCounter[i] > 0) {
            displayChar[i] = rndGlitch();
            glitchCounter[i]--;
          } else {
            charState[i] = STATE_TYPED;
            displayChar[i] = ch[i];
          }
        }
        if (charState[i] === STATE_CORRUPT) {
          if (glitchCounter[i] > 0) {
            displayChar[i] = rndGlitch();
            glitchCounter[i]--;
          } else {
            charState[i] = STATE_TYPED;
            displayChar[i] = ch[i];
          }
        }
      }
    }

    if (phase === PHASE_TYPE) {
      lastTypeT += dt;
      // Type next character(s)
      while (lastTypeT >= TYPE_INTERVAL && typeIdx < N) {
        charState[typeIdx] = STATE_GLITCH;
        glitchCounter[typeIdx] = GLITCH_CYCLES;
        displayChar[typeIdx] = rndGlitch();
        typeIdx++;
        lastTypeT -= TYPE_INTERVAL;
      }
      // All typed — wait for glitches to settle
      if (typeIdx >= N) {
        var allSettled = true;
        for (var i = 0; i < N; i++) {
          if (charState[i] !== STATE_TYPED) { allSettled = false; break; }
        }
        if (allSettled) { phase = PHASE_HOLD; phaseTime = 0; }
      }

    } else if (phase === PHASE_HOLD) {
      if (phaseTime > HOLD_MS) {
        phase = PHASE_CORRUPT;
        phaseTime = 0;
        corruptWave = 0;
        lastCorruptT = 0;
      }

    } else if (phase === PHASE_CORRUPT) {
      lastCorruptT += dt;
      var waveInterval = CORRUPT_MS / CORRUPT_WAVES;

      if (lastCorruptT >= waveInterval && corruptWave < CORRUPT_WAVES) {
        // Corrupt a random selection of characters
        for (var i = 0; i < N; i++) {
          if (Math.random() < CORRUPT_CHANCE) {
            charState[i] = STATE_CORRUPT;
            glitchCounter[i] = GLITCH_CYCLES + Math.floor(Math.random() * 4);
            displayChar[i] = rndGlitch();
          }
        }
        corruptWave++;
        lastCorruptT = 0;
      }

      if (phaseTime > CORRUPT_MS) {
        // Reset all to hidden and start retyping
        for (var i = 0; i < N; i++) {
          charState[i] = STATE_HIDDEN;
          displayChar[i] = '';
        }
        phase = PHASE_RETYPE;
        phaseTime = 0;
        typeIdx = 0;
        lastTypeT = 0;
      }

    } else if (phase === PHASE_RETYPE) {
      lastTypeT += dt;
      while (lastTypeT >= TYPE_INTERVAL && typeIdx < N) {
        charState[typeIdx] = STATE_GLITCH;
        glitchCounter[typeIdx] = GLITCH_CYCLES;
        displayChar[typeIdx] = rndGlitch();
        typeIdx++;
        lastTypeT -= TYPE_INTERVAL;
      }
      if (typeIdx >= N) {
        var allSettled = true;
        for (var i = 0; i < N; i++) {
          if (charState[i] !== STATE_TYPED) { allSettled = false; break; }
        }
        if (allSettled) { phase = PHASE_HOLD; phaseTime = 0; }
      }
    }
  }

  /* ── Draw ──────────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    var cursorX = -1, cursorY = -1;

    for (var i = 0; i < N; i++) {
      if (charState[i] === STATE_HIDDEN) continue;

      var color;
      if (charState[i] === STATE_GLITCH) {
        color = COLOR_GLITCH;
      } else if (charState[i] === STATE_CORRUPT) {
        color = COLOR_CORRUPT;
      } else {
        color = COLOR_TYPED;
      }

      ctx.fillStyle = color;
      if (GLOW) { ctx.shadowColor = color; ctx.shadowBlur = charState[i] === STATE_TYPED ? 2 : 5; }
      ctx.fillText(displayChar[i], hx[i], hy[i]);

      // Track cursor position (after last visible char)
      if (charState[i] !== STATE_HIDDEN) {
        cursorX = hx[i] + cw;
        cursorY = hy[i];
      }
    }
    if (GLOW) ctx.shadowBlur = 0;

    // Draw blinking cursor
    if ((phase === PHASE_TYPE || phase === PHASE_RETYPE) && cursorVisible && cursorX > 0) {
      ctx.fillStyle = COLOR_CURSOR;
      if (GLOW) { ctx.shadowColor = COLOR_CURSOR; ctx.shadowBlur = 4; }
      ctx.fillRect(cursorX - 1, cursorY - FONT_SIZE * 0.45, 2, FONT_SIZE * 0.9);
      if (GLOW) ctx.shadowBlur = 0;
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

  requestAnimationFrame(animate);

  /* ── Interactions ──────────────────────────────────────────── */
  var lastClickTime = 0;

  canvas.addEventListener('click', function (e) {
    var now = e.timeStamp || Date.now();
    if (now - lastClickTime < 350) return;
    lastClickTime = now;

    // Corrupt all visible characters
    for (var i = 0; i < N; i++) {
      if (charState[i] === STATE_TYPED) {
        charState[i] = STATE_CORRUPT;
        glitchCounter[i] = GLITCH_CYCLES + Math.floor(Math.random() * 6);
        displayChar[i] = rndGlitch();
      }
    }
  });

  canvas.addEventListener('dblclick', function () {
    lastClickTime = 0;
    // Instant retype
    for (var i = 0; i < N; i++) {
      charState[i] = STATE_HIDDEN;
      displayChar[i] = '';
    }
    phase = PHASE_RETYPE;
    phaseTime = 0;
    typeIdx = 0;
    lastTypeT = 0;
  });

  /* ── Resize ────────────────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      W = wrap.clientWidth || 760;
      var r = layoutText();
      sizeCanvas(r.totalH);
      N = r.data.length;
      RETYPE_MS = N * TYPE_INTERVAL + N * GLITCH_SPEED;
      hx = new Float32Array(N);
      hy = new Float32Array(N);
      ch = new Array(N);
      charState     = new Uint8Array(N);
      glitchCounter = new Uint8Array(N);
      displayChar   = new Array(N);
      for (var i = 0; i < N; i++) {
        hx[i] = r.data[i].hx;
        hy[i] = r.data[i].hy;
        ch[i] = r.data[i].ch;
        charState[i] = STATE_TYPED;
        displayChar[i] = ch[i];
      }
      phase = PHASE_HOLD;
      phaseTime = 0;
    }, 300);
  });

})();
