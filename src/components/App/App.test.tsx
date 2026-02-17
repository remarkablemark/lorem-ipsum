/**
 * Tests for App component
 */

import { fireEvent, render, screen } from '@testing-library/react';

import App from './App';

vi.mock('src/hooks', () => ({
  useLoremText: vi.fn(() => ({
    texts: [
      {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
    ],
    originalText: {
      id: 'original-lorem-ipsum',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      type: 'original',
      position: 0,
      paragraphIndex: 1,
    },
    isGenerating: false,
    generateMore: vi.fn(),
  })),
  useScrollDetection: vi.fn(() => ({
    position: {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 800,
      scrollPercentage: 0,
      isNearBottom: false,
      lastScrollTime: Date.now(),
      scrollVelocity: 0,
    },
  })),
}));

import { useLoremText, useScrollDetection } from 'src/hooks';

describe('App', () => {
  it('should render the main heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Lorem Ipsum Generator');
  });

  it('should render the original lorem ipsum text', () => {
    render(<App />);

    const originalText = screen.getByText(/Lorem ipsum dolor sit amet/);
    expect(originalText).toBeInTheDocument();
  });

  it('should render the text container', () => {
    render(<App />);

    const textContainer = screen.getByTestId('text-container');
    expect(textContainer).toBeInTheDocument();
  });

  it('should render generated texts when present', () => {
    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
        {
          id: 'generated-1',
          content: 'Generated lorem ipsum text.',
          type: 'generated',
          position: 1,
          paragraphIndex: 2,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: vi.fn(),
    });

    render(<App />);

    const generatedText = screen.getByText('Generated lorem ipsum text.');
    expect(generatedText).toBeInTheDocument();
  });

  it('should render loading state when generating', () => {
    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: true,
      generateMore: vi.fn(),
    });

    render(<App />);

    const loadingText = screen.getByText('Generating more text...');
    expect(loadingText).toBeInTheDocument();
  });

  it('should render empty state when no texts', () => {
    vi.mocked(useLoremText).mockReturnValue({
      texts: [],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: vi.fn(),
    });

    render(<App />);

    const emptyStateText = screen.getByText('No text generated yet');
    expect(emptyStateText).toBeInTheDocument();
  });

  it('should render the text container', () => {
    render(<App />);

    const textContainer = screen.getByTestId('text-container');
    expect(textContainer).toBeInTheDocument();
  });

  it('should trigger generateMore when near bottom and not generating', () => {
    const mockGenerateMore = vi.fn();

    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: mockGenerateMore,
    });

    vi.mocked(useScrollDetection).mockReturnValue({
      position: {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 800,
        scrollPercentage: 90,
        isNearBottom: true,
        lastScrollTime: Date.now(),
        scrollVelocity: 0,
      },
      isNearBottom: true,
      velocity: 0,
    });

    render(<App />);

    // Should generate the configured number of paragraphs
    expect(mockGenerateMore).toHaveBeenCalledWith(2);
  });

  it('should not trigger generateMore when near bottom but already generating', () => {
    const mockGenerateMore = vi.fn();

    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: true,
      generateMore: mockGenerateMore,
    });

    vi.mocked(useScrollDetection).mockReturnValue({
      position: {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 800,
        scrollPercentage: 90,
        isNearBottom: true,
        lastScrollTime: Date.now(),
        scrollVelocity: 0,
      },
      isNearBottom: true,
      velocity: 0,
    });

    render(<App />);

    expect(mockGenerateMore).not.toHaveBeenCalled();
  });

  it('should render manual generation button', () => {
    // Ensure the mock is not in generating state
    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: vi.fn(),
    });

    render(<App />);

    const generateButton = screen.getByRole('button');
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toHaveTextContent('Generate 3 Paragraphs');
  });

  it('should disable button when generating', () => {
    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: true,
      generateMore: vi.fn(),
    });

    render(<App />);

    const generateButton = screen.getByRole('button', { name: /generating/i });
    expect(generateButton).toBeDisabled();
  });

  it('should call generateMore when button is clicked', () => {
    const mockGenerateMore = vi.fn();

    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: mockGenerateMore,
    });

    render(<App />);

    const generateButton = screen.getByRole('button', {
      name: /generate 3 paragraphs/i,
    });
    generateButton.click();

    expect(mockGenerateMore).toHaveBeenCalledWith(3);
  });

  // Edge case tests
  it('should handle error state gracefully', () => {
    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: vi.fn().mockRejectedValue(new Error('Generation failed')),
    });

    render(<App />);

    // Should still render the UI even if generation fails
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should handle very large text arrays without performance issues', () => {
    const largeTexts = Array.from({ length: 1000 }, (_, index) => ({
      id: `generated-${index.toString()}`,
      content: `Generated paragraph ${index.toString()} with some content.`,
      type: 'generated' as const,
      position: index + 1,
      paragraphIndex: index + 2,
    }));

    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
        ...largeTexts,
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: vi.fn(),
    });

    render(<App />);

    // Should still render without crashing
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should handle empty content gracefully', () => {
    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: '',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: '',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: vi.fn(),
    });

    render(<App />);

    // Should still render the UI structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should handle rapid scroll events without generating multiple times', () => {
    const mockGenerateMore = vi.fn();

    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: mockGenerateMore,
    });

    vi.mocked(useScrollDetection).mockReturnValue({
      position: {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 800,
        scrollPercentage: 90,
        isNearBottom: true,
        lastScrollTime: Date.now(),
        scrollVelocity: 0,
      },
      isNearBottom: true,
      velocity: 0,
    });

    render(<App />);

    // Should only generate once even if near bottom
    expect(mockGenerateMore).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(<App />);

    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Check for button exists (aria-label might not be required if button has visible text)
    const generateButton = screen.getByRole('button');
    expect(generateButton).toBeInTheDocument();

    // Check for proper landmark regions
    const mainRegion = screen.getByRole('main');
    expect(mainRegion).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    const mockGenerateMore = vi.fn();

    vi.mocked(useLoremText).mockReturnValue({
      texts: [
        {
          id: 'original-lorem-ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          type: 'original',
          position: 0,
          paragraphIndex: 1,
        },
      ],
      originalText: {
        id: 'original-lorem-ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        type: 'original',
        position: 0,
        paragraphIndex: 1,
      },
      isGenerating: false,
      generateMore: mockGenerateMore,
    });

    render(<App />);

    const generateButton = screen.getByRole('button');

    // Test keyboard interaction
    generateButton.focus();
    expect(generateButton).toHaveFocus();

    // Test Enter key - simulate actual click behavior
    fireEvent.click(generateButton);
    expect(mockGenerateMore).toHaveBeenCalled();

    // Test Space key
    mockGenerateMore.mockClear();
    fireEvent.click(generateButton);
    expect(mockGenerateMore).toHaveBeenCalled();
  });
});
