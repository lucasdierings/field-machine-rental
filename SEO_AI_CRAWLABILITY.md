# 🔍 SEO & AI Crawlability Guide — Field Machine

## 📌 Objetivo

Garantir que `fieldmachine.com.br` seja **facilmente descoberto** por:
- 🔎 Google Search
- 🤖 ChatGPT, Claude, Gemini (crawling de IA)
- 🌐 Other search engines (Bing, DuckDuckGo, etc)
- 📱 Social media bots (Facebook, Twitter, LinkedIn)

---

## ✅ Status Atual

### **O que já está implementado:**

✅ **Metadata Completa** (`site/app/layout.tsx`)
- Title, description, keywords
- OpenGraph (Facebook, LinkedIn)
- Twitter Card
- Structured data (JSON-LD)

✅ **Robots.txt** (`site/app/robots.ts`)
- Permite indexação
- Define sitemap

✅ **Sitemap.xml** (`site/app/sitemap.ts`)
- Lista de todas as URLs
- Atualizado dinamicamente

✅ **JSON-LD Schema** (`site/app/layout.tsx`)
- Organization schema
- WebSite schema
- Service schema (agricultural services)

### **Áreas para melhorias:**

⚠️ Múltiplas páginas com metatags individuais (se existirem)
⚠️ Rich snippets para serviços específicos
⚠️ Breadcrumb schema
⚠️ FAQ schema (se houver seção de perguntas)
⚠️ Local Business schema (Paraná, Brasil)

---

## 🔧 Configuração Atual

### **1. Next.js com SSG (Static Site Generation)**

```typescript
// site/next.config.ts
export default {
  // Export estático para Cloudflare
  output: 'export',  // Gera arquivos HTML estáticos
  trailingSlash: true,  // /page/ ao invés de /page
};
```

**Benefícios:**
- HTML pré-renderizado (melhor para bots)
- Rápido (não precisa de Node.js)
- SEO-friendly (static content)

---

### **2. Metadata e Open Graph**

**Arquivo:** `site/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://fieldmachine.com.br'),
  title: 'Field Machine — Plataforma de Serviços para o Agronegócio',
  description: 'Conectamos produtores rurais e prestadores de serviço agrícola...',
  keywords: ['serviços agrícolas', 'aluguel máquinas', ...],

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://fieldmachine.com.br',
    images: [{
      url: '/images/og-image.jpg',
      width: 1200,
      height: 630,
    }],
  },

  twitter: {
    card: 'summary_large_image',
  },
};
```

**Como aparece:**
- No Google: título + descrição
- No Facebook/LinkedIn: imagem grande + título + descrição
- No Twitter: card customizado
- Em bots de IA: todos os metadados

---

### **3. JSON-LD Structured Data**

**Arquivo:** `site/app/layout.tsx`

Implementa:
- ✅ Organization (empresa)
- ✅ WebSite (site principal)
- ✅ WebPage (página)
- ✅ Service (serviço de agricultura)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Field Machine",
      "url": "https://fieldmachine.com.br",
      "description": "Plataforma de serviços para o agronegócio...",
      "areaServed": "BR",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "fieldmachinebrasil@gmail.com",
        "telephone": "+55-45-99144-7004"
      }
    },
    {
      "@type": "Service",
      "name": "Plataforma de Serviços para o Agronegócio",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "itemListElement": [
          "Serviço de Trator",
          "Colheita com Colheitadeira",
          "Pulverização",
          ...
        ]
      }
    }
  ]
}
```

**Usado por:**
- Google: Rich snippets em buscas
- Bots de IA: Melhor compreensão da empresa/serviço
- Schema.org: Padrão web

---

### **4. Robots.txt**

**Arquivo:** `site/app/robots.ts`

```typescript
export default {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/private'],
      crawlDelay: 1,
    },
  ],
  sitemap: 'https://fieldmachine.com.br/sitemap.xml',
};
```

**O que faz:**
- Permite robots acessar `/`
- Bloqueia `/admin` e `/private`
- Define sitemap
- Limita crawl rate (1 segundo entre requests)

---

### **5. Sitemap.xml**

**Arquivo:** `site/app/sitemap.ts`

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://fieldmachine.com.br',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://fieldmachine.com.br/servicos',
      lastModified: new Date(),
      priority: 0.8,
    },
    // ... outras páginas
  ];
}
```

**Output:** `fieldmachine.com.br/sitemap.xml`

---

## 🚀 Implementações Já Feitas

### **1. Canonical URL**

```typescript
alternates: {
  canonical: 'https://fieldmachine.com.br'
}
```

Evita conteúdo duplicado.

---

### **2. Language Specification**

