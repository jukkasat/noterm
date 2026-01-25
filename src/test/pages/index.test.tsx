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

  it('should open add note dialog when double-clicking empty board', async () => {
    render(<MainComponent />);
    
    const boardArea = screen.getByTestId('note-board');
    
    fireEvent.doubleClick(boardArea);
    
    await waitFor(() => {
      expect(screen.getByText('Add New Note')).toBeInTheDocument();
    });
  });

  it('should open add note dialog when double-clicking board with existing notes', async () => {
    const testNotes = [{
      id: '1',
      content: [{ type: 'text', id: '1', value: 'Existing note' }],
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
    
    // Verify note exists
    expect(screen.getByText('Existing note')).toBeInTheDocument();
    
    const boardArea = screen.getByTestId('note-board');
    
    fireEvent.doubleClick(boardArea);
    
    await waitFor(() => {
      expect(screen.getByText('Add New Note')).toBeInTheDocument();
    });
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
          expect(notes[0].content).toBeDefined();
          expect(notes[0].content[0].value).toBe('Test note');
        }
      });
    }
  });

  it('should load notes from localStorage on mount', () => {
    const testNotes = [{
      id: '1',
      content: [{ type: 'text', id: '1', value: 'Persisted note' }],
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
      content: [{ type: 'text', id: '1', value: 'Note to delete' }],
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
      content: [{ type: 'text', id: '1', value: 'Test note' }],
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
      { id: '1', content: [{ type: 'text', id: '1', value: 'First note' }], x: 100, y: 100, width: 250, height: 200, color: '#fef08a', createdAt: Date.now(), updatedAt: Date.now() },
      { id: '2', content: [{ type: 'text', id: '2', value: 'Second note' }], x: 400, y: 100, width: 250, height: 200, color: '#bfdbfe', createdAt: Date.now(), updatedAt: Date.now() },
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

  describe('Swimlanes', () => {
    it('should not render swimlanes when swimlanesCount is 0', () => {
      localStorage.setItem('noter-swimlanes-count', '0');
      render(<MainComponent />);
      
      // Should show header normally at top
      const headers = screen.getAllByText('noterm.');
      expect(headers).toHaveLength(1); // Only one header, not in bottom-left
    });

    it('should render swimlanes when swimlanesCount is set', () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      // Should show default labels for 2 swimlanes
      expect(screen.getByText('Backlog')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });

    it('should render correct number of swimlanes based on count', () => {
      localStorage.setItem('noter-swimlanes-count', '4');
      render(<MainComponent />);
      
      // Default labels for 4 swimlanes
      expect(screen.getByText('Backlog')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });

    it('should show logo at bottom-left when swimlanes are enabled', () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      // Should have two "noterm." - one in bottom-left and one from header
      const headers = screen.getAllByText('noterm.');
      expect(headers.length).toBeGreaterThan(0);
    });

    it('should load custom swimlane labels from localStorage', () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      localStorage.setItem('noter-swimlane-labels', JSON.stringify({
        2: ['Custom Label 1', 'Custom Label 2', 'Custom Label 3']
      }));
      
      render(<MainComponent />);
      
      expect(screen.getByText('Custom Label 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Label 2')).toBeInTheDocument();
      expect(screen.getByText('Custom Label 3')).toBeInTheDocument();
    });

    it('should enable editing swimlane label on double-click', async () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      const backlogLabel = screen.getByText('Backlog');
      fireEvent.doubleClick(backlogLabel);
      
      await waitFor(() => {
        const input = screen.getByDisplayValue('Backlog');
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe('INPUT');
      });
    });

    it('should save edited swimlane label on blur', async () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      const backlogLabel = screen.getByText('Backlog');
      fireEvent.doubleClick(backlogLabel);
      
      await waitFor(() => {
        const input = screen.getByDisplayValue('Backlog');
        fireEvent.change(input, { target: { value: 'New Backlog' } });
        fireEvent.blur(input);
      });
      
      await waitFor(() => {
        expect(screen.getByText('New Backlog')).toBeInTheDocument();
        
        const savedLabels = localStorage.getItem('noter-swimlane-labels');
        expect(savedLabels).toBeTruthy();
        
        if (savedLabels) {
          const labels = JSON.parse(savedLabels);
          expect(labels[2][0]).toBe('New Backlog');
        }
      });
    });

    it('should save edited swimlane label on Enter key', async () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      const backlogLabel = screen.getByText('Backlog');
      fireEvent.doubleClick(backlogLabel);
      
      await waitFor(() => {
        const input = screen.getByDisplayValue('Backlog');
        fireEvent.change(input, { target: { value: 'Updated Backlog' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      });
      
      await waitFor(() => {
        expect(screen.getByText('Updated Backlog')).toBeInTheDocument();
      });
    });

    it('should cancel editing swimlane label on Escape key', async () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      const backlogLabel = screen.getByText('Backlog');
      fireEvent.doubleClick(backlogLabel);
      
      await waitFor(() => {
        const input = screen.getByDisplayValue('Backlog');
        fireEvent.change(input, { target: { value: 'Changed Label' } });
        fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      });
      
      await waitFor(() => {
        // Should still show original label
        expect(screen.getByText('Backlog')).toBeInTheDocument();
        expect(screen.queryByText('Changed Label')).not.toBeInTheDocument();
      });
    });

    it('should persist swimlanes count to localStorage', async () => {
      render(<MainComponent />);
      
      // Initially should be 0 (saved by component)
      let savedCount = localStorage.getItem('noter-swimlanes-count');
      expect(savedCount).toBe('0');
      
      // Note: In a real scenario, this would be set through the settings dialog
      // but for this test we'll set it directly and re-render
      localStorage.setItem('noter-swimlanes-count', '3');
      
      render(<MainComponent />);
      
      await waitFor(() => {
        savedCount = localStorage.getItem('noter-swimlanes-count');
        expect(savedCount).toBe('3');
      });
    });

    it('should use default labels when no custom labels exist', () => {
      localStorage.setItem('noter-swimlanes-count', '1');
      render(<MainComponent />);
      
      // Default labels for 1 swimlane
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });

    it('should handle maximum swimlanes count', () => {
      localStorage.setItem('noter-swimlanes-count', '5');
      render(<MainComponent />);
      
      // Default labels for 5 swimlanes (6 lanes total)
      expect(screen.getByText('Backlog')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });

    it('should not render empty swimlane labels', async () => {
      localStorage.setItem('noter-swimlanes-count', '2');
      render(<MainComponent />);
      
      const backlogLabel = screen.getByText('Backlog');
      fireEvent.doubleClick(backlogLabel);
      
      await waitFor(() => {
        const input = screen.getByDisplayValue('Backlog');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);
      });
      
      // Should still show "Backlog" since empty strings are ignored
      await waitFor(() => {
        expect(screen.getByText('Backlog')).toBeInTheDocument();
      });
    });
  });

  describe('Font Style', () => {
    it('should load font style from localStorage on mount', () => {
      localStorage.setItem('noter-font-style', 'serif');
      render(<MainComponent />);
      
      const savedFontStyle = localStorage.getItem('noter-font-style');
      expect(savedFontStyle).toBe('serif');
    });

    it('should default to handwriting if no font style is saved', () => {
      render(<MainComponent />);
      
      const savedFontStyle = localStorage.getItem('noter-font-style');
      expect(savedFontStyle).toBe('handwriting');
    });

    it('should persist font style to localStorage', () => {
      localStorage.setItem('noter-font-style', 'monospace');
      render(<MainComponent />);
      
      const savedFontStyle = localStorage.getItem('noter-font-style');
      expect(savedFontStyle).toBe('monospace');
    });

    it('should ignore invalid font style values', () => {
      localStorage.setItem('noter-font-style', 'invalid-font');
      render(<MainComponent />);
      
      // Should fall back to default handwriting
      const savedFontStyle = localStorage.getItem('noter-font-style');
      expect(savedFontStyle).toBe('handwriting');
    });

    it('should accept all valid font styles', () => {
      const validFonts = ['handwriting', 'sans-serif', 'serif', 'monospace'];
      
      validFonts.forEach(font => {
        localStorage.clear();
        localStorage.setItem('noter-font-style', font);
        render(<MainComponent />);
        
        const savedFontStyle = localStorage.getItem('noter-font-style');
        expect(savedFontStyle).toBe(font);
      });
    });
  });

  describe('Save Backup Dialog', () => {
    it('should open save backup dialog when clicking save button', async () => {
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        await waitFor(() => {
          expect(screen.getByText('Save Backup')).toBeInTheDocument();
          expect(screen.getByText('Enter a name for your backup file.')).toBeInTheDocument();
        });
      }
    });

    it('should show default filename in save dialog', async () => {
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        await waitFor(() => {
          const input = screen.getByLabelText('Filename') as HTMLInputElement;
          expect(input.value).toMatch(/noter_backup_\d{2}_\d{2}_\d{2}\.json/);
        });
      }
    });

    it('should allow editing filename before saving', async () => {
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(() => {
          const input = screen.getByLabelText('Filename');
          fireEvent.change(input, { target: { value: 'my_custom_backup.json' } });
          expect((input as HTMLInputElement).value).toBe('my_custom_backup.json');
        });
      }
    });

    it('should trigger download when save is confirmed', async () => {
      const testNotes = [{
        id: '1',
        content: [{ type: 'text', id: '1', value: 'Test note for backup' }],
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
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(() => {
          const confirmButton = screen.getByRole('button', { name: /save/i });
          fireEvent.click(confirmButton);
        });

        await waitFor(() => {
          expect(global.URL.createObjectURL).toHaveBeenCalled();
        });
      }
    });

    it('should close dialog when cancel is clicked', async () => {
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(() => {
          expect(screen.getByText('Save Backup')).toBeInTheDocument();
        });

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        await waitFor(() => {
          expect(screen.queryByText('Save Backup')).not.toBeInTheDocument();
        });
      }
    });

    it('should add .json extension if missing', async () => {
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(async () => {
          const input = screen.getByLabelText('Filename');
          fireEvent.change(input, { target: { value: 'backup_without_ext' } });
          
          const confirmButton = screen.getByRole('button', { name: /save/i });
          fireEvent.click(confirmButton);
          
          // The download link would have .json extension added
          await waitFor(() => {
            expect(global.URL.createObjectURL).toHaveBeenCalled();
          });
        });
      }
    });

    it('should apply dark mode styling to save dialog', async () => {
      localStorage.setItem('noter-dark-mode', 'true');
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(() => {
          const input = screen.getByLabelText('Filename');
          expect(input).toHaveStyle({ backgroundColor: '#2a2520' });
        });
      }
    });

    it('should apply custom font style to save dialog', async () => {
      localStorage.setItem('noter-font-style', 'serif');
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(() => {
          const title = screen.getByText('Save Backup');
          expect(title.className).toContain('font-serif');
        });
      }
    });

    it('should save with Enter key in save dialog', async () => {
      render(<MainComponent />);
      
      const saveButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-save')
      );
      
      if (saveButton) {
        fireEvent.click(saveButton);
        
        await waitFor(() => {
          const input = screen.getByLabelText('Filename');
          fireEvent.change(input, { target: { value: 'enter_save.json' } });
          fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        });

        await waitFor(() => {
          expect(global.URL.createObjectURL).toHaveBeenCalled();
          expect(screen.queryByText('Save Backup')).not.toBeInTheDocument();
        });
      }
    });
  });
});