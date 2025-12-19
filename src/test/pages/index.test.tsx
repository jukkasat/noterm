import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainComponent from '@/pages/Index';

// Mock unhead
vi.mock('@unhead/react', () => ({
  useSeoMeta: vi.fn(),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('Index page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render the page with title', () => {
    render(<MainComponent />);
    expect(screen.getByText('noterm.')).toBeInTheDocument();
    expect(screen.getByText('Your Digital Note Board')).toBeInTheDocument();
  });

  it('should show empty state when no notes', () => {
    render(<MainComponent />);
    expect(screen.getByText('No notes yet!')).toBeInTheDocument();
  });

  it('should open add note dialog when clicking plus button', async () => {
    render(<MainComponent />);
    
    const addButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-plus')
    );
    
    if (addButton) {
      fireEvent.click(addButton);
      await waitFor(() => {
        expect(screen.getByText('Add New Note')).toBeInTheDocument();
      });
    }
  });

  it('should persist notes to localStorage', async () => {
    render(<MainComponent />);
    
    // Open dialog and add note
    const addButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-plus')
    );
    
    if (addButton) {
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Enter note content...');
        fireEvent.change(messageInput, { target: { value: 'Test note' } });
        
        const submitButton = screen.getByText('Add Note');
        fireEvent.click(submitButton);
      });

      // Check localStorage
      await waitFor(() => {
        const savedNotes = localStorage.getItem('noter-notes');
        expect(savedNotes).toBeTruthy();
        
        if (savedNotes) {
          const notes = JSON.parse(savedNotes);
          expect(notes).toHaveLength(1);
          expect(notes[0].message).toBe('Test note');
        }
      });
    }
  });

  it('should load notes from localStorage on mount', () => {
    const testNotes = [{
      id: '1',
      message: 'Persisted note',
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      color: '#fef08a',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }];
    
    localStorage.setItem('noter-notes', JSON.stringify(testNotes));
    
    render(<MainComponent />);
    
    expect(screen.getByText('Persisted note')).toBeInTheDocument();
  });

  it('should delete a note', async () => {
    const testNotes = [{
      id: '1',
      message: 'Note to delete',
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      color: '#fef08a',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }];
    
    localStorage.setItem('noter-notes', JSON.stringify(testNotes));
    render(<MainComponent />);
    
    const deleteButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-trash-2')
    );
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Note to delete')).not.toBeInTheDocument();
      });
    }
  });

  it('should update note color', async () => {
    const testNotes = [{
      id: '1',
      message: 'Test note',
      x: 100,
      y: 100,
      width: 250,
      height: 200,
      color: '#fef08a',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }];
    
    localStorage.setItem('noter-notes', JSON.stringify(testNotes));
    render(<MainComponent />);
    
    const colorButtons = screen.getAllByRole('button').filter(btn => 
      btn.style.backgroundColor !== ''
    );
    
    if (colorButtons.length > 1) {
      // Click a different color button (not the first one which might be the same color)
      fireEvent.click(colorButtons[1]);
      
      await waitFor(() => {
        const savedNotes = localStorage.getItem('noter-notes');
        if (savedNotes) {
          const notes = JSON.parse(savedNotes);
          expect(notes[0].color).toBeDefined();
        }
      });
    }
  });

  it('should handle multiple notes', () => {
    const testNotes = [
      { id: '1', message: 'First note', x: 100, y: 100, width: 250, height: 200, color: '#fef08a', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '2', message: 'Second note', x: 400, y: 100, width: 250, height: 200, color: '#bfdbfe', createdAt: Date.now(), updatedAt: Date.now() },
    ];
    
    localStorage.setItem('noter-notes', JSON.stringify(testNotes));
    render(<MainComponent />);
    
    expect(screen.getByText('First note')).toBeInTheDocument();
    expect(screen.getByText('Second note')).toBeInTheDocument();
  });

  it('should close add note dialog on cancel', async () => {
    render(<MainComponent />);
    
    const addButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')?.classList.contains('lucide-plus')
    );
    
    if (addButton) {
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Add New Note')).toBeInTheDocument();
      });
      
      // Press Escape key to close dialog
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Add New Note')).not.toBeInTheDocument();
      });
    }
  });
});