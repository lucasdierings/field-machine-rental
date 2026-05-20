import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const isChunkLoadError = (error: Error | null): boolean => {
  if (!error?.message) return false;
  return (
    /Failed to fetch dynamically imported module/i.test(error.message) ||
    /Loading chunk \d+ failed/i.test(error.message) ||
    /Importing a module script failed/i.test(error.message) ||
    /error loading dynamically imported module/i.test(error.message)
  );
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Store error for admin debug overlay
    if (window.__APP_ERRORS) {
      window.__APP_ERRORS.push({
        type: 'react',
        message: error.message,
        file: errorInfo.componentStack?.split('\n')[1]?.trim(),
        time: new Date().toISOString(),
      });
    }

    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = isChunkLoadError(this.state.error);

      // Para erros de chunk antigo (deploy enquanto a aba estava aberta),
      // mostramos uma mensagem específica e o botão "Tentar novamente" força
      // um reload completo (não apenas reset de state) para pegar o
      // index.html novo.
      if (isChunkError) {
        return (
          <section
            className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Atualização disponível
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              O FieldMachine foi atualizado. Recarregue a página para
              continuar.
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => {
                try {
                  sessionStorage.removeItem('fm:chunk-reload-attempted');
                } catch {
                  // noop
                }
                window.location.reload();
              }}
              aria-label="Recarregar página"
            >
              Recarregar página
            </button>
          </section>
        );
      }

      return (
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
          }}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ef4444', marginBottom: '16px' }}>
            ⚠️ Algo deu errado
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', maxWidth: '400px' }}>
            Estamos com um problema temporario. Nossa equipe ja foi notificada e estamos trabalhando para resolver.
          </p>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
            onClick={() => window.location.reload()}
            aria-label="Recarregar página após erro"
          >
            Recarregar App
          </button>
          <a
            href="/status"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Verificar status dos sistemas
          </a>
        </section>
      );
    }

    return this.props.children;
  }
}
