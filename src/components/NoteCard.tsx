import { useState, useRef, useEffect } from 'react';
import type { Note } from '@/types/note';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, GripHorizontal } from 'lucide-react';
import { clamp } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
}

export function NoteCard({ note, onUpdate, onDelete, onDragStart }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(note.subject || '');
  const [message, setMessage] = useState(note.message);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    if (isEditing || isResizing) return;

    // compute board (parent) rect so note coordinates are relative to board
    const parent = cardRef.current?.offsetParent as HTMLElement | null;
    const boardRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };

    setIsDragging(true);
    // store pointer offset relative to board-local note position
    setDragOffset({
      x: clientX - boardRect.left - note.x,
      y: clientY - boardRect.top - note.y,
    });
    onDragStart(note.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
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

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        // compute board rect and convert client coords to board-local coords
        const parent = cardRef.current?.offsetParent as HTMLElement | null;
        const boardRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        const localX = clientX - boardRect.left;
        const localY = clientY - boardRect.top;
        let newX = localX - dragOffset.x;
        let newY = localY - dragOffset.y;

        // Allow half of the note to be outside the board
        const minX = -note.width / 2;
        const maxX = (boardRect.width ?? window.innerWidth) - note.width / 2;
        const minY = -note.height;
        const maxY = (boardRect.height ?? window.innerHeight) - note.height / 2;

        newX = clamp(newX, minX, maxX);
        newY = clamp(newY, minY, maxY);
        onUpdate(note.id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = clientX - resizeStart.x;
        const deltaY = clientY - resizeStart.y;
        const newWidth = Math.max(125, resizeStart.width + deltaX);
        const newHeight = Math.max(150, resizeStart.height + deltaY);
        onUpdate(note.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, note.id, onUpdate, note.width, note.height]);

  const handleSave = () => {
    onUpdate(note.id, { subject, message, updatedAt: Date.now() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSubject(note.subject || '');
    setMessage(note.message);
    setIsEditing(false);
  };

  return (
    <Card
      ref={cardRef}
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
          <>
            <div className="flex-1 overflow-hidden flex flex-col gap-2">
              <input
                type="text"
                className="bg-transparent border-b border-gray-400 outline-none text-sm font-handwriting font-semibold"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (optional)..."
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
              <textarea
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm font-handwriting overflow-auto"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Note content..."
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex gap-1 mt-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              {note.subject && (
                <p className="text-sm font-handwriting font-semibold mb-2 border-b border-gray-400 pb-1">
                  {note.subject}
                </p>
              )}
              <p className="text-sm whitespace-pre-wrap break-words font-handwriting">
                {note.message}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600 font-handwriting flex-1 text-center">
                  {formatDate(note.updatedAt)}
                </p>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </>
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
      </div>
    </Card>
  );
}
