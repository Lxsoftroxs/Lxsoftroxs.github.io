/* typewriter-glitch.js — Text appears character by character like a
   typewriter, with random "glitch" characters that cycle before settling.

   The corruption pass used to repeat forever, so a long post never held
   still long enough to read. It now types in, corrupts once, retypes, and
   then settles; further corruption is on demand via tap or Replay. */
(function () {
  var wrap = document.querySelector('.typewriter-glitch[data-typewriter]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[typewriter-glitch] fx-runtime missing'); return; }

  var source = wrap.querySelector('.typewriter-source');
  var canvas = wrap.querySelector('.typewriter-canvas');
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

  var TYPE_INTERVAL = 25;
  var GLITCH_CYCLES = 4;
  var GLITCH_SPEED  = 40;
  var CURSOR_BLINK  = 500;

  var HOLD_MS    = 5000;
  var CORRUPT_MS = 6000;

  var CORRUPT_CHANCE = 0.15;
  var CORRUPT_WAVES  = 3;

  var GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFabcdef';

  var COLOR_TYPED   = '#6df';
  var COLOR_GLITCH  = '#f44';
  var COLOR_CURSOR  = '#6df';
  var COLOR_CORRUPT = '#fa0';

  /* ══════════════════════════════════════════════════════════════ */

  var font = FONT_SIZE + 'px ' + FONT_FAMILY;
  var lh   = Math.round(FONT_SIZE * LINE_HEIGHT);
  var cw   = FX.charWidth(ctx, font);

  var W, H, N = 0;
  var hx, hy, ch, charState, glitchCounter, displayChar;

  var STATE_HIDDEN = 0, STATE_GLITCH = 1, STATE_TYPED = 2, STATE_CORRUPT = 3;

  function rndGlitch() { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]; }

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

  function build(settled) {
    var r = layoutText();
    H = Math.max(400, r.totalH + 40);
    FX.sizeCanvas(canvas, ctx, W, H);

    N = r.data.length;
    hx = new Float32Array(N); hy = new Float32Array(N);
    ch = new Array(N);
    charState = new Uint8Array(N);
    glitchCounter = new Uint8Array(N);
    displayChar = new Array(N);

    for (var i = 0; i < N; i++) {
      hx[i] = r.data[i].hx;
      hy[i] = r.data[i].hy;
      ch[i] = r.data[i].ch;
      charState[i] = settled ? STATE_TYPED : STATE_HIDDEN;
      displayChar[i] = settled ? ch[i] : '';
      glitchCounter[i] = 0;
    }
    return N > 0;
  }

  if (!build(false)) { FX.fallback(wrap, 'nothing to lay out'); return; }

  /* ── Phase state ───────────────────────────────────────────── */
  var PHASE_TYPE = 0, PHASE_HOLD = 1, PHASE_CORRUPT = 2, PHASE_RETYPE = 3, PHASE_SETTLED = 4;

  var phase = PHASE_TYPE;
  var phaseTime = 0;
  var typeIdx = 0;
  var lastTypeT = 0;
  var lastGlitch = 0;
  var corruptWave = 0;
  var lastCorruptT = 0;
  var cursorVisible = true;
  var lastCursorT = 0;
  var pending = 0;        // characters still mid-glitch
  var cycles = 0;         // completed corrupt/retype cycles
  var MAX_CYCLES = 1;     // then settle and stay readable

  function settleAll() {
    for (var i = 0; i < N; i++) {
      charState[i] = STATE_TYPED;
      displayChar[i] = ch[i];
      glitchCounter[i] = 0;
    }
    pending = 0;
    phase = PHASE_SETTLED;
    phaseTime = 0;
  }

  function restart() {
    for (var i = 0; i < N; i++) {
      charState[i] = STATE_HIDDEN;
      displayChar[i] = '';
      glitchCounter[i] = 0;
    }
    pending = 0;
    cycles = 0;
    phase = PHASE_TYPE;
    phaseTime = 0;
    typeIdx = 0;
    lastTypeT = 0;
  }

  function corruptAll() {
    for (var i = 0; i < N; i++) {
      if (charState[i] === STATE_TYPED) {
        charState[i] = STATE_CORRUPT;
        glitchCounter[i] = GLITCH_CYCLES + Math.floor(Math.random() * 6);
        displayChar[i] = rndGlitch();
        pending++;
      }
    }
    phase = PHASE_CORRUPT;
    phaseTime = 0;
    corruptWave = CORRUPT_WAVES;   // manual corruption: skip the auto waves
    lastCorruptT = 0;
  }

  /* ── Update ────────────────────────────────────────────────── */
  function step(dt) {
    /* Once settled nothing changes until the reader asks for it — the whole
       point of the rewrite, and it also means zero repaints while reading. */
    if (phase === PHASE_SETTLED) return false;

    phaseTime += dt;
    lastCursorT += dt;

    var changed = false;

    if (lastCursorT >= CURSOR_BLINK) {
      cursorVisible = !cursorVisible;
      lastCursorT = 0;
      if (phase === PHASE_TYPE || phase === PHASE_RETYPE) changed = true;
    }

    /* Advance glitch counters. `pending` tracks how many characters are still
       cycling so the settle check is O(1) instead of an O(N) scan per frame. */
    lastGlitch += dt;
    if (lastGlitch >= GLITCH_SPEED && pending > 0) {
      lastGlitch = 0;
      changed = true;
      for (var i = 0; i < N; i++) {
        var s = charState[i];
        if (s !== STATE_GLITCH && s !== STATE_CORRUPT) continue;
        if (glitchCounter[i] > 0) {
          displayChar[i] = rndGlitch();
          glitchCounter[i]--;
        } else {
          charState[i] = STATE_TYPED;
          displayChar[i] = ch[i];
          pending--;
        }
      }
    }

    if (phase === PHASE_TYPE || phase === PHASE_RETYPE) {
      lastTypeT += dt;
      while (lastTypeT >= TYPE_INTERVAL && typeIdx < N) {
        charState[typeIdx] = STATE_GLITCH;
        glitchCounter[typeIdx] = GLITCH_CYCLES;
        displayChar[typeIdx] = rndGlitch();
        pending++;
        typeIdx++;
        lastTypeT -= TYPE_INTERVAL;
        changed = true;
      }
      if (typeIdx >= N && pending === 0) {
        phase = PHASE_HOLD;
        phaseTime = 0;
        changed = true;
      }

    } else if (phase === PHASE_HOLD) {
      if (phaseTime > HOLD_MS) {
        if (cycles >= MAX_CYCLES) { settleAll(); return true; }
        phase = PHASE_CORRUPT;
        phaseTime = 0;
        corruptWave = 0;
        lastCorruptT = 0;
        changed = true;
      }

    } else if (phase === PHASE_CORRUPT) {
      lastCorruptT += dt;
      if (lastCorruptT >= CORRUPT_MS / CORRUPT_WAVES && corruptWave < CORRUPT_WAVES) {
        for (var j = 0; j < N; j++) {
          if (charState[j] === STATE_TYPED && Math.random() < CORRUPT_CHANCE) {
            charState[j] = STATE_CORRUPT;
            glitchCounter[j] = GLITCH_CYCLES + Math.floor(Math.random() * 4);
            displayChar[j] = rndGlitch();
            pending++;
          }
        }
        corruptWave++;
        lastCorruptT = 0;
        changed = true;
      }
      if (phaseTime > CORRUPT_MS) {
        for (var k = 0; k < N; k++) { charState[k] = STATE_HIDDEN; displayChar[k] = ''; }
        pending = 0;
        cycles++;
        phase = PHASE_RETYPE;
        phaseTime = 0;
        typeIdx = 0;
        lastTypeT = 0;
        changed = true;
      }
    }

    return changed;
  }

  /* ── Draw ──────────────────────────────────────────────────── */
  var STATE_COLOR = [null, COLOR_GLITCH, COLOR_TYPED, COLOR_CORRUPT];
  var STATE_BLUR  = [0, 5, 2, 5];

  function draw() {
    /* Only the on-screen slice is cleared and repainted. Rows outside it keep
       whatever they had; they are cleared when they scroll back into the
       band, so what the reader sees is always correct. */
    var band = FX.band(canvas);
    ctx.clearRect(0, band.y0, W, band.y1 - band.y0);
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    /* Characters are drawn in reading order — the vast majority share the
       settled state, so the fill/shadow state changes only at the handful of
       boundaries where a glyph is mid-glitch. */
    var cursorX = -1, cursorY = -1;
    var last = -1;
    for (var i = 0; i < N; i++) {
      var s = charState[i];
      if (s === STATE_HIDDEN) continue;
      cursorX = hx[i] + cw;
      cursorY = hy[i];
      if (hy[i] < band.y0 || hy[i] > band.y1) continue;
      if (s !== last) {
        last = s;
        ctx.fillStyle = STATE_COLOR[s];
        if (GLOW) { ctx.shadowColor = STATE_COLOR[s]; ctx.shadowBlur = STATE_BLUR[s]; }
      }
      ctx.fillText(displayChar[i], hx[i], hy[i]);
    }
    if (GLOW) ctx.shadowBlur = 0;

    if ((phase === PHASE_TYPE || phase === PHASE_RETYPE) && cursorVisible && cursorX > 0) {
      ctx.fillStyle = COLOR_CURSOR;
      if (GLOW) { ctx.shadowColor = COLOR_CURSOR; ctx.shadowBlur = 4; }
      ctx.fillRect(cursorX - 1, cursorY - FONT_SIZE * 0.45, 2, FONT_SIZE * 0.9);
      if (GLOW) ctx.shadowBlur = 0;
    }
  }

  /* Reduced motion means never run the typing animation at all. */
  if (FX.reduceMotion) settleAll();
  draw();

  var loop = FX.loop(canvas, { step: step, draw: draw });

  /* ── Interaction ───────────────────────────────────────────── */
  FX.pointer(canvas, {
    onTap:       function () { corruptAll(); loop.play(); loop.wake(); },
    onDoubleTap: function () { restart();    loop.play(); loop.wake(); }
  });

  FX.controls(wrap, {
    loop: loop,
    onReplay: function () { restart(); loop.wake(); },
    onRead: function () {},
    hint: {
      hover: 'click to corrupt · double-click to retype',
      touch: 'tap to corrupt · double-tap to retype'
    }
  });

  FX.onResize(function () {
    /* Rebuild settled so a rotation never dumps the reader back into typing. */
    build(true);
    phase = PHASE_SETTLED;
    phaseTime = 0;
    loop.wake();
  });
})();
