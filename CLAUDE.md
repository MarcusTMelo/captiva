# Captiva v3 — instruções operacionais

Fonte da verdade: `_referencia/brief-captiva-v3.md`. Em conflito, o brief manda.

## O que é
Página única para vender o Chevrolet Captiva 2011/12 prata (2.4 Ecotec, automática) em Brasília.
Comédia + transparência: o carro é um personagem que bebe e não esconde. Quem chega veio do QR do folder.
Objetivo único: fazer rir, provar que o carro é bom e levar ao **WhatsApp**.

## Tom
- Debochado, brasiliense, autoconsciente.
- Regra de ouro: **a piada nunca esconde informação — todo exagero vem com um dado real.**
- **A palavra 'bebe' aparece no máximo 2 vezes no site.**
- **A Captiva é "ela"** (decisão do dono): toda referência ao carro vai no feminino ("ela bebe", "Mimada", "Quero ver ela de perto"). Substantivos masculinos explícitos continuam masculinos ("um carro de 2011", "1.680 kg de carro", "O carrão").
- **Linguagem inclusiva:** nada de masculino genérico para pessoas ("pessoa compradora", "quem dirige", "oficina de confiança"); nos alts, posições neutras ("banco dianteiro esquerdo", não "do motorista").

## As seções (ids fixos)
Ordem na página (layout final do dono, Partes 1 e 2): `hero` → faixa de ícones → `historia` (bloco autorizado pelo dono) → `carrao` → `fotos` → `alcoolatra` (par I) → `ficha` (par J) → `fim` (par K) → rodapé.

| # | id | Seção | Imagem-chave | Status |
|---|----|-------|--------------|--------|
| 1 | `hero` | Tô vendendo... Quer comprar? + preço + WhatsApp | `img/cartoon/brasilia-desktop-{1280,1920}.webp` + `brasilia-mobile-{720,1080}.webp` (cena de Brasília com a Torre de TV, full-bleed; `folder-cena` saiu do hero mas fica no repo) | ✅ pronta (layout novo, sessão A) |
| 2 | `carrao` | O carrão (espaço, conforto, câmbio/piloto automático, engate, ficha curta) | `img/cartoon/portas-abertas.webp` | ✅ pronta |
| 3 | `alcoolatra` | O lado alcoólatra (confissão + card "Consumo (média real)") | `img/cartoon/bomba-na-boca{-800,}.webp` | ✅ pronta (layout final) |
| 4 | `fotos` | 76 fotos, zero maquiagem (galeria com filtros, lê `fotos.json`) | `img/fotos/*.avif` + `img/fotos/thumbs/*.webp` | ✅ pronta |
| 5 | `ficha` | Manutenção e histórico (6 itens + ficha corrida completa no `details`) + card "Transparência sempre" | `img/recortes/*.webp` (notas fiscais nunca entram) | ✅ pronta (layout final) |
| 6 | `fim` | Ficha técnica + fechamento "Começo da sua." (preço + WhatsApp) + selos de condição + QR | `img/cartoon/carro-no-morro{-800,}.webp` + `img/qr-whatsapp.svg` | ✅ pronta (layout final) |

### Decisões do layout novo (barra + hero + faixa de ícones)
- Barra superior fixa (`.barra`, `--barra: 3.5rem`, máx. 56px) fora do `<main>`: marca em texto (sem logo/marca registrada), âncoras #carrao/#alcoolatra/#fotos/#ficha a partir de 52rem, botão de WhatsApp (só ícone, 44px, no celular; com texto a partir de 64rem). Âncoras: `html { scroll-padding-top: var(--barra) }` + `scroll-margin-top: calc(0.75rem - var(--pad-secao))` nas seções.
- Hero: cena de Brasília full-bleed com `<picture>` (retrato até 51.99rem). Marca do gerador de IA removida cortando 180px da borda direita das artes originais. O carro nunca fica sob texto. Celular: na cena só o título (céu) e o painel do preço (grama); subtítulo + link vêm logo depois do hero, no creme; a cena sobe só o necessário (`--chao`) pra mostrar o vidro da Torre inteiro. Desktop: título no céu à esquerda (a partir de 75rem desce até logo abaixo do avião, que fica inteiro), cartão do subtítulo embaixo dele, oferta num painel à direita; enquadramento calculado em `--corte-topo`/`--corte-base`. Barra com fundo creme 100% opaco.
- Faixa de ícones (`ul.destaques`) entre o hero e o #carrao — não é seção. 4×2 no celular, 8 colunas a partir de 52rem.

