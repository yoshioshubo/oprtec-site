# oprtec-site

Site institucional da OPRtec - https://www.oprtec.com.br

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Tailwind CSS 4**
- **next-intl** - portugues (raiz), ingles (`/en`) e espanhol (`/es`); todo texto fica em `messages/{locale}.json`
- **Firebase** (Firestore) - leads do formulario de contato e contatos editaveis em `/admin`
- **Mercado Pago** (PreApproval + Card Payment Brick) - assinatura dos planos
- Deploy: **Railway**, build automatico a cada push na `master`

## Rodando local

```bash
npm install
npm run dev
```

`MERCADOPAGO_ACCESS_TOKEN` precisa estar no `.env.local` para o checkout funcionar (sem
ele, `/api/assinar` responde 500 com "pagamento nao configurado"). As chaves do Firebase e
a public key do Mercado Pago sao publicas por natureza e ficam no codigo.

## Estrutura

```
src/app/[locale]/       paginas (home, produtos, planos, cases, sobre, contato,
                        avaliacao, checkout, termos, privacidade, admin)
src/app/api/assinar/    cria a assinatura no Mercado Pago (rate limit por IP)
src/app/robots.js       robots.txt
src/app/sitemap.js      sitemap.xml com hreflang dos 3 idiomas
src/components/         Header, Footer, CookieBanner, WhatsAppButton, ...
src/lib/                contato (padroes + normalizacao), siteConfig (Firestore), rateLimit
src/data/               planos e ordem dos produtos (textos ficam em messages/)
messages/               pt.json, en.json, es.json - mesmas chaves nos tres
firestore.rules         regras do Firestore (publicar pelo console do Firebase)
```

## Convencoes

- Todo texto visivel vai para `messages/` nos tres idiomas - nada fixo na pagina.
- Links internos usam `Link` de `@/i18n/navigation` (resolve o prefixo de idioma sozinho).
- As regras do Firestore sao a barreira real de permissao; validacao no cliente e so UX.
- `/admin` e `/checkout` ficam fora do sitemap e bloqueados no robots.txt.
