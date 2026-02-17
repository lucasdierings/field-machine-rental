# 🤖 Como Organizar no Claude Code Interface

Você viu a screenshot com 3 seções vazias? Vou guiar você a preencher cada uma.

---

## 📍 SEÇÃO 1: MEMÓRIA (esquerda)

**O quê**: Resumo das regras principais para Claude sempre lembrar

**Arquivo a usar**: `CLAUDE_MEMORIA.txt`

**Como adicionar:**
1. Abrir `CLAUDE_MEMORIA.txt` no projeto
2. Copiar TODO o conteúdo
3. No Claude Code, clicar em "Memória"
4. Colar o conteúdo
5. Salvar

**Resultado**: Claude vai sempre ver as principais regras do projeto

---

## 📋 SEÇÃO 2: INSTRUÇÕES (direita acima)

**O quê**: Como você quer que Claude trabalhe no projeto

**Arquivo a usar**: `CLAUDE_SYSTEM_INSTRUCTIONS.txt`

**Como adicionar:**
1. Abrir `CLAUDE_SYSTEM_INSTRUCTIONS.txt`
2. Copiar TODO o conteúdo
3. No Claude Code, clicar em "Instruções"
4. Colar o conteúdo
5. Salvar

**Resultado**: Claude vai sempre seguir seus padrões e templates

---

## 📎 SEÇÃO 3: ARQUIVOS (direita abaixo)

**O quê**: Referências e documentos para consultar

**Quais arquivos adicionar:**

### Arquivos principais (RECOMENDADO)

```
1. REFERENCIA_RAPIDA.txt
   → Para consulta rápida durante desenvolvimento
   → Cole se precisar de uma regra específica

2. REGRAS_NEGOCIO_RESUMO.txt
   → Referência completa de todas as regras
   → Quando precisa de detalhes

3. CLAUDE_INSTRUCTIONS.md
   → Padrões de código, exemplos
   → Quando trabalha com componentes, hooks, testes
```

### Opcional (Se converter para PDF)

```
4. CLAUDE_PROMPT.pdf
   → Versão em PDF do prompt completo
   → Para ter sempre visível
```

**Como adicionar arquivos:**

1. No Claude Code interface (aquela screenshot)
2. Seção "Arquivos" (direita abaixo)
3. Botão "+Adicionar arquivo"
4. Selecionar arquivo do projeto
5. Pronto! Claude pode consultar quando precisar

---

## 🎯 ORDEM RECOMENDADA DE PREENCHIMENTO

### Passo 1: MEMÓRIA
```
1. Copiar CLAUDE_MEMORIA.txt inteiro
2. Colar na seção "Memória"
3. Salvar
→ Claude agora lembra das regras principais
```

### Passo 2: INSTRUÇÕES
```
1. Copiar CLAUDE_SYSTEM_INSTRUCTIONS.txt inteiro
2. Colar na seção "Instruções"
3. Salvar
→ Claude agora sabe como você quer trabalhar
```

### Passo 3: ARQUIVOS
```
1. Clicaro "+Adicionar arquivo"
2. Selecionar REFERENCIA_RAPIDA.txt
3. Clicar "+Adicionar arquivo" novamente
4. Selecionar REGRAS_NEGOCIO_RESUMO.txt
5. Clicar "+Adicionar arquivo" novamente
6. Selecionar CLAUDE_INSTRUCTIONS.md
7. Salvar
→ Claude pode consultar essas referências quando precisar
```

---

## 🔄 Depois de Configurar

### Primeira Requisição

```
Oi Claude! Implementa a página de Busca.

Descrição: [sua descrição]
Requisitos: [listar]
Arquivos: [indicar quais arquivos]
Testes: Sim, 80%+ coverage

Quando terminar, me avisa!
```

### Claude vai:
- ✅ Usar regras da MEMÓRIA
- ✅ Seguir padrões das INSTRUÇÕES
- ✅ Consultar ARQUIVOS quando necessário
- ✅ Implementar conforme pedido
- ✅ Fazer testes e commit

---

## 💡 Dica: Diferença Entre Seções

| Seção | Usa | Quando |
|-------|-----|--------|
| **Memória** | Claude lê automaticamente | Sempre (contexto constante) |
| **Instruções** | Claude segue automaticamente | Sempre (padrões de trabalho) |
| **Arquivos** | Claude consulta se precisar | Quando você indica ou ele procura |

---

## 📝 Resumo Prático

**Preencha assim:**

```
🧠 MEMÓRIA:
   Cole conteúdo de CLAUDE_MEMORIA.txt

📋 INSTRUÇÕES:
   Cole conteúdo de CLAUDE_SYSTEM_INSTRUCTIONS.txt

📎 ARQUIVOS:
   Adicione:
   ✅ REFERENCIA_RAPIDA.txt
   ✅ REGRAS_NEGOCIO_RESUMO.txt
   ✅ CLAUDE_INSTRUCTIONS.md
```

**Pronto! Agora Claude tem contexto completo do projeto.**

---

## 🎓 Depois: Como Usar

### Requisição Simples

```
Implemente feature X.

Descrição: [o que é]
Arquivos: [quais mudam]
Testes: Sim
```

Claude automaticamente:
- Consulta MEMÓRIA para regras
- Segue INSTRUÇÕES para padrões
- Referencia ARQUIVOS se precisar

### Pergunta Sobre Regras

```
Qual é a regra para reservas?
```

Claude vai:
- Consultar MEMÓRIA (resumo)
- Se precisar detalhe, consultar ARQUIVOS (REFERENCIA_RAPIDA.txt)

### Verificação

```
Pronto para commit?
```

Claude vai:
- Seguir regras de INSTRUÇÕES
- Indicar status
- Listar warnings (se houver)

---

## ✅ Checklist Final

- [ ] Abri Claude Code
- [ ] Copiei CLAUDE_MEMORIA.txt e colei em "Memória"
- [ ] Copiei CLAUDE_SYSTEM_INSTRUCTIONS.txt e colei em "Instruções"
- [ ] Adicionei REFERENCIA_RAPIDA.txt em "Arquivos"
- [ ] Adicionei REGRAS_NEGOCIO_RESUMO.txt em "Arquivos"
- [ ] Adicionei CLAUDE_INSTRUCTIONS.md em "Arquivos"
- [ ] Salvei tudo
- [ ] Pronto para usar! 🚀

---

## 🎯 Resultado Final

Quando tudo estiver configurado:

✅ Claude tem MEMÓRIA do projeto (regras principais)
✅ Claude segue suas INSTRUÇÕES (como trabalhar)
✅ Claude pode consultar ARQUIVOS (referências detalhadas)
✅ Você pode pedir tarefas simples e concisas
✅ Claude executa sabendo todo o contexto

**Agora você trabalha eficientemente com Claude!**
