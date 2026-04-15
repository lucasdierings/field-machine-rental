import { lazy, type ComponentType } from "react";

/**
 * Wrapper de React.lazy() que detecta falhas de carregamento dinâmico de
 * chunk e tenta recarregar a página automaticamente UMA vez.
 *
 * Isso resolve o erro:
 *   "Failed to fetch dynamically imported module: ...assets/Foo-<hash>.js"
 *
 * que acontece quando o usuário tem um index.html cacheado apontando para
 * hashes de bundle antigos que não existem mais no servidor após um deploy
 * novo.
 *
 * Estratégia:
 * 1. Tenta o import normalmente.
 * 2. Se falhar com erro de chunk load, marca uma flag em sessionStorage e
 *    força um reload (que vai pegar o index.html novo).
 * 3. Se ao reload o erro persistir (flag já presente), apenas relança o erro
 *    para o ErrorBoundary mostrar a tela amigável.
 */
const RELOAD_FLAG = "fm:chunk-reload-attempted";

const isChunkLoadError = (error: unknown): boolean => {
  if (!error) return false;
  const message =
    error instanceof Error ? error.message : String(error);
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Loading chunk \d+ failed/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message)
  );
};

export const lazyWithRetry = <T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) =>
  lazy(async () => {
    try {
      const mod = await factory();
      // Importou com sucesso — pode limpar a flag para próximas falhas.
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        // noop
      }
      return mod;
    } catch (error) {
      if (!isChunkLoadError(error)) {
        throw error;
      }

      let alreadyTried = false;
      try {
        alreadyTried = sessionStorage.getItem(RELOAD_FLAG) === "1";
      } catch {
        // sessionStorage indisponível (modo privado etc.)
      }

      if (alreadyTried) {
        // Já tentou recarregar e ainda falha — deixa o ErrorBoundary tratar.
        throw error;
      }

      try {
        sessionStorage.setItem(RELOAD_FLAG, "1");
      } catch {
        // noop
      }

      // Força reload completo para pegar o index.html novo.
      window.location.reload();

      // Retorna uma promise que nunca resolve para o React não disparar o
      // fallback do Suspense enquanto o reload acontece.
      return new Promise(() => {}) as Promise<{ default: T }>;
    }
  });
