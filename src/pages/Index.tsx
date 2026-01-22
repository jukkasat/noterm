import { useState, useEffect, useRef } from 'react';
import { useSeoMeta } from '@unhead/react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Upload, Settings } from 'lucide-react';
import { NoteCard } from '@/components/NoteCard';
import { AddNoteDialog } from '@/components/AddNoteDialog';
import { NOTE_COLORS } from '@/components/noteColors';
import { SettingsDialog } from '@/components/SettingsDialog';
import { SupportDialog } from '@/components/SupportDialog';
import { generateId, getThemeColors } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import type { Note, TextSize, SwimlanesCount } from '@/types/note';

const DEFAULT_SWIMLANE_LABELS: Record<number, string[]> = {
  1: ['In Progress', 'Ready'],
  2: ['Backlog', 'In Progress', 'Ready'],
  3: ['Backlog', 'To Do', 'In Progress', 'Ready'],
  4: ['Backlog', 'To Do', 'In Progress', 'Review', 'Ready'],
  5: ['Backlog', 'To Do', 'In Progress', 'Review', 'Testing', 'Ready'],
};

const MainComponent = () => {
  useSeoMeta({
    title: 'noter m. - Your Digital Note Board',
    description: 'A beautiful digital note board for organizing your thoughts and things to remember',
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>(3);
  const [swimlanesCount, setSwimlanesCount] = useState<SwimlanesCount>(0);
  const [swimlaneLabels, setSwimlaneLabels] = useState<Record<number, string[]>>({});
  const [editingLaneIndex, setEditingLaneIndex] = useState<number | null>(null);
  const [editingLaneValue, setEditingLaneValue] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const laneInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    const savedSwimlanesCount = localStorage.getItem('noter-swimlanes-count');
    if (savedSwimlanesCount) {
      const count = parseInt(savedSwimlanesCount, 10);
      if (count >= 0 && count <= 5) {
        setSwimlanesCount(count as SwimlanesCount);
      }
    }

    const savedSwimlaneLabels = localStorage.getItem('noter-swimlane-labels');
    if (savedSwimlaneLabels) {
      try {
        setSwimlaneLabels(JSON.parse(savedSwimlaneLabels));
      } catch (err) {
        console.error('Failed to load swimlane labels:', err);
      }
    }

  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Save swimlanes count preference to localStorage
  useEffect(() => {
    localStorage.setItem('noter-swimlanes-count', swimlanesCount.toString());
  }, [swimlanesCount]);

  // Save swimlane labels to localStorage
  useEffect(() => {
    localStorage.setItem('noter-swimlane-labels', JSON.stringify(swimlaneLabels));
  }, [swimlaneLabels]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingLaneIndex !== null && laneInputRef.current) {
      laneInputRef.current.focus();
      laneInputRef.current.select();
    }
  }, [editingLaneIndex]);

  // Get current labels for swimlane count
  const getCurrentLabels = (count: SwimlanesCount): string[] => {
    if (count === 0) return [];
    return swimlaneLabels[count] || DEFAULT_SWIMLANE_LABELS[count] || [];
  };

  const handleLaneDoubleClick = (index: number) => {
    const currentLabels = getCurrentLabels(swimlanesCount);
    setEditingLaneIndex(index);
    setEditingLaneValue(currentLabels[index] || '');
  };

  const handleLaneLabelSave = () => {
    if (editingLaneIndex !== null && editingLaneValue.trim()) {
      const currentLabels = getCurrentLabels(swimlanesCount);
      const newLabels = [...currentLabels];
      newLabels[editingLaneIndex] = editingLaneValue.trim();
      
      setSwimlaneLabels({
        ...swimlaneLabels,
        [swimlanesCount]: newLabels,
      });
    }
    setEditingLaneIndex(null);
    setEditingLaneValue('');
  };

  const handleLaneLabelCancel = () => {
    setEditingLaneIndex(null);
    setEditingLaneValue('');
  };

  const handleLaneInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLaneLabelSave();
    } else if (e.key === 'Escape') {
      handleLaneLabelCancel();
    }
  };

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
      description: `Your Notes are saved as ${filename}`,
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

  const colors = getThemeColors(darkMode);
  const { background: backgroundColor, board: boardColor, text: textColor, subtle: subtleTextColor } = colors;

  return (
    <div className={`min-h-screen overflow-auto p-12 note-container ${isMobile ? 'mobile' : ''}`} style={{ backgroundColor }}>
      <div className={`relative min-h-[calc(100vh-6rem)] ${isMobile ? 'min-w-[1000px]' : 'min-w-[1400px]'} rounded-lg`} style={{ backgroundColor: boardColor }}>
        {/* Wooden border frame */}
        <div
          key={`border-${isMobile}`}
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            borderWidth: isMobile ? '16px' : '24px',
            borderStyle: 'solid',
            borderColor: 'transparent',
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

        {/* Header - Only show at top when swimlanes are disabled */}
        {swimlanesCount === 0 && (
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
        )}

        {/* Spacer when swimlanes are enabled to maintain layout */}
        {swimlanesCount > 0 && (
          <div className="relative z-0 p-8">
            <div className="py-2 pl-4" style={{ visibility: 'hidden' }}>
              <h1 className="text-6xl pl-1">
                noterm.
              </h1>
              <p className="text-sm">
                Your Digital Note Board
              </p>
            </div>
          </div>
        )}

        {/* Logo at bottom left when swimlanes are enabled */}
        {swimlanesCount > 0 && (
          <div className="absolute bottom-8 left-12 z-0 pointer-events-none pb-4">
            <h1 className="text-6xl pl-1" style={{ color: textColor, fontFamily: 'Sacramento, cursive' }}>
              noterm.
            </h1>
            <p className="text-sm" style={{ color: subtleTextColor }}>
              Your Digital Note Board
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Note board area */}
        <div 
          data-testid="note-board"
          className="relative" 
          style={{ minHeight: 'calc(100vh - 12rem)' }}
          onDoubleClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddDialogOpen(true);
            }
          }}
        >
          {/* Swimlanes */}
          {swimlanesCount > 0 && (
            <>
              {getCurrentLabels(swimlanesCount).map((label, index) => {
                const totalLanes = getCurrentLabels(swimlanesCount).length;
                const laneWidth = 100 / totalLanes;
                const leftPosition = (index * laneWidth);
                
                return (
                  <div
                    key={`swimlane-${index}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${leftPosition}%`,
                      top: '-120px',
                      bottom: '0',
                      borderLeft: index === 0 ? 'none' : `2px dashed ${darkMode ? '#6b5638' : '#8b6f47'}`,
                      width: `${laneWidth}%`,
                    }}
                  >
                    <div 
                      className="sticky top-4 px-4 py-2 text-center"
                      style={{ 
                        color: subtleTextColor,
                        fontSize: '0.875rem',
                        opacity: 0.7,
                      }}
                    >
                      {editingLaneIndex === index ? (
                        <input
                          ref={laneInputRef}
                          type="text"
                          value={editingLaneValue}
                          onChange={(e) => setEditingLaneValue(e.target.value)}
                          onBlur={handleLaneLabelSave}
                          onKeyDown={handleLaneInputKeyDown}
                          className="pointer-events-auto bg-transparent border-b border-gray-400 outline-none text-center font-semibold w-full"
                          style={{ 
                            color: textColor,
                            fontSize: '0.875rem',
                          }}
                          maxLength={20}
                        />
                      ) : (
                        <span
                          className="pointer-events-auto cursor-pointer font-semibold hover:opacity-100 transition-opacity"
                          onDoubleClick={() => handleLaneDoubleClick(index)}
                          title="Double-click to rename"
                        >
                          {label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center" style={{ color: subtleTextColor }}>
                <p className="text-xl mb-2">No notes yet!</p>
                <p className="text-sm opacity-75">Add your first note by clicking the + button or double-clicking the board.</p>
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

        {/* Support Development link at bottom center */}
        <div className="flex justify-center pb-10">
          <button
            onClick={() => setIsSupportDialogOpen(true)}
            className="text-sm hover:underline transition-all"
            style={{ color: subtleTextColor }}
          >
            ☕ Support noter m.
          </button>
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
          swimlanesCount={swimlanesCount}
          onSwimlanesCountChange={setSwimlanesCount}
        />
        <SupportDialog
          open={isSupportDialogOpen}
          onOpenChange={setIsSupportDialogOpen}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default MainComponent;
