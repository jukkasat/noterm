import { useState, useEffect, useRef } from 'react';
import { useSeoMeta } from '@unhead/react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Upload, Settings } from 'lucide-react';
import { NoteCard } from '@/components/NoteCard';
import { AddNoteDialog } from '@/components/AddNoteDialog';
import { NOTE_COLORS } from '@/components/noteColors';
import { SettingsDialog } from '@/components/SettingsDialog';
import { generateId } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import type { Note, TextSize } from '@/types/note';

const MainComponent = () => {
  useSeoMeta({
    title: 'noter m. - Your Digital Note Board',
    description: 'A beautiful digital note board for organizing your thoughts and things to remember',
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>(3);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = window.innerWidth <= 768;

  // Load notes and settings from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('noter-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.error('Failed to load notes:', err);
      }
    }

    const savedDarkMode = localStorage.getItem('noter-dark-mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }

    const savedTextSize = localStorage.getItem('noter-text-size');
    if (savedTextSize) {
      const size = parseInt(savedTextSize, 10);
      if (size >= 1 && size <= 5) {
        setTextSize(size as TextSize);
      }
    }

  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('noter-notes', JSON.stringify(notes));
  }, [notes]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('noter-dark-mode', darkMode.toString());
  }, [darkMode]);

  // Save text size preference to localStorage
  useEffect(() => {
    localStorage.setItem('noter-text-size', textSize.toString());
  }, [textSize]);

  const handleAddNote = (message: string, subject?: string) => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      subject,
      content: message ? [{ type: 'text', id: generateId(), value: message }] : [],
      x: 100 + Math.random() * 200, // Top-left area: 100-300px from left
      y: 150 + Math.random() * 150, // Top area: 150-300px from top
      width: 250,
      height: 200,
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      createdAt: now,
      updatedAt: now,
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => note.id === id ? { ...note, ...updates } : note));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleDragStart = (id: string) => {
    // Don't allow dragging if a different note is being edited
    if (editingNoteId && editingNoteId !== id) {
      return;
    }
    // Bring note to front by reordering
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex > -1) {
      const note = notes[noteIndex];
      const reordered = [...notes.filter(n => n.id !== id), note];
      setNotes(reordered);
    }
  };

  const handleSaveToFile = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // month
    const yy = String(now.getFullYear()).substring(2);
    const filename = `noter_backup_${dd}_${mm}_${yy}.json`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Notes saved!',
      description: `Your Notes are saved as: ${filename}`,
    });
  };

  const handleLoadFromFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const notesData = event.target?.result as string;
          const loadedNotes = JSON.parse(notesData);
          if (Array.isArray(loadedNotes)) {
            setNotes(loadedNotes);
            toast({
              title: 'Notes loaded!',
              description: `Successfully loaded ${loadedNotes.length} note(s).`,
            });
          } else {
            throw new Error('Invalid notes format');
          }
        } catch (_err) {
          toast({
            title: 'Failed to load notes',
            description: 'The JSON file could not be parsed.',
            variant: 'destructive',
          });
          console.log("Failed to load notes, error: " + _err)
        }
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const backgroundColor = darkMode ? '#2a2520' : '#d4c4a8';
  const boardColor = darkMode ? '#3a3530' : '#f5f0e8';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const subtleTextColor = darkMode ? '#c0b5a5' : '#6b5638';

  return (
    <div className={`min-h-screen overflow-auto p-12 note-container ${isMobile ? 'mobile' : ''}`} style={{ backgroundColor }}>
      <div className={`relative min-h-[calc(100vh-6rem)] ${isMobile ? 'min-w-[1000px]' : 'min-w-[1400px]'} rounded-lg`} style={{ backgroundColor: boardColor }}>
        {/* Wooden border frame */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            border: '24px solid transparent',
            borderImage: 'linear-gradient(135deg, #8b6f47 0%, #6b5638 25%, #5a4a2f 50%, #6b5638 75%, #8b6f47 100%) 1',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.5), 0 6px 24px rgba(0,0,0,0.4), 0 3px 12px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(107, 86, 56, 0.1) 2px, rgba(107, 86, 56, 0.1) 4px)',
            }}
          />
        </div>

        {/* Header */}
        <div className="relative z-0 flex items-center justify-between p-8">
          <div className="py-2 pl-4">
            <h1 className="text-6xl pl-1" style={{ color: textColor, fontFamily: 'Sacramento, cursive' }}>
              noterm.
            </h1>
            <p className="text-sm" style={{ color: subtleTextColor}}>
              Your Digital Note Board
            </p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Note board area */}
        <div className="relative" style={{ minHeight: 'calc(100vh - 12rem)' }}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              onDragStart={handleDragStart}
              textSize={textSize}
              editingNoteId={editingNoteId}
              onEditingChange={setEditingNoteId}
            />
          ))}

          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center" style={{ color: subtleTextColor }}>
                <p className="text-xl mb-2">No notes yet!</p>
                <p className="text-sm opacity-75">Click the + button to add your first note</p>
              </div>
            </div>
          )}
        </div>

        {/* Top right buttons */}
        <div className="fixed top-8 right-8 flex gap-2 z-50">
          <Button
            onClick={handleSaveToFile}
            variant="outline"
            className="h-10 w-10 p-0"
            style={{ borderColor: '#8b6f47', color: '#5a4a2f', backgroundColor: '#f5f0e8' }}
          >
            <Save className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleLoadFromFile}
            variant="outline"
            className="h-10 w-10 p-0"
            style={{ borderColor: '#8b6f47', color: '#5a4a2f', backgroundColor: '#f5f0e8' }}
          >
            <Upload className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setIsSettingsDialogOpen(true)}
            className="h-10 w-10 p-0 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: '#8b6f47' }}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Add note button */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="fixed bottom-8 right-8 h-12 w-12 p-0 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: '#81511bff', zIndex: 2000 }}
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Dialogs */}
        <AddNoteDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddNote}
          darkMode={darkMode}
        />
        <SettingsDialog
          open={isSettingsDialogOpen}
          onOpenChange={setIsSettingsDialogOpen}
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
          textSize={textSize}
          onTextSizeChange={setTextSize}
        />
      </div>
    </div>
  );
};

export default MainComponent;
