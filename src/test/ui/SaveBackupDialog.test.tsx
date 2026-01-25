import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaveBackupDialog } from '@/components/SaveBackupDialog';

describe('SaveBackupDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnSave = vi.fn();
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSave: mockOnSave,
    defaultFilename: 'noter_backup_25_01_26.json',
    textSize: 3 as const,
    fontStyle: 'handwriting' as const,
    darkMode: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render save backup dialog when open', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    expect(screen.getByText('Save Backup')).toBeInTheDocument();
    expect(screen.getByText('Enter a name for your backup file.')).toBeInTheDocument();
    expect(screen.getByLabelText('Filename')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<SaveBackupDialog {...defaultProps} open={false} />);

    expect(screen.queryByText('Save Backup')).not.toBeInTheDocument();
  });

  it('should display default filename in input', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename') as HTMLInputElement;
    expect(input.value).toBe('noter_backup_25_01_26.json');
  });

  it('should update filename when user types', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'my_custom_backup.json' } });

    expect((input as HTMLInputElement).value).toBe('my_custom_backup.json');
  });

  it('should call onSave with filename when Save button is clicked', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'custom_backup.json' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('custom_backup.json');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should add .json extension if not present', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'backup_without_extension' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('backup_without_extension.json');
  });

  it('should not add .json extension if already present', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'backup.json' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('backup.json');
  });

  it('should save when Enter key is pressed', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'enter_save.json' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockOnSave).toHaveBeenCalledWith('enter_save.json');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onOpenChange when Cancel button is clicked', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should disable Save button when filename is empty', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: '' } });

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('should disable Save button when filename is only whitespace', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: '   ' } });

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('should trim whitespace from filename before saving', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: '  backup.json  ' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('backup.json');
  });

  it('should reset filename when dialog reopens', async () => {
    const { rerender } = render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'modified.json' } });
    expect((input as HTMLInputElement).value).toBe('modified.json');

    // Close dialog
    rerender(<SaveBackupDialog {...defaultProps} open={false} />);

    // Reopen with new default filename
    rerender(
      <SaveBackupDialog
        {...defaultProps}
        open={true}
        defaultFilename="noter_backup_26_01_26.json"
      />
    );

    await waitFor(() => {
      const newInput = screen.getByLabelText('Filename') as HTMLInputElement;
      expect(newInput.value).toBe('noter_backup_26_01_26.json');
    });
  });

  describe('Dark mode styling', () => {
    it('should apply dark mode colors when darkMode is true', () => {
      render(<SaveBackupDialog {...defaultProps} darkMode={true} />);

      const input = screen.getByLabelText('Filename');
      expect(input).toHaveStyle({ backgroundColor: '#2a2520' });
    });

    it('should apply light mode colors when darkMode is false', () => {
      render(<SaveBackupDialog {...defaultProps} darkMode={false} />);

      const input = screen.getByLabelText('Filename');
      expect(input).toHaveStyle({ backgroundColor: '#fdfcfa' });
    });
  });

  describe('Font style', () => {
    it('should apply handwriting font class', () => {
      render(<SaveBackupDialog {...defaultProps} fontStyle="handwriting" />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('font-handwriting');
    });

    it('should apply sans-serif font class', () => {
      render(<SaveBackupDialog {...defaultProps} fontStyle="sans-serif" />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('font-sans');
    });

    it('should apply serif font class', () => {
      render(<SaveBackupDialog {...defaultProps} fontStyle="serif" />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('font-serif');
    });

    it('should apply monospace font class', () => {
      render(<SaveBackupDialog {...defaultProps} fontStyle="monospace" />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('font-mono');
    });
  });

  describe('Text size', () => {
    it('should apply text size 1 classes', () => {
      render(<SaveBackupDialog {...defaultProps} textSize={1} />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('text-base');
    });

    it('should apply text size 3 classes', () => {
      render(<SaveBackupDialog {...defaultProps} textSize={3} />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('text-xl');
    });

    it('should apply text size 5 classes', () => {
      render(<SaveBackupDialog {...defaultProps} textSize={5} />);

      const title = screen.getByText('Save Backup');
      expect(title.className).toContain('text-3xl');
    });
  });

  it('should have correct placeholder text', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    expect(input).toHaveAttribute('placeholder', 'noter_backup.json');
  });

  it('should not call onSave when Save is clicked with empty filename', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: '' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should handle special characters in filename', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'backup_2026-01-25_notes.json' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('backup_2026-01-25_notes.json');
  });

  it('should handle filename with multiple dots', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'backup.v2.final' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('backup.v2.final.json');
  });

  it('should preserve filename that already ends with .json', () => {
    render(<SaveBackupDialog {...defaultProps} />);

    const input = screen.getByLabelText('Filename');
    fireEvent.change(input, { target: { value: 'my_backup.json' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('my_backup.json');
    expect(mockOnSave).not.toHaveBeenCalledWith('my_backup.json.json');
  });
});
