# 🎯 Estratégia de SEO Otimizado — Field Machine

## 📊 Análise da Concorrência

Você está competindo com:
- 🔴 **cnabrasilorg.br** (site grande, autoridade)
- 🟡 **MF Rural** (marketplace consolidado)
- 🟡 **Agro** (portal agrícola)
- 🔵 **Advogados Carneiro** (conteúdo especializado)

**Oportunidade:** Ninguém está focado em **MARKETPLACE P2P** de serviços. Você tem um nicho único!

---

## 🎯 Estratégia de SEO em 3 Camadas

### **Camada 1: Otimizar Página Principal (Site)**

**Arquivo:** `site/app/page.tsx`

Adicione estas seções com conteúdo rico:

#### **1. Hero Section Otimizado**
```html
<section>
  <h1>Plataforma de Serviços Agrícolas — Conectando Produtores e Prestadores</h1>
  <p>Alugue máquinas agrícolas, contrate serviços de preparo de solo, colheita e pulverização
     sem intermediários. Negociação direta, sem taxas.</p>

  <img alt="Trator agrícola em campo com produtor rural — Field Machine plataforma de serviços"
       src="/images/hero-trator.jpg" />
</section>
```

#### **2. Seção de Serviços com Schema**
```tsx
// Cada serviço tem seu próprio schema
const servicos = [
  {
    name: "Aluguel de Trator Agrícola",
    description: "Máquinas modernas para plantio, aração e colheita...",
  },
  {
    name: "Serviço de Colheita Mecanizada",
    description: "Colheitadeiras para soja, milho e outros grãos...",
  },
  {
    name: "Pulverização Agrícola",
    description: "Aplicação de defensivos e fertilizantes...",
  },
  {
    name: "Preparo de Solo",
    description: "Aração, gradagem e nivelamento...",
  },
  {
    name: "Plantio Mecanizado",
    description: "Plantadeiras para semeadura de precisão...",
  },
  {
    name: "Transporte Agrícola",
    description: "Caminhões e carretas para transporte de grãos...",
  },
];
```

#### **3. FAQ Section (Aparece no Google!)**
```html
<section>
  <h2>Perguntas Frequentes sobre Serviços Agrícolas</h2>

  <details>
    <summary>Como funciona a plataforma Field Machine?</summary>
    <p>Field Machine é um marketplace que conecta produtores rurais (demandantes)
       com prestadores de serviços agrícolas (ofertantes). Você publica sua máquina
       ou serviço, recebe pedidos, negocia direto e realiza o serviço.</p>
  </details>

  <details>
    <summary>Qual é a taxa de comissão do Field Machine?</summary>
    <p>Field Machine não cobra taxa de comissão! Você negocia direto com o cliente
       e acerta os valores entre vocês. Sem intermediários, sem custos ocultos.</p>
  </details>

  <details>
    <summary>Como alugar uma máquina agrícola no Field Machine?</summary>
    <p>1. Acesse app.fieldmachine.com.br
       2. Faça login ou crie conta
       3. Busque máquinas por localização
       4. Selecione as datas
       5. Envie solicitação ao proprietário
       6. Negocie via chat
       7. Confirme o aluguel</p>
  </details>

  <details>
    <summary>Quais tipos de serviços disponho no Field Machine?</summary>
    <p>• Aluguel de trator
       • Colheita mecanizada
       • Pulverização agrícola
       • Preparo de solo
       • Plantio mecanizado
       • Transporte agrícola
       • E mais...</p>
  </details>
</section>
```

#### **4. Conteúdo Informativo (Blog Section)**
```html
<section>
  <h2>Guias e Dicas de Serviços Agrícolas</h2>

  <article>
    <h3>Guia Completo: Como Alugar um Trator Agrícola Online</h3>
    <p>Dicas para economizar até 40% nos custos de aluguel...</p>
  </article>

  <article>
    <h3>Diferenças entre Colheita Mecanizada e Manual</h3>
    <p>Qual é mais eficiente para sua fazenda?</p>
  </article>
</section>
```

---

### **Camada 2: Criar Conteúdo de Blog**

