import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="p-6 md:p-8 rounded-3xl bg-charcoal/90 border border-red-500/30 text-ivory max-w-lg mx-auto my-8 shadow-2xl backdrop-blur-md text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-ivory">
            {this.props.fallbackTitle || 'Component Encountered an Issue'}
          </h3>
          <p className="text-sm text-ivory-muted leading-relaxed">
            {this.props.fallbackMessage ||
              'A non-critical rendering error occurred. You can attempt to reload the component.'}
          </p>
          {this.state.error && (
            <p className="p-3 rounded-xl bg-black/40 text-red-300 font-mono text-xs overflow-x-auto text-left border border-white/5">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReset}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber text-[#0a0806] font-semibold text-xs uppercase tracking-wider hover:bg-amber/90 transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber/20"
          >
            <RefreshCw size={14} />
            <span>Retry Rendering</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
