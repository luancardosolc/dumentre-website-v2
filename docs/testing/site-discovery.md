# Site Discovery — Dumentre

Descoberta manual feita navegando o site em produção com o MCP `browseros`, antes de escrever
qualquer teste Playwright. Objetivo: mapear a estrutura real do DOM, links, comportamento
interativo e riscos, para que os testes fiquem alinhados ao site real (não a suposições).

## URLs visitadas

- `https://dumentre.com` (principal, usada para toda a exploração detalhada)
- `https://www.dumentre.com` (smoke check: título, H1 e `style.css` presentes — idêntico ao apex)
- `https://dumentre.pages.dev` (smoke check: título, H1 e `style.css` presentes — idêntico ao apex)

Título da página: `Dumentre | Sites, Sistemas e Automações Inteligentes`
Meta description: `A Dumentre cria sites, sistemas customizados e automações inteligentes sob
medida para pequenas e médias empresas que querem vender, atender e operar melhor.`

## Seções encontradas (na ordem do DOM)

| Seção | Seletor | Notas |
|---|---|---|
| Hero | `.hero-section` (sem id) | título, subtítulo, 2 CTAs, mockup visual à direita (`digital-funnel`) |
| Problemas | `#problemas` `.problems-section` | cards de problemas |
| Banner CTA intermediário | `.mid-cta-banner` (sem id) | botão "Analisar meu Caso no WhatsApp" |
| Soluções | `#solucoes` `.solutions-section` | |
| Comece Pequeno | `#produtos-entrada` `.entry-products-section` | 8 links `entry-link`, todos wa.me com mensagens pré-preenchidas diferentes |
| Como Funciona | `#como-funciona` `.how-it-works-section` | |
| Diferenciais | `#diferenciais` `.technical-differences-section` | |
| (sem nome de menu) | `.target-audience-section` (sem id) | não está no menu de navegação |
| FAQ | `#faq` `.faq-section` | 9 perguntas em `.faq-item` |
| CTA final | `.final-cta-section` (sem id) | botão "Falar no WhatsApp" + "Enviar e-mail" |
| Footer | `.main-footer` | logo, nav duplicada, coluna de contato/redes sociais |

## Header

### Desktop
- Logo: `<a class="logo-link" href="#">` com `<img alt="Logo Dumentre">` + texto "DUMENTRE".
- Nav links (`.nav-link`): Problemas `#problemas`, Soluções `#solucoes`, Comece Pequeno
  `#produtos-entrada`, Como Funciona `#como-funciona`, Diferenciais `#diferenciais`, FAQ `#faq`.
- CTA "Falar no WhatsApp" dentro de `.nav-cta-wrapper`, escondido no topo da página (classe
  `cta-hidden` seria aplicada, mas por padrão já nasce sem — a visibilidade é controlada pelo
  `IntersectionObserver` do hero) e reaparece assim que o hero sai do viewport
  (`.main-header.header-scrolled` + `.nav-cta-wrapper` sem `cta-hidden`). Confirmado clicando e
  rolando: no topo `cta-hidden` não é setado inicialmente pela classe, mas o botão só fica
  realmente visível/opaco via CSS quando o hero não está intersectando; após rolar, `header-scrolled=true`
  e o botão fica visível.
- Clicar num nav-link atualiza `location.hash`, rola até a seção e marca `.active-nav` no link
  correto (testado clicando em "Soluções" → hash vira `#solucoes`, só esse link fica com
  `active-nav`).

### Mobile (validado via DOM/JS, sem redimensionar viewport — ver "Riscos e limitações")
- Botão hamburger: `.mobile-nav-toggle` (`aria-controls="primary-navigation"`,
  `aria-expanded="false"` inicialmente, `aria-label="Abrir Menu"`), 3 `span.hamburger-bar`.
- Ao clicar (`.click()` disparado via JS): `aria-expanded` vira `"true"`, `.nav-menu` recebe
  classe `.active`, `document.body.style.overflow` vira `"hidden"` (scroll lock confirmado).
- Fechar clicando em qualquer `.nav-link`: confirmado — volta a `aria-expanded="false"`,
  `.active` removida.
