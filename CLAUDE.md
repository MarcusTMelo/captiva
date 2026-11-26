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
| # | id | Seção | Imagem-chave |
|---|----|-------|--------------|
| 1 | `hero` | Tô vendendo... Quer comprar? + preço + WhatsApp | `img/cartoon/beberrao-sem-fundo.webp` |
| 2 | `carrao` | O carrão (espaço, conforto, câmbio/piloto automático, engate, ficha curta) | `img/cartoon/portas-abertas.webp` |
| 3 | `alcoolatra` | O lado alcoólatra (confissão + consumo real) | `img/cartoon/bomba-na-boca.webp` |
| 4 | `fotos` | 76 fotos, zero maquiagem (galeria com filtros, lê `fotos.json`) | `img/fotos/*.avif` |
| 5 | `ficha` | Ficha corrida (manutenções, IPVA/licenciamento, defeitos assumidos) | notas fiscais + `img/recortes/*.png` |
| 6 | `fim` | Fim da história (condições + WhatsApp + "Começo da sua.") | `img/cartoon/carro-no-morro.webp` |

## Dados oficiais (não alterar, não completar)
- Preço: **R$ 40.000, negociável**
- Pagamento: **só à vista** (sem troca, sem financiamento)
- Aceita **vistoria / laudo cautelar** por conta do comprador
- Quilometragem: mais de 172.961 km — **km atual = PENDENTE: nunca inventar número**
- Consumo real: **cidade 7,2 km/l · estrada 9,7 km/l**
- Donos: **3 ou mais** — com humor ("passou por várias mãos, todas cuidaram"), sempre ao lado do histórico de manutenção
- Onde ver: **Águas Claras, Brasília/DF**
- Final da placa: não divulgar
- WhatsApp: +55 61 99902-7520, **uma única mensagem pré-preenchida**

## Paleta — posto de gasolina retrô
Direção visual decidida em 25/11/2026. Variáveis em `:root` do `style.css`:
| Variável | Hex | Uso |
|---|---|---|
| `--verde-posto` | `#0F7A3A` | fundo do hero |
| `--verde-escuro` | `#0A5A2A` | texto sobre amarelo (etiquetas) |
| `--amarelo` | `#FFD000` | destaques, visor, anel de foco |
| `--vermelho` | `#E13029` | botão WhatsApp (escurecido de #E8322A p/ branco passar 4.5:1) |
| `--visor` | `#111111` | painel do preço (visor da bomba) |
| `--branco` | `#FFFFFF` | texto sobre verde/vermelho/visor |
| `--creme` | `#FFF6E5` | reservado para as próximas seções |

- Amarelo sobre verde dá 3.69:1 → **só texto grande (≥ 24px bold)**.
- Preço sempre exibido como visor de bomba (fonte mono do sistema).
- Fontes só do sistema; nada externo.

## WhatsApp
URL única do site (já codificada):

`https://wa.me/5561999027520?text=Oi%2C%20Marcus!%20Vi%20o%20site%20do%20Captiva%20e%20quero%20saber%20mais%20sobre%20ele%20(inclusive%20o%20lado%20alco%C3%B3latra).`

- **Todo botão de WhatsApp do site usa exatamente esta URL, sem variação** (nem no texto, nem nos parâmetros).

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
