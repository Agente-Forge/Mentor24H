/* sidebar-dot.js — Sliding Dot Indicator
   IIFE isolado | zero dependências | não altera app.js
   Criterion: bolinha desliza de item a item em 300ms */
(function () {
  'use strict';

  function initDot() {
    var dot     = document.getElementById('sidebar-dot');
    var navZone = document.querySelector('.sidebar-zona-nav');
    if (!dot || !navZone) return;

    function moveDot() {
      var active = navZone.querySelector('.nav-item.active');
      if (!active) {
        dot.classList.remove('visible');
        return;
      }

      /* getBoundingClientRect é viewport-relative — correto para posição relativa
         entre dois elementos mesmo com scroll */
      var zoneRect = navZone.getBoundingClientRect();
      var itemRect = active.getBoundingClientRect();

      /* Centraliza verticalmente o dot (9px = metade de 18px) */
      var offsetY = (itemRect.top - zoneRect.top) + (itemRect.height / 2) - 9;

      /* Clamp: não deixa o dot ultrapassar os limites da zona */
      var maxOffset = navZone.offsetHeight - 18;
      offsetY = Math.max(0, Math.min(offsetY, maxOffset));

      dot.style.transform = 'translateY(' + offsetY + 'px)';
      dot.classList.add('visible');
    }

    /* Observa mudanças de classe em todos os nav-items da zona */
    var navObserver = new MutationObserver(function (mutations) {
      var changed = mutations.some(function (m) {
        return m.attributeName === 'class' &&
               m.target.classList.contains('nav-item');
      });
      if (changed) moveDot();
    });

    navZone.querySelectorAll('.nav-item').forEach(function (item) {
      navObserver.observe(item, { attributes: true, attributeFilter: ['class'] });
    });

    /* Re-posiciona ao colapsar/expandir sidebar */
    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
      new MutationObserver(function () {
        /* Pequeno delay para aguardar a transição de width */
        setTimeout(moveDot, 60);
      }).observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    /* Posição inicial */
    moveDot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDot);
  } else {
    /* DOMContentLoaded já disparou — aguarda app.js inicializar o router */
    setTimeout(initDot, 0);
  }
})();