- Fechar com tecla Escape: confirmado via `KeyboardEvent('keydown', {key:'Escape'})` — mesmo
  resultado.
- Não há um botão "X" dedicado — o próprio botão hamburger (`.mobile-nav-toggle`) se transforma
  visualmente em X via CSS (`[aria-expanded="true"] .hamburger-bar` com rotação/opacidade), é o
  mesmo elemento clicável para abrir e fechar.
- Bug do overlay mobile (menu não cobrindo o hero corretamente): **já corrigido** — confirmado
  buscando `style.css` de produção e checando a regra `.nav-menu` dentro de
  `@media (max-width: 900px)`: usa `height: calc(100vh - var(--header-height))` em vez do antigo
  `bottom: 0` (que quebrava por causa do `backdrop-filter` no `.main-header`, que vira containing
  block para `position: fixed`). Commit relacionado: `211a5a2 fix: correct mobile navigation overlay`.

## Hero

- Título (`h1.hero-title`): "Sites, sistemas e automações inteligentes para empresas que querem
  vender, atender e operar melhor." (com `<span>` destacando "atender e").
- Subtítulo (`.hero-subtitle`): parágrafo sobre soluções digitais enxutas.
- Botão "Falar no WhatsApp" (`.btn-primary.btn-whatsapp`, primeiro da página): ícone
  `assets/icons/brands/whatsapp.svg` + texto, `href` para `wa.me`, `target="_blank"`,
  `rel="noopener"`.
- Botão "Enviar e-mail" (`.btn-secondary`): `mailto:simplificasoftwares@gmail.com?subject=...`.
- Texto pequeno: "Conversa inicial sem compromisso • Estudo de viabilidade técnica".
- Painel visual à direita (`.hero-container` grid): mockup de navegador falso mostrando
  "dumentre.com/digital-funnel" com 4 linhas de features (Presença Local & SEO, Landing Page de
  Conversão, WhatsApp & Chatbot 24/7, Observabilidade Ativa) — puramente decorativo, sem link.

## Links mapeados

### Internos (hash, mesma página)
6 no header + 1 "Dumentre" (`#`) e 6 no footer, todos apontando para os ids de seção reais
listados acima (`#problemas`, `#solucoes`, `#produtos-entrada`, `#como-funciona`,
`#diferenciais`, `#faq`). Todos resolvem para um elemento existente no DOM.

### wa.me (WhatsApp) — 13 ocorrências
Todas com `target="_blank"` e `rel="noopener"`, todas para o número `5511936217352`, cada uma com
uma mensagem pré-preenchida (`?text=...`) diferente conforme o contexto do botão (hero, header,
banner intermediário, 8 CTAs de "Comece Pequeno", CTA final, telefone no rodapé sem texto
pré-definido).

### mailto: — 3 ocorrências
Hero, CTA final e rodapé, todas para `simplificasoftwares@gmail.com` (as duas primeiras com
`subject`/`body` pré-preenchidos, a do rodapé é só o endereço puro).

### Externos — 3 ocorrências (rodapé)
- Instagram `https://www.instagram.com/dumentre.co/` (`target="_blank"`)
- Facebook `https://www.facebook.com/dumentre` (`target="_blank"`)
- Google Maps `https://maps.app.goo.gl/G6Bma2tb2nvxVeah9` (`target="_blank"`)

## FAQ

- 9 perguntas, cada uma `<button class="faq-trigger" aria-expanded="false">` dentro de
  `.faq-item`.
- Clicar alterna `aria-expanded` entre `"true"`/`"false"` e adiciona/remove a classe `.active` no
  `.faq-item` pai.
- **Múltiplos itens podem ficar abertos ao mesmo tempo** — não é um accordion exclusivo. Testado
  abrindo os itens 0 e 1 simultaneamente: ambos ficaram com `aria-expanded="true"`.
- Cada item tem um `.faq-answer` correspondente no DOM (sempre presente, exibido/ocultado via
  CSS/altura, não removido do DOM).

## Assets

