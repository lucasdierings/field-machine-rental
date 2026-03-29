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

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sempre logar erros, mesmo em produção
    console.error('Error caught by boundary:', error, errorInfo);

    // Em produção, também mostrar alert para debug mobile
    if (import.meta.env.PROD) {
      setTimeout(() => {
        alert(`Erro capturado: ${error.message}`);
      }, 100);
    }

    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
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
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
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
          <button
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Tentar novamente sem recarregar
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