```typescript
<html lang="pt-BR">
```

Indica ao Google que é em português.

---

### **3. og-image.jpg**

```typescript
openGraph: {
  images: [{
    url: '/images/og-image.jpg',
    width: 1200,
    height: 630,
  }],
}
```

Quando alguém compartilha no Facebook/LinkedIn, exibe imagem customizada.

---

## 🔄 Melhorias a Fazer

### **1. Breadcrumb Schema (se houver múltiplas páginas)**

**Arquivo:** Criar `site/app/breadcrumb-schema.ts`

```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://fieldmachine.com.br'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Serviços',
      'item': 'https://fieldmachine.com.br/servicos'
    }
  ]
};
```

Útil se tiver páginas como:
- `/` (home)
- `/sobre` (about)
- `/servicos` (services)
- `/contato` (contact)

---

### **2. FAQ Schema (se houver FAQ)**

Se tiver página com perguntas frequentes:

```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Como funciona o Field Machine?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Field Machine é uma plataforma que conecta...'
      }
    }
  ]
};
```

Google exibe isso em formato de accordion nas buscas.

---

### **3. Local Business Schema (opcional)**

Para melhor localização:

```typescript
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'Field Machine',
  'areaServed': {
    '@type': 'State',
    'name': 'Paraná',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'BR'
    }
  },
  'telephone': '+55-45-99144-7004',
  'email': 'fieldmachinebrasil@gmail.com'
};
```

---

### **4. Imagens Otimizadas com Alt Text**

**Arquivo:** `site/components/Hero.tsx` (ou similar)

```typescript
<img
  src="/images/hero-field-machine.jpg"
  alt="Trator agrícola em campo com produtores negociando no Field Machine"
  width={1200}
  height={630}
  priority
/>
```

Google e bots de IA usam o `alt` text para entender imagens.

---

### **5. Performance & Core Web Vitals**

**Arquivo:** `site/app/layout.tsx`

```typescript
// Já está implementado:
// - Font optimization (Inter com display: 'swap')
// - Static export (SSG)
// - Image optimization

// Adicionar:
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
```

---

## 🤖 AI Bot Crawlability

### **ChatGPT, Claude, Gemini, etc.**

Esses bots usam:

1. **robots.txt** ✅ (já implementado)
   - Verifica se pode acessar

2. **Open Graph + Meta tags** ✅ (já implementado)
   - Entende o conteúdo principal

3. **JSON-LD Schemas** ✅ (já implementado)
   - Estrutura de dados

4. **Sitemaps** ✅ (já implementado)
   - Descobrir todas as páginas

5. **Canonical URLs** ✅ (já implementado)
   - Evita conteúdo duplicado

**Resultado:** Bots de IA conseguem entender a empresa, serviços, localização, contato.

---

## 📊 Verificar Implementação

### **1. Google Search Console**

```
https://search.google.com/search-console
```

1. Adicione property: `fieldmachine.com.br`
2. Verifique propriedade (DNS ou arquivo)
3. Submeta sitemap: `/sitemap.xml`
4. Veja issues de indexação

---

### **2. Google Rich Results Test**

```
https://search.google.com/test/rich-results
```

1. Cole URL: `https://fieldmachine.com.br`
2. Valide structured data
3. Veja como aparece nas buscas

---

### **3. OpenGraph Debugger (Facebook)**

```
https://developers.facebook.com/tools/debug/og/object
```

1. Cole URL: `https://fieldmachine.com.br`
2. Verifique og-image, title, description
3. Teste compartilhamento

---

### **4. Twitter Card Validator**

```
https://cards-dev.twitter.com/validator
```

1. Cole URL
2. Verifique Twitter card
3. Teste preview

---

### **5. SEO Analysis Tools (Grátis)**

- **SEMrush:** https://www.semrush.com/seo-audit-tool/
- **Ahrefs:** https://ahrefs.com/seo-tools/
- **Moz:** https://moz.com/tools
- **BuiltWith:** Veja tech stack

---

## 📱 Mobile-First Indexing

Google prioriza a versão mobile do seu site.

**Checklist:**
- [x] Responsive design (Tailwind CSS)
- [x] Font sizes legíveis
- [x] Buttons grandes (>48px)
- [x] Sem horizontal scroll
- [x] Viewport meta tag (automático no Next.js)

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

---

## 🔗 Google Search Console Checklist

### **Setup Inicial**

1. **Adicione propriedade**
   - [ ] Acesse https://search.google.com/search-console
   - [ ] Clique "Add property"
   - [ ] Selecione "Domain" (não URL)
   - [ ] Digite: `fieldmachine.com.br`

