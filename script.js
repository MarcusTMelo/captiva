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

// (b) Galeria (#fotos): a grade já vem inteira no HTML (gerada a partir de fotos.json).
//     Sem JS: 76 miniaturas, cada uma abre a AVIF grande direto.
//     Com JS: filtros, "Mostrar mais" em lotes e visualizador em <dialog>.
(function galeria() {
  var secao = document.getElementById('fotos');
  if (!secao) return;

  var itens = Array.prototype.slice.call(secao.querySelectorAll('.galeria__item'));
  var filtros = secao.querySelector('.fotos__filtros');
  var botoesFiltro = Array.prototype.slice.call(secao.querySelectorAll('.filtro'));
  var anuncio = secao.querySelector('[data-anuncio]');
  var botaoMais = secao.querySelector('[data-mais]');
  var restantesEl = secao.querySelector('[data-restantes]');
  if (!itens.length || !filtros || !botaoMais) return;

  var celular = window.matchMedia('(max-width: 51.999rem)');
  var filtroAtivo = 'todas';
  var ativos = itens;   // itens do filtro ativo, na ordem da grade
  var mostrando = 0;    // quantos do filtro ativo estão visíveis

  function lote() { return celular.matches ? 12 : 24; }
  function doFiltro(f) {
    return f === 'todas' ? itens : itens.filter(function (li) { return li.dataset.cat === f; });
  }

  // Contagens dos botões sempre conferidas com a grade real
  secao.querySelectorAll('[data-conta]').forEach(function (el) {
    el.textContent = doFiltro(el.dataset.conta).length;
  });

  function mostrarAte(n) {
    mostrando = Math.min(n, ativos.length);
    itens.forEach(function (li) { li.hidden = true; });
    for (var i = 0; i < mostrando; i++) ativos[i].hidden = false;
    var restantes = ativos.length - mostrando;
    botaoMais.hidden = restantes <= 0;
    restantesEl.textContent = restantes;
  }

  function aplicarFiltro(f, anunciar) {
    filtroAtivo = f;
    ativos = doFiltro(f);
    botoesFiltro.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filtro === f));
    });
    mostrarAte(lote()); // trocar de filtro reinicia a contagem
    if (anunciar) anuncio.textContent = 'Mostrando ' + ativos.length + ' fotos';
  }

  botoesFiltro.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.filtro !== filtroAtivo) aplicarFiltro(b.dataset.filtro, true);
    });
  });

  botaoMais.addEventListener('click', function () {
    var primeiroNovo = mostrando;
    mostrarAte(mostrando + lote());
    // foco vai para a primeira foto nova (o botão pode ter sumido)
    var alvo = ativos[primeiroNovo] && ativos[primeiroNovo].querySelector('a');
    if (alvo) alvo.focus();
  });

  filtros.hidden = false;
  aplicarFiltro('todas', false);

  // (c) Visualizador
  var dialogo = secao.querySelector('.visualizador');
  if (!dialogo || typeof dialogo.showModal !== 'function') return; // sem <dialog>: link abre a foto

  var foto = dialogo.querySelector('[data-foto]');
  var contador = dialogo.querySelector('[data-contador]');
  var palco = dialogo.querySelector('[data-palco]');
  var atual = 0;
  var preCarga = null;

  function linkDe(i) { return ativos[i].querySelector('a'); }

  function exibir(i) {
    atual = (i + ativos.length) % ativos.length;
    var a = linkDe(atual);
    var mini = a.querySelector('img');
    foto.removeAttribute('src'); // não mostra a foto anterior enquanto a nova carrega
    foto.width = Number(a.dataset.largura);
    foto.height = Number(a.dataset.altura);
    foto.alt = mini.alt;
    foto.style.backgroundImage = 'url("' + mini.getAttribute('src') + '")';
    foto.src = a.getAttribute('href');
    contador.textContent = (atual + 1) + ' / ' + ativos.length;
    // pré-carrega só a próxima
    if (ativos.length > 1) {
      preCarga = new Image();
      preCarga.src = linkDe((atual + 1) % ativos.length).getAttribute('href');
    }
  }

  function abrir(i) {
    exibir(i);
    document.documentElement.classList.add('sem-rolagem');
    dialogo.showModal();
  }

  dialogo.addEventListener('close', function () {
    document.documentElement.classList.remove('sem-rolagem');
    // se navegou além do lote visível, revela até a foto atual para o foco ter onde voltar
    if (atual >= mostrando) mostrarAte(atual + 1);
    linkDe(atual).focus();
  });

  foto.addEventListener('load', function () { foto.style.backgroundImage = ''; });

  secao.querySelector('.galeria').addEventListener('click', function (e) {
    var a = e.target.closest('.galeria__item a');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    var i = ativos.indexOf(a.parentNode);
    if (i < 0) return;
    e.preventDefault();
    abrir(i);
  });

  dialogo.querySelector('[data-fechar]').addEventListener('click', function () { dialogo.close(); });
  dialogo.querySelector('[data-anterior]').addEventListener('click', function () { exibir(atual - 1); });
  dialogo.querySelector('[data-proxima]').addEventListener('click', function () { exibir(atual + 1); });

  // Esc fecha nativamente; setas trocam de foto
  dialogo.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); exibir(atual - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); exibir(atual + 1); }
  });

  // Clique no fundo (fora da foto e dos botões) fecha
  palco.addEventListener('click', function (e) {
    if (e.target === palco && !arrastou) dialogo.close();
  });

  // Swipe: arrastar o dedo para os lados troca de foto (limiar ~50px)
  var inicioX = null, inicioY = 0, arrastou = false;
  palco.addEventListener('pointerdown', function (e) {
    if (!e.isPrimary) return;
    inicioX = e.clientX; inicioY = e.clientY; arrastou = false;
  });
  palco.addEventListener('pointerup', function (e) {
    if (inicioX === null || !e.isPrimary) return;
    var dx = e.clientX - inicioX, dy = e.clientY - inicioY;
    inicioX = null;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
      arrastou = true;
      exibir(dx < 0 ? atual + 1 : atual - 1);
    }
  });
  palco.addEventListener('pointercancel', function () { inicioX = null; });
})();
