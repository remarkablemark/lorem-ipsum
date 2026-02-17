/**
 * Tests for CopyButton component
 */

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import CopyButton from './CopyButton';

// Mock clipboard utilities
vi.mock('src/utils/clipboardUtils/clipboardUtils', () => ({
  copyText: vi.fn(),
  isClipboardSupported: vi.fn(() => true),
}));

import { copyText } from 'src/utils/clipboardUtils/clipboardUtils';

const mockCopyText = vi.mocked(copyText);

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render copy button with default text', () => {
    render(<CopyButton text="Sample text" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Copy');
  });

  it('should render copy button with custom text', () => {
    render(<CopyButton text="Sample text" buttonText="Copy All" />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Copy All');
  });

  it('should call copyText when clicked', async () => {
    render(<CopyButton text="Sample text to copy" />);

    const button = screen.getByRole('button');

    await waitFor(() => {
      fireEvent.click(button);
    });

    expect(mockCopyText).toHaveBeenCalledWith('Sample text to copy');
  });

  it('should show copied feedback after successful copy', async () => {
    mockCopyText.mockResolvedValue({
      success: true,
      copyType: 'selection',
      timestamp: Date.now(),
    });

    render(<CopyButton text="Sample text" />);

    const button = screen.getByRole('button');

    await waitFor(() => {
      fireEvent.click(button);
    });

    expect(button).toHaveTextContent('Copied!');
  });

  it('should show error feedback on failed copy', async () => {
    mockCopyText.mockResolvedValue({
      success: false,
      copyType: 'selection',
      timestamp: Date.now(),
      error: 'Failed',
    });

    render(<CopyButton text="Sample text" />);

    const button = screen.getByRole('button');

    await waitFor(() => {
      fireEvent.click(button);
    });

    expect(button).toHaveTextContent('Copy failed');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CopyButton text="Sample text" disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should have proper accessibility attributes', () => {
    render(<CopyButton text="Sample text" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Copy text to clipboard');
  });

  it('should apply custom className when provided', () => {
    render(<CopyButton text="Sample text" className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should not render when clipboard is not supported', async () => {
    // Mock isClipboardSupported to return false
    const clipboardUtils =
      await import('src/utils/clipboardUtils/clipboardUtils');
    vi.spyOn(clipboardUtils, 'isClipboardSupported').mockReturnValue(false);

    const { container } = render(<CopyButton text="Sample text" />);

    // Component should return null, so container should be empty
    expect(container.firstChild).toBeNull();

    // Restore original mock
    vi.spyOn(clipboardUtils, 'isClipboardSupported').mockReturnValue(true);
  });

  it('should not call copyText when disabled', async () => {
    render(<CopyButton text="Sample text" disabled />);

    const button = screen.getByRole('button');

    await waitFor(() => {
      fireEvent.click(button);
    });

    expect(mockCopyText).not.toHaveBeenCalled();
  });

  it('should not call copyText when already copying', () => {
    // Mock copyText to never resolve to simulate copying state
    mockCopyText.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 10000)),
    );

    render(<CopyButton text="Sample text" />);

    const button = screen.getByRole('button');

    // First click
    act(() => {
      fireEvent.click(button);
    });

    // Second click while still copying
    act(() => {
      fireEvent.click(button);
    });

    // copyText should only have been called once
    expect(mockCopyText).toHaveBeenCalledTimes(1);
  });

  it('should have handleClickSync function that calls handleClick', () => {
    render(<CopyButton text="Sample text" />);

    const button = screen.getByRole('button');

    // The handleClickSync function should be called when button is clicked
    // This tests the sync wrapper that calls the async handleClick
    expect(button).toBeInTheDocument();

    // Click the button to trigger the sync wrapper
    act(() => {
      fireEvent.click(button);
    });

    // The async handleClick should have been called (we can verify this by checking if copyText was called)
    expect(mockCopyText).toHaveBeenCalled();
  });
});
