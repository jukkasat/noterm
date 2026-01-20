import { useEffect } from 'react';
import type { Note, TextSize } from '@/types/note';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogFooter } from './ui/dialog';
import { GripHorizontal } from 'lucide-react';
import { useNoteCard } from '@/hooks/useNoteCard';
import { useNoteDragResize } from '@/hooks/useNoteDragResize';
import { NoteEditMode } from '@/components/notecard/NoteEditMode';
import { NoteReadMode } from '@/components/notecard/NoteReadMode';
import { getTextSizeClasses } from '@/lib/utils';
import { NOTE_COLORS } from '@/components/noteColors';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  textSize?: TextSize;
  editingNoteId: string | null;
  onEditingChange: (id: string | null) => void;
}

export function NoteCard({ note, onUpdate, onDelete, onDragStart, textSize = 3, editingNoteId, onEditingChange }: NoteCardProps) {
  const { subject, setSubject, content,
    setContent, isDragging, setIsDragging,
    isResizing, setIsResizing, isEditing,
    setIsEditing, isDeleting, setIsDeleting,
    zoomedImage, setZoomedImage, dragOffset,
    resizeStart, setResizeStart, isAddMenuOpen,
    setIsAddMenuOpen, fileInputRef, handleSave,
    handleCancel, handleContentChange, handleRemoveContent,
    handleAddCheckbox, handleAddText, handleAddImage,
    handleImageUpload, handleDragStart, cardRef
  } = useNoteCard({ note, onUpdate, onDragStart });

  const sizeClasses = getTextSizeClasses(textSize);

  // Notify parent when edit state changes
  useEffect(() => {
    if (isEditing) {
      onEditingChange(note.id);
    } else if (editingNoteId === note.id) {
      onEditingChange(null);
    }
  }, [isEditing, note.id, editingNoteId, onEditingChange]);

  // Handle drag and resize
  useNoteDragResize( isDragging, isResizing, dragOffset, resizeStart,
    note, onUpdate, setIsDragging, setIsResizing, cardRef
  );

  // Auto-resize all textareas when content changes or editing mode changes
  useEffect(() => {
    if (isEditing) {
      const textareas = document.querySelectorAll('.text-input');
      textareas.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement;
        element.style.height = 'auto';
        const newHeight = Math.min(element.scrollHeight + 4, 40);
        element.style.minHeight = `${newHeight}px`;
        element.style.height = `${element.scrollHeight + 4}px`;
      });
    }
  }, [content, isEditing]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // If another note is being edited, blink that note and prevent interaction
    if (editingNoteId && editingNoteId !== note.id) {
      // Find the editing note and trigger its blink
      const editingCard = document.querySelector(`[data-note-id="${editingNoteId}"]`);
      if (editingCard) {
        editingCard.classList.add('blink-border');
        setTimeout(() => {
          editingCard.classList.remove('blink-border');
        }, 600); // 2 blinks * 300ms
      }
      return;
    }
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // If another note is being edited, blink that note and prevent interaction
    if (editingNoteId && editingNoteId !== note.id) {
      const editingCard = document.querySelector(`[data-note-id="${editingNoteId}"]`);
      if (editingCard) {
        editingCard.classList.add('blink-border');
        setTimeout(() => {
          editingCard.classList.remove('blink-border');
        }, 600);
      }
      return;
    }
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    }
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, clientX: number, clientY: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: clientX,
      y: clientY,
      width: note.width,
      height: note.height,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    handleResizeStart(e, e.clientX, e.clientY);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleResizeStart(e, touch.clientX, touch.clientY);
    }
  };

  const handleColorChange = () => {
    const currentColorIndex = NOTE_COLORS.indexOf(note.color);
    let newColorIndex;
    
    // Get random index different from current
    do {
      newColorIndex = Math.floor(Math.random() * NOTE_COLORS.length);
    } while (newColorIndex === currentColorIndex && NOTE_COLORS.length > 1);
    
    onUpdate(note.id, { color: NOTE_COLORS[newColorIndex] });
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = () => {
    onDelete(note.id);
    setIsDeleting(false);
  };

  const handleClose = () => {
    setIsDeleting(false);
  };

  const resizeTextArea = (textarea: HTMLTextAreaElement) => {
    const { style } = textarea;
    const maxHeight = 2000; // Max height in pixels
    
    // The 4 corresponds to the 2 2px borders (top and bottom)
    style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight + 8, maxHeight);
    style.minHeight = `${newHeight}px`;
    style.height = `${textarea.scrollHeight + 4}px`;
  };

  return (
    <Card
      ref={cardRef}
      data-note-id={note.id}
      className="absolute shadow-lg hover:shadow-xl transition-shadow duration-200"
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        backgroundColor: note.color,
        cursor: isDragging ? 'grabbing' : isEditing ? 'default' : 'grab',
        userSelect: 'none',
        zIndex: isDragging || isResizing ? 1000 : 1,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="p-4 flex flex-col h-full relative">
        {isEditing ? (
          <NoteEditMode
            subject={subject}
            content={content}
            sizeClasses={sizeClasses}
            onSubjectChange={setSubject}
            onContentChange={handleContentChange}
            onRemoveContent={handleRemoveContent}
            onSave={handleSave}
            onCancel={handleCancel}
            onAddCheckbox={handleAddCheckbox}
            onAddText={handleAddText}
            onAddImage={handleAddImage}
            isAddMenuOpen={isAddMenuOpen}
            setIsAddMenuOpen={setIsAddMenuOpen}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            setContent={setContent}
            resizeTextArea={resizeTextArea}
            onColorChange={handleColorChange}
          />
        ) : (
          <NoteReadMode
            note={note}
            content={content}
            sizeClasses={sizeClasses}
            onEdit={() => {
              // Only allow editing if no other note is being edited
              if (!editingNoteId || editingNoteId === note.id) {
                setIsEditing(true);
              } else {
                // Blink the currently edited note
                const editingCard = document.querySelector(`[data-note-id="${editingNoteId}"]`);
                if (editingCard) {
                  editingCard.classList.add('blink-border');
                  setTimeout(() => {
                    editingCard.classList.remove('blink-border');
                  }, 600);
                }
              }
            }}
            onDelete={handleDelete}
            onImageClick={setZoomedImage}
            formatDate={formatDate}
            setContent={setContent}
            onUpdate={onUpdate}
          />
        )}
        {/* Resize handle - only show in edit mode */}
        {isEditing && (
          <div
            className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-10 flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-30 rounded-tl-lg"
            onMouseDown={handleResizeMouseDown}
            onTouchStart={handleResizeTouchStart}
            style={{ touchAction: 'none' }}
          >
            <GripHorizontal className="h-5 w-5 text-gray-600 rotate-45 pointer-events-none" />
          </div>
        )}

        {isDeleting && (
          <Dialog open onOpenChange={handleClose}>
            <DialogContent className="text-xs whitespace-pre-wrap break-words font-handwriting">
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <DialogFooter className="pt-3 pr-0.5">
                <p className="pr-5 text-red-600">Delete Note?</p>
                <button onClick={handleClose}>No</button>
                <button className="pl-1" onClick={handleConfirmDelete}>Yes</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {zoomedImage && (
          <Dialog open onOpenChange={() => setZoomedImage(null)}>
            <DialogContent 
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] p-4 bg-black/90 border-none z-[9999] flex items-center justify-center"
              onClick={() => setZoomedImage(null)}
            >
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <img 
                src={zoomedImage} 
                alt="Zoomed" 
                className="max-w-full max-h-[85vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
}
