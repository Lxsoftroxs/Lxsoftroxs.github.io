/* poetry-life.js — Conway's Game of Life rendered with poem characters.
   The poem is laid out on a character grid, evolved through Game of Life
   generations, then morphed back into the readable poem.

   The simulation only advances a few times a second, so the render loop is
   driven by FX.loop's dirty flag rather than repainting every frame. */
(function () {
  var wrap = document.querySelector('.poetry-life[data-poem]');
  if (!wrap) return;

  if (!window.FX) { console.warn('[poetry-life] fx-runtime missing'); return; }

  var source = wrap.querySelector('.poem-source');
  var canvas = wrap.querySelector('.life-canvas');
  if (!source || !canvas) { FX.fallback(wrap, 'missing source or canvas'); return; }

  var poemText = source.innerText.trim();
  if (!poemText) { FX.fallback(wrap, 'no text'); return; }

  var ctx = canvas.getContext('2d');
  if (!ctx) { FX.fallback(wrap, 'no 2d context'); return; }

  /* ── Font & metrics ────────────────────────────────────────── */
  var GLOW     = !FX.isSmall;
  var fontSize = FX.fontSize(14);
  var font     = fontSize + 'px "Courier New", Courier, monospace';
  var lh       = Math.round(fontSize * 1.8);
  var cw       = Math.ceil(FX.charWidth(ctx, font));

  /* ── Grid ──────────────────────────────────────────────────── */
  var cols, rows, textRows, startRow, grid, original;
  var gridPath;   // grid lines as one Path2D — one stroke call instead of ~70

  var charPool = poemText.replace(/\s/g, '').split('');
  function rnd() { return charPool[Math.floor(Math.random() * charPool.length)]; }

  function emptyGrid() {
    var g = new Array(rows);
    for (var r = 0; r < rows; r++) g[r] = new Array(cols).fill(null);
    return g;
  }

  function cloneGrid(g) {
    var n = new Array(rows);
    for (var r = 0; r < rows; r++) n[r] = g[r].slice();
    return n;
  }

  function build() {
    var W = wrap.clientWidth || 760;
    cols = Math.max(10, Math.floor(W / cw));

    var lines = FX.wrapMono(poemText, cols);
    textRows  = lines.length;
    rows      = Math.max(22, textRows + 8);

    FX.sizeCanvas(canvas, ctx, cols * cw, rows * lh);

    grid = emptyGrid();
    startRow = Math.floor((rows - textRows) / 2);
    for (var i = 0; i < lines.length; i++) {
      var lt = lines[i];
      for (var j = 0; j < lt.length && j < cols; j++) {
        if (lt[j] !== ' ') grid[startRow + i][j] = lt[j];
      }
    }
    original = cloneGrid(grid);

    /* Rebuild the static grid-line geometry once per layout. */
    gridPath = new Path2D();
    for (var r = 0; r <= rows; r++) { gridPath.moveTo(0, r * lh); gridPath.lineTo(cols * cw, r * lh); }
    for (var c = 0; c <= cols; c++) { gridPath.moveTo(c * cw, 0); gridPath.lineTo(c * cw, rows * lh); }
  }

  build();

  /* ── Life rules ────────────────────────────────────────────── */
  function nb(g, r, c) {
    var n = 0;
    var r0 = r > 0 ? r - 1 : 0, r1 = r < rows - 1 ? r + 1 : rows - 1;
    var c0 = c > 0 ? c - 1 : 0, c1 = c < cols - 1 ? c + 1 : cols - 1;
    for (var nr = r0; nr <= r1; nr++) {
      var row = g[nr];
      for (var nc = c0; nc <= c1; nc++) {
        if (nr === r && nc === c) continue;
        if (row[nc]) n++;
      }
    }
    return n;
  }

  function stepLife() {
    var next = emptyGrid();
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var n = nb(grid, r, c);
        next[r][c] = grid[r][c] ? ((n === 2 || n === 3) ? grid[r][c] : null)
                                : ((n === 3) ? rnd() : null);
      }
    }
    grid = next;
  }

  function morph(progress) {
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (Math.random() < progress) grid[r][c] = original[r][c];
      }
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  var yPad = Math.round((lh - fontSize) / 2);

  function draw() {
    var cW = cols * cw;
    var band = FX.band(canvas);
    ctx.clearRect(0, band.y0, cW, band.y1 - band.y0);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, band.y0, cW, band.y1 - band.y0);
    ctx.clip();

    ctx.strokeStyle = 'rgba(102,221,255,0.025)';
    ctx.lineWidth = 0.5;
    ctx.stroke(gridPath);
    ctx.restore();

    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#6df';
    /* Set once for the whole pass rather than per glyph. */
    if (GLOW) { ctx.shadowColor = '#6df'; ctx.shadowBlur = 6; }

    /* Only the rows inside the visible slice are painted. */
    var rFrom = Math.max(0, Math.floor(band.y0 / lh));
    var rTo   = Math.min(rows - 1, Math.ceil(band.y1 / lh));
    for (var r = rFrom; r <= rTo; r++) {
      var row = grid[r];
      var y = r * lh + yPad;
      for (var c = 0; c < cols; c++) {
        if (row[c]) ctx.fillText(row[c], c * cw, y);
      }
    }
    if (GLOW) ctx.shadowBlur = 0;
  }

  /* ── State machine ─────────────────────────────────────────── */
  var PHASE_READ = 0, PHASE_EVOLVE = 1, PHASE_MORPH = 2;

  var phase       = PHASE_READ;
  var gen         = 0;
  var maxGen      = 28;
  var morphFrame  = 0;
  var morphFrames = 18;
  var elapsed     = 0;
  var stepMs      = 350;
  var readMs      = 3500;

  /* Returns false when the grid is unchanged, so FX.loop skips the repaint —
     during the 3.5s read phase that is every single frame. */
  function step(dt) {
    elapsed += dt;

    if (phase === PHASE_READ) {
      if (elapsed < readMs) return false;
      phase = PHASE_EVOLVE; gen = 0; elapsed = 0;
      return false;
    }

    if (phase === PHASE_EVOLVE) {
      if (elapsed < stepMs) return false;
      elapsed = 0;
      stepLife();
      if (++gen >= maxGen) { phase = PHASE_MORPH; morphFrame = 0; }
      return true;
    }

    if (phase === PHASE_MORPH) {
      if (elapsed < 60) return false;
      elapsed = 0;
      morphFrame++;
      var p = morphFrame / morphFrames;
      morph(p * p);
      if (morphFrame >= morphFrames) {
        grid = cloneGrid(original);
        phase = PHASE_READ;
      }
      return true;
    }
    return false;
  }

  function reset() {
    grid = cloneGrid(original);
    phase = PHASE_READ;
    elapsed = 0; gen = 0; morphFrame = 0;
  }

  draw();
  var loop = FX.loop(canvas, { step: step, draw: draw });

  /* ── Interaction ───────────────────────────────────────────── */
  /* Was: click to reset, hover to pause — the pause was unreachable on touch.
     Now a tap resets, a long press holds the current generation, and the
     control bar gives an explicit pause for everyone. */
  var heldByPress = false;

  FX.pointer(canvas, {
    onTap: function () { reset(); loop.wake(); },
    onLongPress: function () {
      heldByPress = loop.playing;
      if (heldByPress) loop.pause();
    },
    onHover: function () {},
    onHoverEnd: function () {
      if (heldByPress) { heldByPress = false; loop.play(); }
    }
  });

  FX.controls(wrap, {
    loop: loop,
    onReplay: function () { reset(); loop.wake(); },
    onRead: function () {},
    hint: {
      hover: 'click to reset · press and hold to freeze',
      touch: 'tap to reset · hold to freeze'
    }
  });

  FX.onResize(function () {
    build();
    phase = PHASE_READ;
    elapsed = 0; gen = 0;
    loop.wake();
  });
})();
