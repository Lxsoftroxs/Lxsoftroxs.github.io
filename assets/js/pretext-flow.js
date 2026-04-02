(function () {
  function createFlowObject(className, label) {
    const obj = document.createElement('div');
    obj.className = `flow-object ${className}`;
    obj.innerHTML = `<span class="flow-object-label">${label}</span>`;
    return obj;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function makeDraggable(objectEl, state) {
    let activePointer = null;
    let startX = 0;
    let startY = 0;
    let startMarginX = 0;
    let startMarginY = 0;

    objectEl.addEventListener('pointerdown', (event) => {
      activePointer = event.pointerId;
      objectEl.setPointerCapture(activePointer);
      startX = event.clientX;
      startY = event.clientY;

      const style = getComputedStyle(objectEl);
      startMarginY = parseFloat(style.marginTop) || 0;

      if (state.side === 'left') {
        startMarginX = parseFloat(style.marginLeft) || 0;
      } else {
        startMarginX = parseFloat(style.marginRight) || 0;
      }
    });

    objectEl.addEventListener('pointermove', (event) => {
      if (activePointer !== event.pointerId) return;

      const container = objectEl.closest('.post-content');
      if (!container) return;
      const containerWidth = container.clientWidth;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      const maxHorizontal = Math.max(0, containerWidth - objectEl.offsetWidth - 24);
      const nextX = clamp(startMarginX + deltaX, 0, maxHorizontal);
      const nextY = clamp(startMarginY + deltaY, 0, 1200);

      if (state.side === 'left') {
        objectEl.style.marginLeft = `${nextX}px`;
      } else {
        objectEl.style.marginRight = `${nextX}px`;
      }
      objectEl.style.marginTop = `${nextY}px`;
    });

    function stopDrag(event) {
      if (activePointer !== event.pointerId) return;
      objectEl.releasePointerCapture(activePointer);
      activePointer = null;
    }

    objectEl.addEventListener('pointerup', stopDrag);
    objectEl.addEventListener('pointercancel', stopDrag);
  }

  async function hydratePretextStatus(hintNode, contentNode) {
    if (!hintNode || !contentNode) return;
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/@chenglou/pretext/+esm');
      if (!mod || typeof mod.prepare !== 'function' || typeof mod.layout !== 'function') {
        hintNode.textContent = 'Pretext loaded with fallback mode.';
        return;
      }

      const sample = contentNode.innerText.replace(/\s+/g, ' ').trim().slice(0, 1700);
      if (!sample) {
        hintNode.textContent = 'Pretext ready.';
        return;
      }

      const prepared = mod.prepare(sample, {
        font: "17px 'Courier New', Courier, monospace",
        maxWidth: Math.max(300, Math.floor(contentNode.clientWidth || 700)),
      });

      const lines = mod.layout(prepared, {
        maxWidth: Math.max(300, Math.floor(contentNode.clientWidth || 700)),
        maxHeight: 800,
      });

      const lineCount = Array.isArray(lines) ? lines.length : 0;
      hintNode.textContent = `Pretext active • estimated ${lineCount} rendered lines in this container.`;
    } catch (error) {
      hintNode.textContent = 'Flow active. Pretext could not be loaded in this environment.';
    }
  }

  function init() {
    const content = document.querySelector('.post-content[data-flow-content]');
    const block = document.querySelector('.interactive-flow');
    if (!content || !block) return;

    const leftObject = createFlowObject('flow-object-left', 'Object A');
    const rightObject = createFlowObject('flow-object-right', 'Object B');

    content.prepend(rightObject);
    content.prepend(leftObject);

    makeDraggable(leftObject, { side: 'left' });
    makeDraggable(rightObject, { side: 'right' });

    const status = document.createElement('p');
    status.className = 'flow-status';
    status.textContent = 'Loading Pretext…';
    block.appendChild(status);

    const reset = block.querySelector('[data-flow-reset]');
    if (reset) {
      reset.addEventListener('click', () => {
        leftObject.style.marginLeft = '0px';
        rightObject.style.marginRight = '0px';
        leftObject.style.marginTop = '0px';
        rightObject.style.marginTop = '0px';
      });
    }

    hydratePretextStatus(status, content);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
