# Captiva v3 — instruções operacionais

Fonte da verdade: `_referencia/brief-captiva-v3.md`. Em conflito, o brief manda.

## O que é
Página única para vender o Chevrolet Captiva 2011/12 prata (2.4 Ecotec, automática) em Brasília.
Comédia + transparência: o carro é um personagem que bebe e não esconde. Quem chega veio do QR do folder.
Objetivo único: fazer rir, provar que o carro é bom e levar ao **WhatsApp**.

## Tom
- Debochado, brasiliense, autoconsciente.
- Regra de ouro: **a piada nunca esconde informação — todo exagero vem com um dado real.**

## As 6 seções (ids fixos, nesta ordem)
| # | id | Seção | Imagem-chave | Status |
|---|----|-------|--------------|--------|
| 1 | `hero` | Tô vendendo... Quer comprar? + preço + WhatsApp | `img/cartoon/folder-cena-{800,1600}.webp` (cena do folder, sem texto e sem QR) | ✅ pronta |
| 2 | `carrao` | O carrão (espaço, conforto, câmbio/piloto automático, engate, ficha curta) | `img/cartoon/portas-abertas.webp` | ✅ pronta |
| 3 | `alcoolatra` | O lado alcoólatra (confissão + consumo real) | `img/cartoon/bomba-na-boca.webp` | ✅ pronta |
| 4 | `fotos` | 76 fotos, zero maquiagem (galeria com filtros, lê `fotos.json`) | `img/fotos/*.avif` + `img/fotos/thumbs/*.webp` | ✅ pronta |
| 5 | `ficha` | Ficha corrida (manutenções, IPVA/licenciamento, defeitos assumidos) | `img/recortes/*.webp` (notas fiscais nunca entram) | ✅ pronta |
| 6 | `fim` | Fim da história (condições + WhatsApp + "Começo da sua.") | `img/cartoon/carro-no-morro{-800,}.webp` + `img/qr-whatsapp.svg` | em validação (sessão 6) |

### Decisões da galeria (#fotos)
- Filtros: **Todas (76) · Por fora (27) · Por dentro (23) · Detalhes (26)**. **"lateral" entra no filtro Por fora (27)** = `externa` (20) + `lateral` (7). Por dentro = `interna`; Detalhes = `detalhes`.
- A grade é HTML estático gerado a partir do `fotos.json` (mesma ordem; `data-cat` = fora/dentro/detalhes). Mudou o `fotos.json`, regenera a grade.
- Miniaturas em `img/fotos/thumbs/*.webp` (480px no lado maior, qualidade 70). A AVIF grande só baixa ao abrir o visualizador.

### Decisões da ficha corrida (#ficha)
- Classes com prefixo `corrida__` / `linha-tempo` / `selo` / `polaroid` — `.ficha` já é a ficha técnica do #carrao.
- Recortes: `img/recortes/*.webp` (lado maior 800px, qualidade 80, transparência preservada, recortados no conteúdo). Os PNG ficam no repo mas fora do HTML. Placa tarjada de preto (inclusive nos PNG).
- Polaroids inclinam com a propriedade `rotate` (não `transform`) pra não brigar com o `.reveal`.

### Decisões do fim (#fim)
- Classes com prefixo `fim__` / `bilhete` / `combinado` / `rodape`. Condições = 1 `.visor` (preço) + 3 `.fim__selo`; 2×2 no celular, linha de 4 no desktop.
- QR (`img/qr-whatsapp.svg`) gerado uma vez com segno (nível M, azul-marinho sobre branco, margem de 4 módulos) e verificado decodificando para a URL exata. Só aparece no desktop (≥ 52rem); no celular fica `display:none` e não é baixado. Mudou a URL, regenera e verifica de novo.
- O site fecha com a onda verde-oliva do folder (`.fim__onda`) emendada no `<footer class="rodape">`, que fica fora do `<main>`.

## Dados oficiais (não alterar, não completar)
- Preço: **R$ 40.000, negociável**
- Pagamento: **só à vista** (sem troca, sem financiamento)
- Aceita **vistoria / laudo cautelar** por conta do comprador
- Quilometragem: **179.044 km**
- Motor/câmbio (confirmados pelo CRLV): **2.4 Ecotec 16V, 185 cv / 2400 cc, gasolina · automático de 6 marchas com modo manual (+/−) · tração dianteira**
- Porta-malas **821 L** · tanque **73 L** · **5 lugares**
- Itens: ar-condicionado, piloto automático, computador de bordo, freio de mão elétrico, engate, câmera de ré, bancos de couro com aquecimento nos dois dianteiros, ajuste lombar no banco do motorista, rádio original de fábrica
- **NÃO tem sensor de estacionamento** (nunca dizer que tem)
- Consumo real: **cidade 7,2 km/l · estrada 9,7 km/l**
- Consumo oficial de ficha (fábrica): **cidade 10,0 km/l · estrada 14,9 km/l** — só para a piada, nunca como consumo do carro
- Peso: **1.680 kg** (ficha de fábrica)
- Autonomia calculada (73 L × consumo real): **~525 km na cidade · ~700 km na estrada**
- Donos: **3 ou mais** — com humor ("passou por várias mãos, todas cuidaram"), sempre ao lado do histórico de manutenção
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

- Amarelo nunca é texto sobre creme (1.32:1). O anel de foco amarelo leva halo azul-marinho.
- Título: Lilita One, caixa alta, contorno branco grosso + sombra suave. Texto corrido: fonte do sistema.
- Fontes hospedadas no próprio repo (`fonts/*.woff2` + `fonts/OFL.txt`), nada de CDN.

## WhatsApp
URL única do site (já codificada):

`https://wa.me/5561999027520?text=Oi%2C%20Marcus!%20Vi%20o%20site%20do%20Captiva%20e%20quero%20saber%20mais%20sobre%20ele%20(inclusive%20o%20lado%20alco%C3%B3latra).`

- **Todo botão de WhatsApp do site usa exatamente esta URL, sem variação** (nem no texto, nem nos parâmetros).
- **Contato só por WhatsApp; o dono não atende ligação de número desconhecido; o número não aparece escrito no site** (só dentro da URL do `wa.me` e do QR).

## Stack
- HTML + CSS + JS puro (`index.html`, `style.css`, `script.js`, `fotos.json`). Mobile first.
- Caminhos sempre relativos.

## PROIBIDO
- Scroll-jacking.
- Pinning / sticky de cena.
- Bibliotecas de smooth scroll ou scroll animation (Lenis, Locomotive, GSAP ScrollTrigger etc.).
- Qualquer framework ou build step (nada de npm, bundler, package.json).
- APIs de terceiros — inclusive QR code: gerar SVG local.
- Caminhos absolutos ou apontando para `dev.`.
- Inventar dados do carro.
- Divulgar o final da placa.
- Mais de uma mensagem pré-preenchida no WhatsApp.
- Seções além das 6.
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
