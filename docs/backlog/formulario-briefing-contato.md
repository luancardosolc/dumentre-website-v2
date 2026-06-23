# Backlog: Formulário de Briefing e Contato 📝

## Objetivo
Implementar um formulário interativo de captação de leads qualificados no site oficial da Dumentre, permitindo que o cliente descreva seu projeto e necessidades básicas antes de ser direcionado ao atendimento comercial.

## Por que isso importa comercialmente?
Embora o contato direto pelo WhatsApp seja de baixíssima fricção, alguns clientes preferem descrever detalhadamente suas necessidades de forma assíncrona por e-mail ou formulário. Além disso, o preenchimento de um briefing preliminar ajuda a equipe comercial da Dumentre a se preparar melhor para a reunião de vendas, economizando tempo de qualificação.

## Escopo Inicial
- Formulário estático com campos de: Nome, E-mail, Telefone/WhatsApp, Nome da Empresa, Ramo de Atuação, Tipo de Solução Desejada (Site, Automação, CRM, Outros) e Descrição do Projeto.
- Integração simples com serviço de e-mail seguro ou ferramenta de captação estática (como Formspree, Web3Forms ou similar) em fase futura.
- Mensagem de sucesso amigável pós-envio, orientando o cliente sobre o tempo de retorno (ex.: "Responderemos em até 24 horas").

## Fora de Escopo por enquanto
- Criação de banco de dados e backend próprio para salvar os contatos.
- Validações de inteligência artificial de preenchimento.

## Critérios de Aceite
- O formulário deve ter design responsivo e premium, alinhado à identidade visual.
- Os campos obrigatórios devem ser validados no client-side.
- Deve haver proteção contra bots/spam (ex.: reCAPTCHA v3 ou Cloudflare Turnstile).

## Ideias Futuras
- Formulário dinâmico no estilo "passo a passo" (multi-step form) com micro-animações para aumentar a taxa de preenchimento.

## Prioridade Sugerida
**Alta**
