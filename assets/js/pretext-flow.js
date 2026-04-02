(function () {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function initMirrorBall(content) {
    const mirrorBall = document.createElement('div');
    mirrorBall.className = 'flow-mirror-ball';
    mirrorBall.setAttribute('aria-hidden', 'true');

    content.prepend(mirrorBall);

    let targetX = 16;
    let targetY = 10;
    let currentX = 16;
    let currentY = 10;
    let rafId = null;

    function applyPosition() {
      rafId = null;
      const maxX = Math.max(0, content.clientWidth - mirrorBall.offsetWidth - 8);
      const maxY = Math.max(0, content.scrollHeight - mirrorBall.offsetHeight);

      const clampedX = clamp(targetX, 0, maxX);
      const clampedY = clamp(targetY, 0, maxY);

      // Lerp toward target for smooth following
      currentX = lerp(currentX, clampedX, 0.15);
      currentY = lerp(currentY, clampedY, 0.15);

      mirrorBall.style.marginLeft = `${currentX}px`;
      mirrorBall.style.marginTop  = `${currentY}px`;

      // Keep animating until settled
      const settled = Math.abs(currentX - clampedX) < 0.5 && Math.abs(currentY - clampedY) < 0.5;
      if (!settled) {
        rafId = window.requestAnimationFrame(applyPosition);
      }
    }

    function schedulePosition() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(applyPosition);
    }

    content.addEventListener('mousemove', (event) => {
      const bounds = content.getBoundingClientRect();
      targetX = event.clientX - bounds.left - mirrorBall.offsetWidth / 2;
      targetY = event.clientY - bounds.top  - mirrorBall.offsetHeight / 2;
      schedulePosition();
    });

    content.addEventListener('touchmove', (event) => {
      if (!event.touches[0]) return;
      const touch = event.touches[0];
      const bounds = content.getBoundingClientRect();
      targetX = touch.clientX - bounds.left - mirrorBall.offsetWidth / 2;
      targetY = touch.clientY - bounds.top  - mirrorBall.offsetHeight / 2;
      schedulePosition();
    }, { passive: true });

    content.addEventListener('touchstart', (event) => {
      if (!event.touches[0]) return;
      const touch = event.touches[0];
      const bounds = content.getBoundingClientRect();
      targetX = touch.clientX - bounds.left - mirrorBall.offsetWidth / 2;
      targetY = touch.clientY - bounds.top  - mirrorBall.offsetHeight / 2;
      schedulePosition();
    }, { passive: true });

    window.addEventListener('resize', schedulePosition);
    schedulePosition();
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
