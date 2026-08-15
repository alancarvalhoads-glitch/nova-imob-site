# Banner de assinatura de e-mail — Nova Imob

`assinatura-email-banner.png` — 560×118 (renderizado em 2x, 1120×236).

Assinatura completa em uma peça só: nome, cargo, divisor e o wordmark
`novAImob` com tagline. Fundo na base escura da marca (`#0B0F19`) com brilho
degradê azul→roxo saindo da direita.

## Por que não está em uso

Foi aprovado visualmente em 14/08/2026, mas **deixado de fora da campanha de
prospecção outbound de propósito**: os e-mails frios rodam sem nenhuma imagem
nem link, porque isso reduz risco de cair em spam.

Guardado para fluxos onde a entregabilidade não é o gargalo:

- sequências opt-in (quem baixou isca, quem se inscreveu)
- e-mails para lead que já respondeu
- assinatura em e-mail 1:1

## Se for usar

1. Suba o PNG em host próprio (ex.: `alancarvalho.pro/img/`) e referencie por
   URL absoluta. Nada de SVG: o Gmail remove.
2. Ponha `alt` com nome + cargo em texto. Outlook desktop bloqueia imagem por
   padrão e sem `alt` a assinatura some.
3. Largura máxima 560px, com `style="max-width:100%;height:auto"`.

## Regerar

`assinatura-email-banner.fonte.html` é a fonte. Tem duas variantes (A = base
escura, aprovada; B = degradê pleno, descartada porque o "AI" do wordmark perde
o brilho em fundo claro). Renderizar com Playwright em `scale: device` para
sair nítido em retina. Fontes vêm do Google Fonts (Space Grotesk + Inter).