**Arquivo:** `site/app/blog/[slug]/page.tsx`

Crie posts sobre:

```
1. "Aluguel de Máquinas Agrícolas: Guia Prático para 2026"
   Keywords: aluguel máquinas agrícolas, locação trator, custo aluguel

2. "Pulverização Agrícola: Como Escolher o Serviço Certo"
   Keywords: pulverização agrícola, aplicação defensivos, serviço pulverização

3. "Preparo de Solo: Técnicas Modernas e Custos"
   Keywords: preparo solo, aração, gradagem, aluguel grade

4. "Colheita Mecanizada: Economize até 40% com Compartilhamento"
   Keywords: colheita mecanizada, colheitadeira aluguel, colheita soja

5. "Como Começar como Prestador de Serviços Agrícolas"
   Keywords: prestador serviços agrícolas, como alugar máquina, renda extra
```

Cada post deve ter:
- **2000-3000 palavras** (Google adora conteúdo longo)
- **Palavras-chave naturais** (não forçado)
- **Imagens otimizadas** com alt text
- **Links internos** para app.fieldmachine.com.br
- **Schema BlogPosting** no JSON-LD

---

### **Camada 3: Otimizar Meta Tags e JSON-LD**

**Arquivo:** `site/app/layout.tsx` (atualizar)

```typescript
// Expandir keywords
keywords: [
  // Existentes
  'aluguel máquinas agrícolas',
  'prestador de serviço agrícola',

  // NOVOS - Long-tail keywords
  'aluguel trator por hora',
  'aluguel colheitadeira preço',
  'serviço pulverização agrícola',
  'preparo de solo contratação',
  'plantio mecanizado custo',
  'transporte grãos preço',

  // Variações regionais
  'aluguel máquina agrícola Paraná',
  'serviço agrícola Santa Catarina',
  'aluguel equipamento rural Brasil',

  // Termos de transação
  'onde alugar trator',
  'como contratar pulverização',
  'aluguel máquina agrícola online',
  'plataforma aluguel máquinas',
  'marketplace serviços agrícolas',
],
```

**JSON-LD FAQSchema** (adicionar):
```typescript
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como alugar máquinas agrícolas no Field Machine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Acesse app.fieldmachine.com.br, crie conta, busque máquinas, selecione datas, envie solicitação e negocie com o proprietário."
      }
    },
    // ... mais FAQ
  ]
}
```

---

## 🚀 Otimizações de Performance (Core Web Vitals)

### **1. Otimizar Imagens**
```typescript
import Image from 'next/image';

// ❌ Ruim
<img src="/trator.jpg" alt="trator" />

// ✅ Bom
<Image
  src="/trator.jpg"
  alt="Trator agrícola JD 8520 para aluguel — Field Machine"
  width={1200}
  height={630}
  priority // Hero image
  placeholder="blur"
/>
```

### **2. Lazy Loading para Componentes**
```typescript
import dynamic from 'next/dynamic';

const FAQSection = dynamic(() => import('./FAQ'), {
  loading: () => <p>Carregando...</p>,
});
```

### **3. Compressão e Caching**
No `next.config.ts`:
```typescript
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  compress: true,
};
```

---

## 📱 Otimizar para Mobile

Google prioriza versão mobile!

```typescript
// site/app/layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a', // Verde Field Machine
};
```

**Mobile Checklist:**
- [x] Responsive design (Tailwind)
- [ ] Botões >48px (toque fácil)
- [ ] Textos legíveis sem zoom
- [ ] Sem horizontal scroll
- [ ] Carregamento rápido

---

## 🔗 Construir Backlinks (Authority)

Google valoriza sites que links para você!

**Estratégias:**

### **1. Parceria com Influenciadores Agrícolas**
- Enviar para YouTubers/Instagrammers agrícolas
- "Vimos seu conteúdo, Field Machine pode ajudar seus seguidores"

### **2. Criar Recurso Linkável**
- "Guia Completo de Preços de Aluguel de Máquinas 2026"
- Sites agrícolas vão querer linkar

