import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">خطا در بارگذاری صفحه</h2>
            <p className="text-slate-400 mb-4">
              متأسفانه خطایی رخ داده است. لطفاً صفحه را رفرش کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              رفرش صفحه
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-slate-400">
                  جزئیات خطا
                </summary>
                <pre className="mt-2 text-xs text-red-300 bg-red-900 p-2 rounded border border-red-700">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
