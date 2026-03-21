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
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
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
          className="flex flex-col items-center justify-center p-8 text-center"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 className="text-lg font-semibold text-destructive mb-2">Algo deu errado</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => this.setState({ hasError: false, error: null })}
            aria-label="Recarregar página após erro"
          >
            Tentar novamente
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
