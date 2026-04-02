(function () {
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
  function lerp(a, b, t)    { return a + (b - a) * t; }

  const RADIUS       = 43;   // half of --size: 86px
  const SHAPE_MARGIN = 14;   // breathing room between circle edge and text

  function initMirrorBall(content) {
    // Required for absolute positioning of the visual object
    content.style.position = 'relative';

    // Two invisible spacer floats own the text-exclusion geometry.
    const lf = document.createElement('div');
    const rf = document.createElement('div');
    lf.setAttribute('aria-hidden', 'true');
    rf.setAttribute('aria-hidden', 'true');

    // Visible ball that follows pointer.
    const ball = document.createElement('div');
    ball.className = 'flow-mirror-ball';
    ball.setAttribute('aria-hidden', 'true');
    ball.style.cssText = 'position:absolute; float:none; shape-outside:none; margin:0; pointer-events:none;';

    // DOM order matters: spacers must be before prose.
    content.prepend(ball);
    content.prepend(rf);
    content.prepend(lf);

    let targetX = RADIUS + 20;
    let targetY = RADIUS + 20;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    function applyPosition() {
      rafId = null;

      const W = content.clientWidth;
      const H = content.scrollHeight;
      const pad = RADIUS + SHAPE_MARGIN;
      const cx = clamp(currentX, pad, W - pad);
      const cy = clamp(currentY, pad, H - pad);

      // Include shape margin in float block height so text wraps around full circle silhouette.
      const floatH = (RADIUS * 2) + (SHAPE_MARGIN * 2);
      const marginTop = Math.max(0, cy - RADIUS - SHAPE_MARGIN);

      lf.style.cssText = [
        'float:left',
        `width:${Math.max(0, cx)}px`,
        `height:${floatH}px`,
        `margin-top:${marginTop}px`,
        `shape-outside:circle(${RADIUS}px at 100% 50%)`,
        `shape-margin:${SHAPE_MARGIN}px`,
        'pointer-events:none',
      ].join(';');

      rf.style.cssText = [
        'float:right',
        `width:${Math.max(0, W - cx)}px`,
        `height:${floatH}px`,
        `margin-top:${marginTop}px`,
        `shape-outside:circle(${RADIUS}px at 0% 50%)`,
        `shape-margin:${SHAPE_MARGIN}px`,
        'pointer-events:none',
      ].join(';');

      ball.style.left = `${cx - RADIUS}px`;
      ball.style.top  = `${cy - RADIUS}px`;
    }

    function tick() {
      rafId = null;
      const W = content.clientWidth;
      const H = content.scrollHeight;
      const pad = RADIUS + SHAPE_MARGIN;

      const clampedX = clamp(targetX, pad, W - pad);
      const clampedY = clamp(targetY, pad, H - pad);

      currentX = lerp(currentX, clampedX, 0.14);
      currentY = lerp(currentY, clampedY, 0.14);
      applyPosition();

      const settled = Math.abs(currentX - clampedX) < 0.4 &&
                      Math.abs(currentY - clampedY) < 0.4;
      if (!settled) rafId = requestAnimationFrame(tick);
    }

    function schedule() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function onPointer(clientX, clientY) {
      const b = content.getBoundingClientRect();
      targetX = clientX - b.left;
      targetY = clientY - b.top + content.scrollTop;
      schedule();
    }

    content.addEventListener('mousemove', (e) => onPointer(e.clientX, e.clientY));
    content.addEventListener('touchstart', (e) => {
      if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    content.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('resize', schedule);

    applyPosition();
  }

  function init() {
    const content = document.querySelector('.post-content[data-flow-content]');
    if (!content) return;
    initMirrorBall(content);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
