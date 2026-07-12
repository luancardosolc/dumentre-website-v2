# E2E Testing — Dumentre

Cobertura E2E do site com [Playwright Test](https://playwright.dev/). O site é HTML/CSS/JS
vanilla sem build step, então os testes locais sobem um `python -m http.server` simples e
apontam o Playwright para ele.

Antes de escrever os testes, o site foi explorado manualmente com o MCP `browseros` — ver
[`site-discovery.md`](./site-discovery.md) para o mapeamento completo (seções, links, CTAs,
FAQ, comportamento do menu mobile) e [`test-plan.md`](./test-plan.md) para a matriz de testes
planejada a partir dessa descoberta.

## Instalação

```bash
npm install
npx playwright install
```

`npx playwright install` baixa os browsers (Chromium, Firefox, WebKit) usados pelo Playwright —
só precisa ser rodado uma vez por máquina (ou quando a versão do `@playwright/test` mudar).

## Build estático (`dist/`)

O site não tem build step de verdade (é HTML/CSS/JS vanilla), mas o repo tem arquivos de
desenvolvimento (`tests/`, `docs/`, `package.json`, `playwright.config.ts`, `tsconfig.json`,
relatórios) que **não podem** ser publicados. `npm run build` roda
`scripts/build-static.js` (só Node.js standard library, sem dependências) e copia **apenas**
os arquivos realmente referenciados pelo site para `dist/`:

```bash
npm run build
```

O script:
1. Confirma que cada arquivo da lista existe em disco — se algo referenciado em `index.html`
   sumir, o build falha alto e claro em vez de publicar um site quebrado.
2. Apaga e recria `dist/`.
3. Copia só esses arquivos (preservando `assets/icons/brands/`).

A lista de arquivos públicos foi construída a partir de um inventário real de `index.html`
(todo `img src`, `link href`, `script src`, `meta og:image`/`twitter:image`, JSON-LD
`logo`/`image`) e de `site.webmanifest` (`icons`) — não é uma lista arbitrária. Se adicionar uma
nova referência local em `index.html`, atualize `PUBLIC_FILES` em `scripts/build-static.js` de
acordo.

`dist/` é git-ignorado (gerado a cada build, nunca commitado).

### Configuração no Cloudflare Pages

O projeto Pages deve usar:
- **Build command:** `npm run build`
- **Build output directory:** `dist`

(Antes disso, o Pages publicava a raiz do repo inteira — incluindo `tests/`, `docs/` e
`package.json` — que não é o que deve ficar público.)

## Rodando os testes localmente

```bash
npm run test:e2e          # roda tudo, exceto os testes de produção
npm run test:e2e:ui       # abre o UI mode do Playwright (interativo)
npm run test:e2e:headed   # roda com o browser visível
```

O `webServer` do `playwright.config.ts` roda `npm run build` e depois sobe
`python -m http.server 8799 -d dist` — ou seja, os testes locais exercitam exatamente o que vai
para produção (o conteúdo de `dist/`, não o repo inteiro). Os testes rodam contra
`http://127.0.0.1:8799` e o servidor cai no final. Não precisa internet — exceto para carregar as
fontes do Google Fonts referenciadas no `<head>` (fora do controle dos testes locais; nenhum
teste depende delas terem carregado).

## Rodando os testes de produção

`production.spec.ts` é a única suíte que acessa a internet de verdade — bate em
`https://dumentre.com`, `https://www.dumentre.com` e `https://dumentre.pages.dev`. Ela é tagueada
com `@production` e **fica de fora do `npm run test:e2e` por padrão** (que roda com
`--grep-invert @production`).

```bash
npm run test:e2e:prod
```

Esse comando roda `playwright test --grep @production` — funciona igual no bash e no PowerShell,
sem precisar de variável de ambiente inline (o padrão `VAR=valor comando` do bash quebra no
PowerShell/cmd do Windows, então evitamos essa abordagem). Se preferir isolar manualmente:

```powershell
# PowerShell — equivalente manual, caso queira rodar sem o script do package.json
npx playwright test --grep "@production"
```

## Abrindo o relatório HTML

```bash
npm run test:e2e:report
```

Abre o último relatório HTML gerado (pasta `playwright-report/`, git-ignorada) num navegador,
com detalhes de cada teste, screenshots de falha e vídeos.

## Lendo traces

Testes que falham geram automaticamente (configurado em `playwright.config.ts`):
- **trace** (`retain-on-failure`) — timeline completa da execução, DOM snapshots, rede, console.
- **screenshot** (`only-on-failure`) — captura no momento da falha.
- **video** (`retain-on-failure`) — gravação do teste inteiro.

Tudo fica em `test-results/` (git-ignorado). Para abrir um trace:

```bash
npx playwright show-trace test-results/<pasta-do-teste>/trace.zip
```

## Testes existentes

| Arquivo | Cobre |
|---|---|
| `smoke.spec.ts` | Página carrega (200), título, meta description, CSS/JS referenciados e aplicados, logo visível, zero erro de console |
| `navigation.spec.ts` | Cada link do header navega para a âncora certa, `active-nav` segue o clique, links do footer resolvem para as mesmas seções (desktop only — nav fica oculta em mobile) |
| `cta-links.spec.ts` | Atributos (`href`/`target`/`rel`) dos botões WhatsApp e e-mail no hero, header e CTA final; todos os links `wa.me`; link de telefone do rodapé. **Nunca clica** em nenhum desses links |
| `mobile-menu.spec.ts` | Hamburger, abrir/fechar (clique/link/Escape), `aria-expanded`, scroll lock do body, e a regressão do bug de overlay (painel cobre a tela real, hero não fica clicável por baixo) — mobile only, viewports reais 375×667 e 390×844 |
| `faq.spec.ts` | 9 perguntas presentes, expandir/colapsar, `aria-expanded`, múltiplos itens abertos ao mesmo tempo |
| `assets.spec.ts` | Logo e ícone do WhatsApp (3 instâncias) carregam com `naturalWidth > 0`, nenhum asset principal retorna erro de rede |
| `favicon.spec.ts` | `favicon.ico` é um ícone binário real (não HTML), os 5 PNGs retornam `image/png`, `site.webmanifest` é JSON válido com `name`/`short_name`/cores corretos, e todas as tags de favicon estão no `<head>` |
| `production.spec.ts` (`@production`) | Smoke mínimo (200, título, CSS, assets sem 404) nas 3 URLs de produção + `favicon.ico` não pode ser o fallback HTML do SPA |

Projetos configurados em `playwright.config.ts`:
- `chromium-desktop` — Desktop Chrome, viewport padrão.
- `chromium-mobile` — Chromium, viewport 375×667.
- `webkit-mobile` — WebKit, viewport 390×844.

## O que está coberto

- Carregamento básico (smoke) local e em produção.
- Navegação por âncora e destaque do link ativo no header desktop.
- Atributos dos CTAs de WhatsApp/e-mail (sem clicar de verdade).
- Menu mobile completo: abrir, cobrir a tela corretamente (regressão do bug de overlay), fechar
  por hamburger/link/Escape, scroll lock.
- FAQ: expandir/colapsar, `aria-expanded`, comportamento não-exclusivo (múltiplos abertos).
- Carregamento de assets principais (logo, ícone WhatsApp) e ausência de 404.
- Smoke de produção nas 3 URLs publicadas.

## Limitações conhecidas

- **Nenhum clique real em `wa.me`/`mailto:`.** Todos os testes de CTA leem `href`/`target`/`rel`
  via `getAttribute`/`toHaveAttribute` — nunca chamam `.click()` nesses elementos. Clicar
  abriria uma aba externa (WhatsApp Web ou o cliente de e-mail do SO), o que é indesejável e
  não-determinístico num ambiente de CI/teste.
- Sem cobertura de screenshot/snapshot visual pixel-perfect nesta primeira fase (deliberado —
  ver `test-plan.md`).
- Não cobre cada um dos 13 links `wa.me` individualmente com sua mensagem pré-preenchida
  específica — cobre-se o padrão (hero, header, CTA final) e a validação estrutural do
  conjunto todo (mesmo número de telefone, `target`/`rel` corretos em todos).
- Firefox não está configurado como projeto (fora do escopo pedido).
- Sem testes de acessibilidade completos ou de performance/Lighthouse.
- Em máquinas sob carga, rodar os 3 projetos de browser em paralelo contra um único
  `http.server` local pode ocasionalmente estourar timeouts individuais; por isso
  `retries: 1` está configurado localmente (2 em CI) — falhas que persistem após o retry são
  reais, não flake.
