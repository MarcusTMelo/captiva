/* ══════════════════════════════════════════════════════════════
   CAPTIVA — script.js
   Extraído de index.html (Etapa 1 da refatoração estrutural).
   Conteúdo idêntico ao <script> original, sem nenhuma alteração de
   lógica, ordem ou comportamento. Depende de GSAP/ScrollTrigger/
   MotionPathPlugin já carregados via <script src> no index.html
   ANTES deste arquivo (mesma ordem de carregamento de antes).
   ══════════════════════════════════════════════════════════════ */

(function(){
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapReady = (typeof window.gsap !== 'undefined') && (typeof window.ScrollTrigger !== 'undefined') && (typeof window.MotionPathPlugin !== 'undefined');
  if (!gsapReady || prefersReduced) document.documentElement.classList.add('no-motion');

  /* ── "words": quebra o texto em spans ── */
  var scenesAll = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  scenesAll.forEach(function(scene){
    var wordsEls = scene.querySelectorAll('[data-fx="words"]');
    for (var w = 0; w < wordsEls.length; w++) {
      var el = wordsEls[w];
      var words = el.textContent.split(/\s+/).filter(Boolean);
      el.innerHTML = words.map(function(word){ return '<span class="fx-word">' + word + '&nbsp;</span>'; }).join('');
    }
  });

  /* ══════════════════════════════════════
     GALERIA — dados, filtros e lightbox.
     Roda SEMPRE, independente do GSAP: as
     76 fotos precisam estar acessíveis
     mesmo se o motor de scroll falhar.
  ══════════════════════════════════════ */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var counts = { externa: 0, lateral: 0, interna: 0, detalhes: 0 };
  galleryItems.forEach(function(item, i){
    item.setAttribute('data-num', (i + 1) + ' / 76');
    var cat = item.getAttribute('data-cat');
    if (counts[cat] !== undefined) counts[cat]++;
  });
  var setText = function(id, val){ var el = document.getElementById(id); if (el) el.textContent = val; };
  setText('countExterna', counts.externa);
  setText('countLateral', counts.lateral);
  setText('countInterna', counts.interna);
  setText('countDetalhes', counts.detalhes);

  var currentFilter = 'todas';
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
  function applyFilter(filter){
    currentFilter = filter;
    filterBtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-filter') === filter); });
    galleryItems.forEach(function(item){
      var show = filter === 'todas' || item.getAttribute('data-cat') === filter;
      item.classList.toggle('is-hidden', !show);
    });
    /* CAUSA RAIZ do bug "seções somem depois de filtrar": esconder itens
       muda a altura do grid masonry (column-count), o que muda a altura
       de .gallery-section, o que desloca a posição de TODAS as cenas
       seguintes no documento — mas o ScrollTrigger de cada uma guarda
       start/end calculados no load e não se recalcula sozinho quando um
       ancestral muda de altura por CSS puro (display:none). Resultado:
       as cenas depois da galeria ficam pinadas numa posição que já não
       corresponde a lugar nenhum da página, suas timelines nunca
       avançam, e tudo que começa com opacity:0 (todo elemento .fx)
       fica invisível pra sempre — só o fundo da cena aparece.
       Corrigir de verdade = recalcular todo mundo depois da mudança de
       altura, não maquiar o sintoma. */
    if (window.ScrollTrigger) {
      requestAnimationFrame(function(){ ScrollTrigger.refresh(); });
    }
  }
  filterBtns.forEach(function(b){
    b.addEventListener('click', function(){ applyFilter(b.getAttribute('data-filter')); });
  });

  /* revela os itens do grid suavemente conforme entram na tela
     (IntersectionObserver — leve, funciona com ou sem GSAP) */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, { rootMargin: '80px 0px' });
    galleryItems.forEach(function(item){ io.observe(item); });
  } else {
    galleryItems.forEach(function(item){ item.classList.add('in-view'); });
  }

  /* cena de encerramento do rodapé — dispara quando entra na viewport,
     mesmo padrão do IntersectionObserver da galeria (leve, roda com
     ou sem GSAP).
     Transição 14 (Lote 3, cap-final→rodapé): threshold baixado de 0.25
     pra 0.01 (dispara assim que a 1ª fatia do rodapé aparece, não só
     depois de 1/4 dele já estar em quadro) — junto com a remoção do
     transition-delay de .rodape-bird, isso faz os pássaros do rodapé
     começarem a nascer enquanto o #cap-final (e seus próprios pássaros,
     .cap-final-bird-wrap, ainda visíveis até o fim do pin) só está
     terminando de sair de quadro — nunca um instante sem pássaro algum
     em tela entre os dois sistemas. */
  var rodapeCena = document.getElementById('rodapeCena');
  if (rodapeCena) {
    if ('IntersectionObserver' in window) {
      var rodapeIo = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting) { rodapeCena.classList.add('in-view'); rodapeIo.unobserve(rodapeCena); } });
      }, { threshold: 0.01 });
      rodapeIo.observe(rodapeCena);
    } else {
      rodapeCena.classList.add('in-view');
    }
  }

  /* lightbox — navega dentro do filtro ativo */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var current = 0;

  function visibleList(){
    return galleryItems.filter(function(item){
      return currentFilter === 'todas' || item.getAttribute('data-cat') === currentFilter;
    });
  }
  function showAt(idx){
    var list = visibleList();
    if (!list.length) return;
    current = (idx + list.length) % list.length;
    var img = list[current].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = (current + 1) + ' / ' + list.length;
  }
  function openLightbox(item){
    var list = visibleList();
    var idx = list.indexOf(item);
    showAt(idx < 0 ? 0 : idx);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  galleryItems.forEach(function(item){
    item.addEventListener('click', function(){ openLightbox(item); });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function(){ showAt(current - 1); });
  document.getElementById('lightboxNext').addEventListener('click', function(){ showAt(current + 1); });
  lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showAt(current - 1);
    if (e.key === 'ArrowRight') showAt(current + 1);
  });
  /* swipe no touch */
  var touchX = null;
  lightbox.addEventListener('touchstart', function(e){ touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function(e){
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) showAt(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* dots do trilho — clique rola até a cena.
     Bug real encontrado em teste: #cap-1/#cap-2 agora vivem dentro do
     Ato 1 unificado (#act1) como camadas `position:absolute;inset:0`
     — sempre ocupam o MESMO retângulo físico (top:0 da viewport
     pinada), então `scrollIntoView()` nelas sempre "resolve" pra
     scrollY 0 (o topo do #act1 inteiro), não pro trecho de scroll
     que efetivamente mostra aquele capítulo. `window.act1ScrollTo`
     (populado por buildAct1() logo abaixo, só quando o motor GSAP
     está ativo) sabe converter "cap-1"/"cap-2" pro scrollY real
     dentro do intervalo pinado; no fallback no-motion (onde
     window.act1ScrollTo nunca é criado, e #cap-1/#cap-2 voltam a ser
     elementos normais em fluxo) o scrollIntoView padrão já funciona
     perfeitamente, então o fallback abaixo continua servindo esse
     caso sem nenhuma mudança de comportamento. */
  document.querySelectorAll('.chapter-dot').forEach(function(dot){
    dot.addEventListener('click', function(){
      var id = dot.getAttribute('data-target');
      if (window.act1ScrollTo && window.act1ScrollTo(id)) return;
      var target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (document.documentElement.classList.contains('no-motion')) return;

  /* ══════════════════════════════════════
     MOTOR CINEMATOGRÁFICO — GSAP + ScrollTrigger
     Sistema de cenas/fx próprio, desenhado e implementado por
     Marcus Túlio (@marcustmelo) especificamente pra este projeto.
  ══════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  var dotsMap = {};
  document.querySelectorAll('.chapter-dot').forEach(function(d){ dotsMap[d.getAttribute('data-target')] = d; });

  var progressEl = document.getElementById('scrollProgress');
  gsap.to(progressEl, {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
  });

  /* Prólogo → Capítulo 01 → Capítulo 02: agora fundidos num único
     mecanismo (ver buildAct1() mais abaixo, depois de addFx/buildScene
     estarem definidos) — o antigo heroTl solto (scrollTrigger próprio,
     trigger:.page) foi removido; a lógica de "hero escurece/dá zoom
     enquanto cap-1 já começa a aparecer" agora é só mais um trecho da
     timeline mestre do Ato 1, nunca uma timeline isolada com seu
     próprio início/fim independente. */

  /* Constrói, pra um elemento [data-fx], a tween equivalente numa
     timeline de cena com scrub. */
  function addFx(tl, el){
    var type = el.getAttribute('data-fx');
    var range = (el.getAttribute('data-range') || '0,1').split(',').map(Number);
    var start = range[0];
    var dur = Math.max(range[1] - range[0], 0.0001);

    switch (type) {
      case 'rise':
        /* mesma correção do 'inout': GSAP clampa posição negativa pra 0,
           então um elemento com start<=0 não tem rampa possível antes
           do início da timeline — nasce direto no estado final. */
        if (start <= 0) gsap.set(el, { opacity: 1, y: 0 });
        else tl.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: dur }, start);
        break;
      case 'rise-scale':
        tl.fromTo(el, { opacity: 0, y: 22, scale: 0.74 }, { opacity: 1, y: 0, scale: 1, duration: dur }, start);
        break;
      case 'rise-scale-darken':
        /* Lote 2, transição 7 (cap-5→cap-6): mesma entrada de 'rise-scale'
           (a,b), mas com um 3º valor opcional (c) que — se presente —
           faz o chip continuar crescendo/escurecendo até o fim da cena,
           funcionando como o próprio gatilho visual da transição pro
           preto do cap-6 (o chip já É um retângulo escuro sobre fundo
           claro; só precisa dominar mais e ficar mais escuro ainda). */
        var rsdA = range[0], rsdB = range[1], rsdC = range[2];
        tl.fromTo(el, { opacity: 0, y: 22, scale: 0.74 }, { opacity: 1, y: 0, scale: 1, duration: Math.max(rsdB - rsdA, 0.0001) }, rsdA);
        if (!isNaN(rsdC)) {
          /* bug real encontrado em teste: sem um 'from' explícito, o GSAP
             interpola 'filter' a partir de "sem filtro" tratando como
             brightness(0) (preto absoluto) em vez de brightness(1) — o
             chip ficava quase invisível/preto total logo no início desta
             2ª tween. fromTo com brightness(1) explícito corrige. */
          tl.fromTo(el, { filter: 'brightness(1)' }, { scale: 1.14, filter: 'brightness(0.62)', duration: Math.max(rsdC - rsdB, 0.0001) }, rsdB);
        }
        break;
      case 'grow-huge':
        /* entra minúscula, estoura de tamanho e assenta um pouco menor — o "momento tipográfico" */
        tl.fromTo(el, { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1.32, duration: dur * 0.72 }, start)
          .to(el, { scale: 1, duration: dur * 0.28 }, start + dur * 0.72);
        break;
      case 'slide-left':
        tl.fromTo(el, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: dur }, start);
        break;
      case 'slide-right':
        tl.fromTo(el, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: dur }, start);
        break;
      case 'settle':
        tl.fromTo(el, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: dur }, start);
        break;
      case 'settle-out':
        /* Lote 1, transição 5 (cap-3→cap-4): oposto de 'settle' — o
           elemento já está em quadro (ou nasce visível, se start<=0) e
           encolhe/desvanece até sumir, usado pro .selo reaproveitado
           que "cede lugar" ao motor do cap-4.
           Dois bugs reais corrigidos aqui (o 2º só apareceu depois de
           consertar o 1º, em teste de fronteira real):
           1. A fase de saída tinha `duration: dur` (a janela INTEIRA do
              range), começando já deslocada em `start + dur*0.15` — ou
              seja, terminava em `start + dur*1.15`, sempre 15% além do
              fim do range. Quando o range termina em 1 (fim da cena), o
              scrub nunca avança progress além disso, então o tween de
              saída nunca completava — o elemento ficava "preso" em
              opacity>0 além do fim do cap-3, nunca sumindo de vez.
           2. Consertar (1) ingenuamente (encolher até opacity:0 exatamente
              no fim do range) reintroduz o problema original por outro
              caminho: no instante exato da fronteira (progress=1 do
              cap-3 == progress=0 do cap-4) o elemento já estaria a
              opacity:0 de um lado — sem sobreposição real com o par que
              nasce do outro lado, voltando a ser um corte perceptível,
              só que de opacidade em vez de cor. Fix: a saída não vai até
              0, só até uma opacidade residual (~0.35) dentro do próprio
              range do cap-3 — e o par simétrico do cap-4 (mesmo range de
              início, 0 a X) nasce nessa MESMA opacidade residual (em vez
              de opacity:1 cheio) e só então completa o desaparecimento —
              o elemento fica genuinamente visível dos dois lados do corte,
              nunca a opacidade plena nem a zero exatamente na fronteira. */
        var soResidual = 0.35;
        var soOutDur = Math.max(dur * 0.85, 0.0001);
        if (start <= 0) {
          gsap.set(el, { opacity: soResidual, scale: 0.8 });
          tl.to(el, { opacity: 0, scale: 0.55, duration: Math.max(dur, 0.0001) }, 0);
        } else {
          tl.fromTo(el, { opacity: 0, scale: 1 }, { opacity: 1, scale: 1, duration: Math.max(dur * 0.15, 0.0001) }, start);
          tl.to(el, { opacity: soResidual, scale: 0.8, duration: soOutDur }, start + dur * 0.15);
        }
        break;
      case 'blur-in':
        var speed = parseFloat(el.getAttribute('data-speed')) || 0;
        tl.fromTo(el, { opacity: 0, filter: 'blur(14px)', scale: 1.06 }, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: dur }, start);
        if (speed) tl.fromTo(el, { y: -speed }, { y: speed, ease: 'none', duration: 1 }, 0);
        break;
      case 'pop':
        /* personagem cartoon: entra com pequeno exagero de escala, sai encolhendo.
           A rotação de entrada é SOMADA à rotação de base (--rot), não a
           substitui — senão qualquer inclinação definida no CSS se perde
           assim que o elemento ganha essa animação. Com só 2 valores no
           range (a,b) o elemento entra e PERMANECE (sem tween de saída)
           — necessário pra composições tipo colagem (cap.06) onde cada
           foto se acumula na tela em vez de sumir; ver o bug documentado
           logo abaixo em 'grow-fill' sobre nunca "esconder" uma saída
           empurrando c/d pra além de 1 — isso estica tl.duration() e
           desnormaliza TODAS as posições da timeline da cena. */
        var a = range[0], b = range[1], c = range[2], d = range[3];
        var popBaseRot = gsap.getProperty(el, 'rotation') || 0;
        tl.fromTo(el, { opacity: 0, scale: 0.4, rotation: popBaseRot - 8 }, { opacity: 1, scale: 1.08, rotation: popBaseRot, duration: Math.max(b - a, 0.0001) * 0.7 }, a)
          .to(el, { scale: 1, duration: Math.max(b - a, 0.0001) * 0.3 }, a + (b - a) * 0.7);
        if (range.length >= 4) {
          tl.to(el, { opacity: 0, scale: 0.82, duration: Math.max(d - c, 0.0001) }, c);
        }
        break;
      case 'pop-archive':
        /* Transição 12 (Lote 3, cap-historico→cap-quem): mesma entrada do
           'pop' (a,b), mas a saída (c,d) é um "arquivamento" físico em vez
           de um simples encolher/desvanecer — usado só no recibo 2026 (o
           mais recente): gira levemente e recua pro fundo (scale menor +
           leve deslocamento y), escurecendo (filter brightness), como se
           estivesse sendo guardado, dando um encerramento físico ao
           histórico antes do silêncio do cap-quem. Estado inicial do
           filter é sempre explícito no fromTo (nunca implícito) — regra
           já validada nesta sessão: interpolar filter sem isso pode
           passar por um instante de valor errado. */
        var paA = range[0], paB = range[1], paC = range[2], paD = range[3];
        var paBaseRot = gsap.getProperty(el, 'rotation') || 0;
        tl.fromTo(el, { opacity: 0, scale: 0.4, rotation: paBaseRot - 8 }, { opacity: 1, scale: 1.08, rotation: paBaseRot, duration: Math.max(paB - paA, 0.0001) * 0.7 }, paA)
          .to(el, { scale: 1, duration: Math.max(paB - paA, 0.0001) * 0.3 }, paA + (paB - paA) * 0.7);
        if (range.length >= 4) {
          var paDur = Math.max(paD - paC, 0.0001);
          tl.fromTo(el, { rotation: paBaseRot, scale: 1, y: 0, filter: 'brightness(1)' },
                         { rotation: paBaseRot - 22, scale: 0.62, y: 18, filter: 'brightness(0.4)', duration: paDur }, paC)
            .to(el, { opacity: 0, duration: paDur * 0.4 }, paC + paDur * 0.6);
        }
        break;
      case 'arrive':
        /* entrada de foto mais dramática que 'pop': desloca de fora da tela +
           rotaciona + estoura escala antes de assentar — "fotografia entrando
           na cena de maneira impactante" (usada pra foto-herói do cap.02). */
        var arBaseRot = gsap.getProperty(el, 'rotation') || 0;
        var arDir = el.getAttribute('data-dir') === 'rev' ? -1 : 1;
        tl.fromTo(el,
          { opacity: 0, x: arDir * 90, y: 50, scale: 0.62, rotation: arBaseRot - arDir * 16 },
          { opacity: 1, x: 0, y: 0, scale: 1.06, rotation: arBaseRot, duration: dur * 0.72 }, start)
          .to(el, { scale: 1, duration: dur * 0.28 }, start + dur * 0.72);
        break;
      case 'drive-wobble':
        /* cartoon "dirige" até o lugar com leve cambaleio (efeito bêbado) —
           entra de fora da cena, oscila y/rotação em pulsos, assenta no
           lugar onde o --rot de base já posiciona, e (se o range tiver
           4 valores) recolhe/some no fim — mesma estrutura do 'pop',
           só com entrada mais teatral (usada no cap.04). */
        var dwBaseRot = gsap.getProperty(el, 'rotation') || 0;
        var dwFrom = parseFloat(el.getAttribute('data-from-x')) || -70;
        var dwA = range[0], dwB = range[1], dwC = range[2], dwD = range[3];
        var dwDur = Math.max(dwB - dwA, 0.0001);
        tl.fromTo(el, { opacity: 0, x: dwFrom + 'vw', y: 14, rotation: dwBaseRot - 11 },
                       { opacity: 1, x: '0vw', y: -7, rotation: dwBaseRot + 7, duration: dwDur * 0.55 }, dwA)
          .to(el, { y: 9, rotation: dwBaseRot - 5, duration: dwDur * 0.25 }, dwA + dwDur * 0.55)
          .to(el, { y: 0, rotation: dwBaseRot, duration: dwDur * 0.2 }, dwA + dwDur * 0.8);
        if (!isNaN(dwC) && !isNaN(dwD)) {
          tl.to(el, { opacity: 0, scale: 0.82, duration: Math.max(dwD - dwC, 0.0001) }, dwC);
        }
        break;
      case 'path':
        /* elemento percorre um trecho de um <path> SVG guia (a "estrada"
           ou trajetória daquela cena) via MotionPathPlugin — mesmo
           conceito técnico da referência (getPointAtLength + rotação
           pela tangente), só que usando a implementação oficial do GSAP
           em vez de calcular à mão. data-path aponta pro seletor do
           <path> guia (pode ser invisível — só um trilho — ou visível,
           como a própria estrada desenhada). data-path-start/-end (0–1,
           opcionais) permitem percorrer só um trecho do path, não ele
           inteiro. data-path-rotate sobrescreve a auto-rotação pela
           tangente com um ângulo fixo, pra ícones que não fazem sentido
           girando (ex.: um avião que deve manter a inclinação de voo). */
        var pathSel = el.getAttribute('data-path');
        if (!pathSel) break;
        var pStartFrac = parseFloat(el.getAttribute('data-path-start'));
        var pEndFrac = parseFloat(el.getAttribute('data-path-end'));
        if (isNaN(pStartFrac)) pStartFrac = 0;
        if (isNaN(pEndFrac)) pEndFrac = 1;
        /* data-path-rotate: ausente = segue a tangente inteira (bom pra
           ícones simples/silhuetas, ex. aviãozinho); "false" = nunca
           gira, só translada (necessário pra arte em perspectiva 3/4
           como o carrinho da Captiva — girar esse tipo de arte pela
           tangente vira ela de cabeça pra baixo em vez de "virar o
           carro pro outro lado"); um número = tangente + esse offset. */
        var pRotateAttr = el.getAttribute('data-path-rotate');
        var pAutoRotate;
        if (pRotateAttr === 'false') pAutoRotate = false;
        else if (pRotateAttr === null || pRotateAttr === '') pAutoRotate = true;
        else pAutoRotate = parseFloat(pRotateAttr) || 0;
        var pFade = Math.min(dur * 0.15, 0.04);
        /* um único tween de posição — start/end do motionPath já
           definem o trecho fixo do path; é o progresso do PRÓPRIO
           tween (0→1, controlado pelo scrub) que anda por esse trecho.
           (tentar fazer um fromTo animando start/end como se fossem
           valores comuns não funciona — dá um trecho de comprimento
           zero no estado inicial e quebra o cálculo do plugin.) */
        tl.to(el, {
          motionPath: { path: pathSel, align: pathSel, alignOrigin: [0.5, 0.5], autoRotate: pAutoRotate, start: pStartFrac, end: pEndFrac },
          duration: dur, ease: 'none'
        }, start);
        /* opacidade em tween(s) separado(s) — propriedade diferente,
           não conflita com o motionPath acima */
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: pFade }, start);
        tl.to(el, { opacity: 0, duration: pFade }, start + dur - pFade);
        break;
      case 'recede-rise-scale':
        /* entra grande e domina, depois recua (esmaece/encolhe) sem sumir — dá lugar às falas seguintes */
        var ra = range[0], rb = range[1], rc = range[2], rd = range[3];
        tl.fromTo(el, { opacity: 0, y: 22, scale: 0.74 }, { opacity: 1, y: 0, scale: 1, duration: Math.max(rb - ra, 0.0001) }, ra)
          .to(el, { opacity: 0.3, scale: 0.82, duration: Math.max(rd - rc, 0.0001) }, rc);
        break;
      case 'slide-out-grow':
        /* "tipografia cinética" (cap.06): entra centralizada e pequena,
           cresce dominando o quadro (chegando perto de tocar as bordas
           no pico) e então continua crescendo ENQUANTO desliza pra fora
           de quadro na horizontal — não é um fade/rise no lugar, é o
           texto literalmente atravessando e saindo da tela, tipo o
           título "JANUARY"/"FEBRUARY" do craftedbygc.com. Duas etapas
           na mesma tween-timeline: (a→b) cresce parado no centro;
           (b→c) cresce mais um pouco enquanto desliza em x até sumir
           (o overflow:hidden do .scene-pin garante que "sumir" é
           literal, não só opacity:0). data-slide-dir escolhe o lado
           (default 'right'); data-slide-vw a distância percorrida. */
        var sgA = range[0], sgB = range[1], sgC = (range.length >= 3 ? range[2] : range[1]);
        var sgDurGrow = Math.max(sgB - sgA, 0.0001);
        var sgDurSlide = Math.max(sgC - sgB, 0.0001);
        var sgFrom = parseFloat(el.getAttribute('data-from-scale'));
        var sgPeak = parseFloat(el.getAttribute('data-peak-scale'));
        var sgExit = parseFloat(el.getAttribute('data-exit-scale'));
        if (isNaN(sgFrom)) sgFrom = 0.5;
        if (isNaN(sgPeak)) sgPeak = 1.35;
        if (isNaN(sgExit)) sgExit = 1.9;
        var sgVw = parseFloat(el.getAttribute('data-slide-vw')) || 120;
        var sgDir = el.getAttribute('data-slide-dir') === 'left' ? -1 : 1;
        if (sgA <= 0) gsap.set(el, { opacity: 1, scale: sgFrom, x: 0 });
        else tl.fromTo(el, { opacity: 0, scale: sgFrom, x: 0 }, { opacity: 1, scale: sgFrom, x: 0, duration: 0.0001 }, sgA);
        tl.to(el, { scale: sgPeak, duration: sgDurGrow }, sgA);
        tl.to(el, { scale: sgExit, x: sgDir * sgVw + 'vw', duration: sgDurSlide, ease: 'power1.in' }, sgB)
          .to(el, { opacity: 0, duration: Math.min(sgDurSlide * 0.4, 0.06) }, sgC - Math.min(sgDurSlide * 0.4, 0.06));
        break;
      case 'inout':
        var ia = range[0], ib = range[1], ic = range[2], id = range[3];
        /* GSAP recusa (clampa pra 0) qualquer posição negativa numa
           timeline — então um elemento cujo fade-in "deveria" começar
           um pouco antes do t=0 da cena (ex.: o primeiro shot de uma
           sequência, que não pode ter um instante inicial vazio) não
           dá pra resolver empurrando ia pra negativo, GSAP ignora isso.
           Quando ia<=0 não existe rampa possível antes do início da
           timeline — a correção real é o elemento já nascer visível
           (gsap.set, sem fromTo) e a única tween ser a saída. */
        if (ia <= 0) {
          gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
        } else {
          tl.fromTo(el, { opacity: 0, y: 28, x: 16, scale: 0.94 }, { opacity: 1, y: 0, x: 0, scale: 1, duration: Math.max(ib - ia, 0.0001) }, ia);
        }
        tl.to(el, { opacity: 0, y: -28, x: -16, scale: 0.95, duration: Math.max(id - ic, 0.0001) }, ic);
        break;
      case 'cross':
        /* elemento atravessa a tela de um lado a outro — usado pra fotos
           ou blocos gráficos que precisam de composição em movimento,
           não só entrar/sumir no lugar. */
        var travelVw = parseFloat(el.getAttribute('data-travel')) || 46;
        var rev = el.getAttribute('data-dir') === 'rev';
        var fromX = (rev ? travelVw : -travelVw) + 'vw';
        var toX   = (rev ? -travelVw : travelVw) + 'vw';
        tl.fromTo(el, { x: fromX, opacity: 0 }, { x: '0vw', opacity: 1, duration: dur * 0.5 }, start)
          .to(el, { x: toX, opacity: 0, duration: dur * 0.5 }, start + dur * 0.5);
        break;
      case 'grow-fill':
        /* a foto/elemento cresce e passa a dominar a composição — pra
           quando a cena precisa terminar com a imagem ocupando quase
           tudo, em vez de só entrar do mesmo tamanho de sempre. */
        var gfFrom = parseFloat(el.getAttribute('data-from-scale')) || 0.55;
        var gfTo   = parseFloat(el.getAttribute('data-to-scale')) || 1.4;
        if (range.length >= 4) {
          var ga = range[0], gb = range[1], gc = range[2], gd = range[3];
          var gfDurIn = Math.max(gb - ga, 0.0001);
          /* opacidade sobe numa janela curta e independente da duração
             do dolly de escala (mesmo princípio já usado no data-fx="path":
             opacity e a propriedade "de movimento" — lá motionPath, aqui
             scale — são tweens separadas na mesma timeline, então uma
             pode ser rápida enquanto a outra continua lenta/contínua sem
             conflito). Sem isso, um dolly longo (gb-ga grande, "cresce
             devagar por todo o shot") deixava a foto quase invisível
             por boa parte do próprio fade-in, coincidindo com o início
             do scroll da cena — um frame vazio, sem foto nem texto. */
          var gfFadeDur = Math.min(gfDurIn * 0.25, 0.05);
          tl.fromTo(el, { scale: gfFrom }, { scale: gfTo, duration: gfDurIn }, ga);
          /* GSAP clampa qualquer posição negativa pra 0 — não dá pra
             "adiantar" a tween de opacidade pra antes do início da
             timeline. Quando ga<=0 (o dolly começa junto com o t=0 da
             cena, ex. primeiro shot de uma sequência que não pode ter
             instante vazio) a opacidade nasce pronta (gsap.set) e só a
             escala continua a tween normal — o dolly de escala segue
             lento e contínuo, só a transparência não fica "descendo
             junto" e deixando o quadro vazio bem no início do shot. */
          if (ga <= 0) gsap.set(el, { opacity: 1 });
          else tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: gfFadeDur }, ga);
          tl.to(el, { opacity: 0.15, scale: gfTo * 1.08, duration: Math.max(gd - gc, 0.0001) }, gc);
        } else {
          tl.fromTo(el, { scale: gfFrom, opacity: 0 }, { scale: gfTo, opacity: 1, duration: dur }, start);
        }
        break;
      case 'reveal-data':
        /* pra listas de dados (ficha técnica): em vez de todo item entrar
           igual (mesma direção, mesma escala — "slide 1, slide 2..."),
           alterna direção/escala por posição, then a variedade vem da
           composição, não de um efeito novo por item. */
        var sibs = Array.prototype.filter.call(el.parentElement.children, function(c){
          return c.getAttribute('data-fx') === 'reveal-data';
        });
        var rdIdx = sibs.indexOf(el);
        var rdPattern = rdIdx % 4;
        var rdFrom = [
          { opacity: 0, x: -46, y: 14,  scale: 0.8,  rotate: -6 },
          { opacity: 0, x: 46,  y: -10, scale: 0.82, rotate: 5  },
          { opacity: 0, x: 0,   y: 54,  scale: 0.7,  rotate: -3 },
          { opacity: 0, x: 0,   y: -42, scale: 1.22, rotate: 4  }
        ][rdPattern];
        var rda = range[0], rdb = range[1], rdc = range[2], rdd = range[3];
        tl.fromTo(el, rdFrom, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: Math.max(rdb - rda, 0.0001) }, rda);
        tl.to(el, { opacity: 0, scale: rdPattern % 2 === 0 ? 0.74 : 1.16, y: rdPattern % 2 === 0 ? -26 : 26, duration: Math.max(rdd - rdc, 0.0001) }, rdc);
        break;
      case 'words':
        var words = el.children, n = words.length;
        for (var i = 0; i < n; i++) {
          var wStart = start + (i / n) * dur * 0.72;
          tl.fromTo(words[i], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: dur * 0.34 }, wStart);
        }
        break;
      case 'fade-echo':
        /* resquício que nasce visível e dissolve de vez logo no início —
           diferente de 'fade' (que só entra e permanece pro resto da
           cena): aqui os 4 valores do range são de fato usados (fade-in
           rapidíssimo a,b + fade-out real c,d), pra um "eco residual"
           que precisa mesmo sumir cedo, não lavar a cena inteira. */
        var feA = range[0], feB = range[1], feC = range[2], feD = range[3];
        if (feA <= 0) gsap.set(el, { opacity: 1 });
        else tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: Math.max(feB - feA, 0.0001) }, feA);
        tl.to(el, { opacity: 0, duration: Math.max(feD - feC, 0.0001) }, feC);
        break;
      case 'arrive-sheet-preview':
        /* Lote 1, transição 4: par de saída de 'arrive-sheet' — a
           pré-visualização nasce discreta e, nos últimos instantes do
           cap-2b, já começa a girar/deslizar em direção à posição que
           .ficha-sheet vai assentar no início do cap-3 (mesmo sentido
           de movimento, começo do gesto que a cena seguinte completa). */
        var aspA = range[0], aspB = range[1];
        var aspBaseRot = -1.4;
        tl.fromTo(el, { opacity: 0, x: '14vw', y: '-6vh', rotation: aspBaseRot - 16 },
                       { opacity: 0.8, x: '6vw', y: '-3vh', rotation: aspBaseRot - 9, duration: Math.max(aspB - aspA, 0.0001) }, aspA);
        break;
      case 'arrive-sheet':
        /* Lote 1, transição 4 (cap-2b→cap-3): a "folha de ficha" chega
           deslizando/girando (como se fosse colocada sobre a mesa) —
           continuação do mesmo movimento que .ficha-sheet-preview já
           inicia no fim do cap-2b (ver HTML do cap-2b). Gira mais e
           desloca mais na entrada, assenta na rotação final de -1.4deg
           definida no CSS (.ficha-sheet). start<=0 é o caso normal
           aqui (a folha é a primeira coisa que a cena mostra). */
        var asA = range[0], asB = range[1];
        var asBaseRot = -1.4;
        if (asA <= 0) {
          tl.fromTo(el, { opacity: 0.7, x: '6vw', y: '-3vh', rotation: asBaseRot - 9 },
                         { opacity: 1, x: 0, y: 0, rotation: asBaseRot, duration: Math.max(asB - asA, 0.0001) }, 0);
        } else {
          tl.fromTo(el, { opacity: 0, x: '6vw', y: '-3vh', rotation: asBaseRot - 9 },
                         { opacity: 1, x: 0, y: 0, rotation: asBaseRot, duration: Math.max(asB - asA, 0.0001) }, asA);
        }
        break;
      case 'speed-lines-in':
        /* Lote 1, transição 2 (cap-1→cap-2): par simétrico de
           'speed-lines-out' — nasce já esticada/deslocada (como se
           tivesse acabado de atravessar a costura vinda do cap-1) e
           retrai/desvanece rápido nos primeiros instantes do cap-2. */
        var siA = range[0], siB = range[1], siC = range[2], siD = range[3];
        if (siA <= 0) gsap.set(el, { opacity: 1, scaleX: 2.2, x: '-6vw' });
        else tl.fromTo(el, { opacity: 0, scaleX: 2.2, x: '-6vw' }, { opacity: 1, scaleX: 2.2, x: '-6vw', duration: Math.max(siB - siA, 0.0001) }, siA);
        tl.to(el, { scaleX: 1, x: '0vw', duration: Math.max(siD - siC, 0.0001) }, siC)
          .to(el, { opacity: 0, duration: Math.max(siD - siC, 0.0001) * 0.8 }, siC + Math.max(siD - siC, 0.0001) * 0.2);
        break;
      case 'speed-lines-out':
        /* Lote 1, transição 2 (cap-1→cap-2): entra como um 'fade' comum
           (a,b), mas nos últimos instantes da cena (c,d) acelera/estica
           horizontalmente — como se o próprio quadro fosse arrastado
           pro lado — em vez de simplesmente desvanecer no lugar. O
           scaleX final > 1 é o que dá a sensação de "atravessou a
           costura arrastando um pouco de amarelo consigo" (o par visual
           que efetivamente aparece do lado do cap-2 é .cap2-yellow-
           streak, um elemento gêmeo reaproveitando o mesmo desenho). */
        var slA = range[0], slB = range[1], slC = range[2], slD = range[3];
        if (slA <= 0) gsap.set(el, { opacity: 1 });
        else tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: Math.max(slB - slA, 0.0001) }, slA);
        tl.fromTo(el, { scaleX: 1, x: 0 }, { scaleX: 2.2, x: '18vw', duration: Math.max(slD - slC, 0.0001), ease: 'power1.in' }, slC)
          .to(el, { opacity: 0, duration: Math.max(slD - slC, 0.0001) * 0.7 }, slC + Math.max(slD - slC, 0.0001) * 0.3);
        break;
      case 'drive-away-echo':
        /* Lote 2, transição 6 (cap-4→cap-5): par de saída do carrinho
           cartoon 'drive-wobble' do cap-4 — que já recolhe/some em
           0.62-0.72, bem antes do fim da cena. Este segundo elemento
           (mesma arte, novo <figure> no início do #cap-5) nasce já em
           pleno movimento de afastamento — pequeno, deslizando pra fora
           pela lateral, encolhendo — como se tivesse "dirigido para a
           cena seguinte" em vez de simplesmente desaparecido. 2 valores
           só (entra já saindo, termina sumido) — nunca reaparece depois. */
        var daA = range[0], daB = range[1];
        var daDur = Math.max(daB - daA, 0.0001);
        gsap.set(el, { opacity: 0.85, x: '0vw', scale: 0.86 });
        tl.fromTo(el, { opacity: 0.85, x: '0vw', scale: 0.86 },
                       { opacity: 0, x: '32vw', scale: 0.62, duration: daDur, ease: 'power1.in' }, daA);
        break;
      case 'anchor-shrink-echo':
        /* Lote 2, transição 8 (cap-6→cap-estado): par de saída da foto-
           âncora final da colagem do cap-6 (.cap6-photo--anchor, grande
           e centralizada) — em vez de simplesmente sumir na fronteira,
           este segundo elemento (mesma foto, novo <figure> no início do
           #cap-estado) nasce ainda grande/quase centralizada (imitando
           onde a âncora estava) e encolhe rapidamente para o canto de
           repouso definido no CSS (.cap-estado-anchor-echo), then
           desvanece — "a mesma foto continuando visível, encolhendo",
           não um corte seco. */
        var aseA = range[0], aseB = range[1];
        var aseDur = Math.max(aseB - aseA, 0.0001);
        var aseBaseRot = gsap.getProperty(el, 'rotation') || 0;
        /* bug real encontrado em teste visual: a 1ª versão nascia grande
           (scale 2.6) e deslocada pro centro-esquerda, vazando por cima/
           ao redor do Shot A real (texto + foto) do #cap-estado, mesmo
           ficando atrás dele em z-index — a "sobra" visível nas bordas
           do Shot A já bastava pra competir com o conteúdo principal.
           Reduzido bastante (scale 1.5, deslocamento menor, ease power2
           que já encolhe rápido nos primeiros instantes) e opacidade
           inicial mais baixa. */
        tl.fromTo(el, { opacity: 0.55, x: '10vw', y: '-16vh', scale: 1.5, rotation: aseBaseRot + 6 },
                       { opacity: 0.7, x: '0vw', y: '0vh', scale: 1, rotation: aseBaseRot, duration: aseDur * 0.7, ease: 'power2.out' }, aseA)
          .to(el, { opacity: 0, duration: aseDur * 0.3 }, aseA + aseDur * 0.7);
        break;
      case 'fade-dim':
        /* Lote 2, transição 9 (cap-estado→galeria): igual 'fade', mas o
           alvo de opacidade é lido de data-max-opacity em vez de fixo
           em 1 — usado pras miniaturas periféricas que antecipam a
           órbita da galeria (precisam ficar sempre discretas, nunca
           competir com o conteúdo principal da cena). */
        var fdMax = parseFloat(el.getAttribute('data-max-opacity'));
        if (isNaN(fdMax)) fdMax = 0.4;
        tl.fromTo(el, { opacity: 0 }, { opacity: fdMax, duration: dur }, start);
        break;
      case 'fade':
      default:
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur }, start);
    }

    /* ── camadas com velocidade própria ──
       data-speed / data-rot-speed valem pra qualquer tipo de fx (exceto
       os que já usam y/rotate por conta própria) e correm a cena INTEIRA
       (0 a 1), não só o range do elemento — é isso que dá a sensação de
       profundidade: cada camada se move num ritmo diferente do resto. */
    var usesY = (type === 'rise' || type === 'rise-scale' || type === 'rise-scale-darken' || type === 'recede-rise-scale' || type === 'inout' || type === 'reveal-data' || type === 'words' || type === 'arrive' || type === 'drive-wobble' || type === 'path' || type === 'arrive-sheet' || type === 'arrive-sheet-preview' || type === 'anchor-shrink-echo' || type === 'pop-archive');
    var usesRotate = (type === 'pop' || type === 'reveal-data' || type === 'arrive' || type === 'drive-wobble' || type === 'path' || type === 'arrive-sheet' || type === 'arrive-sheet-preview' || type === 'anchor-shrink-echo' || type === 'pop-archive');
    var speed = parseFloat(el.getAttribute('data-speed'));
    if (speed && type !== 'blur-in' && !usesY) {
      tl.fromTo(el, { y: -speed }, { y: speed, ease: 'none', duration: 1 }, 0);
    }
    var rotSpeed = parseFloat(el.getAttribute('data-rot-speed'));
    if (rotSpeed && !usesRotate) {
      /* soma à rotação de base (--rot) em vez de substituí-la — do
         contrário qualquer inclinação de moldura definida no CSS
         desaparece assim que a camada ganha esse drift. */
      var baseRot = gsap.getProperty(el, 'rotation') || 0;
      tl.fromTo(el, { rotation: baseRot - rotSpeed }, { rotation: baseRot + rotSpeed, ease: 'none', duration: 1 }, 0);
    }
  }

  function updateCounter(el, p){
    var total = parseInt(el.getAttribute('data-total'), 10) || 1;
    var range = (el.getAttribute('data-range') || '0,1').split(',').map(Number);
    var local = Math.max(0, Math.min(1, (p - range[0]) / (range[1] - range[0])));
    var idx = local >= 1 ? total - 1 : Math.floor(local * total);
    function two(n){ n = n + 1; return n < 10 ? '0' + n : '' + n; }
    el.textContent = two(idx) + ' / ' + two(total - 1);
    el.style.opacity = local > 0 ? 1 : 0;
  }

  /* uma timeline pinada por cena — scrub 0.85 dá a inércia cinematográfica */
  function buildScene(scene){
    var pinEl = scene.querySelector('.scene-pin');
    var dot = dotsMap[scene.id];
    var counterEl = scene.querySelector('[data-fx="counter"]');

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: function(){ return '+=' + Math.max(scene.offsetHeight - window.innerHeight, 1); },
        pin: pinEl,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onEnter: function(){ if (dot) dot.classList.add('active'); },
        onEnterBack: function(){ if (dot) dot.classList.add('active'); },
        onLeave: function(){ if (dot) dot.classList.remove('active'); },
        onLeaveBack: function(){ if (dot) dot.classList.remove('active'); },
        onUpdate: function(self){
          if (counterEl) updateCounter(counterEl, self.progress);
          if (scene.hasAttribute('data-flash-at')) {
            var at = parseFloat(scene.getAttribute('data-flash-at'));
            if (self.progress >= at && !scene.dataset.flashed) {
              scene.dataset.flashed = '1';
              scene.classList.add('flash-hit');
              setTimeout(function(){ scene.classList.remove('flash-hit'); }, 500);
            } else if (self.progress < at - 0.05) {
              scene.dataset.flashed = '';
            }
          }
        }
      }
    });

    var fxEls = scene.querySelectorAll('[data-fx]');
    for (var i = 0; i < fxEls.length; i++) {
      if (fxEls[i].getAttribute('data-fx') !== 'counter') addFx(tl, fxEls[i]);
    }
  }
  /* #cap-1/#cap-2 NÃO passam por buildScene() — pertencem ao Ato 1
     unificado (buildAct1() logo abaixo), que já os pina junto com o
     hero num único ScrollTrigger/timeline. */
  scenesAll.filter(function(s){ return s.id !== 'cap-1' && s.id !== 'cap-2'; }).forEach(buildScene);

  /* ══════════════════════════════════════
     ATO 1 UNIFICADO — hero + cap-1 + cap-2 (protótipo "câmera
     contínua"). Ver o comentário HTML de abertura de #act1 pra
     explicação completa. Em vez de 3 ScrollTriggers independentes
     (o antigo heroTl solto + buildScene(cap-1) + buildScene(cap-2)),
     isto é UM único ScrollTrigger com UM único pin (.act1-pin) e UMA
     timeline mestre (act1Tl, progresso 0–1 = do topo do hero até o
     fim do cap-2). Cada elemento [data-fx] das 3 camadas continua
     usando a MESMA função addFx() de sempre, através de duas
     timelines LOCAIS (cap1Tl/cap2Tl, cada uma 0–1 relativa à própria
     cena, ver buildSegmentTimeline() dentro de buildAct1()) que são
     aninhadas dentro da timeline mestre via .add()+.totalDuration()
     — o próprio GSAP reescalona o tempo, preservando a proporção/
     ritmo interno de cada shot exatamente como já estava, sem
     precisar reescrever nenhum data-range no DOM (uma 1ª tentativa
     fazendo isso via reescrita de atributo quebrou o sentinela
     "start<=0 = já nasce visível" que várias branches de addFx()
     usam — ver o comentário dentro de buildSegmentTimeline() pra
     detalhes). */
  function buildAct1(){
    var wrap = document.getElementById('act1');
    var pin = wrap ? wrap.querySelector('.act1-pin') : null;
    var heroLayer = document.getElementById('act1Hero');
    var cap1 = document.getElementById('cap-1');
    var cap2 = document.getElementById('cap-2');
    if (!wrap || !pin || !heroLayer || !cap1 || !cap2) return;

    /* distâncias de scroll de cada segmento, em vh — as MESMAS que
       .act1-wrap usa no CSS pra calcular sua altura total (leem a
       mesma custom property, então nunca podem dessincronizar). */
    function vhVar(name){
      return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
    }
    var heroVh = vhVar('--act1-hero-vh');
    var cap1Vh = vhVar('--act1-cap1-vh');
    var cap2Vh = vhVar('--act1-cap2-vh');
    var totalVh = heroVh + cap1Vh + cap2Vh;
    /* sub-trecho [0–1] de cada segmento dentro da timeline mestre */
    var heroEnd = heroVh / totalVh;
    var cap1End = (heroVh + cap1Vh) / totalVh;
    var cap2End = 1;

    /* Cada segmento (cap-1/cap-2) ganha sua PRÓPRIA timeline local
       0–1 — exatamente como buildScene() já constrói pra qualquer
       outra cena, usando addFx() sem NENHUMA mudança de semântica
       (todo o convencionado "start<=0 = já nasce visível" continua
       funcionando exatamente igual, porque o 0 de cada timeline
       local É o início real daquele segmento). Essa timeline local
       depois é aninhada dentro da timeline mestre via .add(), na
       posição/duração proporcional que aquele segmento ocupa no Ato
       1 inteiro — é o próprio GSAP quem faz o reescalonamento de
       tempo (nested timeline), sem precisar reescrever nenhum
       data-range no DOM. Bug real evitado por não fazer isso via
       reescrita de atributo (1ª tentativa desta implementação): o
       valor "0" de um data-range (usado por várias branches de
       addFx() como sentinela de "nasce já visível, sem rampa") deixa
       de significar "0 relativo à cena" e passa a significar "0
       relativo ao Ato inteiro" assim que é somado a um segStart>0 —
       quebrando esse sentinela pra qualquer elemento do cap-2 (ex.:
       "172.961 km", data-range="0,0"). Timeline aninhada não tem esse
       problema: a semântica de cada fx nunca sai do universo 0–1 da
       própria cena. */
    function buildSegmentTimeline(root){
      var localTl = gsap.timeline({ defaults: { ease: 'none' } });
      var els = root.querySelectorAll('[data-fx]');
      for (var i = 0; i < els.length; i++) {
        if (els[i].getAttribute('data-fx') !== 'counter') addFx(localTl, els[i]);
      }
      return localTl;
    }
    var cap1Tl = buildSegmentTimeline(cap1);
    var cap2Tl = buildSegmentTimeline(cap2);

    var heroBg = document.getElementById('bg');
    var heroDarken = document.getElementById('heroDarkenEcho');
    var heroBirdWakeups = document.querySelectorAll('.hero-bird-wakeup');
    var heroFadeTargets = Array.prototype.slice.call(document.querySelector('.act1-layer--hero .page').children).filter(function(c){
      return c !== heroBg && c !== heroDarken && Array.prototype.indexOf.call(heroBirdWakeups, c) === -1;
    });
    /* bug real encontrado em teste de scroll contínuo (não pulos):
       .titulo-bloco/.scroll-hint/.card-whatsapp têm cada um sua própria
       animação CSS de entrada (`animation: ... forwards`) — e uma
       animação CSS ATIVA sempre vence um `style` inline aplicado por
       JS/GSAP na mesma propriedade, não importa a ordem ou
       especificidade (regra do próprio spec de CSS Animations). Isso
       fazia o GSAP escrever opacity:0 no atributo style (confirmado
       via getAttribute('style')) enquanto o computed opacity real
       ficava travado em 1 pela animação de entrada — o título/CTA do
       hero nunca sumiam de verdade, ficando por cima de tudo do cap-1
       indefinidamente. Corrigido desarmando a animação CSS (`animation:
       none`) no exato instante em que o Ato 1 é construído (a entrada
       inicial delas já aconteceu no load, antes do usuário rolar).
       Ao desarmar a animação, define explicitamente o estado de
       repouso pós-entrada (opacity:1, sem deslocamento) — sem isso o
       elemento herdaria o opacity:0 do frame 0% da própria keyframe
       no instante em que a animação for removida. */
    gsap.set(heroFadeTargets, { animation: 'none', opacity: 1, y: 0 });
    var bgVerde = document.getElementById('act1BgColor');
    var bgAmarelo = document.getElementById('act1BgColor2');

    var dot1 = dotsMap['cap-1'];
    var dot2 = dotsMap['cap-2'];

    var act1Tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: function(){ return '+=' + Math.max(wrap.offsetHeight - window.innerHeight, 1); },
        pin: pin,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: function(self){
          var p = self.progress;
          /* chapter-dots: cap-1 "ativo" enquanto p está no trecho do
             cap-1, cap-2 enquanto p está no trecho do cap-2 — nunca os
             dois juntos, mas com fronteira contínua (sem gap) já que
             heroEnd/cap1End/cap2End são contíguos. */
          if (dot1) dot1.classList.toggle('active', p >= heroEnd && p < cap1End);
          if (dot2) dot2.classList.toggle('active', p >= cap1End && p <= cap2End);
        }
      }
    });

    /* ── FASE 1 — hero: câmera empurra pra dentro da ilustração
       (dolly/zoom contínuo, mais generoso que o "scale:1.12" antigo,
       e espalhado por uma janela bem mais longa) enquanto o conteúdo
       do hero (título/CTA) desvanece — o fundo (.bg) NÃO desaparece
       de vez no fim desta fase: ele continua visível, ainda em zoom,
       enquanto as primeiras camadas do cap-1 (as 3 fotos-polaroid,
       remapeadas pra começar já dentro do fim desta fase) chegam por
       cima/entre ele — overlap real, mesmo princípio que os .shot
       internos já usam, agora na fronteira hero→cap-1. */
    var heroZoomDur = Math.min(heroEnd + (cap1End - heroEnd) * 0.35, cap2End);
    act1Tl.to(heroBg, { scale: 1.32, duration: heroZoomDur }, 0);
    act1Tl.to(heroFadeTargets, { opacity: 0, y: -30, duration: heroEnd * 0.7 }, heroEnd * 0.3);
    if (heroDarken) act1Tl.fromTo(heroDarken, { opacity: 0 }, { opacity: 1, duration: heroEnd * 0.7 }, heroEnd * 0.35);
    if (heroBirdWakeups.length) {
      act1Tl.fromTo(heroBirdWakeups, { opacity: 0 }, { opacity: 0.85, duration: heroEnd * 0.5 }, heroEnd * 0.5);
      act1Tl.to(heroBirdWakeups, { scaleY: 0.4, duration: heroEnd * 0.08 }, heroEnd * 0.62)
            .to(heroBirdWakeups, { scaleY: 1, duration: heroEnd * 0.08 }, heroEnd * 0.7)
            .to(heroBirdWakeups, { scaleY: 0.4, duration: heroEnd * 0.08 }, heroEnd * 0.78)
            .to(heroBirdWakeups, { scaleY: 1, y: -18, opacity: 0, duration: heroEnd * 0.14 }, heroEnd * 0.86);
    }
    /* o fundo da ilustração só desvanece de vez já dentro do trecho do
       cap-1 (não no fim exato do hero) — dá tempo real de coexistir em
       tela com o Shot 1 do cap-1 (fotos-polaroid + texto) antes de
       sumir por completo. */
    var heroBgFadeStart = heroEnd + (cap1End - heroEnd) * 0.08;
    var heroBgFadeDur = (cap1End - heroEnd) * 0.42;
    act1Tl.to(heroBg, { opacity: 0, duration: heroBgFadeDur }, heroBgFadeStart);
    act1Tl.set(heroLayer, { pointerEvents: 'none' }, heroBgFadeStart + heroBgFadeDur);

    /* ── FUNDO CONTÍNUO — duas camadas de cor sólida por baixo de
       tudo (mesmo princípio já provado no site pros "ecos" de
       transição — dois elementos irmãos, opacidade cruzada — só que
       aqui são elas quem definem o fundo inteiro, não um acréscimo
       decorativo por cima de retângulos sólidos trocando por classe):
       .act1BgColor (verde-escuro) nasce de opacidade 0 (a ilustração
       do hero ainda domina) e sobe enquanto o hero desvanece — o verde
       "nasce" da ilustração. .act1BgColor2 (gradiente amarelo/laranja)
       nasce por cima dela, também de opacidade 0, numa janela longa
       centrada na fronteira cap-1→cap-2 — o amarelo nasce do verde,
       nunca um corte de classe/cor instantâneo. */
    act1Tl.fromTo(bgVerde, { opacity: 0 }, { opacity: 1, duration: heroBgFadeDur * 1.3 }, heroBgFadeStart);
    var yellowStart = cap1End - (cap1End - heroEnd) * 0.16;
    var yellowDur = (cap2End - cap1End) * 0.34;
    act1Tl.fromTo(bgAmarelo, { opacity: 0 }, { opacity: 1, duration: yellowDur }, yellowStart);

    /* ── FRONTEIRA cap-1→cap-2 (fecho do cap-1 ↔ abertura do cap-2):
       o fecho do cap-1 (Shot 4 — foto IMG_1166 + texto, já com saída
       tardia por design: persiste até o fim da cena, nunca cai a
       opacidade 0 antes da troca) agora também encolhe/recua de
       verdade NESTE trecho, enquanto "172.961 km" do cap-2 já está
       crescendo por cima (seu próprio data-fx="rise" já nasce visível
       no início do cap-2, sobreposto no tempo) — as duas coisas
       coexistem em tela, nenhuma passa por opacidade 0 no mesmo
       instante em que a outra também está em 0. */
    var cap1Shot4Text = cap1.querySelectorAll('.shot')[3];
    var cap1Shot4Corner = cap1.querySelector('.cap1-shot4-corner');
    /* Reduzido de 0.3 pra 0.1 (fração do próprio cap-2 local): bug real
       encontrado por varredura sistemática de opacidade EFETIVA (produto
       de opacidade por toda a cadeia de ancestrais, não só o elemento
       isolado) rolando de verdade — com 0.3, esse recuo só terminava no
       local-progress 0.3 do cap-2, mas o SHOT 2 do cap-2 ("E ela continua
       aqui. Divíssima!") já entra em local-progress 0.14 — os dois
       ficavam sobrepostos e legíveis ao mesmo tempo por uma janela real
       (~0.14 a ~0.22). Com 0.1, o recuo termina bem antes do Shot 2
       começar a nascer. */
    var seamDur = (cap2End - cap1End) * 0.1;
    /* Opacidade residual reduzida de 0.5/0.35 pra 0.12/0.06: mesmo em
       35% de opacidade, texto branco em negrito ainda competia
       visualmente de forma real com "172.961 km" chegando por cima na
       MESMA posição do quadro — bug real, confirmado medindo a
       opacidade efetiva exata (0.347) e vendo a screenshot: ainda
       lia-se "Daquelas que chegam" nitidamente por baixo do número.
       Quase zero (não zero — a regra do site é nunca sumir 100% de
       repente) resolve isso sem reintroduzir o corte abrupto. */
    if (cap1Shot4Corner) {
      act1Tl.to(cap1Shot4Corner, { scale: 0.55, opacity: 0.12, x: '-4vw', duration: seamDur }, cap1End);
    }
    if (cap1Shot4Text) {
      act1Tl.to(cap1Shot4Text, { scale: 0.75, opacity: 0.06, duration: seamDur }, cap1End);
    }
    /* bug real encontrado em teste de scroll contínuo: o par acima só
       encolhe o fecho do cap-1 até uma opacidade residual (0.5/0.35) e
       PÁRA — antes isso era seguro porque a cena cap-1 simplesmente
       terminava/desmontava ali. Agora #cap-1 nunca sai do DOM (fica
       absoluto atrás de #cap-2 pro resto do Ato 1), então esse resíduo
       (incluindo as 3 fotos-polaroid do Shot 1, que também "recuam sem
       sumir de vez" por design do fx recede-rise-scale) ficava visível
       pra sempre por cima/atrás de TODO o resto do cap-2 — inclusive
       nos shots finais, bem depois de fazer sentido narrativamente.
       Corrigido com um fade da CAMADA #cap-1 inteira até opacity:0,
       numa janela generosa que começa logo após o pico do "gesto de
       transformação" acima (dá tempo de vê-lo acontecer) e termina
       bem antes do fim do cap-2 — dali em diante #cap-1 realmente some
       de vez, como qualquer cena anterior já fazia antes desta
       unificação. */
    act1Tl.to(cap1, { opacity: 0, duration: (cap2End - cap1End) * 0.22 }, cap1End + seamDur);

    /* finalmente: as duas timelines locais (cap1Tl/cap2Tl, cada uma já
       0–1 relativa à própria cena, construídas acima) entram na
       timeline MESTRE como filhas aninhadas do GSAP. addFx() sempre
       trabalha em frações 0–1 (a convenção de data-range de qualquer
       cena do site), então cada timeline local sempre tem duração 1 —
       .totalDuration(targetSpan) reescala essa duração original pro
       intervalo exato que o segmento ocupa dentro do Ato 1
       (cap1End−heroEnd / cap2End−cap1End), e só então .add() a insere
       na timeline mestre na posição correta. É o próprio GSAP
       reescalonando o tempo internamente — nenhum data-range é
       reescrito no DOM, então toda a semântica interna de addFx()
       (inclusive "start<=0 = já nasce visível") permanece correta pra
       cada cena, exatamente como se ainda fosse independente. */
    cap1Tl.totalDuration(Math.max(cap1End - heroEnd, 0.0001));
    act1Tl.add(cap1Tl, heroEnd);
    cap2Tl.totalDuration(Math.max(cap2End - cap1End, 0.0001));
    act1Tl.add(cap2Tl, cap1End);

    /* usado pelo clique nos chapter-dots (ver acima) — converte
       "cap-1"/"cap-2" num scrollY real dentro do intervalo pinado do
       Ato 1, já que os dois deixaram de ser elementos navegáveis via
       scrollIntoView() comum (são camadas absolutas sobrepostas, não
       posições distintas no documento). Rola pro INÍCIO de cada
       trecho (heroEnd/cap1End), não pro meio — mesma convenção de
       "início do capítulo" que scrollIntoView(block:'start') já dava
       antes desta unificação. */
    window.act1ScrollTo = function(id){
      var frac = id === 'cap-1' ? heroEnd : (id === 'cap-2' ? cap1End : null);
      if (frac === null) return false;
      var st = act1Tl.scrollTrigger;
      if (!st) return false;
      var y = st.start + frac * (st.end - st.start);
      /* window.scrollTo smooth em vez de gsap.to+ScrollToPlugin — o
         site não carrega o ScrollToPlugin (só ScrollTrigger e
         MotionPathPlugin), e não vale a pena somar mais uma dependência
         CDN só pra esse gesto pontual de navegação. */
      window.scrollTo({ top: y, behavior: 'smooth' });
      return true;
    };
  }
  buildAct1();

  /* costura de verdade cap-4→cap-5 (teste pontual, position:fixed,
     não pertence a nenhuma .scene-pin — ver CSS .scene-seam acima
     pra entender por que os "ecos" internos não bastavam). Sobe de
     opacidade um pouco antes do fim do cap-4, fica no pico bem em
     cima do instante exato da troca de sticky, desce de novo já
     dentro do cap-5 — o degradê interno da própria camada é quem
     faz a cor parecer se misturar, já que ela cobre as duas cenas
     por igual nesse intervalo. */
  (function(){
    var seam = document.getElementById('seam-cap4-cap5');
    var cap4 = document.getElementById('cap-4');
    if (!seam || !cap4) return;
    gsap.timeline({
      scrollTrigger: {
        trigger: cap4,
        start: 'bottom bottom+=350',
        end: 'bottom bottom-=350',
        scrub: 0.4
      }
    })
      .fromTo(seam, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.5 })
      .to(seam, { opacity: 0, ease: 'none', duration: 0.5 });
  })();

  /* entrada cinematográfica da galeria — pin curto, não controla a
     página inteira; assim que termina, o grid já flui normalmente */
  var galleryIntroPin = document.querySelector('.gallery-intro-pin');
  if (galleryIntroPin) {
    var dot = dotsMap['galeria'];
    var introTl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: galleryIntroPin,
        start: 'top top',
        end: function(){ return '+=' + Math.max(galleryIntroPin.offsetHeight - window.innerHeight, 1); },
        pin: galleryIntroPin.querySelector('.gallery-intro-stage'),
        scrub: 0.85,
        invalidateOnRefresh: true,
        onEnter: function(){ if (dot) dot.classList.add('active'); },
        onEnterBack: function(){ if (dot) dot.classList.add('active'); },
        onLeave: function(){ if (dot) dot.classList.remove('active'); },
        onLeaveBack: function(){ if (dot) dot.classList.remove('active'); }
      }
    });
    galleryIntroPin.querySelectorAll('[data-fx]').forEach(function(el){ addFx(introTl, el); });
  }
})();
