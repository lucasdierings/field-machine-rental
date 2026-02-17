# 🤖 Setup para Usar Claude Localmente

**Objetivo**: Organizar seu projeto para trabalhar com Claude no seu computador

---

## 📋 O Que Você Tem

Criei 2 arquivos para você usar com Claude:

1. **CLAUDE_PROMPT.md** - Prompt completo com todas as regras
2. **REGRAS_NEGOCIO_RESUMO.txt** - Resumo das regras de negócio

---

## 🚀 Passo 1: Preparar Arquivos

### Opção A: Copiar Conteúdo

```
1. Abrir CLAUDE_PROMPT.md
2. Copiar TODO o conteúdo dentro de ```...```
3. Colar na primeira mensagem com Claude
```

### Opção B: Usar Como Referência

```
1. Manter CLAUDE_PROMPT.md aberto em outra aba
2. Em cada requisição, referenciar: "Conforme o prompt do projeto"
3. Se Claude esquecer contexto, colar novamente
```

### Opção C: Converter para PDF

```
Windows/Mac:
1. Abrir CLAUDE_PROMPT.md no editor de texto
2. Ctrl+P (ou Cmd+P) → Salvar como PDF
3. Guardar no seu desktop/pasta

Alternativa:
- Copiar conteúdo para Google Docs → Download como PDF
- Ou usar editor online (markdown to PDF)
```

---

## 📝 Passo 2: Primeira Sessão com Claude

### Opção A: Colar Prompt Inteiro (Recomendado)

1. Abrir Claude Code
2. Navegar para `/home/user/field-machine-rental`
3. **Primeira mensagem** para Claude:

```
Cole aqui TODO o conteúdo de CLAUDE_PROMPT.md
(está entre os ``` ``` do arquivo)
```

### Opção B: Referência Rápida

Se o prompt for longo, pode fazer assim:

```
Olá Claude! Vou trabalhar no Field Machine Rental.

Contexto: Platform de aluguel de máquinas agrícolas
Tech: React + TypeScript + Supabase
Regras: Vou pedir conforme necessário

Atores principais:
- Admin: acesso total, aprova docs
- Proprietário: cadastra máquinas
- Rentador: busca máquinas, faz reservas
- Anônimo: apenas visualiza

Quando pedir algo, vou indicar a seção das regras.

Pronto? Estou pronto!
```

---

## 💻 Passo 3: Como Fazer Requisições

### Exemplo 1: Feature

```
Preciso implementar a página de Busca de Máquinas.

**Tipo**: Feature
**Prioridade**: P1

**Descrição**:
Criar página Search.tsx onde usuário:
- Digita localização (endereço ou coords)
- Seleciona raio 10-100km (padrão 50)
- Aplica filtros: categoria, preço min/max, ano, avaliação
- Vê resultado com distância calculada
- Clica para ver detalhes

**Regras** (conforme prompt):
- Haversine para distância
- Máx 50 resultados por página
- Apenas máquinas com status='available'
- Validar: raio deve ser 10-100

**Arquivos** que devem ser criados:
- src/pages/Search.tsx
- src/components/ui/AdvancedFilters.tsx
- src/hooks/useMachineSearch.ts
- src/lib/geolocation.ts

**Testes**: Sim, mínimo 80% coverage

Quando terminar:
1. Rodou npm test com sucesso?
2. Há console.log ou warnings?
3. Pronto para fazer commit?
```

### Exemplo 2: Bug Fix

```
Encontrei um bug na busca.

**Bug**: Filtro de raio retorna máquinas muito longe (além de 100km)

**Como reproduzir**:
1. Ir para Search page
2. Selecionar raio 100km
3. Ver resultados mostrando máquinas a 200km+

**Esperado**: Apenas máquinas até 100km

**Arquivo afetado**: src/lib/geolocation.ts (linha ~45)

**Regra** (conforme prompt, seção 5 - Busca):
- Usar Haversine formula corretamente
- Máx 100km deve ser respeitado

Por favor, corrija e teste.
```

### Exemplo 3: Refactor

```
Vou fazer um refactor.

**Refactor**: Extrair lógica de máquinas para custom hook

**Por quê**:
- Reduzir duplicação em MachineCard e MachineDetails
- Melhorar reutilização
- Facilitar testes

**Mudanças**:
- Criar src/hooks/useMachine.ts
- Atualizar MachineCard.tsx
- Atualizar MachineDetails.tsx

**Testes**: Devem passar 100% (sem novos)

Vamos lá!
```

---

## 📌 Dicas Importantes

### 1. Sempre Indicar A Seção Das Regras

```
❌ ERRADO:
"Faz a validação do CPF"

✅ CORRETO:
"Faz a validação do CPF (conforme prompt, seção 7 - Validações)"
```

### 2. Manter o Prompt Visível

Se trabalhar em múltiplas sessões:
- Sessão 1: Cola o prompt completo
- Sessão 2: Cola novamente OU referencia "Conforme o prompt do projeto"
- Claude sempre lembrar o contexto se você indicar

### 3. Feedback Ao Claude

```
Bom! Agora:
1. Adiciona teste unitário
2. Faz commit com mensagem: feat(search): implement machine search page
3. Indica se está pronto para PR
```

