# Changelog

Todos os mudanças importantes para este projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/),
e este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- GitHub Actions workflows para lint, build e security checks
- Dependabot configuration para atualizações automáticas de dependências
- GitHub issue templates (bug report, feature request)
- GitHub PR template com checklist
- CONTRIBUTING.md com guia completo de desenvolvimento
- `.env.example` para o site (Next.js)
- CHANGELOG.md e VERSION file para versionamento

### Changed
- Melhorias em documentação e templates GitHub

### Security
- Adicionado CI/CD para verificação de vulnerabilidades

---

## [0.1.0] - 2026-03-21

### Added
- ✨ Plataforma de aluguel de máquinas agrícolas (marketplace)
- 🔐 Autenticação com Supabase (sign in, sign up, password reset)
- 👥 Sistema de roles (admin, owner/equipamento, renter/locatário)
- 📊 Dashboard de máquinas com métricas de receita
- 🔍 Sistema de busca e filtros (localização, raio de busca, preço)
- 📝 Gestão de máquinas (adicionar, editar, visualizar)
- 📅 Sistema de reservas (booking) e solicitações
- 🏠 Página de perfil do usuário
- 📄 Verificação de documentos (CPF/CNPJ)
- 🎨 Design system com Tailwind CSS + shadcn/ui
- 🌙 Dark mode (light/dark themes)
- 📱 Responsividade mobile-first
- 🚀 Deploy automático via Cloudflare Pages
- 🗄️ Backend com Supabase (PostgreSQL + Auth + Storage)
- 🎯 SEO otimizado para marketplace
- ⚡ Performance otimizada com Vite e React lazy loading

### Fixed
- Variáveis de ambiente no Cloudflare Pages

### Security
- Proteção de rotas com autenticação obrigatória
- Validação de entrada com Zod
- CORS configurado

---

### Versioning

Este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/):
- **MAJOR**: Mudanças que quebram compatibilidade (v2.0.0, v3.0.0)
- **MINOR**: Novas features sem quebrar compatibilidade (v0.1.0, v0.2.0)
- **PATCH**: Correções de bugs (v0.1.1, v0.1.2)

### Release Process

1. Crie uma branch `release/vX.Y.Z` a partir de `develop`
2. Atualize `VERSION` file e `CHANGELOG.md`
3. Faça commit: `chore(release): v0.1.0`
4. Crie PR para `main`
5. Após aprovação e merge, crie uma tag: `git tag v0.1.0`
6. Faça push da tag: `git push origin v0.1.0`

---

[Unreleased]: https://github.com/lucasdierings/field-machine-rental/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lucasdierings/field-machine-rental/releases/tag/v0.1.0