### Decisões da galeria (#fotos)
- Filtros: **Todas (76) · Por fora (27) · Por dentro (23) · Detalhes (26)**. **"lateral" entra no filtro Por fora (27)** = `externa` (20) + `lateral` (7). Por dentro = `interna`; Detalhes = `detalhes`.
- A grade é HTML estático gerado a partir do `fotos.json` (mesma ordem; `data-cat` = fora/dentro/detalhes). Mudou o `fotos.json`, regenera a grade.
- Miniaturas em `img/fotos/thumbs/*.webp` (480px no lado maior, qualidade 70). A AVIF grande só baixa ao abrir o visualizador.

### Layout final do dono (Parte 2): pares de blocos
Referência: `_referencia/EuQueroEhAssim.png`. As três últimas seções são faixas com **dois blocos lado a lado a partir de 64rem** (`.par`; empilhados abaixo disso). Padding compacto como #historia/#carrao/#fotos.
- **I · #alcoolatra** (`.par--60`): `.bloco.alcool` (card creme com borda oliva) = cabeçalho (bomba no círculo **amarelo** — exceção pedida pelo dono, traço azul-marinho — + etiqueta + h2 menor), imagem paisagem à esquerda (no celular abre o card), abertura + "De onde vem a sede?…" à direita; `details` "Ver o lado alcoólatra completo" com os cartões "Tanque cheio" e "Ela até faz regime.". Ao lado, `aside.cartao.consumo` "Consumo (média real)": visores Cidade/Estrada com ícones de prédio e estrada, as duas legendas e a nota do dono. O link do hero aponta pra `#alcoolatra`.
- **J · #ficha** (`.par--60`): `.bloco.corrida` = chave + "Manutenção e histórico" + h2 "Mimada, e com nota fiscal." menor; 6 itens com ícone (`ul.itens`, 3×2 em todas as larguras; `&shy;` em "Arrefeci­mento" e "licencia­mento" pro 320px), só dados reais; `details` "Ver ficha corrida completa" com tudo o que havia (abertura R$ 15 mil, arrefecimento, Manutenção por ano, selos IPVA/licenciamento, skincare, Marcas de uso com polaroids). Ao lado, `aside.cartao.cartao--claro.transparencia` "Transparência sempre" (cabeçalho `--verde-claro`, aperto de mão): bilhete do dono + `details` "Ver o combinado".
- **K · #fim** (`.par--40`, altura igualada): `aside.ficha` (ficha técnica, card `--oliva-escuro`, 8 itens) + `.fim__banner`; embaixo `.fim__base` = 3 selos numa linha + QR com legenda (só ≥ 52rem).
- `details.mais` = "Ver … completo" nativo (funciona sem JS); setinha desenhada em CSS, sem texto. Não colocar `.reveal` dentro de `details`.

