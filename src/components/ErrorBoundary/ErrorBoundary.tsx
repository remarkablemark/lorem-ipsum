/**
 * Error Boundary component for catching and handling React errors
 * Provides fallback UI and error reporting functionality
 */

import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="flex min-h-screen items-center justify-center bg-slate-50"
          role="alert"
          aria-live="polite"
        >
          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-4xl" aria-hidden="true">
                  ⚠️
                </span>
              </div>
              <h1 className="mb-2 text-xl font-semibold text-slate-900">
                Something went wrong
              </h1>
              <p className="mb-6 text-slate-600">
                We encountered an unexpected error. You can try refreshing the
                page or click the button below to reset the application.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left" data-testid="error-details">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 max-h-40 overflow-auto rounded bg-slate-100 p-3 font-mono text-xs text-slate-800">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div className="mb-2">
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
