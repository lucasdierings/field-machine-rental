# Guia de Acessibilidade - Field Machine Rental

Este documento descreve os padrões de acessibilidade que o projeto Field Machine Rental segue e orienta como implementar novas funcionalidades de forma acessível.

## 📋 Padrão de Conformidade

O projeto segue as recomendações de **WCAG 2.1 Level AA** (Web Content Accessibility Guidelines):
- Nível A: Requisitos básicos de acessibilidade
- Nível AA: Requisitos aprimorados (nosso alvo)
- Nível AAA: Requisitos avançados (opcional)

**Público alvo:**
- Usuários com deficiências visuais (cegos, baixa visão)
- Usuários com deficiências auditivas
- Usuários com deficiências motoras
- Usuários com deficiências cognitivas
- Usuários com deficiências de fala

---

## 🎯 Princípios Fundamentais (POUR)

A acessibilidade é baseada em 4 princípios chamados POUR:

### 1. **Perceptível** (Perceivable)
- Conteúdo deve ser percebido pelos usuários
- Não deve ser invisível para todos os sentidos

**Exemplo:**
```tsx
// ✅ Bom: Imagem com texto alternativo
<img src="machine.jpg" alt="Trator John Deere 6155R vermelho" />

// ❌ Ruim: Imagem sem alt text
<img src="machine.jpg" />
```

### 2. **Operável** (Operable)
- Toda funcionalidade deve ser operável via teclado
- Não deve exigir mouse ou touch

**Exemplo:**
```tsx
// ✅ Bom: Botão navegável com Tab
<button onClick={handleClick}>Alugar Máquina</button>

// ❌ Ruim: Elemento div sem suporte a teclado
<div onClick={handleClick}>Alugar Máquina</div>
```

### 3. **Compreensível** (Understandable)
- Texto deve ser claro e legível
- Interface deve ser previsível

**Exemplo:**
```tsx
// ✅ Bom: Linguagem clara em português
<label>Email do usuário *</label>

// ❌ Ruim: Linguagem confusa ou abreviada
<label>E-mail usr *</label>
```

### 4. **Robusto** (Robust)
- Código deve ser compatível com tecnologias assistivas
- HTML semântico e atributos ARIA

**Exemplo:**
```tsx
// ✅ Bom: HTML semântico com ARIA
<form>
  <label htmlFor="email">Email *</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">Email inválido</span>
</form>

// ❌ Ruim: Sem semântica
<div>
  <div>Email *</div>
  <input type="text" />
  <div>Email inválido</div>
</div>
```

---

## 🔧 Checklist de Acessibilidade

Use este checklist ao implementar novos componentes:

### Formulários
- [ ] Cada campo tem um `<label>` associado via `htmlFor`
- [ ] Campos obrigatórios têm `aria-required="true"`
- [ ] Mensagens de erro têm `role="alert"`
- [ ] Placeholder não substitui label
- [ ] Validação em tempo real com feedback visual
- [ ] Navegação com Tab funciona corretamente

**Exemplo de formulário acessível:**
```tsx
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Validação em tempo real
    if (value && !value.includes("@")) {
      setEmailError("Email deve conter @");
    } else {
      setEmailError("");
    }
  };

  return (
    <form>
      <div className="mb-4">
        <label htmlFor="email">
          Email do usuário *
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          aria-required="true"
          aria-describedby={emailError ? "email-error" : undefined}
          aria-invalid={!!emailError}
        />
        {emailError && (
          <span id="email-error" role="alert" className="text-red-500 text-sm mt-1">
            {emailError}
          </span>
        )}
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
}
```

### Imagens e Ícones
- [ ] Todas as imagens têm `alt` text descritivo
- [ ] Ícones decorativos têm `aria-hidden="true"`
- [ ] Ícones funcionais têm `aria-label`

**Exemplo:**
```tsx
// ✅ Imagem com alt text
<img
  src="machine.jpg"
  alt="Colheitadeira Case IH A6140 em campo de milho"
/>

// ✅ Ícone decorativo
<Loader2 className="animate-spin" aria-hidden="true" />

// ✅ Ícone funcional (botão fechar)
<button onClick={onClose} aria-label="Fechar modal">
  <X className="w-4 h-4" />
</button>
```

### Navegação
- [ ] Links têm texto descritivo (não "clique aqui")
- [ ] Menu navegável via teclado
- [ ] Estado atual está visível
- [ ] Skip links para conteúdo principal (opcional)

**Exemplo:**
```tsx
// ✅ Bom: Texto descritivo
<Link to="/machines">Ver todas as máquinas disponíveis</Link>

// ❌ Ruim: Vago
<Link to="/machines">Clique aqui</Link>
```

### Cores e Contraste
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande
- [ ] Não usar cor como único indicador de status

**Ferramentas para testar:**
- WebAIM Contrast Checker
- Color Contrast Analyzer
- Lighthouse (Chrome DevTools)

