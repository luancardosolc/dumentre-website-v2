# Test Plan — Playwright E2E (Dumentre)

Baseado em `site-discovery.md`. Todos os testes locais rodam contra um `http.server` Python
servindo os arquivos estáticos do repo (`python -m http.server`), sem depender de internet.
`production.spec.ts` é a única suíte que acessa a internet/produção e roda separada.

## Matriz de testes

### 1. `smoke.spec.ts`
- Página carrega com status 200 e `<title>` correto.
- Meta description presente.
- `style.css` e `script.js` estão referenciados e carregam (sem erro de rede).
- Logo (`img[alt="Logo Dumentre"]`) visível e com `naturalWidth > 0`.
- Nenhum erro de console do tipo `pageerror`/`console.error` durante o carregamento.

### 2. `navigation.spec.ts`
- Cada link do header (`Problemas`, `Soluções`, `Comece Pequeno`, `Como Funciona`,
  `Diferenciais`, `FAQ`) navega para a âncora correta (`location.hash` muda) e a seção alvo fica
  visível no viewport.
- Link ativo (`active-nav`) muda para o item clicado.
- Os mesmos links no footer resolvem para os mesmos ids de seção (existência da seção, sem
  precisar repetir o teste de scroll).

### 3. `cta-links.spec.ts`
- Botão "Falar no WhatsApp" do hero: `href` começa com `https://wa.me/5511936217352`,
  `target="_blank"`, `rel` contém `noopener`.
- Botão "Falar no WhatsApp" do header e do CTA final: mesmos atributos.
- Botão "Enviar e-mail" do hero e do CTA final: `href` começa com
  `mailto:simplificasoftwares@gmail.com`.
- Nenhum clique real disparado nesses elementos — apenas leitura de atributos via `getAttribute`.
- Link do telefone no rodapé (`+55 11 93621-7352`) aponta para `wa.me` sem `?text=`.

### 4. `mobile-menu.spec.ts` (viewport mobile real via Playwright)
- Em viewport 375×667: hamburger visível, nav desktop não visível.
- Clicar no hamburger abre o menu: `aria-expanded="true"`, `.nav-menu.active`.
- O painel do menu cobre a área abaixo do header (bounding box do `.nav-menu` começa no fim do
  header e vai até o fim do viewport) — valida que o bug do overlay continua corrigido.
- O título do hero não fica clicável/visível por cima do menu aberto (checagem de
  `elementFromPoint` ou z-index/visibilidade).
- Clicar de novo no botão (que virou "X" visualmente) fecha o menu.
- Clicar em um link do menu fecha o menu.
- Tecla Escape fecha o menu.
- Enquanto aberto, `document.body.style.overflow === 'hidden'`; ao fechar, volta a vazio.
- Repetir os checks essenciais (abrir/cobrir/fechar) em 390×844.

### 5. `faq.spec.ts`
- As 9 perguntas estão presentes e visíveis.
- Clicar na primeira pergunta: `aria-expanded` vira `"true"`, resposta fica visível.
- Clicar de novo: volta para `"false"`.
- Abrir duas perguntas diferentes ao mesmo tempo: ambas permanecem com `aria-expanded="true"`
  (comportamento não-exclusivo confirmado na descoberta).

### 6. `assets.spec.ts`
- Logo carrega (`naturalWidth > 0`, sem 404 via evento de `response`).
- `whatsapp.svg` carrega (mesma checagem) nas 3 instâncias (header, hero, CTA final).
- Nenhuma resposta de rede com status ≥ 400 para os assets principais (`style.css`, `script.js`,
  logo, ícone) durante o carregamento da página.

### 7. `production.spec.ts` (tag `@production`, não roda por padrão)
- Smoke mínimo em `https://dumentre.com`: status 200, título correto, CSS carregado.
- Smoke mínimo em `https://www.dumentre.com`: idem.
- Smoke mínimo em `https://dumentre.pages.dev`: idem.
- Sem navegação/interação pesada — só carregar e checar render básico + ausência de 404 nos
  assets principais.

## Fora de escopo nesta fase
Ver seção "O que NÃO será coberto" em `site-discovery.md`.
