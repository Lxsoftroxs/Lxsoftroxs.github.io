/* poetry-life.js — Conway's Game of Life rendered with poem characters.
   Uses @chenglou/pretext to lay out the poem text on a character grid,
   then evolves the grid through Game of Life generations.
   Characters scatter, form new patterns, then morph back into the
   readable poem — an endless cycle of decay and rebirth. */
(async function () {
  /* ── Early exit if no poetry element on this page ──────────── */
  var wrap = document.querySelector('.poetry-life[data-poem]');
  if (!wrap) return;

  /* ── Load pretext ──────────────────────────────────────────── */
  var pt;
  try {
    pt = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
  } catch (e) {
    console.warn('[poetry-life] pretext unavailable:', e);
    return;
  }

  /* ── DOM references ────────────────────────────────────────── */
  var source = wrap.querySelector('.poem-source');
  if (!source) return;

  var poemText = source.innerText.trim();
  if (!poemText) return;

  var canvas = wrap.querySelector('.life-canvas');
  if (!canvas) { canvas = document.createElement('canvas'); wrap.appendChild(canvas); }
  var ctx = canvas.getContext('2d');

  /* ── Font & metrics ────────────────────────────────────────── */
  var fontSize = 14;
  var font = fontSize + 'px "Courier New", Courier, monospace';
  var lh = Math.round(fontSize * 1.8);

  ctx.font = font;
  var cw = Math.ceil(ctx.measureText('M').width);

  /* ── Grid dimensions ───────────────────────────────────────── */
  var W = wrap.clientWidth || 760;
  var cols = Math.floor(W / cw);
  if (cols < 10) cols = 10;

  var prepared = pt.prepareWithSegments(poemText, font, { whiteSpace: 'pre-wrap' });
  var layout = pt.layoutWithLines(prepared, cols * cw, lh);
  var textRows = layout.lineCount;
  var minRows = Math.max(22, textRows + 8);
  var rows = minRows;

  /* ── Size canvas (retina-aware) ────────────────────────────── */
  var dpr = window.devicePixelRatio || 1;
  function sizeCanvas() {
    canvas.width  = Math.round(cols * cw * dpr);
    canvas.height = Math.round(rows * lh * dpr);
    canvas.style.width  = (cols * cw) + 'px';
    canvas.style.height = (rows * lh) + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();

  /* ── Character pool from the poem ──────────────────────────── */
  var charPool = poemText.replace(/\s/g, '').split('');
  function rnd() { return charPool[Math.floor(Math.random() * charPool.length)]; }

  /* ── Grid helpers ──────────────────────────────────────────── */
  function emptyGrid() {
    var g = new Array(rows);
    for (var r = 0; r < rows; r++) {
      g[r] = new Array(cols);
      for (var c = 0; c < cols; c++) g[r][c] = null;
    }
    return g;
  }

  function cloneGrid(g) {
    var n = new Array(rows);
    for (var r = 0; r < rows; r++) n[r] = g[r].slice();
    return n;
  }

  /* ── Place poem on the grid using pretext line layout ──────── */
  var grid = emptyGrid();
  var startRow = Math.floor((rows - textRows) / 2);

  for (var i = 0; i < layout.lines.length; i++) {
    var lt = layout.lines[i].text;
    for (var j = 0; j < lt.length && j < cols; j++) {
      if (lt[j] !== ' ') {
        grid[startRow + i][j] = lt[j];
      }
    }
  }

  var original = cloneGrid(grid);

  /* ── Count live neighbours ─────────────────────────────────── */
  function nb(g, r, c) {
    var n = 0;
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        var nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc]) n++;
      }
    }
    return n;
  }

  /* ── One Game-of-Life generation ───────────────────────────── */
  function step() {
    var next = emptyGrid();
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var n = nb(grid, r, c);
        if (grid[r][c]) {
          next[r][c] = (n === 2 || n === 3) ? grid[r][c] : null;
        } else {
          next[r][c] = (n === 3) ? rnd() : null;
        }
      }
    }
    grid = next;
  }

  /* ── Morph grid toward original (gradual reassembly) ───────── */
  function morph(progress) {
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (Math.random() < progress) {
          grid[r][c] = original[r][c];
        }
      }
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  function draw() {
    var cW = cols * cw;
    var cH = rows * lh;
    ctx.clearRect(0, 0, cW, cH);

    /* Faint grid lines */
    ctx.strokeStyle = 'rgba(102,221,255,0.025)';
    ctx.lineWidth = 0.5;
    for (var r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * lh); ctx.lineTo(cW, r * lh); ctx.stroke();
    }
    for (var c = 0; c <= cols; c++) {
      ctx.beginPath(); ctx.moveTo(c * cw, 0); ctx.lineTo(c * cw, cH); ctx.stroke();
    }

    /* Characters with glow */
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.shadowColor = '#6df';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#6df';

    var yPad = Math.round((lh - fontSize) / 2);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillText(grid[r][c], c * cw, r * lh + yPad);
        }
      }
    }
    ctx.shadowBlur = 0;
  }

  /* ── Animation state machine ───────────────────────────────── */
  var PHASE_READ    = 0;   // show readable poem
  var PHASE_EVOLVE  = 1;   // Game of Life running
  var PHASE_MORPH   = 2;   // reassembling back to poem

  var phase       = PHASE_READ;
  var gen         = 0;
  var maxGen      = 28;
  var morphFrame  = 0;
  var morphFrames = 18;
  var lastStep    = 0;
  var stepMs      = 350;   // ms between generations
  var readMs      = 3500;  // ms to hold readable text
  var paused      = false;

  function animate(ts) {
    if (!lastStep) lastStep = ts;
    var dt = ts - lastStep;

    if (!paused) {
      if (phase === PHASE_READ) {
        if (dt >= readMs) {
          phase = PHASE_EVOLVE;
          gen = 0;
          lastStep = ts;
        }
      } else if (phase === PHASE_EVOLVE) {
        if (dt >= stepMs) {
          step();
          gen++;
          lastStep = ts;
          if (gen >= maxGen) {
            phase = PHASE_MORPH;
            morphFrame = 0;
            lastStep = ts;
          }
        }
      } else if (phase === PHASE_MORPH) {
        if (dt >= 60) {             // morph at ~16 fps
          morphFrame++;
          var p = morphFrame / morphFrames;
          morph(p * p);             // ease-in curve
          lastStep = ts;
          if (morphFrame >= morphFrames) {
            grid = cloneGrid(original);   // snap to exact original
            phase = PHASE_READ;
            lastStep = ts;
          }
        }
      }
    }

    draw();
    requestAnimationFrame(animate);
  }

  /* ── First paint then start loop ───────────────────────────── */
  draw();
  requestAnimationFrame(animate);

  /* ── Interactions ──────────────────────────────────────────── */

  /* Click → instant reset to readable */
  canvas.addEventListener('click', function () {
    grid = cloneGrid(original);
    phase = PHASE_READ;
    lastStep = 0;
    gen = 0;
    morphFrame = 0;
    draw();
  });

  /* Hover → pause / resume */
  canvas.addEventListener('mouseenter', function () { paused = true; });
  canvas.addEventListener('mouseleave', function () {
    paused = false;
    lastStep = 0;     // reset timer so next phase doesn't jump
  });

  /* Resize → recalculate (simple reload approach for now) */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      W = wrap.clientWidth || 760;
      var newCols = Math.floor(W / cw);
      if (newCols !== cols && newCols >= 10) {
        cols = newCols;
        prepared = pt.prepareWithSegments(poemText, font, { whiteSpace: 'pre-wrap' });
        layout = pt.layoutWithLines(prepared, cols * cw, lh);
        textRows = layout.lineCount;
        rows = Math.max(22, textRows + 8);
        sizeCanvas();

        grid = emptyGrid();
        startRow = Math.floor((rows - textRows) / 2);
        for (var i = 0; i < layout.lines.length; i++) {
          var lt = layout.lines[i].text;
          for (var j = 0; j < lt.length && j < cols; j++) {
            if (lt[j] !== ' ') grid[startRow + i][j] = lt[j];
          }
        }
        original = cloneGrid(grid);
        phase = PHASE_READ;
        lastStep = 0;
        gen = 0;
        draw();
      }
    }, 300);
  });
})();
