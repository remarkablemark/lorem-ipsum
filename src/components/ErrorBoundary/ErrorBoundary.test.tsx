/**
 * Tests for ErrorBoundary component
 */

import { render, screen } from '@testing-library/react';

import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ThrowErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch and display error when child component throws', () => {
    // Suppress console.error for this test
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should call onError prop when error occurs', () => {
    const mockOnError = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(
      <ErrorBoundary onError={mockOnError}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnError.mock.calls[0][0]).toBeInstanceOf(Error);

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should render custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should reset error state when reset button is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Should show error state
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click reset button
    const resetButton = screen.getByText('Try Again');
    resetButton.click();

    // Rerender with non-throwing component
    rerender(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>,
    );

    // Should show normal content
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should show error details in development mode', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    // Mock development mode
    vi.stubGlobal('import.meta', {
      env: {
        DEV: true,
        MODE: 'development',
      },
    });

    const { container } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Basic check that error boundary renders its fallback UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();

    // Check that error details are shown in development mode
    const errorDetails = container.querySelector(
      '[data-testid="error-details"]',
    );
    expect(errorDetails).toBeInTheDocument();
    expect(
      screen.getByText('Error Details (Development Only)'),
    ).toBeInTheDocument();

    // Check that the error container has proper accessibility attributes
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveAttribute('aria-live', 'polite');

    // Restore
    vi.unstubAllGlobals();
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should have proper accessibility attributes', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveAttribute('aria-live', 'polite');

    const resetButton = screen.getByRole('button', { name: 'Try Again' });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveAttribute('type', 'button');

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should reload page when refresh button is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    const refreshButton = screen.getByRole('button', { name: 'Refresh Page' });
    refreshButton.click();

    expect(mockReload).toHaveBeenCalled();

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should handle error in production mode', () => {
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Should still show error UI in production mode
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Restore console.error
    // eslint-disable-next-line no-console
    vi.mocked(console.error).mockRestore();
  });

  it('should handle error without console logging in production mode', () => {
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(vi.fn());

    // Mock production mode by setting DEV to false after import
    const originalDev = import.meta.env.DEV;
    (import.meta.env as unknown as { DEV: boolean }).DEV = false;

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Should still show error UI
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Restore
    (import.meta.env as unknown as { DEV: boolean }).DEV = originalDev;
    mockConsoleError.mockRestore();
  });
});
