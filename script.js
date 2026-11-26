'use strict';

// (a) Reveal de entrada: elementos .reveal ganham .is-visible quando entram na tela.
//     O CSS só esconde .reveal quando <html> tem a classe "js" E o usuário não pediu
//     menos movimento — sem JS (ou sem IntersectionObserver) tudo fica visível.
//     Sem scroll-jacking, sem pinning: só observa, nunca mexe na rolagem.
(function reveal() {
  var reduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzido || !('IntersectionObserver' in window)) return;

  var alvos = document.querySelectorAll('.reveal');
  if (!alvos.length) return;

  var observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      observer.unobserve(entrada.target); // cada elemento anima uma vez só
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  document.documentElement.classList.add('js');
  alvos.forEach(function (el) { observer.observe(el); });
})();

// (b) Galeria (#fotos): ler fotos.json (caminho relativo) e montar a grade com filtros
//     por categoria. Imagens com loading="lazy" e alt.