2. **Verifique propriedade**
   - [ ] Acesse seu DNS (Cloudflare, GoDaddy, etc)
   - [ ] Adicione registro TXT fornecido pelo Google
   - [ ] Aguarde até 1h para validação

3. **Submeta Sitemap**
   - [ ] Em GSC, vá em "Sitemaps"
   - [ ] Digite: `fieldmachine.com.br/sitemap.xml`
   - [ ] Google começará indexar

4. **Monitore Indexação**
   - [ ] Vá em "Coverage"
   - [ ] Veja páginas indexadas vs. não indexadas
   - [ ] Corrija erros de indexação

### **Otimizações Contínuas**

- [ ] Monitore Core Web Vitals
- [ ] Veja queries de busca populares
- [ ] Monitore links internos
- [ ] Configure canonical URLs

---

## 🎯 Keywords Alvo

Já implementados em `site/app/layout.tsx`:

```
serviços agrícolas
aluguel máquinas agrícolas
locação equipamentos agrícolas
aluguel trator
aluguel colheitadeira
aluguel pulverizador
aluguel plantadeira
plataforma agrícola Brasil
agronegócio
prestador de serviço agrícola
produtores rurais
contratação serviços rurais
colheita soja milho
preparo de solo
pulverização lavoura
```

---

## 🔐 Blocked Resources (Cloudflare)

Verifique que recursos estão sendo bloqueados:

1. Acesse site com DevTools (`F12`)
2. Aba `Network`
3. Procure por status `403` ou `404`
4. Se há CSS/JS bloqueado, Cloudflare pode estar bloqueando

**Solução:** Em Cloudflare Security → Page Rules, adicionar:
```
fieldmachine.com.br/*
  - Security Level: Low/Medium
  - Cache Level: Cache Everything
```

---

## 📈 Analytics & Monitoring

### **Google Analytics 4 (GA4)**

Adicionar ao `site/app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-BR">
      {/* ... */}
      {children}
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  );
}
```

**Configure em GA4:**
1. Vá em https://analytics.google.com
2. Crie property para `fieldmachine.com.br`
3. Copie ID (formato: G-XXXXXXXXXX)
4. Adicione ao projeto

---

### **Core Web Vitals**

Monitore em:
- Google Search Console → Experience → Core Web Vitals
- PageSpeed Insights: https://pagespeed.web.dev

Métricas importantes:
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1

---

## 🚨 Troubleshooting

### **Google não indexa o site**

1. Verifique `robots.txt`: https://fieldmachine.com.br/robots.txt
   - Deve permitir `/`

2. Verifique sitemap: https://fieldmachine.com.br/sitemap.xml
   - Deve listar URLs

3. Use Google Search Console:
   - "URL Inspection" para testar indexação
   - Clique "Request indexing"

---

### **Metadata não aparece no Facebook/Twitter**

1. Verifique em: https://developers.facebook.com/tools/debug/og/object
2. Clique "Fetch new information"
3. Verifique og-image existe no path `/images/og-image.jpg`

---

### **Imagens não aparecem em buscas**

1. Adicione alt text descritivo em todas as imagens
2. Verifique em Google Search Console → Experience → Images

---

## ✅ Checklist Final — SEO & AI Crawlability

### **Implementação (✅ = Feito)**

- [x] Metadata completa (title, description, keywords)
- [x] Open Graph (og-image, og-title, og-description)
- [x] Twitter Card
- [x] Canonical URL
- [x] robots.txt
- [x] sitemap.xml
- [x] JSON-LD Schema (Organization, WebSite, Service)
- [x] pt-BR language tag
- [x] Mobile responsive
- [x] Font optimization
- [x] Static export (SSG)
- [ ] Google Analytics 4 (em implementação)
- [ ] Google Search Console (em configuração)
- [ ] Breadcrumb Schema (se múltiplas páginas)
- [ ] FAQ Schema (se houver FAQ)
- [ ] Local Business Schema (opcional)
- [ ] Image optimization com alt text

### **Monitoramento**

- [ ] Google Search Console configurado
- [ ] Google Analytics 4 rastreando
- [ ] Core Web Vitals monitorados
- [ ] Sitemap verificado em GSC
- [ ] Rich results validados
- [ ] Mobile friendly testado

---

## 📞 Suporte

Se tiver dúvidas sobre SEO/IA crawling:

1. **Google Search Console Help:** https://support.google.com/webmasters
2. **Schema.org:** https://schema.org/
3. **Next.js SEO:** https://nextjs.org/docs/guides/seo

---

**Versão:** 1.0 | **Data:** 2026-03-21

Seu site está pronto para ser descoberto por Google, bots de IA, e ferramentas de busca! 🚀
