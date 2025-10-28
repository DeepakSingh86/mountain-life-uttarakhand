/* public/anti-inspect.js -- best-effort client hardening (not foolproof) */
(function(){
  'use strict';
  try {
    const noop = function(){};
    const methods = ['log','debug','info','warn','error','table','trace','group','groupCollapsed','groupEnd'];
    window.console = window.console || {};
    methods.forEach(m => { window.console[m] = noop; });
  } catch(e) {}

  window.addEventListener('contextmenu', e => e.preventDefault());

  window.addEventListener('keydown', function(e){
    if (e.key === 'F12') { e.preventDefault(); e.stopPropagation(); }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) { e.preventDefault(); e.stopPropagation(); }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'S' || e.key === 'P')) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  let devtoolsOpen = false;
  const threshold = 160;
  setInterval(function(){
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        // Optional action: do nothing by default.
      }
    } else {
      devtoolsOpen = false;
    }
  }, 1000);
})();