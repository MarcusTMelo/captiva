# Captiva v3 — Brief do projeto

*Atualizado em 25 de novembro de 2026 · Marcus Túlio*

## 1. O que é

Página única para vender o Chevrolet Captiva 2011/12 prata (2.4 Ecotec, automática) em Brasília, **na base da comédia**. O carro é um personagem: um carrão de verdade, mas que bebe. A piada é o gancho; a transparência fecha a venda.

O site existe para cumprir a promessa do folder colado na janela do carro:

> "Veja mais fotos, detalhes e o lado alcoólatra dele" → captiva.marcustmelo.com

Quem escaneou o QR já está curioso. O site não precisa convencer do zero: precisa **fazer rir, provar que o carro é bom e levar ao WhatsApp**.

## 2. Tom

- Debochado, brasiliense, autoconsciente. O carro sabe que bebe e não esconde.
- A piada nunca esconde informação: todo exagero vem com um dado real logo depois.
- Estilo visual: cartoon 3D (estilo animação) do Captiva com cara, misturado com fotos reais sem maquiagem.
- Direção visual (decidida em 25 de novembro de 2026): o site é o folder ganhando vida: carro sempre dentro de cena ilustrada, título adesivo em Lilita One, creme + azul-marinho + verde-oliva, rabiscos à mão, faixa ondulada.

## 3. Escopo da v1 (fechado — 6 seções)

| # | Seção | Promessa do folder | Conteúdo | Imagem-chave |
|---|-------|--------------------|----------|--------------|
| 1 | Hero | — | "Tô vendendo... Quer comprar?" + preço + WhatsApp | Cena do folder (recorte da arte, sem texto e sem QR) |
| 2 | O carrão | detalhes | Espaço, conforto, câmbio automático, piloto automático, engate. Ficha técnica curta | portas-abertas |
| 3 | O lado alcoólatra | lado alcoólatra | A confissão + **consumo real** (cidade/estrada) | Foto_Principal_v2 (bomba na boca) |
| 4 | 76 fotos, zero maquiagem | mais fotos | Galeria com filtros (externa, interna, detalhes) | fotos reais |
| 5 | Ficha corrida | detalhes | Manutenções por ano, IPVA/licenciamento, pequenos defeitos assumidos | notas fiscais |
| 6 | Fim da história | — | Condições da venda + WhatsApp + "Começo da sua." | CarronoMorro |

**Fora da v1** (vai para o Estacionamento): smooth scroll, pinning, cenas encadeadas, novos cartoons, versão em outro idioma, analytics.

## 4. Dados que precisam estar no site

- Preço: **R$ 40.000, negociável**
- Pagamento: **só à vista** (sem troca, sem financiamento)
- Aceita **vistoria / laudo cautelar** por conta do comprador
- Quilometragem: **179.044 km**
- Motor/câmbio (confirmados pelo CRLV): **2.4 Ecotec 16V, 185 cv / 2400 cc, gasolina · automático de 6 marchas com modo manual (+/−) · tração dianteira**
- Porta-malas **821 L** · tanque **73 L** · **5 lugares**
- Itens: ar-condicionado, piloto automático, computador de bordo, freio de mão elétrico, engate, câmera de ré, bancos de couro com aquecimento nos dois dianteiros, ajuste lombar no banco do motorista, rádio original de fábrica
- **NÃO tem sensor de estacionamento**
- Consumo real: **cidade 7,2 km/l · estrada 9,7 km/l**
- Donos: **3 ou mais** — assumir com humor ("passou por várias mãos, todas cuidaram"), sempre ao lado do histórico de manutenção
- Onde ver: **Águas Claras, Brasília/DF**
- Final da placa: não divulgar por enquanto
- **Placa, chassi, RENAVAM e dados do proprietário nunca entram no site nem no repo.**
- WhatsApp: +55 61 99902-7520, **uma única mensagem pré-preenchida**

## 5. Regras técnicas

- HTML + CSS + JS puro. Sem framework, sem biblioteca de scroll.
- Motion é tempero, não prato: só fade/slide de entrada com CSS + IntersectionObserver e `prefers-reduced-motion` respeitado. **Proibido scroll-jacking e pinning** (foi aí que a v1 e a v2 morreram).
- Mobile first: quem escaneia o QR está no celular, na calçada.
- Imagens em AVIF/WebP com fallback, `loading="lazy"` abaixo da dobra, `alt` em todas.
- Caminhos relativos; nada apontando para `dev.` em produção.
- QR code gerado localmente (SVG), sem API de terceiros.
- Fontes hospedadas no próprio repo (woff2 + OFL), nada de CDN.
- Repositório: MarcusTMelo/captiva · VPS em /root/Projetos/Captiva-v3 · publica em dev, troca em produção só quando a v1 estiver pronta.

## 6. Inventário de assets (repo MarcusTMelo/captiva, branch main)

**Reaproveitar direto:**
- `Fotos/` — 76 fotos reais em AVIF (~26 MB), **já categorizadas** no index.html antigo (`data-cat`: externa 20, interna 23, lateral 7, detalhes 26). Extrair essa classificação para um `fotos.json` em vez de refotografar ou reclassificar.
- `Fotos/Fotos_sem_fundo/` — 8 recortes PNG (BundinhaComEngate, FrenteComArranhadinho, DiagonalPraEsquerda...). Bons para a seção "Ficha corrida" (defeitos assumidos).
- `Cartoon/portas-abertas.jpg`, `Cartoon/beberrao.png`.

**Faltando no repo (subir na v3):**
- Folder da janela (Folder_quase_completo.png) — referência visual nº 1
- Carro_beberrao_sem_fundo.png, Foto_Principal_v2 (bomba na boca), CarronoMorro.png

**Não reaproveitar:**
- `captiva-material/INFO.txt` e as referências — spec do carro animado em curva bezier com partículas e sombra dinâmica. É o DNA da bola de neve; fica no histórico.
- `Background.webp` / hero ilustrado de Brasília — avaliar depois; v1 usa o cartoon do folder.
- Branch `refactor/arquitetura-modular` e o dev2 — encerrados.

**Estrutura proposta da v3:** branch nova `v3` (órfã) no mesmo repo, reaproveitando `Fotos/` e tudo o mais do zero:
```
index.html  style.css  script.js  fotos.json
img/cartoon/   img/fotos/ (as 76 AVIF)   img/recortes/
CLAUDE.md   (cópia resumida deste brief para o Claude Code)
```

## 7. Regras anti-bola-de-neve

1. **Uma seção por sessão de Claude Code.** Só começa a próxima depois de validar a atual no celular.
2. **Definição de pronto da seção:** texto final, imagem final, funciona no celular, sem erro no console.
3. **Estacionamento:** ideia nova durante o trabalho não entra; vai para a lista abaixo e é avaliada depois da v1 no ar.
4. **Prazo da v1:** 6 seções = 6 sessões. Se uma seção passar de 2 sessões, simplifica em vez de insistir.
5. **Bom e no ar > perfeito no dev.** O objetivo é vender o carro, não ganhar prêmio do Awwwards.

## 8. Estacionamento (Lots-o'-Parking 🅿️)

- *(vazio — ideias entram aqui durante o trabalho)*
