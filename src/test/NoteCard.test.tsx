import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {NoteCard } from '../components/NoteCard';
import type { Note } from '@/types/note';

const mockNote: Note = {
  id: '1',
  subject: 'Test Subject',
  message: 'Test message',
  x: 100,
  y: 100,
  width: 250,
  height: 200,
  color: '#fef08a',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('NoteCard', () => {
  it('should render note with subject and message', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    render(
      <NoteCard
        note={mockNote}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    );

    expect(screen.getByText('Test Subject')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should call onUpdate when editing and saving', async () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    render(
      <NoteCard
        note={mockNote}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    );

    // Double click to enter edit mode
    const messageArea = screen.getByText('Test message');
    fireEvent.doubleClick(messageArea);

    // Find textarea and change value
    const textarea = screen.getByDisplayValue('Test message') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Updated message' } });

    // Click save button
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
      message: 'Updated message',
    }));
  });

  it('should call onDelete when delete is confirmed', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    render(
      <NoteCard
        note={mockNote}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    );

    // Click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-trash-2')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      // Confirm deletion
      const confirmButton = screen.getByText('Yes');
      fireEvent.click(confirmButton);

      expect(onDelete).toHaveBeenCalledWith('1');
    }
  });

  it('should render with different text sizes', () => {
    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    const { rerender } = render(
      <NoteCard
        note={mockNote}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
        textSize="small"
      />
    );

    let subject = screen.getByText('Test Subject');
    expect(subject).toHaveClass('text-xs');

    rerender(
      <NoteCard
        note={mockNote}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
        textSize="large"
      />
    );

    subject = screen.getByText('Test Subject');
    expect(subject).toHaveClass('text-base');
  });
});