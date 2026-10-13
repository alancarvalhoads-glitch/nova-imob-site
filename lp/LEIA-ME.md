# /lp — LP do Plantao Infinito, servida em lp.novaimob.tech

Esta pasta e a landing page de anuncios. Ela vive no mesmo repositorio e no
mesmo projeto do Cloudflare Pages que o site, mas e servida no subdominio
`lp.novaimob.tech`.

## Por que existe uma regra no Cloudflare

No Pages, **todo dominio ligado ao projeto serve a raiz do projeto**. Ligar
`lp.novaimob.tech` ao projeto, sozinho, faria o subdominio exibir a mesma
`index.html` da home. E o arquivo `_redirects` nao resolve: ele nao casa por
hostname (os docs dizem textualmente que redirect por dominio nao e suportado).

Quem faz o subdominio apontar para esta pasta e **uma Transform Rule de URL
Rewrite**, na zona `novaimob.tech`:

| campo | valor |
|---|---|
| Nome | `lp.novaimob.tech serve /lp` |
| If (expressao) | `http.host eq "lp.novaimob.tech"` |
| Then > Path | Rewrite to > **Dynamic** > `concat("/lp", http.request.uri.path)` |
| Query | nao mexer |

O rewrite e invisivel: o visitante continua vendo `lp.novaimob.tech/`.

Caminho no painel: **novaimob.tech > Rules > Transform Rules > URL Rewrite**.

## Por que o CSS e o JS do modal sao URL absoluta

O rewrite vale para **todo** caminho do subdominio. Se a pagina pedisse
`/assets/cta-modal.js`, o pedido viraria `/lp/assets/cta-modal.js` e daria 404.

As duas opcoes eram duplicar os assets aqui dentro ou apontar para o dominio
principal. Duplicar criaria duas copias do modal, e corrigir uma e esquecer a
outra e o tipo de falha silenciosa que ja nos custou tempo. Entao esta pagina
carrega `https://novaimob.tech/assets/cta-modal.(css|js)`: **uma copia so**,
a mesma que a home, o blog e a /lp-2 usam.

Consequencia pratica: ao mexer em `assets/cta-modal.js`, conferir esta LP tambem.

## noindex

A pagina esta com `noindex, follow` de proposito. Enquanto a home for a mesma
peca do Plantao Infinito, as duas indexadas seriam conteudo duplicado. Quando a
home virar institucional, decidir se libera a indexacao.

## Metricas

O subdominio por si so nao separa metrica nenhuma: GA4 e Pixel vem das tags do
HTML, que hoje sao as mesmas da home (`G-ZRHBKM39WX`, pixel `1323374123103378`).
Para ler a LP separada no GA4, criar um **fluxo de dados proprio** para
`lp.novaimob.tech` e trocar o ID aqui. No Pixel, manter o mesmo e proposital:
publico unico otimiza melhor.
