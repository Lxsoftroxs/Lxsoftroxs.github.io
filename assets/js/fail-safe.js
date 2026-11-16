/*
 * Fail-safe: when one of this site's own scripts fails to load or crashes,
 * say so on the page instead of leaving a silent blank spot, and name the
 * file in the console. Loaded first, on its own, so it keeps working when
 * something else is broken. Other sections of the page are unaffected.
 */
(function () {
  'use strict';
  var shown = false;

  function ownScript(url) {
    return typeof url === 'string' && url.indexOf(location.origin + '/assets/js/') === 0;
  }

  function notify(file, detail) {
    if (window.console) console.error('[fail-safe] ' + file + ': ' + detail);
    if (shown) return;
    shown = true;
    var show = function () {
      var box = document.createElement('div');
      box.id = 'fail-safe-notice';
      box.setAttribute('role', 'status');
      box.textContent = 'Part of this page failed to load (' + file.split('/').pop() +
        '). The rest of the page still works. Try reloading.';
      box.style.cssText = 'margin:12px auto;max-width:800px;padding:10px 14px;border:1px solid #a55;' +
        'border-radius:6px;background:#2a1414;color:#f3d6d6;font:14px/1.4 system-ui,sans-serif;text-align:center';
      var main = document.getElementById('main-content');
      if (main) main.insertBefore(box, main.firstChild); else document.body.appendChild(box);
    };
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  }

  // Capture phase: also sees <script src> elements that failed to load.
  window.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'SCRIPT' && ownScript(el.src)) {
      notify(el.src, 'file did not load');
    } else if (ownScript(e.filename)) {
      notify(e.filename, (e.message || 'error') + ' (line ' + e.lineno + ')');
    }
  }, true);

  // The mistake that broke the playable projects: code the CSP refuses to run.
  document.addEventListener('securitypolicyviolation', function (e) {
    if (window.console) {
      console.warn('[fail-safe] Content Security Policy blocked ' + (e.blockedURI || 'inline code') +
        ' (' + e.violatedDirective + '). Inline <script> and on*="" handlers do not run on this ' +
        'site: put the code in assets/js/ instead. See scripts/check_site.py.');
    }
  });
})();
