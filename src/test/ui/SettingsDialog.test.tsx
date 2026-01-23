import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsDialog } from '@/components/SettingsDialog';

describe('SettingsDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnDarkModeChange = vi.fn();
  const mockOnTextSizeChange = vi.fn();
  const mockOnFontStyleChange = vi.fn();
  const mockOnSwimlanesCountChange = vi.fn();

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
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
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
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
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
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    const darkModeSwitch = screen.getByRole('switch');
    fireEvent.click(darkModeSwitch);

    await waitFor(() => {
      expect(mockOnDarkModeChange).toHaveBeenCalledWith(true);
    });
  });

  it('should change text size when plus button is clicked', async () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    // Find all buttons and locate the Plus button
    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => btn.querySelector('.lucide-plus'));
    
    expect(plusButton).toBeDefined();
    if (plusButton) {
      fireEvent.click(plusButton);

      await waitFor(() => {
        expect(mockOnTextSizeChange).toHaveBeenCalledWith(4);
      });
    }
  });

  it('should open about dialog when About button is clicked', async () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
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
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ backgroundColor: '#3a3530' });
  });

  it('should display correct text size value', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={2}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    // Check that the number 2 is displayed
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render font style dropdown', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    expect(screen.getByText('Font style')).toBeInTheDocument();
    const select = screen.getByDisplayValue('Handwriting');
    expect(select).toBeInTheDocument();
  });

  it('should display all font style options', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    const select = screen.getByDisplayValue('Handwriting') as HTMLSelectElement;
    const options = Array.from(select.options).map(option => option.text);
    
    expect(options).toContain('Handwriting');
    expect(options).toContain('Sans Serif');
    expect(options).toContain('Serif');
    expect(options).toContain('Monospace');
  });

  it('should change font style when dropdown is changed', async () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="handwriting"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    const select = screen.getByDisplayValue('Handwriting');
    fireEvent.change(select, { target: { value: 'sans-serif' } });

    await waitFor(() => {
      expect(mockOnFontStyleChange).toHaveBeenCalledWith('sans-serif');
    });
  });

  it('should display correct font style value', () => {
    render(
      <SettingsDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        darkMode={false}
        onDarkModeChange={mockOnDarkModeChange}
        textSize={3}
        onTextSizeChange={mockOnTextSizeChange}
        fontStyle="monospace"
        onFontStyleChange={mockOnFontStyleChange}
        swimlanesCount={0}
        onSwimlanesCountChange={mockOnSwimlanesCountChange}
      />
    );

    const select = screen.getByDisplayValue('Monospace');
    expect(select).toBeInTheDocument();
  });
});