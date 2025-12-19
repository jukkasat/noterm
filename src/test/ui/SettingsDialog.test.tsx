import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsDialog } from '@/components/SettingsDialog';

describe('SettingsDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnDarkModeChange = vi.fn();
  const mockOnTextSizeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render settings dialog when open', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="normal"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Customize your noter m. experience.')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <SettingsDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="normal"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should toggle dark mode when switch is clicked', async () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="normal"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    const darkModeSwitch = screen.getByRole('switch');
    fireEvent.click(darkModeSwitch);

    await waitFor(() => {
      expect(mockOnDarkModeChange).toHaveBeenCalledWith(true);
    });
  });

  it('should change text size when radio button is selected', async () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="normal"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    const largeRadio = screen.getByLabelText('Large');
    fireEvent.click(largeRadio);

    await waitFor(() => {
      expect(mockOnTextSizeChange).toHaveBeenCalledWith('large');
    });
  });

  it('should open about dialog when About button is clicked', async () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="normal"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    const aboutButton = screen.getByText('About');
    fireEvent.click(aboutButton);

    await waitFor(() => {
      expect(screen.getByText('noterm.')).toBeInTheDocument();
    });
  });

  it('should apply dark mode styles when darkMode is true', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={true}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="normal"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ backgroundColor: '#3a3530' });
  });

  it('should have correct text size selected', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize="small"
        onTextSizeChange={mockOnTextSizeChange}
      />
    );

    const smallRadio = screen.getByLabelText('Small') as HTMLInputElement;
    expect(smallRadio).toBeChecked();
  });
});