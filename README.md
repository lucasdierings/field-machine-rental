# Field Machine

Plataforma de aluguel de máquinas agrícolas — conecta produtores rurais e proprietários de equipamentos.

## Tecnologias

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) (banco de dados, autenticação, storage)

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ e npm
- Conta no [Supabase](https://supabase.com/)

## Configuração local

```sh
# 1. Clone o repositório
git clone https://github.com/lucasdierings/field-machine-rental.git
cd field-machine-rental

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.development
# Edite .env.development com suas chaves do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:8080`.

## Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anonima
```

## Scripts

```sh
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção (saída em /dist)
npm run preview  # Preview do build local
npm run lint     # Linter
```

## Deploy

O projeto é hospedado no **Cloudflare Pages** com deploy automático a cada push na branch `main`.

**Configurações de build:**
- Build command: `npm run build`
- Output directory: `dist`

**Variáveis de ambiente necessárias no Cloudflare:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Banco de dados

As migrações ficam em `supabase/migrations/`. Para aplicar no banco remoto, acesse o **SQL Editor** no Supabase Dashboard e execute os arquivos em ordem cronológica.
