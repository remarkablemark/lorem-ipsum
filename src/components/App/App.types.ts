/**
 * Types for App component
 */

export interface AppProps {
  className?: string;
}

export interface AppState {
  isInitialized: boolean;
  hasError: boolean;
  errorMessage?: string;
}
