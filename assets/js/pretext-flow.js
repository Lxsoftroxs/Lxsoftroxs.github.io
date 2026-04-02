(function () {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function initMirrorBall(content) {
    const mirrorBall = document.createElement('div');
    mirrorBall.className = 'flow-mirror-ball';
    mirrorBall.setAttribute('aria-hidden', 'true');

    content.prepend(mirrorBall);

    let targetX = 16;
    let targetY = 10;
    let rafPending = false;

    function applyPosition() {
      rafPending = false;
      const maxX = Math.max(0, content.clientWidth - mirrorBall.offsetWidth - 8);
      const maxY = Math.max(0, content.scrollHeight - mirrorBall.offsetHeight);

      mirrorBall.style.marginLeft = `${clamp(targetX, 0, maxX)}px`;
      mirrorBall.style.marginTop = `${clamp(targetY, 0, maxY)}px`;
    }

    function schedulePosition() {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(applyPosition);
    }

    content.addEventListener('mousemove', (event) => {
      const bounds = content.getBoundingClientRect();
      targetX = event.clientX - bounds.left - mirrorBall.offsetWidth / 2;
      targetY = event.clientY - bounds.top - mirrorBall.offsetHeight / 2;
      schedulePosition();
    });

    content.addEventListener('touchmove', (event) => {
      if (!event.touches[0]) return;
      const touch = event.touches[0];
      const bounds = content.getBoundingClientRect();
      targetX = touch.clientX - bounds.left - mirrorBall.offsetWidth / 2;
      targetY = touch.clientY - bounds.top - mirrorBall.offsetHeight / 2;
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