### 4. Se Claude Esquecer Regra

```
Espera! Isso viola a regra na seção 5 do prompt:
"Máx 50 resultados por página"

Você pode corrigir?
```

---

## 🎯 Workflow Recomendado

### Dia 1: Setup Inicial

```
1. Colar prompt completo na primeira mensagem
2. Claude responde confirmando que entendeu
3. Você pega primeira tarefa
4. Claude executa
5. Você testa localmente (npm run dev)
6. Aprovado? Faça commit e push
```

### Dia 2+: Sessões Subsequentes

```
1. Abrir Claude Code
2. Primeira mensagem: "Continuando Field Machine Rental. Conforme o prompt anterior."
3. Se Claude não lembrar: "Vou colar o prompt novamente:"
4. Colar CLAUDE_PROMPT.md
5. Continuar de onde parou
```

---

## 📂 Estrutura de Pasta Recomendada

Salvar os documentos em seu computador:

```
~/Documents/Field Machine Rental/
├── CLAUDE_PROMPT.md          (Principal - usar sempre)
├── REGRAS_NEGOCIO_RESUMO.txt (Referência rápida)
├── SETUP_CLAUDE_LOCAL.md     (Este arquivo)
└── PDFs/ (se converter)
    ├── Prompt.pdf
    └── Regras.pdf
```

---

## 🖨️ Converter Para PDF (Opções)

### Google Docs (Fácil)

1. Abrir Google Docs
2. Copiar conteúdo de CLAUDE_PROMPT.md
3. Colar no Google Docs
4. File → Download → PDF

### Microsoft Word

1. Abrir Word
2. Copiar conteúdo
3. Ctrl+V para colar
4. Ctrl+S → Salvar como PDF

### VSCode / Editor Local

1. Abrir arquivo em VSCode
2. Instalar extensão: "Markdown PDF"
3. Clicar botão "Export PDF"

### Browser (Universal)

1. Abrir CLAUDE_PROMPT.md em navegador (converter markdown)
2. Ou usar site: https://markdown-to-pdf.com/
3. Colar conteúdo → Download como PDF

---

## ✅ Checklist Antes de Começar

- [ ] Li este arquivo (SETUP_CLAUDE_LOCAL.md)
- [ ] Tenho acesso a CLAUDE_PROMPT.md
- [ ] Tenho acesso a REGRAS_NEGOCIO_RESUMO.txt
- [ ] Abri Claude Code ou vou abrir
- [ ] Copiei o prompt (ou sei onde encontrar)
- [ ] Entendo como fazer requisições
- [ ] Pronto para começar! 🚀

---

## 🔄 Próximas Sessões

Quando voltar a trabalhar:

### Se for a Mesma Sessão
- Claude vai lembrar do contexto
- Continue de onde parou

### Se for Nova Sessão (Novo Dia)

**Opção 1 - Rápida**:
```
Continuando Field Machine Rental.
Conforme o prompt que passei antes (CLAUDE_PROMPT.md).

[Sua requisição]
```

**Opção 2 - Segura**:
```
Vou colar o prompt novamente:

[Cole conteúdo inteiro de CLAUDE_PROMPT.md]

Pronto! Agora:
[Sua requisição]
```

---

## 📞 Se Claude Esquecer

Se Claude não lembrar das regras:

```
Claude, você tem o arquivo CLAUDE_PROMPT.md?
Se não, vou colar de novo:

[Cole o prompt]

Agora está claro? Vamos continuar!
```

---

## 🎓 Exemplo de Sessão Completa

```
USUÁRIO:
Oi Claude! Vou trabalhar no Field Machine Rental.

[Cola CLAUDE_PROMPT.md inteiro]

Entendeu tudo? Pronto para trabalhar?

---

CLAUDE:
Entendi! Salvei todas as regras:
- 5 atores (Admin, Proprietário, Rentador, Anônimo)
- Fluxo de cadastro 4-steps
- 6 categorias de máquinas
- Estados de booking...
[resumo das principais regras]

Pronto! Qual é o primeira tarefa?

---

USUÁRIO:
Preciso da página de Busca.

[Descreve feature usando template]

---

CLAUDE:
Entendido! Vou implementar:
1. src/pages/Search.tsx
2. src/components/ui/AdvancedFilters.tsx
3. src/hooks/useMachineSearch.ts
4. src/lib/geolocation.ts

[Implementa tudo]

Pronto! Status:
✅ npm test passou
✅ Zero console.log
✅ Pronto para commit

Quer que eu faça o commit?

---

USUÁRIO:
Sim! Faz o commit e depois prepara a próxima feature.

[Claude faz tudo]
```

---

## 🎯 Resumo

**TL;DR** (muito longo, não leu):

1. **Arquivo Principal**: CLAUDE_PROMPT.md
2. **Como Usar**: Cole na primeira mensagem com Claude
3. **Requisições**: Use templates (Bug/Feature/Refactor)
4. **Próximas Sessões**: Referencie ou cole novamente
5. **PDFs**: Use conversor online se precisar

---

**Pronto para começar a trabalhar com Claude! 🚀**
