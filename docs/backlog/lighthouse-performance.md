# Backlog: Otimização de Performance e Lighthouse ⚡

## Objetivo
Garantir pontuação máxima (perto de 100) no Google Lighthouse para as métricas de Performance, Acessibilidade, Melhores Práticas e SEO.

## Por que isso importa comercialmente?
Sites lentos perdem clientes em segundos (especialmente no mobile via conexões 3G/4G). Além disso, o Google penaliza sites lentos nos resultados de busca orgânica. Alta velocidade significa melhor experiência do usuário, menor custo por clique em anúncios e maior conversão.

## Escopo Inicial
- Otimização de imagens do site (conversão para formato WebP/AVIF e dimensionamento correto).
- Minificação e concatenação de arquivos CSS e JS.
- Inserção de `font-display: swap` em todas as fontes importadas do Google Fonts.
- Eliminação de recursos que bloqueiam a renderização inicial.
- Garantia de conformidade com os Core Web Vitals (LCP, FID, CLS).

## Fora de Escopo por enquanto
- Reconstrução completa do código (a stack já é vanilla exatamente para garantir isso).

## Critérios de Aceite
- Nota de performance superior a 95 no Google PageSpeed Insights (desktop e mobile).
- Sem pulos de layout bruscos (CLS zero).

## Ideias Futuras
- Uso de redes de borda (edge platforms) e Service Workers para carregar recursos de forma instantânea offline.

## Prioridade Sugerida
**Baixa**