### Decisões da ficha corrida (#ficha)
- Classes com prefixo `corrida__` / `itens` / `linha-tempo` / `selo` / `polaroid` — `.ficha` é a ficha técnica (no par do #fim).
- Recortes: `img/recortes/*.webp` (lado maior 800px, qualidade 80, transparência preservada, recortados no conteúdo). Os PNG ficam no repo mas fora do HTML. Placa tarjada de preto (inclusive nos PNG).
- Polaroids inclinam com a propriedade `rotate` (não `transform`) pra não brigar com o `.reveal`.

### Decisões do fim (#fim)
- Classes com prefixo `fim__` / `local` / `rodape` (`bilhete` e `combinado` foram pro card "Transparência sempre" do #ficha). Fechamento em cena: `.fim__banner` (carro-no-morro) com etiqueta + h2 "Começo da sua." no céu e `.fim__painel` colado embaixo: visor **verde-escuro** "R$ 40.000 / negociável · só à vista", botão grande "Quero ver ela de perto", pino "Águas Claras, Brasília/DF" e o aviso de ligação (visor ao lado do botão a partir de 40rem). Nada cobre a Captiva, as pessoas, a Torre nem a cidade. Abaixo do par: 3 `.fim__selo` numa linha (empilhados < 30rem) + QR com legenda.
- QR (`img/qr-whatsapp.svg`) gerado uma vez com segno (nível M, azul-marinho sobre branco, margem de 4 módulos) e verificado decodificando para a URL exata (também recortado da tela a 1x). Exibido a 176px (11rem), só no desktop (≥ 52rem); no celular fica `display:none` e não é baixado. Mudou a URL, regenera e verifica de novo.
- O site fecha com a onda verde-oliva do folder (`.fim__onda`) emendada no `<footer class="rodape">`, que fica fora do `<main>`.

### Ritmo visual (sessão B)
- Fundos: #historia creme · #carrao e #fotos `.bloco-verde` (oliva-escuro contido) · #alcoolatra `--creme-quente` · #ficha creme · #fim creme + banner.
- `.cartao` = cabeçalho verde-oliva (ícone + h3 branco) + corpo `--creme-claro`. Usado em "Consumo (média real)", "Tanque cheio", ECO, arrefecimento, "Manutenção por ano" e "Transparência sempre" (`.cartao--claro`: cabeçalho `--verde-claro` com texto oliva-escuro). Os cards do #carrao continuam `.card` (ícone no círculo). `.bloco` = card principal de cada par (creme claro, borda oliva).

## Dados oficiais (não alterar, não completar)
- Preço: **R$ 40.000, negociável**
- Pagamento: **só à vista** (sem troca, sem financiamento)
- Aceita **vistoria / laudo cautelar** por conta do comprador
- Quilometragem: **179.044 km**
- Motor/câmbio (confirmados pelo CRLV): **2.4 Ecotec 16V, 185 cv / 2400 cc, gasolina · automático de 6 marchas com modo manual (+/−) · tração dianteira**
- Porta-malas **821 L** · tanque **73 L** · **5 lugares**
- Itens: ar-condicionado, piloto automático, computador de bordo, freio de mão elétrico, engate, câmera de ré, bancos de couro com aquecimento nos dois dianteiros, ajuste lombar no banco do motorista, rádio original de fábrica
- Botão ECO (do lado da alavanca) — fonte: manual do proprietário, p. 6-54: troca de marcha antecipada, acelerador menos sensível, marcha lenta 625 ± 25 rpm; **sem número de consumo**
- **NÃO tem sensor de estacionamento** (nunca dizer que tem)
- Consumo real: **cidade 7,2 km/l · estrada 9,7 km/l**
- Consumo oficial de ficha (fábrica): **cidade 10,0 km/l · estrada 14,9 km/l** — só para a piada, nunca como consumo do carro
- Peso: **1.680 kg** (ficha de fábrica)
- Autonomia calculada (73 L × consumo real): **~525 km na cidade · ~700 km na estrada**
- Donos: **não mencionar número de donos no site; contado na visita.**
- Onde ver: **Águas Claras, Brasília/DF**
- Final da placa: não divulgar
- **Placa, chassi, RENAVAM e dados do proprietário nunca entram no site nem no repo.**
- WhatsApp: +55 61 99902-7520, **uma única mensagem pré-preenchida**
- **Contato só por WhatsApp; o dono não atende ligação de número desconhecido; o número não aparece escrito no site.**
- Manutenção (notas disponíveis na visita; quase R$ 15 mil desde 2024, tudo com nota fiscal):
  - **2024:** troca de óleo e filtros; válvula termostática nova.
  - **2025:** caixa de direção nova; discos e pastilhas de freio dianteiros; amortecedor dianteiro, buchas e bieletas; 2 pneus novos, com alinhamento e balanceamento.
  - **2026:** arrefecimento renovado (bomba d'água, válvula termostática, sensor de temperatura, tampas e cano de água); 4 velas novas; óleo sintético e todos os filtros trocados, a última vez em outubro.
- Documentação: **IPVA 2026 pago · licenciamento 2026 feito**
- **Regra de copy do dono:** não mencionar multas nem alienação fiduciária; o histórico de aquecimento de 2025 aparece só como "arrefecimento renovado em 2026" (resolvido, confirmado pelo dono); detalhes contados pessoalmente na visita.
- Notas fiscais, CRLV, CPF, endereço e placa **nunca** entram no site nem no repo (nem valores por manutenção nem nomes de oficinas).

## Direção visual e paleta
**O site é o folder ganhando vida:** carro sempre dentro de cena ilustrada, título adesivo em Lilita One, creme + azul-marinho + verde-oliva, rabiscos à mão, faixa ondulada.

Variáveis em `:root` do `style.css` (hex medidos em `_referencia/folder.png`):
| Variável | Hex | Uso |
|---|---|---|
| `--creme` | `#F9EDDE` | fundo da página e das faixas |
| `--azul-marinho` | `#040F1C` | texto, "TÔ VENDENDO…", fundo do visor |
| `--verde-oliva` | `#3C5113` | "QUER COMPRAR?", botão, etiquetas, rabiscos, onda |
| `--oliva-escuro` | `#2B3B0E` | hover e sombra do botão |
| `--amarelo-estrela` | `#FCCB42` | só estrelinhas, dígitos do visor e anel de foco |
| `--branco` | `#FFFFFF` | contorno do título, texto sobre oliva/azul |
| `--verde-claro` | `#D9E4BE` | cabeçalho do "Transparência sempre" (oliva-escuro 9.1:1) |

- Amarelo nunca é texto sobre creme (1.32:1). O anel de foco amarelo leva halo azul-marinho. Exceção pedida pelo dono: o círculo do ícone da bomba no #alcoolatra (traço azul-marinho por cima).
- Título: Lilita One, caixa alta, contorno branco grosso + sombra suave. Texto corrido: fonte do sistema.
- Fontes hospedadas no próprio repo (`fonts/*.woff2` + `fonts/OFL.txt`), nada de CDN.

## WhatsApp
URL única do site (já codificada):

`https://wa.me/5561999027520?text=Oi%2C%20Marcus!%20Vi%20o%20site%20da%20Captiva%20e%20quero%20saber%20mais%20sobre%20ela%20(inclusive%20o%20lado%20alco%C3%B3latra).`

Mensagem: "Oi, Marcus! Vi o site da Captiva e quero saber mais sobre ela (inclusive o lado alcoólatra)." Mudou a URL → regenera `img/qr-whatsapp.svg` (segno, nível M, margem 4, `omitsize` pra ter viewBox) e confere decodificando localmente.

- **Todo botão de WhatsApp do site usa exatamente esta URL, sem variação** (nem no texto, nem nos parâmetros).
- **Contato só por WhatsApp; o dono não atende ligação de número desconhecido; o número não aparece escrito no site** (só dentro da URL do `wa.me` e do QR).

## Stack
- HTML + CSS + JS puro (`index.html`, `style.css`, `script.js`, `fotos.json`). Mobile first.
- Caminhos sempre relativos.

## PROIBIDO
- Scroll-jacking.
- Pinning / sticky de cena. (**Barra superior fixa permitida** — `<header class="barra">` com `position: sticky`; pinning de cenas e scroll-jacking continuam proibidos.)
- Bibliotecas de smooth scroll ou scroll animation (Lenis, Locomotive, GSAP ScrollTrigger etc.).
- Qualquer framework ou build step (nada de npm, bundler, package.json).
- APIs de terceiros — inclusive QR code: gerar SVG local.
- Caminhos absolutos ou apontando para `dev.`.
- Inventar dados do carro.
- Divulgar o final da placa.
- Mais de uma mensagem pré-preenchida no WhatsApp.
- Seções além das 6 + `#historia` (autorizada pelo dono).
- Novos cartoons.

## Motion permitido
- Só fade/slide de entrada com CSS + IntersectionObserver.
- Sempre respeitar `prefers-reduced-motion` (sem animação quando reduzido).

## Imagens
- AVIF/WebP (com fallback quando fizer sentido).
- `loading="lazy"` em tudo abaixo da dobra; `alt` em todas.
- Originais pesados ficam em `img/cartoon/_originais/` (fora do git).

## Processo
- **Uma seção por sessão.** Só começa a próxima depois de validar a atual no celular.
- Pronto = texto final + imagem final + funciona no celular + zero erro no console.
- Seção passou de 2 sessões → simplifica, não insiste.
- Ideia nova vai para o **Estacionamento** do brief (seção 8), não para o código.
- Bom e no ar > perfeito no dev.

## Publicação (dev)
1. `git push -u origin v3`
2. Sincroniza a pasta servida (o `--delete` apaga no destino o que saiu do repo):
   ```
   rsync -a --delete --exclude='.git' --exclude='.gitignore' --exclude='*.md' --exclude='_referencia/' --exclude='_legado/' /home/marcus/Projetos/Captiva-v3/ /opt/captiva-dev/
   ```
3. Confere com curl: `https://dev.captiva.marcustmelo.com/` responde **200**; `/CLAUDE.md` e `/_referencia/brief-captiva-v3.md` respondem **404**.
   ```
   for p in / /CLAUDE.md /_referencia/brief-captiva-v3.md; do echo "$p $(curl -s -o /dev/null -w '%{http_code}' https://dev.captiva.marcustmelo.com$p)"; done
   ```
