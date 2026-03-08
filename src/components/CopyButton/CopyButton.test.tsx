import { act, fireEvent, render, screen } from '@testing-library/react';
import type { LoremText } from 'src/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  const mockWriteText = vi.fn();
  const originalText: LoremText = {
    id: '1',
    content: 'Lorem ipsum',
    type: 'original',
    position: 0,
    paragraphIndex: 1,
  };
  const texts: LoremText[] = [
    {
      id: '2',
      content: 'Dolor sit',
      type: 'generated',
      position: 1,
      paragraphIndex: 2,
    },
    {
      id: '3',
      content: 'Amet consectetur',
      type: 'generated',
      position: 2,
      paragraphIndex: 3,
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should render copy button with clipboard icon', () => {
    render(<CopyButton originalText={originalText} texts={texts} />);

    const button = screen.getByRole('button', {
      name: /copy text to clipboard/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('📋');
  });

  it('should copy text to clipboard on click', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', {
      name: /copy text to clipboard/i,
    });

    await act(async () => {
      fireEvent.click(button);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(mockWriteText).toHaveBeenCalledWith(
      'Lorem ipsum\n\nDolor sit\n\nAmet consectetur',
    );
  });

  it('should show success feedback after successful copy', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', {
      name: /copy text to clipboard/i,
    });

    await act(async () => {
      fireEvent.click(button);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(
      screen.getByRole('button', { name: /text copied/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('✅');
  });

  it('should reset to idle state after feedback timeout', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', {
      name: /copy text to clipboard/i,
    });

    await act(async () => {
      fireEvent.click(button);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(
      screen.getByRole('button', { name: /text copied/i }),
    ).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    expect(
      screen.getByRole('button', { name: /copy text to clipboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('📋');
  });

  it('should show error feedback on copy failure', async () => {
    mockWriteText.mockRejectedValue(new Error('Permission denied'));

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', {
      name: /copy text to clipboard/i,
    });

    await act(async () => {
      fireEvent.click(button);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(
      screen.getByRole('button', { name: /failed to copy text/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('❌');
  });

  it('should cleanup timer on unmount', () => {
    mockWriteText.mockResolvedValue(undefined);

    const { unmount } = render(
      <CopyButton originalText={originalText} texts={texts} />,
    );

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('should handle rapid clicks correctly', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', {
      name: /copy text to clipboard/i,
    });

    await act(async () => {
      fireEvent.click(button);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(
      screen.getByRole('button', { name: /text copied/i }),
    ).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    await act(async () => {
      fireEvent.click(button);
      await vi.runOnlyPendingTimersAsync();
    });

    expect(
      screen.getByRole('button', { name: /text copied/i }),
    ).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });
    expect(
      screen.getByRole('button', { name: /copy text to clipboard/i }),
    ).toBeInTheDocument();
  });
});