**Exemplo:**
```tsx
// ✅ Bom: Status indicado por cor + texto
<badge variant="destructive">
  ❌ Rejeitado {/* vermelho + ícone + texto */}
</badge>

// ❌ Ruim: Apenas cor
<span style={{ color: 'red' }}>Rejeitado</span>
```

### Títulos e Estrutura
- [ ] Apenas um `<h1>` por página
- [ ] Hierarquia de títulos sem saltos (h1 → h2 → h3)
- [ ] Seções semânticas (`<section>`, `<nav>`, `<main>`, `<footer>`)

**Exemplo:**
```tsx
// ✅ Bom: Hierarquia correta
<h1>Dashboard de Máquinas</h1>
<section>
  <h2>Minhas Máquinas</h2>
  <h3>Filtros</h3>
  <h3>Listagem</h3>
</section>

// ❌ Ruim: Salto de níveis
<h1>Dashboard</h1>
<h3>Meus Itens</h3> {/* pulou h2 */}
```

### Modais e Diálogos
- [ ] Focus trap (Tab dentro do modal)
- [ ] Botão fechar acessível
- [ ] `role="dialog"` ou `role="alertdialog"`
- [ ] Anúncio para screen readers

**Exemplo usando shadcn/ui Dialog:**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function MachineModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Máquina</DialogTitle>
        </DialogHeader>
        {/* Conteúdo do modal */}
      </DialogContent>
    </Dialog>
  );
}
```

O `Dialog` do shadcn/ui já vem com:
- ✅ Focus trap automático
- ✅ `role="dialog"` correto
- ✅ ESC para fechar
- ✅ Backdrop para fechar

---

## 🛠️ Atributos ARIA Comuns

### `aria-label`
Descreve elemento quando não há texto visível:
```tsx
<button aria-label="Fechar">✕</button>
<input aria-label="Buscar máquinas" placeholder="Trator..." />
```

### `aria-describedby`
Conecta elemento a descrição/erro:
```tsx
<input aria-describedby="email-error" />
<span id="email-error">Email deve ser válido</span>
```

### `aria-required`
Marca campo como obrigatório:
```tsx
<input aria-required="true" placeholder="Nome *" />
```

### `aria-invalid`
Indica erro de validação:
```tsx
<input aria-invalid={hasError} aria-describedby={hasError ? "error-msg" : undefined} />
```

### `aria-live`
Anuncia mudanças dinâmicas:
```tsx
<div aria-live="polite" aria-atomic="true">
  {notificationMessage}
</div>
```

**Valores:**
- `polite` - Aguarda silêncio antes de anunciar (padrão)
- `assertive` - Anuncia imediatamente (para erros críticos)
- `off` - Não anuncia

### `aria-hidden`
Oculta elemento de leitores de tela:
```tsx
<Loader2 aria-hidden="true" /> {/* Ícone decorativo */}
```

### `role`
Define papel semântico:
```tsx
<div role="alert">Erro crítico!</div>
<div role="status">Carregando...</div>
<div role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
```

---

## 🧪 Testando Acessibilidade

### 1. **Navegação via Teclado**
```bash
# Pressione TAB para navegar
# Pressione ENTER/SPACE para ativar
# Pressione ESC para fechar modais/menus
# Pressione ARROW KEYS para selecionar opções
```

### 2. **Ferramentas Automáticas**

#### axe DevTools
```bash
# Chrome Extension: https://chrome.google.com/webstore
# Clique no ícone axe → Scan
# Relata violations, best practices
```

#### WAVE (WebAIM)
```bash
# Chrome Extension: https://wave.webaim.org/extension/
# Mostra estrutura semântica visualmente
```

#### Lighthouse
```bash
# Chrome DevTools → Lighthouse
# Clique em "Accessibility"
# Relata problemas e oportunidades
```

### 3. **Screen Reader Testing**

#### Windows: NVDA (gratuito)
```bash
# Download: https://www.nvaccess.org/
# Atalho: INSERT + H para ajuda
```

#### Mac: VoiceOver (nativo)
```bash
# Atalho: CMD + F5 para ativar
# CMD + U para usar rotor
```

#### Linux: ORCA
```bash
# Instalação: sudo apt install gnome-shell-extension-orca
# Atalho: Super + Alt + O
```

### 4. **Teste de Contraste**

```bash
# WebAIM Contrast Checker
https://webaim.org/resources/contrastchecker/

# Mínimo recomendado:
# Normal (< 18pt): 4.5:1
# Grande (≥ 18pt): 3:1
```

---

## 📚 Componentes Acessíveis do Projeto

### Input
✅ Suporta `aria-label`, `aria-describedby`, `aria-required`, `aria-invalid`

Uso:
```tsx
<Input
  type="email"
  aria-label="Email do usuário"
  aria-required="true"
  aria-describedby={error ? "email-error" : undefined}
  aria-invalid={!!error}