| Asset | URL | Status |
|---|---|---|
| CSS | `/style.css` | 200, carregado |
| Google Fonts | `fonts.googleapis.com/css2?family=Inter...` | 200, carregado |
| JS | `/script.js` | 200, carregado |
| Logo | `/dumentre-logo-white-letters.png` | 200, `naturalWidth=624`, usado 2x (header + footer) |
| Ícone WhatsApp | `/assets/icons/brands/whatsapp.svg` | 200, `naturalWidth=150`, usado 3x (header, hero, CTA final) |

Nenhum 404 observado no console em nenhuma das 3 URLs testadas. Console sem warnings/erros.

## Responsividade

- Desktop grande: validado visualmente via screenshot (1600px), layout ok.
- Mobile 375×667 / 390×844: **não foi possível redimensionar o viewport real do navegador** —
  o MCP `browseros` disponível nesta sessão não expõe uma ferramenta de resize/emulação de
  dispositivo (sem `setViewportSize`/CDP `Emulation.setDeviceMetricsOverride`). Em vez disso, o
  comportamento mobile foi validado por dois caminhos complementares:
  1. Leitura do CSS de produção (`@media (max-width: 900px)`) confirmando as regras esperadas.
  2. Disparo sintético dos mesmos handlers de clique/teclado que rodariam em mobile
     (`.mobile-nav-toggle.click()`, `Escape`, clique em `.nav-link`), confirmando que a lógica
     JS (aria-expanded, classe `.active`, scroll lock) funciona corretamente.
  A cobertura real de viewport 375×667 / 390×844 fica a cargo do Playwright (que tem
  `page.setViewportSize` de verdade), não desta descoberta manual.

## Riscos observados

1. **CTA do header some/aparece por scroll** — depende de `IntersectionObserver`; testes de
   navegação devem considerar isso ao localizar o botão do header (pode não estar visível/clicável
   no topo da página).
2. **FAQ não é exclusivo** — um teste que assume "só um aberto por vez" estaria errado; múltiplos
   itens podem ficar abertos.
3. **Nenhum "X" dedicado no menu mobile** — o mesmo botão hamburger fecha o menu; testes devem
   mirar `.mobile-nav-toggle`, não um botão separado.
4. **`.logo-link` aponta para `href="#"`** — clicar nele não navega para nenhuma seção real (âncora
   vazia); não deve ser tratado como link de navegação de seção.
5. **Painel mock do hero é puramente visual**, sem links reais — não precisa de cobertura de
   clique/link.
6. Não há forma de testar viewport mobile real via `browseros` nesta sessão — a suíte Playwright é
   a única camada que efetivamente teste 375×667 / 390×844 com precisão.

## O que será coberto pelo Playwright

- Smoke test local (título, meta, CSS/JS carregando, logo visível, console sem erro).
- Navegação por âncoras internas (todas as seções do menu).
- Atributos dos CTAs de WhatsApp e e-mail (href/target/rel) sem clicar de verdade.
- Menu mobile: abrir, cobrir tela corretamente, fechar por X/link/Escape, scroll lock — usando
  `page.setViewportSize` real do Playwright (375×667 e 390×844/414×896).
- FAQ: expandir/colapsar, `aria-expanded`, múltiplos itens abertos.
- Assets: logo e ícone WhatsApp carregando, `naturalWidth > 0`, sem 404 nos assets principais.
- Smoke mínimo em produção: `dumentre.com`, `www.dumentre.com`, `dumentre.pages.dev`.

## O que NÃO será coberto nesta primeira fase

- Clique real em links `wa.me`/`mailto:` que abrem apps/abas externas (só atributos são
  validados).
- Testes de screenshot/snapshot visual pixel-perfect.
- Cobertura de todos os 13 links wa.me individualmente (cobre-se o padrão — hero, header, CTA
  final — e valida-se a contagem/estrutura geral dos demais, não cada texto de mensagem).
- Firefox (fora do escopo pedido; usamos Chromium desktop/mobile e, se disponível, WebKit mobile).
- Testes de acessibilidade completos (apenas os atributos `aria-expanded` já usados pelo próprio
  site são verificados).
- Testes de performance/Lighthouse.
