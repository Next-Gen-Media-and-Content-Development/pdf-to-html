/* chapter.js — deferred */

(function () {
  'use strict';

  /* ── 1. KaTeX auto-render (inline \(...\) and display \[...\]) ── */
  function initKaTeX() {
    if (typeof renderMathInElement === 'undefined') return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
    });

    /* Store raw LaTeX on each rendered span for the AI Guru integration */
    document.querySelectorAll('.katex').forEach(function (el) {
      var annotation = el.querySelector('annotation[encoding="application/x-tex"]');
      if (annotation) {
        el.dataset.latex = annotation.textContent.trim();
      }
    });
  }

  /* ── 2. Zoomable images (lightbox) ── */
  function initZoom() {
    var overlay = document.createElement('div');
    overlay.id = 'img-overlay';
    overlay.style.cssText = [
      'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.82);',
      'z-index:9999;cursor:zoom-out;align-items:center;justify-content:center;',
    ].join('');
    var zImg = document.createElement('img');
    zImg.style.cssText = 'max-width:95vw;max-height:92vh;object-fit:contain;border-radius:4px;';
    overlay.appendChild(zImg);
    document.body.appendChild(overlay);

    document.querySelectorAll('img.zoomable').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        zImg.src = img.dataset.full || img.src;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    overlay.addEventListener('click', function () {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. Run on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', function () {
    initKaTeX();
    initZoom();
  });
}());