/>
```

### Label
✅ Suporta `htmlFor` para associação com input

Uso:
```tsx
<Label htmlFor="email">Email do usuário *</Label>
<Input id="email" type="email" />
```

### ErrorBoundary
✅ Com `role="alert"` e `aria-live="polite"`

Uso (automático):
```tsx
<ErrorBoundary>
  <MyComponent /> {/* Erros são capturados e anunciados */}
</ErrorBoundary>
```

### Dialog (shadcn/ui)
✅ Focus trap, keyboard navigation, role="dialog"

Uso:
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogTitle>Título do Modal</DialogTitle>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
```

### Button (shadcn/ui)
✅ Suporta aria-label, aria-pressed, aria-expanded

Uso:
```tsx
<Button aria-label="Abrir menu">☰</Button>
<Button aria-pressed={isActive}>Ativar</Button>
<Button aria-expanded={isOpen}>Expandir</Button>
```

---

## 🚀 Boas Práticas

### 1. **Use HTML Semântico**
```tsx
// ✅ Bom
<button onClick={handleClick}>Clique aqui</button>
<form onSubmit={handleSubmit}>
  <input type="email" />
</form>

// ❌ Ruim
<div onClick={handleClick}>Clique aqui</div>
<div onSubmit={handleSubmit}>
  <div>E-mail</div>
</div>
```

### 2. **Valide em Tempo Real com Feedback**
```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

const handleChange = (value: string) => {
  setEmail(value);
  if (value && !isValidEmail(value)) {
    setError("Email inválido");
  } else {
    setError("");
  }
};

return (
  <>
    <Input
      value={email}
      onChange={(e) => handleChange(e.target.value)}
      aria-invalid={!!error}
      aria-describedby={error ? "error" : undefined}
    />
    {error && (
      <span id="error" role="alert" className="text-red-500">
        {error}
      </span>
    )}
  </>
);
```

### 3. **Use Cores + Outros Indicadores**
```tsx
// ✅ Bom: Cor + ícone + texto
<Badge variant="destructive">
  <AlertCircle className="w-4 h-4 mr-2" />
  Erro
</Badge>

// ❌ Ruim: Apenas cor
<Badge style={{ background: 'red' }}>Erro</Badge>
```

### 4. **Texto de Links Deve Ser Descritivo**
```tsx
// ✅ Bom
<Link to="/machines/123">Ver detalhes do Trator John Deere</Link>

// ❌ Ruim
<Link to="/machines/123">Mais informações</Link>
```

### 5. **Imagens Devem Ter Alt Text**
```tsx
// ✅ Bom
<img
  src="machine.jpg"
  alt="Colheitadeira Case IH A6140 vermelha em operação no campo"
/>

// ❌ Ruim (vago)
<img src="machine.jpg" alt="Máquina" />

// ❌ Ruim (repetitivo)
<img src="machine.jpg" alt="Imagem da máquina" />
```

---

## 📊 Checklist de Conformidade WCAG 2.1 AA

- [ ] Contraste mínimo 4.5:1 para texto
- [ ] Todos os inputs têm labels associados
- [ ] Navegação completa via teclado
- [ ] Foco visível em elementos interativos
- [ ] Sem lampejamento (> 3x/segundo)
- [ ] Alt text para todas as imagens
- [ ] Hierarquia correta de headings
- [ ] Estrutura semântica (main, nav, section, footer)
- [ ] Links com texto descritivo
- [ ] Mensagens de erro claras e associadas a campos
- [ ] Focus trap em modais
- [ ] Anúncios via aria-live para atualizações dinâmicas
- [ ] Cores não são o único indicador de status
- [ ] Tempo suficiente para completar tarefas
- [ ] Sem armadilhas (elemento não pode receber foco indefinidamente)

---

## 🔗 Recursos Adicionais

### Documentação
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/pt-BR/docs/Learn/Accessibility)
- [WebAIM](https://webaim.org/)
- [Radix UI Accessibility](https://www.radix-ui.com/docs/primitives/overview/accessibility)

### Ferramentas
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://chromedriver.chromium.org/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Cursos Online
- [Web Accessibility by Google (Udacity)](https://www.udacity.com/course/web-accessibility--ud891)
- [Accessibility Fundamentals (LinkedIn Learning)](https://www.linkedin.com/learning/courses/accessibility-fundamentals)

---

## 🤝 Contribuindo com Acessibilidade

Ao submeter um PR com mudanças de UI:

1. **Use o checklist acima**
2. **Teste com axe DevTools** - 0 violations críticas
3. **Teste navegação via teclado** - TAB funciona em toda a página
4. **Valide contraste** - WebAIM Contrast Checker
5. **Documente mudanças** - Mencione no PR description

Exemplo de PR description:
```markdown
## Acessibilidade
- [x] aria-labels adicionados aos inputs
- [x] Mensagens de erro com role="alert"
- [x] Validação com axe DevTools: 0 críticas
- [x] Navegação com TAB: ✅ Funciona
- [x] Contraste: 4.8:1 (above 4.5:1 required)
```

---

**Última atualização:** 2026-03-21 | **Versão:** 1.0.0