### **3. Mencionar Blogs Agrícolas**
- Link para artigos de especialistas
- Eles vão notar e podem relinkar

### **4. Diretórios e Listagens**
- Google My Business
- Listagem em diretórios agrícolas
- Plataformas de marketplace

---

## 📊 Monitorar Progresso

### **1. Google Search Console**
```
https://search.google.com/search-console
→ Aba "Performance"

Acompanhe:
- Cliques (quantas vezes clicam no seu site)
- Impressões (quantas vezes aparece)
- CTR (taxa de clique = cliques ÷ impressões)
- Posição média (ranking)
```

**Metas iniciais:**
- 1 mês: 100 impressões
- 3 meses: 1000 impressões, 50 cliques
- 6 meses: 5000 impressões, 500 cliques

### **2. PageSpeed Insights**
```
https://pagespeed.web.dev

Testes:
- fieldmachine.com.br (site)
- app.fieldmachine.com.br (app)

Metas:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >95
```

### **3. Analytics (Google Analytics 4)**
```
Acompanhe:
- Usuários novos (tráfego orgânico)
- Tempo na página
- Taxa de rejeição
- Conversões (cliques para app)
```

---

## 🎯 Plano de 30 Dias

### **Semana 1: Otimizar Página Principal**
- [ ] Expandir conteúdo hero section
- [ ] Adicionar seção de serviços com schema
- [ ] Adicionar FAQ com FAQPage schema
- [ ] Otimizar imagens (alt text descritivo)

### **Semana 2: Criar Conteúdo de Blog**
- [ ] 1º artigo: "Guia Aluguel de Máquinas Agrícolas"
- [ ] 2º artigo: "Pulverização Agrícola"
- [ ] Cada um com 2000+ palavras

### **Semana 3: Performance & Mobile**
- [ ] Testar PageSpeed Insights
- [ ] Melhorar Core Web Vitals
- [ ] Testar mobile responsiveness
- [ ] Adicionar Google Analytics 4

### **Semana 4: Monitoramento & Ajustes**
- [ ] Monitorar Google Search Console
- [ ] Ver quais keywords estão ranqueando
- [ ] Otimizar meta descriptions
- [ ] Planejar próximos artigos

---

## 📈 Exemplo: Como Deveria Ficar

```
Google Search:
"prestacao de serviços agricolas"

Resultado esperado em 2-3 meses:
┌─────────────────────────────────────────┐
│ 🔵 Field Machine                        │
│ https://fieldmachine.com.br/            │
│ Plataforma de Serviços para Agronegócio│
│ Conectamos produtores rurais e          │
│ prestadores de serviço agrícola sem...  │
│ ⭐⭐⭐⭐⭐ (reviews)                      │
│ 📍 Paraná, Brasil                       │
└─────────────────────────────────────────┘
```

---

## 💡 Diferencial Competitivo

Enquanto concorrentes falam sobre serviços, **você oferece plataforma**:

**MF Rural:** "Alugue uma colheitadeira"
**Field Machine:** "Marketplace de serviços — negocie direto, sem intermediários, sem taxas"

Use isso no SEO!

---

## 🎓 Próximas Ações Imediatas

### **Esta semana:**
1. **Adicionar FAQ** ao site (Semana 1 do plano)
2. **Testar Core Web Vitals** no PageSpeed Insights
3. **Criar 1º artigo de blog** sobre aluguel de máquinas

### **Próximas 2 semanas:**
4. **Submeter novo sitemap** (já feito!)
5. **Monitorar Google Search Console** (Performance)
6. **Adicionar Google Analytics 4**

---

## 📞 Links Úteis

- **Análise de Concorrência:** https://ahrefs.com/ (trial grátis)
- **Ideias de Keywords:** https://trends.google.com/trends/
- **PageSpeed:** https://pagespeed.web.dev/
- **Search Console:** https://search.google.com/search-console
- **FAQ Schema:** https://schema.org/FAQPage

---

**Versão:** 1.0 | **Data:** 2026-03-21

Seu diferencial é a **plataforma P2P sem taxas**. Use isso no SEO! 🚀
