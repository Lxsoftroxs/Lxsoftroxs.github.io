/* fx-runtime.js — shared runtime for the canvas text effects.

   Every effect (matrix-rain, wave-ripple, typewriter-glitch, constellation,
   flame-ember, poetry-life, quotes-gravity) used to carry its own copy of the
   same scaffolding: a never-ending requestAnimationFrame loop, an uncapped
   devicePixelRatio, mouse-only click/dblclick/hover handlers, and a blocking
   `await import()` of a text-layout library from a CDN.

   This module replaces all of that. No dependencies, no network. */
(function (global) {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     Environment
     ══════════════════════════════════════════════════════════════ */

  var mqReduce = global.matchMedia('(prefers-reduced-motion: reduce)');
  var mqHover  = global.matchMedia('(hover: hover) and (pointer: fine)');

  var FX = {
    /* Live-updating — the user can flip these in OS settings mid-session. */
    get reduceMotion() { return mqReduce.matches; },
    get canHover()     { return mqHover.matches; },
    get isSmall()      { return global.innerWidth < 768; }
  };

  /* Cap the backing store. A dpr-3 phone otherwise renders 9x the pixels of a
     dpr-1 screen every frame, which is where most of the mobile cost went. */
  FX.dpr = function (max) {
    var cap = max || (FX.isSmall ? 1.75 : 2);
    return Math.min(global.devicePixelRatio || 1, cap);
  };

  /* Effects read better at a slightly larger size on a narrow screen, where the
     canvas is only ~335px wide. */
  FX.fontSize = function (base) {
    var b = base || 14;
    return FX.isSmall ? b + 2 : b;
  };

  /* ══════════════════════════════════════════════════════════════
     Monospace text layout (replaces @chenglou/pretext)

     Every effect laid text out on a fixed character grid — advancing x by a
     constant `cw` per character — so the only thing the library actually
     provided was greedy line wrapping. Doing it locally removes a blocking
     cross-origin module fetch from the critical path of each post, and with it
     the failure mode where a CDN hiccup left the post completely blank.
     ══════════════════════════════════════════════════════════════ */

  /* Greedy wrap with `white-space: pre-wrap` semantics: explicit newlines are
     preserved, runs longer than `cols` are hard-broken. */
  FX.wrapMono = function (text, cols) {
    if (cols < 1) cols = 1;
    var out = [];
    var paragraphs = String(text).replace(/\r\n?/g, '\n').split('\n');

    for (var p = 0; p < paragraphs.length; p++) {
      var para = paragraphs[p];

      if (!para.length) { out.push(''); continue; }

      /* Preserve leading indentation, then wrap the remainder. */
      var indentMatch = para.match(/^[ \t]*/);
      var indent = indentMatch ? indentMatch[0].replace(/\t/g, '    ') : '';
      if (indent.length >= cols) indent = '';

      var words = para.slice(indentMatch ? indentMatch[0].length : 0).split(/ +/);
      var line  = indent;
      var lineHasWord = false;

      for (var w = 0; w < words.length; w++) {
        var word = words[w];
        if (!word.length) continue;

        /* A single word too long for the line: hard-break it across lines. */
        while (word.length > cols) {
          if (lineHasWord) { out.push(line); line = indent; lineHasWord = false; }
          var room = cols - line.length;
          if (room < 1) { out.push(line); line = indent; room = cols - line.length; }
          out.push(line + word.slice(0, room));
          word = word.slice(room);
          line = indent;
          lineHasWord = false;
        }

        var candidate = lineHasWord ? line + ' ' + word : line + word;
        if (candidate.length <= cols) {
          line = candidate;
          lineHasWord = true;
        } else {
          out.push(line);
          line = indent + word;
          lineHasWord = true;
        }
      }
      out.push(line);
    }
    return out;
  };

  /* Monospace advance width. Measured once per font, then cached. */
  var cwCache = Object.create(null);
  FX.charWidth = function (ctx, font) {
    if (cwCache[font] === undefined) {
      var prev = ctx.font;
      ctx.font = font;
      cwCache[font] = ctx.measureText('M').width;
      ctx.font = prev;
    }
    return cwCache[font];
  };

  /* Convenience: wrap `text` to fit `maxW` pixels, returning lines + metrics. */
  FX.layout = function (ctx, text, font, maxW) {
    var cw   = FX.charWidth(ctx, font);
    var cols = Math.max(1, Math.floor(maxW / cw));
    return { lines: FX.wrapMono(text, cols), cols: cols, charWidth: cw };
  };

  /* ══════════════════════════════════════════════════════════════
     Animation loop

     Gated on three things the old loops ignored: tab visibility, whether the
     canvas is actually on screen, and whether the effect has anything new to
     draw. A post that has scrolled past now costs nothing at all.
     ══════════════════════════════════════════════════════════════ */

  /**
   * @param {HTMLCanvasElement} canvas  observed for on-screen visibility
   * @param {object} opts
   *   step(dt) -> bool   advance simulation; return false if nothing changed
   *   draw()             paint a frame
   *   fps                frame cap (default 60 desktop / 30 small screens)
   * @returns controller with .play() .pause() .toggle() .wake() .playing
   */
  FX.loop = function (canvas, opts) {
    var step = opts.step || function () { return true; };
    var draw = opts.draw;
    var fps  = opts.fps || (FX.isSmall ? 30 : 60);
    var frameBudget = 1000 / fps;

    var rafId    = 0;
    var lastTs   = 0;
    var acc      = 0;
    var wanted   = true;   // user intent: should this be animating?
    var onScreen = true;
    var visible  = !global.document.hidden;
    var dirty    = true;   // something changed and needs painting

    function running() { return wanted && onScreen && visible; }

    function frame(ts) {
      rafId = global.requestAnimationFrame(frame);

      var dt = lastTs ? ts - lastTs : frameBudget;
      lastTs = ts;
      if (dt > 100) dt = 100;   // clamp after a stall so nothing teleports

      acc += dt;
      if (acc < frameBudget) return;
      var stepDt = acc;
      acc = 0;

      var changed = step(stepDt);
      if (changed !== false) dirty = true;

      if (dirty) { draw(); dirty = false; }
    }

    function start() {
      if (rafId || !running()) return;
      lastTs = 0;
      acc = 0;
      rafId = global.requestAnimationFrame(frame);
    }

    function stop() {
      if (!rafId) return;
      global.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function sync() { running() ? start() : stop(); }

    /* Draws are culled to the visible slice of the canvas, so the picture is
       only valid for the scroll position it was painted at. While the loop is
       running the next frame covers it; while paused or settled, scrolling
       would otherwise reveal blank canvas. One repaint per scroll frame. */
    var repaintQueued = false;
    function repaintOnScroll() {
      if (repaintQueued || rafId || !visible || !onScreen) return;
      repaintQueued = true;
      global.requestAnimationFrame(function () {
        repaintQueued = false;
        if (!rafId && visible && onScreen) draw();
      });
    }
    global.addEventListener('scroll', repaintOnScroll, { passive: true });

    /* Pause when the canvas scrolls out of view. */
    if ('IntersectionObserver' in global) {
      new global.IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        sync();
      }, { rootMargin: '150px 0px' }).observe(canvas);
    }

    /* Pause in background tabs. */
    global.document.addEventListener('visibilitychange', function () {
      visible = !global.document.hidden;
      sync();
    });

    var ctl = {
      get playing() { return wanted; },
      play:   function () { wanted = true;  dirty = true; sync(); },
      pause:  function () { wanted = false; sync(); },
      toggle: function () { wanted ? ctl.pause() : ctl.play(); return wanted; },
      /* Mark the scene dirty — used for one-off repaints while paused. */
      wake:   function () {
        dirty = true;
        if (running()) start();
        else if (visible && onScreen) draw();
      }
    };

    /* Honour the OS reduced-motion setting: start settled and readable. */
    if (FX.reduceMotion) { wanted = false; draw(); }
    else start();

    return ctl;
  };

  /* ══════════════════════════════════════════════════════════════
     Unified pointer input

     The old handlers were `click` + `dblclick` + `mouseenter`/`mouseleave`.
     On a touch screen dblclick is unreliable and competes with double-tap
     zoom, and hover simply does not exist — so "hover to pause" and
     "drag to attract" were unreachable on a phone.

     Pointer Events give mouse, touch and pen one code path. Tap, double-tap,
     long-press and drag are all detected here with touch-appropriate
     thresholds, and vertical drags are always left to the page so a
     full-height canvas can never trap the scroll.
     ══════════════════════════════════════════════════════════════ */

  var DOUBLE_TAP_MS  = 320;   // gap that still counts as a double tap
  var DOUBLE_TAP_PX  = 32;    // fingers miss; allow slop between the two taps
  var LONG_PRESS_MS  = 450;
  var TAP_SLOP_PX    = 12;    // movement beyond this is a drag, not a tap
  var DRAG_LOCK_PX   = 10;    // movement before we commit to an axis

  /**
   * @param {Element} el
   * @param {object} handlers  onTap, onDoubleTap, onLongPress,
   *                           onDragStart, onDragMove, onDragEnd,
   *                           onHover, onHoverEnd  (all (x, y) in element space)
   * @param {object} [opts]    { allowVerticalDrag: false }
   */
  FX.pointer = function (el, handlers, opts) {
    opts = opts || {};
    var h = handlers || {};

    /* `manipulation` removes the legacy 300ms tap delay and stops the browser
       swallowing our double-tap as a zoom gesture. `pan-y` keeps vertical
       scrolling with the page while we take horizontal drags. */
    el.style.touchAction = opts.allowVerticalDrag ? 'none' : 'pan-y';

    var active   = null;   // pointerId currently tracked
    var startX = 0, startY = 0, startT = 0;
    var lastTapX = 0, lastTapY = 0, lastTapT = 0;
    var dragging = false;
    var axisLocked = false;
    var cancelled  = false;
    var longPressTimer = 0;

    function pos(e) {
      var r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function clearLongPress() {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = 0; }
    }

    el.addEventListener('pointerdown', function (e) {
      if (active !== null) return;             // ignore additional fingers
      active = e.pointerId;
      var p = pos(e);
      startX = p.x; startY = p.y; startT = e.timeStamp;
      dragging = false; axisLocked = false; cancelled = false;

      if (h.onLongPress) {
        clearLongPress();
        longPressTimer = setTimeout(function () {
          longPressTimer = 0;
          if (active === null || dragging) return;
          cancelled = true;                    // long press consumes the tap
          h.onLongPress(startX, startY);
        }, LONG_PRESS_MS);
      }
    });

    el.addEventListener('pointermove', function (e) {
      var p = pos(e);

      /* Hover feedback for mice; touch drives this through the drag path. */
      if (active === null) {
        if (h.onHover && e.pointerType === 'mouse') h.onHover(p.x, p.y);
        return;
      }
      if (e.pointerId !== active) return;

      var dx = p.x - startX;
      var dy = p.y - startY;

      if (!dragging) {
        if (Math.abs(dx) < TAP_SLOP_PX && Math.abs(dy) < TAP_SLOP_PX) return;

        /* Decide once whether this gesture belongs to us or to the scroller. */
        if (!axisLocked && e.pointerType !== 'mouse' && !opts.allowVerticalDrag) {
          axisLocked = true;
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > DRAG_LOCK_PX) {
            active = null; clearLongPress();   // vertical: let the page scroll
            return;
          }
        }
        dragging = true;
        cancelled = true;                       // a drag is never also a tap
        clearLongPress();
        if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (err) {} }
        if (h.onDragStart) h.onDragStart(startX, startY);
      }

      if (h.onDragMove) h.onDragMove(p.x, p.y);
      else if (h.onHover) h.onHover(p.x, p.y);
    });

    function finish(e) {
      if (e.pointerId !== active) return;
      var p = pos(e);
      clearLongPress();

      if (dragging) {
        if (h.onDragEnd) h.onDragEnd(p.x, p.y);
        if (h.onHoverEnd) h.onHoverEnd();
      } else if (!cancelled) {
        var near = Math.abs(p.x - lastTapX) < DOUBLE_TAP_PX &&
                   Math.abs(p.y - lastTapY) < DOUBLE_TAP_PX;

        if (h.onDoubleTap && near && e.timeStamp - lastTapT < DOUBLE_TAP_MS) {
          lastTapT = 0;                         // consume; no triple-fire
          h.onDoubleTap(p.x, p.y);
        } else {
          lastTapX = p.x; lastTapY = p.y; lastTapT = e.timeStamp;

          /* Wait out the double-tap window before committing to a single tap,
             so a double tap does not also fire the single-tap action. */
          if (h.onTap) {
            if (h.onDoubleTap) {
              var tx = p.x, ty = p.y, stamp = e.timeStamp;
              setTimeout(function () {
                if (lastTapT === stamp) h.onTap(tx, ty);
              }, DOUBLE_TAP_MS);
            } else {
              h.onTap(p.x, p.y);
            }
          }
        }
        if (e.pointerType !== 'mouse' && h.onHoverEnd) h.onHoverEnd();
      }
      active = null;
      dragging = false;
    }

    el.addEventListener('pointerup', finish);
    el.addEventListener('pointercancel', function (e) {
      if (e.pointerId !== active) return;
      clearLongPress();
      if (dragging && h.onDragEnd) h.onDragEnd(startX, startY);
      if (h.onHoverEnd) h.onHoverEnd();
      active = null; dragging = false;
    });
    el.addEventListener('pointerleave', function (e) {
      if (active === null && h.onHoverEnd && e.pointerType === 'mouse') h.onHoverEnd();
    });

    /* Suppress the browser's synthetic context menu on long press. */
    if (h.onLongPress) {
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     Controls

     The hints ("hover to attract", "drag to attract", "double-click to
     reform") described gestures that do not exist on a touch screen, and
     there was no way at all to stop an effect and just read the text.
     These are real buttons: reachable, discoverable, and keyboard-operable.
     ══════════════════════════════════════════════════════════════ */

  /**
   * @param {Element} wrap    effect container
   * @param {object} cfg
   *   loop      the FX.loop controller
   *   onReplay  optional — restarts the effect from the top
   *   onRead    optional — called with (readable:boolean) when the user
   *             toggles the plain-text view
   *   hint      { hover: string, touch: string } gesture description
   */
  FX.controls = function (wrap, cfg) {
    /* Reaching here means the effect initialised successfully, which is the
       signal the stylesheet uses to hide the plain-text copy. Until it lands,
       the readable text is what shows — so a script error, a blocked script
       or JavaScript being off entirely leaves the post readable instead of
       blank. */
    wrap.classList.add('fx-active');

    var hintEl = wrap.querySelector('[data-fx-hint]');
    var bar = global.document.createElement('div');
    bar.className = 'fx-controls';

    function button(label, aria) {
      var b = global.document.createElement('button');
      b.type = 'button';
      b.className = 'fx-btn';
      b.textContent = label;
      b.setAttribute('aria-label', aria || label);
      bar.appendChild(b);
      return b;
    }

    var playBtn = button('Pause', 'Pause animation');
    playBtn.addEventListener('click', function () {
      var playing = cfg.loop.toggle();
      playBtn.textContent = playing ? 'Pause' : 'Play';
      playBtn.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    });

    if (cfg.onReplay) {
      button('Replay', 'Replay animation').addEventListener('click', function () {
        cfg.onReplay();
        if (!cfg.loop.playing) {
          cfg.loop.play();
          playBtn.textContent = 'Pause';
        }
      });
    }

    if (cfg.onRead) {
      var readBtn = button('Read as text', 'Show the post as plain readable text');
      var readable = false;
      readBtn.addEventListener('click', function () {
        readable = !readable;
        wrap.classList.toggle('fx-readable', readable);
        readBtn.textContent = readable ? 'Show effect' : 'Read as text';
        readBtn.setAttribute('aria-pressed', String(readable));
        readable ? cfg.loop.pause() : cfg.loop.play();
        playBtn.textContent = cfg.loop.playing ? 'Pause' : 'Play';
        cfg.onRead(readable);
      });
    }

    /* Reflect the starting state, which reduced-motion may have set to paused. */
    if (!cfg.loop.playing) playBtn.textContent = 'Play';

    if (cfg.hint) {
      var text = FX.canHover ? cfg.hint.hover : cfg.hint.touch;
      if (hintEl) hintEl.textContent = text;
    }

    if (hintEl && hintEl.parentNode) hintEl.parentNode.insertBefore(bar, hintEl);
    else wrap.appendChild(bar);

    return { bar: bar, playButton: playBtn };
  };

  /* ══════════════════════════════════════════════════════════════
     Failure fallback

     The source text is visually hidden so the canvas can be the only visible
     copy. If an effect cannot start, that hidden copy has to come back —
     otherwise the post renders as nothing at all.
     ══════════════════════════════════════════════════════════════ */
  FX.fallback = function (wrap, reason) {
    if (reason) console.warn('[fx] falling back to plain text:', reason);
    wrap.classList.add('fx-fallback');
    var canvas = wrap.querySelector('canvas');
    if (canvas) canvas.remove();
    var hint = wrap.querySelector('[data-fx-hint]');
    if (hint) hint.remove();
  };

  /* Debounced resize, shared so seven effects do not each ship their own. */
  FX.onResize = function (fn, delay) {
    var t;
    var w = global.innerWidth;
    global.addEventListener('resize', function () {
      /* Mobile browsers fire resize when the URL bar hides; width is the only
         dimension the layouts actually depend on. */
      if (global.innerWidth === w) return;
      w = global.innerWidth;
      clearTimeout(t);
      t = setTimeout(fn, delay || 250);
    });
  };

  /* ══════════════════════════════════════════════════════════════
     Viewport culling

     These canvases are as tall as the post — 5700px is normal for a long
     one — but only a screenful is ever visible. Painting the whole thing
     every frame meant most of the work went to pixels nobody could see.

     Returns the visible slice of the canvas in its own CSS pixel space,
     padded so glyphs drifting in from just off-screen still appear.
     ══════════════════════════════════════════════════════════════ */
  FX.band = function (canvas, margin) {
    var pad = margin === undefined ? 120 : margin;
    var r = canvas.getBoundingClientRect();
    var h = r.height || canvas.height || 0;

    /* A viewport height of zero is reachable — a prerendered page (this site
       ships Speculation Rules), a display:none ancestor, a zero-size frame.
       Culling to nothing there would paint a blank canvas, so fall back to
       drawing everything and let the next real frame narrow it down. */
    var vh = global.innerHeight ||
             (global.document.documentElement && global.document.documentElement.clientHeight) || 0;
    if (!vh || !h) return { y0: 0, y1: h };

    var y0 = -r.top - pad;
    var y1 = -r.top + vh + pad;
    if (y0 < 0) y0 = 0;
    if (y1 > h) y1 = h;
    if (y1 <= y0) return { y0: 0, y1: h };
    return { y0: y0, y1: y1 };
  };

  /* Effects call this instead of hand-rolling canvas sizing. */
  FX.sizeCanvas = function (canvas, ctx, cssW, cssH) {
    var dpr = FX.dpr();
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width  = cssW + 'px';
    canvas.style.height = cssH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  global.FX = FX;
})(window);
