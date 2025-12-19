import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AboutDialog } from '../../components/AboutDialog';

describe('AboutDialog', () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render about dialog when open', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('noterm.')).toBeInTheDocument();
    expect(screen.getByText(/noter memo/i)).toBeInTheDocument();
    expect(screen.getByText(/digital note board/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <AboutDialog
        open={false}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.queryByText('noterm.')).not.toBeInTheDocument();
  });

  it('should display feature descriptions', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/best note app/i)).toBeInTheDocument();
    expect(screen.getByText(/fully usable offline/i)).toBeInTheDocument();
    expect(screen.getByText(/local storage/i)).toBeInTheDocument();
    expect(screen.getByText(/Save and load notes/i)).toBeInTheDocument();
  });

  it('should display PWA tip', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/TIP!/i)).toBeInTheDocument();
    expect(screen.getByText(/Progressive Web App/i)).toBeInTheDocument();
  });

  it('should close dialog when Close button is clicked', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Get all buttons with "Close" text - the last one is the custom Close button
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    fireEvent.click(closeButtons[closeButtons.length - 1]);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should apply dark mode styles when darkMode is true', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={true}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ backgroundColor: '#3a3530' });
  });

  it('should apply light mode styles when darkMode is false', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ backgroundColor: '#ffffff' });
  });

  it('should display Happy noting message', () => {
    render(
      <AboutDialog
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText(/Happy noting!/i)).toBeInTheDocument();
  });
});