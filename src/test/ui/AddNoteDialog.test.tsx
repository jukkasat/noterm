import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddNoteDialog } from '@/components/AddNoteDialog';

describe('AddNoteDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when open', () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText('Add New Note')).toBeInTheDocument();
    expect(screen.getByText('Create a new note for your board.')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <AddNoteDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.queryByText('Add New Note')).not.toBeInTheDocument();
  });

  it('should call onAdd with message when form is submitted', async () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    const messageInput = screen.getByPlaceholderText('Enter note content...');
    fireEvent.change(messageInput, { target: { value: 'Test note message' } });

    const addButton = screen.getByText('Add Note');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Test note message', undefined);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should call onAdd with subject and message when both provided', async () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    const subjectInput = screen.getByPlaceholderText('Note subject...');
    const messageInput = screen.getByPlaceholderText('Enter note content...');

    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const addButton = screen.getByText('Add Note');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Test message', 'Test Subject');
    });
  });

  it('should not submit when message is empty', async () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    const addButton = screen.getByText('Add Note');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAdd).not.toHaveBeenCalled();
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });

  it('should clear inputs after submission', async () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    const subjectInput = screen.getByPlaceholderText('Note subject...') as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText('Enter note content...') as HTMLTextAreaElement;

    fireEvent.change(subjectInput, { target: { value: 'Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Message' } });

    const addButton = screen.getByText('Add Note');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  it('should apply dark mode styles when darkMode prop is true', () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
        darkMode={true}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ backgroundColor: '#3a3530' });
  });

  it('should handle form submission with Enter key', async () => {
    render(
      <AddNoteDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onAdd={mockOnAdd}
      />
    );

    const messageInput = screen.getByPlaceholderText('Enter note content...');
    fireEvent.change(messageInput, { target: { value: 'Test note' } });
    
    const form = messageInput.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Test note', undefined);
    });
  });
});