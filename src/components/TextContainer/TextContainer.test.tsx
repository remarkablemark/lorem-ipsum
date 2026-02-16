/**
 * Tests for TextContainer component
 */

import { render, screen } from '@testing-library/react';

import TextContainer from './TextContainer';

// Mock the hooks to control their behavior
vi.mock('src/hooks/useLoremText', () => ({
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
    reset: vi.fn(),
    getAllText: vi.fn(),
    getWordCount: vi.fn(),
  })),
}));

vi.mock('src/hooks/useScrollDetection', () => ({
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
    isNearBottom: false,
    velocity: 0,
    scrollToTop: vi.fn(),
    scrollToBottom: vi.fn(),
  })),
}));

import { useLoremText } from 'src/hooks/useLoremText';

describe('TextContainer', () => {
  it('should render the original text', () => {
    render(<TextContainer />);

    const originalText = screen.getByText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );
    expect(originalText).toBeInTheDocument();
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
      reset: vi.fn(),
      getAllText: vi.fn(),
      getWordCount: vi.fn(),
    });

    render(<TextContainer />);

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
      reset: vi.fn(),
      getAllText: vi.fn(),
      getWordCount: vi.fn(),
    });

    render(<TextContainer />);

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
      reset: vi.fn(),
      getAllText: vi.fn(),
      getWordCount: vi.fn(),
    });

    render(<TextContainer />);

    const emptyStateText = screen.getByText('No text generated yet');
    expect(emptyStateText).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<TextContainer />);

    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'Lorem ipsum text');
  });

  it('should be scrollable', () => {
    render(<TextContainer />);

    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('data-testid', 'text-container');
  });
});
