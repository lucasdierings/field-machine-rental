# Guia de Contribuição - Field Machine Rental

Obrigado por interessado em contribuir para o Field Machine Rental! Este guia ajudará você a entender nosso processo de desenvolvimento.

## 📋 Índice
1. [Code of Conduct](#code-of-conduct)
2. [Como Começar](#como-começar)
3. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
4. [Padrões de Código](#padrões-de-código)
5. [Processo de PR](#processo-de-pr)
6. [Mensagens de Commit](#mensagens-de-commit)

---

## Code of Conduct

Esperamos que todos os contribuidores mantenham um ambiente respeitoso e inclusivo. Qualquer forma de assédio ou comportamento discriminatório não será tolerada.

---

## Como Começar

### Pré-requisitos
- Node.js 20.x ou superior
- npm 10.x ou superior
- Git configurado com SSH (recomendado)
- VSCode com as extensões recomendadas (ver `.vscode/extensions.json`)

### Setup Local

```bash
# Clone o repositório
git clone git@github.com:lucasdierings/field-machine-rental.git
cd field-machine-rental

# Instale as dependências de ambas as aplicações
cd app && npm ci && cd ..
cd site && npm ci && cd ..

# Configure as variáveis de ambiente
cp app/.env.example app/.env.local
cp site/.env.example site/.env.local

# Adicione suas chaves Supabase em .env.local
# (solicite ao mantainer se não tiver acesso)
```

### Rodando Localmente

```bash
# Terminal 1: Aplicação principal (Vite + React)
cd app
npm run dev
# Acesse http://localhost:8080

# Terminal 2: Landing page (Next.js)
cd site
npm run dev
# Acesse http://localhost:3000

# Terminal 3: Database (opcional - para testes com Supabase)
# Configure conforme necessário
```

---

## Workflow de Desenvolvimento

### 1. Criar uma Branch

```bash
# Sempre crie branches a partir de 'develop'
git checkout develop
git pull origin develop

# Crie uma branch descritiva
git checkout -b tipo/descricao-curta
```

**Tipos de branches:**
- `feature/` - Nova feature
- `bugfix/` - Correção de bug
- `refactor/` - Refatoração de código
- `docs/` - Mudanças de documentação
- `perf/` - Melhorias de performance
- `a11y/` - Melhorias de acessibilidade

**Exemplo:**
```bash
git checkout -b feature/machine-search-filters
git checkout -b bugfix/auth-token-expiration
git checkout -b a11y/form-aria-labels
```

### 2. Desenvolva sua Feature/Fix

```bash
# Faça suas mudanças
# Teste localmente
npm run lint  # Em app/ ou site/
npm run build

# Faça commits pequenos e frequentes
git add .
git commit -m "feat: add search filters to machine listing"
```

### 3. Mantenha-se Atualizado

```bash
# Se a develop mudou enquanto você trabalhava
git fetch origin
git rebase origin/develop

# Resolva conflitos se necessário
git add .
git rebase --continue
```

### 4. Push e Crie PR

```bash
git push origin feature/machine-search-filters

# Acesse GitHub e crie um Pull Request
# Preencha o template completamente
```

---

## Padrões de Código

### TypeScript

✅ **Sempre use TypeScript strict mode:**
```typescript
// ✅ Correto
interface User {
  id: string;
  email: string;
  role: 'admin' | 'owner' | 'renter';
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Evite
let user: any;
function getUser(id) { // sem tipo de retorno
  // ...
}
```

✅ **Use aliases de import:**
```typescript
// ✅ Correto
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// ❌ Evite
import { Button } from '../../../components/ui/button';
```

### React Components

✅ **Padrão de componente funcional:**
```typescript
interface Props {
  title: string;
  onClose: () => void;
  loading?: boolean;
}

export function MyModal({ title, onClose, loading }: Props) {
  return (
    <div role="dialog" aria-label={title}>
      {/* Conteúdo */}
    </div>
  );
}
```

✅ **Use React Hook Form + Zod para validação:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### Estilos (Tailwind CSS)

✅ **Use classes Tailwind diretamente:**
```tsx
<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
  Enviar
</button>
```

✅ **Use componentes shadcn/ui quando disponível:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg">Enviar</Button>
```

### Acessibilidade (WCAG 2.1)

✅ **Sempre adicione aria-labels em inputs:**
```tsx
<input
  type="email"
  placeholder="seu@email.com"
  aria-label="Endereço de email"
  aria-describedby="email-error"
/>
{errors.email && <span id="email-error" role="alert">{errors.email}</span>}
```

✅ **Use elementos semânticos:**
```tsx
<nav aria-label="Main navigation">
  {/* links */}
</nav>

<button aria-label="Fechar modal" onClick={onClose}>×</button>
```

### Remover Console Logs

❌ **Não commitie console.log em produção:**
```typescript
// ❌ Remova antes de fazer commit
console.log('user:', user);
console.error('Error:', error);

// ✅ Use apenas em desenvolvimento:
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

---

## Processo de PR

### Checklist Obrigatório

Antes de submeter seu PR, certifique-se de:

- [ ] Código testado localmente
- [ ] `npm run lint` passa sem erros
- [ ] `npm run build` passa sem erros
- [ ] Sem `console.log` ou `console.error` em produção
- [ ] Acessibilidade verificada
- [ ] Documentação atualizada (se necessário)
- [ ] Commits com mensagens descritivas
- [ ] Rebase feito a partir de `develop` atualizado

### Code Review

- Mínimo 1 aprovação antes de merge
- Resolva todos os comentários
- Rebase se necessário
- Um maintainer fará o merge final

---

## Mensagens de Commit

Use **Conventional Commits** para mensagens claras e semânticas:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Mudanças de documentação
- `style:` - Formatação, sem mudanças lógicas
- `refactor:` - Refatoração de código
- `perf:` - Melhorias de performance
- `test:` - Adicionar/modificar testes
- `chore:` - Dependências, build, CI/CD
- `ci:` - Mudanças em GitHub Actions
- `a11y:` - Melhorias de acessibilidade

### Exemplos

```bash
git commit -m "feat(auth): add two-factor authentication"
git commit -m "fix(machines): correct machine availability calculation"
git commit -m "docs(contributing): update development setup instructions"
git commit -m "perf(bundle): reduce bundle size by tree-shaking unused imports"
git commit -m "a11y(forms): add aria-labels to login form"
git commit -m "refactor(components): extract MachineCard into separate component"
```

---

## Testes

Quando implementados, testes devem ser incluídos:

```bash
cd app
npm run test

# Com coverage
npm run test:coverage
```

Prioridades para testes:
1. Contextos (AuthContext, etc)
2. Funções de validação
3. Custom hooks
4. Componentes de rota

---

## Performance

Ao adicionar dependências:

1. Verifique o tamanho do bundle: `npm run build`
2. Prefira dependências leves
3. Use dynamic imports para componentes grandes

```typescript
// Bom: Lazy load de página
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Ruim: Importa tudo globalmente
import AdminDashboard from './pages/AdminDashboard';
```

---

## Dúvidas?

- Abra uma [issue](https://github.com/lucasdierings/field-machine-rental/issues)
- Envie um email para o mantainer
- Verifique a [documentação](./README.md)

---

**Obrigado por contribuir! 🎉**
