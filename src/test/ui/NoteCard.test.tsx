import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {NoteCard } from '@/components/NoteCard';
import type { Note } from '@/types/note';

const mockNote: Note = {
  id: '1',
  subject: 'Test Subject',
  content: [{ type: 'text', id: '1', value: 'Test message' }],
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
    fireEvent.input(textarea, { target: { value: 'Updated message' } });

    // Click save button
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
      subject: 'Test Subject',
      content: expect.arrayContaining([
        expect.objectContaining({ value: 'Updated message' })
      ]),
      updatedAt: expect.any(Number),
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

  it('should toggle checkbox in read mode without editing', () => {
    const noteWithCheckbox: Note = {
      id: '1',
      subject: 'Test Subject',
      content: [
        { type: 'checkbox', id: '1', text: 'Task 1', checked: false }
      ],
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      color: '#fef08a',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    render(
      <NoteCard
        note={noteWithCheckbox}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    );

    // Find and click checkbox in read mode
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Verify onUpdate was called with checked=true
    expect(onUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
      content: expect.arrayContaining([
        expect.objectContaining({ checked: true })
      ]),
      updatedAt: expect.any(Number),
    }));
  });

  it('should render multiple content types (text, checkbox, image)', () => {
    const noteWithMixedContent: Note = {
      id: '1',
      subject: 'Mixed Content',
      content: [
        { type: 'text', id: '1', value: 'Some text' },
        { type: 'checkbox', id: '2', text: 'Task item', checked: false },
        { type: 'image', id: '3', url: 'data:image/png;base64,test' }
      ],
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      color: '#fef08a',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    render(
      <NoteCard
        note={noteWithMixedContent}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    );

    // Verify all content types are rendered
    expect(screen.getByText('Some text')).toBeInTheDocument();
    expect(screen.getByText('Task item')).toBeInTheDocument();
    expect(screen.getByAltText('Note attachment')).toBeInTheDocument();
  });

  it('should open image zoom dialog when clicking image in read mode', () => {
    const noteWithImage: Note = {
      id: '1',
      subject: 'Image Note',
      content: [
        { type: 'image', id: '1', url: 'data:image/png;base64,test' }
      ],
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      color: '#fef08a',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const onUpdate = vi.fn();
    const onDelete = vi.fn();
    const onDragStart = vi.fn();

    render(
      <NoteCard
        note={noteWithImage}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDragStart={onDragStart}
      />
    );

    // Click the image
    const image = screen.getByAltText('Note attachment');
    fireEvent.click(image);

    // Verify zoomed image dialog appears
    const zoomedImages = screen.getAllByAltText(/Note attachment|Zoomed/);
    expect(zoomedImages.length).toBeGreaterThan(1);
  });

  it('should add text field when clicking empty area in edit mode', () => {
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

    // Enter edit mode
    const messageArea = screen.getByText('Test message');
    fireEvent.doubleClick(messageArea);

    // Find the scrollable container and click on it
    const container = screen.getByText('Test message').closest('.flex-1');
    if (container) {
      fireEvent.click(container);
      
      // Verify a new text field was added
      const textareas = screen.getAllByRole('textbox');
      expect(textareas.length).toBeGreaterThan(1);
    }
  });

  it('should not add second text field if last item is already text', () => {
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

    // Enter edit mode
    const messageArea = screen.getByText('Test message');
    fireEvent.doubleClick(messageArea);

    // Get initial number of text fields (subject + text content)
    const initialTextareas = screen.getAllByRole('textbox');
    const initialCount = initialTextareas.length;

    // Try to click empty area - should NOT add a text field because last item is already text
    const container = screen.getByText('Test message').closest('.flex-1');
    if (container) {
      fireEvent.click(container);
      
      const finalTextareas = screen.getAllByRole('textbox');
      // Should NOT have added any text field
      expect(finalTextareas.length).toBe(initialCount);
    }
  });

  it('should allow adding text field after adding checkbox', async () => {
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

    // Enter edit mode
    const messageArea = screen.getByText('Test message');
    fireEvent.doubleClick(messageArea);

    // Find all buttons and locate the Plus button by its icon
    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => 
      btn.querySelector('.lucide-plus')
    );
    
    if (plusButton) {
      fireEvent.click(plusButton);
      
      // Click "Checkbox" option
      const checkboxButton = screen.getByText('Checkbox');
      fireEvent.click(checkboxButton);
      
      // Wait for the checkbox to be added
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
      });
      
      // Now click empty area - should be able to add text field
      const container = messageArea.closest('.flex-1');
      if (container) {
        const beforeCount = screen.getAllByRole('textbox').length;
        fireEvent.click(container);
        
        // Verify text field was added after checkbox
        await waitFor(() => {
          const afterCount = screen.getAllByRole('textbox').length;
          expect(afterCount).toBeGreaterThan(beforeCount);
        });
      }
    }
  });
});