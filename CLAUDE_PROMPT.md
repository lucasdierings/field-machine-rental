# 🤖 PROMPT PARA INSTRUIR CLAUDE

Use este prompt ao iniciar uma sessão com Claude para trabalhar no projeto Field Machine Rental.

---

## 📋 COPIE E COLE NO CLAUDE:

```
Olá Claude! Vou trabalhar com você no projeto Field Machine Rental.

# CONTEXTO DO PROJETO

**Tipo**: Platform SaaS de aluguel de máquinas agrícolas no Brasil
**Stack**: React 18 + TypeScript + Supabase (PostgreSQL)
**Propósito**: Conectar proprietários de máquinas com produtores rurais para aluguel

# ATORES E REGRAS

## 1. USUÁRIOS DO SISTEMA
- **Admin**: Acesso total, aprova documentos, vê analytics
- **Proprietário**: Cadastra máquinas, recebe solicitações de aluguel
- **Rentador**: Busca máquinas, faz reservas, avalia
- **Anônimo**: Pode buscar, mas não pode reservar

## 2. MÁQUINAS
Categorias: Trator, Colheitadeira, Pulverizador, Plantadeira, Implemento, Transporte
Campos: nome, marca, modelo, ano (>=1990), preço (hora/dia/hectare), localização
Imagens: Máx 10, JPG/PNG, 5MB cada, resolução mín 800x600px
Status: available, unavailable, archived

## 3. RESERVAS (BOOKINGS)
Estados: pending → confirmed → in_progress → completed → reviewed
Preço calculado automaticamente
Sem sobreposição de datas
Máx 365 dias de aluguel
Data passada = bloqueada

## 4. AVALIAÇÕES (REVIEWS)
Após booking completado
Rating 1-5 (obrigatório)
Comentário até 500 chars (opcional)
Avaliação é pública no perfil

## 5. BUSCA E FILTROS
Localização: Raio 10-100km (padrão 50km)
Cálculo: Haversine formula
Filtros: categoria, preço, potência, ano, avaliação, operação
Apenas máquinas com status = 'available'

## 6. SEGURANÇA (RLS)
- user_profiles: apenas próprio perfil
- machines: público ler, proprietário edita
- bookings: apenas renter + owner + admin
- reviews: público ler, criador edita
- alerts: apenas proprietário
Row Level Security deve estar ativada no Supabase

## 7. VALIDAÇÕES
CPF/CNPJ: com dígito verificador
Email: formato válido, único
Telefone: formato brasileiro (+55 ou 11 dígitos)
Senhas: mín 8 chars, 1 maiúscula, 1 número
Preços: > 0
Datas: start < end, não passado

## 8. ESTRUTURA DE PASTAS
src/
├── pages/          (Rotas/Páginas principais)
├── components/     (Componentes React)
├── hooks/          (Custom React hooks)
├── lib/            (Utils, validações)
├── integrations/   (Supabase client)
└── assets/         (Imagens)

## 9. PADRÕES DE CÓDIGO

### Componentes React:
- TypeScript obrigatório
- Functional components com FC type
- Props interface sempre definida
- Custom hooks para lógica

### Validação:
- Usar Zod para schemas
- React Hook Form para formulários
- Sanitizar inputs

### Queries:
- TanStack React Query para data fetching
- Query keys bem estruturadas
- Refetch quando necessário

### Styling:
- Tailwind CSS
- Sem inline styles
- Mobile-first approach

## 10. COMANDOS ÚTEIS
npm run dev       # Desenvolvimento local
npm test          # Rodar testes
npm run lint      # Verificar código
npm run build     # Build produção

## 11. GIT WORKFLOW
1. Branch: claude/feature-name-SESSION_ID
2. Commits: feat/fix/refactor(scope): descrição
3. Commits atômicos (1 feature = 1 commit)
4. Sem git add . (especificar arquivos)
5. Push com -u flag: git push -u origin [branch]

# COMO TRABALHAR COMIGO

Quando pedir para fazer algo, descreva:

1. **Tipo**: Bug Fix / Feature / Refactor
2. **Descrição**: Claro e detalhado
3. **Prioridade**: P0 (crítico) / P1 (alto) / P2 (médio) / P3 (baixo)
4. **Arquivos afetados**: Quais você acha que devem mudar
5. **Regra de negócio**: Qual regra se aplica (dos tópicos 1-9 acima)
6. **Testes**: Deve ter testes? Sim (80%+ coverage)
7. **Critério de aceitação**: Quando está completo?

# EXEMPLO DE REQUISIÇÃO

"Preciso implementar a busca de máquinas.

**Tipo**: Feature
**Prioridade**: P0
**Descrição**: Criar página Search.tsx onde usuário:
- Digita localização (endereço ou coordenadas)
- Seleciona raio 10-100km (padrão 50)
- Aplica filtros: categoria, preço min/max, ano, avaliação min
- Vê lista de máquinas com distância calculada
- Clica em máquina para ver detalhes

**Regras** (da seção 5 acima):
- Usar Haversine para calcular distância
- Filtros devem ser reativos (atualizar em tempo real)
- Máx 50 resultados por página
- Apenas máquinas com status = 'available'

**Arquivos**:
- src/pages/Search.tsx (novo)
- src/components/ui/AdvancedFilters.tsx (novo)
- src/hooks/useMachineSearch.ts (novo)
- src/lib/geolocation.ts (novo)

**Testes**: Sim, 80%+ coverage

Quando terminar:
1. Fazer commit atômico com mensagem clara
2. Indicar o status (pronto para teste / pronto para merge)
3. Listar se há console.log/warnings
"

# IMPORTANTE

- Sempre validar regras acima (seções 1-9) antes de implementar
- Testar código localmente (npm run dev)
- Testes devem passar (npm test)
- Sem console.log no código final
- Commit messages claras e descritivas
- Perguntar se tiver dúvida sobre regra de negócio

Entendido? Estou pronto para trabalhar! 🚀
```

---

## 📝 ALTERNATIVA: REQUISIÇÃO SIMPLES

Se quiser fazer uma requisição simples sem detalhar tudo, use:

```
Claude, preciso que você [implemente / corrija / refatore] [feature].

Referência: Seção [X] do prompt (exemplo: seção 5 = Busca e Filtros)

Requisitos:
- [ ] Requisito 1
- [ ] Requisito 2

Testes obrigatórios: Sim

Arquivo(s): [arquivo1.tsx, arquivo2.ts, ...]

Quando terminar:
1. Me diga se há console.log/warnings
2. Rodou npm test com sucesso?
3. Pronto para merge?
```

---

## 🎯 PRÓXIMAS VEZES

Ao iniciar uma nova sessão com Claude:

1. Cole o prompt acima OU
2. Referendar: "Use o prompt do projeto Field Machine Rental" OU
3. Apenas diga: "Trabalhando no Field Machine Rental. Regras: [resumir principais]"

---

## 💾 COMO USAR

**Opção 1**: Copiar e colar o prompt inteiro acima na primeira mensagem
**Opção 2**: Salvar em um arquivo `.txt` e referenciar em cada sessão
**Opção 3**: Converter para PDF usando:
  - Copiar para Word/Google Docs → Exportar como PDF
  - Usar browser: Ctrl+P → Salvar como PDF
  - Ou ferramentas online (markdown to PDF)

---

**Data**: Fevereiro 2026
**Versão**: 1.0
