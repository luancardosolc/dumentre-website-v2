# Backlog: Deploy e Configuração de Domínio 🌐

## Objetivo
Publicar o site no domínio oficial `dumentre.com` utilizando uma infraestrutura de hospedagem moderna, segura e com CDN global.

## Por que isso importa comercialmente?
O site oficial precisa estar online com estabilidade de 99.9%, segurança HTTPS ativa e carregamento extremamente rápido em qualquer região do Brasil para receber campanhas de anúncios comerciais.

## Escopo Inicial
- Escolha da plataforma de hospedagem de arquivos estáticos (Vercel, Netlify, Cloudflare Pages ou AWS S3+CloudFront).
- Configuração e apontamento dos servidores de DNS da Dumentre para a nova hospedagem.
- Ativação de certificado SSL/TLS gratuito automático (HTTPS) para navegação segura.
- Configuração de regras de cache agressivas na CDN para o site carregar instantaneamente.

## Fora de Escopo por enquanto
- Servidores de backend complexos (o site é e continuará sendo estático por razões de performance e custo).

## Critérios de Aceite
- Acesso funcionando sem erros via `https://dumentre.com` e `https://www.dumentre.com`.
- Redirecionamento automático HTTP para HTTPS.
- Deploy contínuo configurado integrado ao repositório GitHub (Push to Main -> Auto Deploy).

## Ideias Futuras
- Monitoramento de uptime com alertas por WhatsApp caso o domínio fique indisponível por qualquer razão.

## Prioridade Sugerida
**Alta**
