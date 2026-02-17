# 📚 Índice de Documentação - Field Machine Rental

**Bem-vindo ao Field Machine Rental!** 🚜

Este arquivo ajuda você a encontrar rapidamente as informações de que precisa.

---

## 🚀 Comece Por Aqui

Se você é **novo no projeto**, siga esta ordem:

1. **Este arquivo** (você está aqui) ← Visão geral
2. **[PROJECT_ORGANIZATION.md](./PROJECT_ORGANIZATION.md)** ← Estrutura do projeto
3. **[BUSINESS_RULES.md](./BUSINESS_RULES.md)** ← Regras de negócio
4. **[CLAUDE_INSTRUCTIONS.md](./CLAUDE_INSTRUCTIONS.md)** ← Como trabalhar com Claude
5. **[README.md](./README.md)** ← Setup técnico

---

## 📋 Documentos por Tipo

### 📖 Entendendo o Negócio

| Documento | Para Quem | O Quê |
|-----------|-----------|-------|
| **BUSINESS_RULES.md** | PM, Designer, Developer | Todas as regras de negócio da plataforma |
| **PROJECT_ORGANIZATION.md** | PM, Scrum Master | Como o projeto é organizado |

### 👨‍💻 Para Desenvolvedores

| Documento | Para Quem | O Quê |
|-----------|-----------|-------|
| **CLAUDE_INSTRUCTIONS.md** | Developer | Como trabalhar com Claude no projeto |
| **README.md** | DevOps, Developer | Setup, dependências, comandos |

### 🎯 Por Funcionalidade

| Funcionalidade | Onde Ler |
|---|---|
| **Busca de Máquinas** | BUSINESS_RULES.md → Regras de Busca e Filtros |
| **Cadastro de Usuário** | BUSINESS_RULES.md → Regras de Cadastro |
| **Reservas (Bookings)** | BUSINESS_RULES.md → Regras de Reservas |
| **Avaliações (Reviews)** | BUSINESS_RULES.md → Regras de Avaliações |
| **Preços** | BUSINESS_RULES.md → Regras de Preços |
| **Admin Dashboard** | BUSINESS_RULES.md → Regras Administrativas |
| **Segurança (RLS)** | BUSINESS_RULES.md → Regras de Segurança |

---

## 🎨 Estrutura do Projeto

```
field-machine-rental/
├── 📚 DOCUMENTAÇÃO (YOU ARE HERE)
│   ├── DOCUMENTATION_INDEX.md          ← Este arquivo
│   ├── BUSINESS_RULES.md               ← 📌 Leia isto primeiro
│   ├── PROJECT_ORGANIZATION.md         ← Depois isto
│   ├── CLAUDE_INSTRUCTIONS.md          ← Depois isto
│   └── README.md                       ← Setup técnico
│
├── 📱 CÓDIGO FRONTEND
│   ├── src/
│   │   ├── pages/                     ← Páginas/Rotas
│   │   ├── components/                ← Componentes React
│   │   ├── hooks/                     ← Custom React hooks
│   │   ├── lib/                       ← Funções utilitárias
│   │   ├── integrations/              ← Supabase client
│   │   └── assets/                    ← Imagens
│   ├── package.json                   ← Dependências npm
│   ├── vite.config.ts                 ← Configuração Vite
│   └── tsconfig.json                  ← Configuração TypeScript
│
├── 🗄️ CÓDIGO BACKEND
│   └── supabase/
│       ├── migrations/                ← SQL migrations
│       └── functions/                 ← Edge Functions (Deno)
│
└── ⚙️ CONFIGURAÇÃO
    ├── .env.example                   ← Variáveis de ambiente
    ├── .gitignore
    └── eslint.config.js
```

---

## ❓ Respostas Rápidas

### "Preciso implementar uma feature nova"

1. Ler **BUSINESS_RULES.md** para entender a regra
2. Ler **PROJECT_ORGANIZATION.md** → Tipos de Tarefas
3. Usar template em **CLAUDE_INSTRUCTIONS.md** → Formato de Requisições
4. Comunicar com Claude usando o template

**Exemplo:**
```
Quero implementar alertas de busca.

Referência: BUSINESS_RULES.md → Seção "Alertas de Busca"

Requisitos:
- [ ] Criar página de alertas
- [ ] Salvar no database
- [ ] Enviar notificações por email
- [ ] Testes (80%+ coverage)
```

### "Encontrei um bug"

1. Ler **CLAUDE_INSTRUCTIONS.md** → Template: Bug Fix
2. Descrever o problema claramente
3. Indicar a regra de negócio afetada (em BUSINESS_RULES.md)

**Exemplo:**
```
Bug: Busca por raio retorna máquinas muito longe

Referência: BUSINESS_RULES.md → Busca por Localização

Passos: [descrever]
Esperado: [o que deveria acontecer]
Atual: [o que está acontecendo]
```

### "Qual é a regra de negócio para X?"

1. Abrir **BUSINESS_RULES.md**
2. Usar Ctrl+F para buscar
3. Ler a seção correspondente

**Exemplos:**
- Preços? → Seção "Regras de Preços"
- Autenticação? → Seção "Regras de Segurança"
- Admin? → Seção "Regras Administrativas"

### "Como faço um commit?"

1. Ler **CLAUDE_INSTRUCTIONS.md** → Seção "Commit Messages"
2. Usar o formato: `<tipo>(<escopo>): <descrição>`

**Exemplo:**
```bash
git commit -m "feat(search): add price filter to machine search"
```

### "Como é o fluxo de desenvolvimento?"

1. Ler **PROJECT_ORGANIZATION.md** → Seção "Processo de Review e Merge"
2. Seguir o checklist antes de fazer PR

---

## 🔗 Links Úteis

### Documentação Interna
- [Regras de Negócio](./BUSINESS_RULES.md)
- [Instruções para Claude](./CLAUDE_INSTRUCTIONS.md)
- [Organização do Projeto](./PROJECT_ORGANIZATION.md)
- [Setup Técnico](./README.md)

### Código
- Frontend: `src/`
- Backend: `supabase/`
- Testes: `src/__tests__/`

### Tecnologias
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📞 Precisa de Ajuda?

### Dúvida sobre Regras de Negócio?
→ Consulte **BUSINESS_RULES.md**

### Não sabe como trabalhar com Claude?
→ Leia **CLAUDE_INSTRUCTIONS.md**

### Confuso sobre a estrutura do projeto?
→ Veja **PROJECT_ORGANIZATION.md**

### Problema técnico ou setup?
→ Consulte **README.md**

---

## 🎯 Checklist para Novo Developer

- [ ] Li DOCUMENTATION_INDEX.md (este arquivo)
- [ ] Li PROJECT_ORGANIZATION.md
- [ ] Li BUSINESS_RULES.md (pelo menos overview)
- [ ] Fiz setup técnico (npm install, npm run dev)
- [ ] Entendo a estrutura de pastas
- [ ] Sei como fazer um commit
- [ ] Conheço como trabalhar com Claude
- [ ] Pronto para pegar uma tarefa!

---

## 📅 Última Atualização

**Data**: Fevereiro 2026
**Versão**: 1.0
**Status**: ✅ Completo

---

## 🎓 Materiais de Aprendizado Recomendados

**Iniciante em React?**
- [React Docs - Learn React](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**Quer aprender Supabase?**
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Basics](https://www.postgresql.org/docs/current/intro-whatis.html)

**Quer melhorar seus commits?**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write Good Commit Messages](https://chris.beams.io/posts/git-commit/)

---

**Bem-vindo ao time! Aproveite a documentação e boa sorte com o desenvolvimento! 🚀**
