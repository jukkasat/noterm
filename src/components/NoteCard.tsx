import { useState, useRef, useEffect } from 'react';
import type { ContentItem, Note, TextSize } from '@/types/note';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogFooter } from './ui/dialog';
import { Pencil, Trash2, GripHorizontal, Plus, CheckSquare, Image as ImageIcon, Type } from 'lucide-react';
import { clamp, generateId } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  textSize?: TextSize;
}

export function NoteCard({ note, onUpdate, onDelete, onDragStart, textSize = 'normal' }: NoteCardProps) {
  const [subject, setSubject] = useState(note.subject || '');
  const [content, setContent] = useState<ContentItem[]>(note.content || []);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        // compute board rect and convert client coords to board-local coords
        const parent = cardRef.current?.offsetParent as HTMLElement | null;
        const boardRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

        const scrollOffset = {
          left: parent?.scrollLeft || 0,
          top: parent?.scrollTop || 0,
        };

        // Convert clientX and clientY to board-relative coordinates
        const boardX = clientX - boardRect.left + scrollOffset.left;
        const boardY = clientY - boardRect.top + scrollOffset.top;

        let newX = boardX - dragOffset.x;
        let newY = boardY - dragOffset.y;

        // Allow half of the note to be outside the board
        const minX = -note.width / 2;
        const maxX = boardRect.width - note.width / 2;
        const minY = -note.height;
        const maxY = boardRect.height - note.height / 2;

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

  const handleSave = () => {
    // Check if there are any empty text fields
    const hasEmptyTextField = content.some(
      item => item.type === 'text' && (!item.value || item.value.trim() === '')
    );
    
    // Don't save if there are empty text fields
    if (hasEmptyTextField) {
      return;
    }
    
    onUpdate(note.id, { subject, content, updatedAt: Date.now() });
    setIsEditing(false);
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

  const handleCancel = () => {
    setSubject(note.subject || '');
    setContent(note.content || []);
    setIsEditing(false);
  };

  const handleAddCheckbox = () => {
    const newItem: ContentItem = {
      type: 'checkbox',
      id: generateId(),
      text: '',
      checked: false,
    };

    setContent([...content, newItem]);
    setIsAddMenuOpen(false);

    // Focus the new checkbox input after a short delay
    setTimeout(() => {
      const checkboxInputs = document.querySelectorAll('.checkbox-input');
      if (checkboxInputs.length > 0) {
        (checkboxInputs[checkboxInputs.length - 1] as HTMLInputElement).focus();
      }
    }, 50);
  };

  const handleAddText = () => {
    const newItem: ContentItem = {
      type: 'text',
      id: generateId(),
      value: '',
    };

    setContent([...content, newItem]);
    setIsAddMenuOpen(false);

    // Focus the new text input after a short delay
    setTimeout(() => {
      const textInputs = document.querySelectorAll('.text-input');
      if (textInputs.length > 0) {
        const lastInput = textInputs[textInputs.length - 1] as HTMLTextAreaElement;
        lastInput.focus();
        resizeTextArea(lastInput);
      }
    }, 50);
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
    setIsAddMenuOpen(false);
  };

  const handleContentChange = (id: string, updates: Partial<ContentItem>) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, ...updates } as ContentItem : item
    ));
  };

  const handleRemoveContent = (id: string) => {
    setContent(content.filter(item => item.id !== id));
  };

  const handleContentKeyDown = (e: React.KeyboardEvent, id: string, index: number) => {
    if (e.key === 'Enter' && content[index].type === 'checkbox') {
      e.preventDefault();
      
      const newItem: ContentItem = {
        type: 'checkbox',
        id: generateId(),
        text: '',
        checked: false,
      };

      const updatedContent = [
        ...content.slice(0, index + 1),
        newItem,
        ...content.slice(index + 1)
      ];
      
      setContent(updatedContent);

      setTimeout(() => {
        const checkboxInputs = document.querySelectorAll('.checkbox-input');
        const checkboxIndex = content.slice(0, index + 1).filter(item => item.type === 'checkbox').length;
        if (checkboxInputs[checkboxIndex]) {
          (checkboxInputs[checkboxIndex] as HTMLInputElement).focus();
        }
      }, 50);
    }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: ContentItem = {
          type: 'image',
          id: generateId(),
          url: event.target?.result as string,
        };
        setContent([...content, newItem]);
      };
      reader.readAsDataURL(file);
    }
  };

  const getTextSizeClasses = () => {
    switch (textSize) {
      case 'small':
        return {
          subject: 'text-xs',
          message: 'text-xs',
          date: 'text-[10px]',
        };
      case 'large':
        return {
          subject: 'text-base',
          message: 'text-base',
          date: 'text-sm',
        };
      default:
        return {
          subject: 'text-sm',
          message: 'text-sm',
          date: 'text-xs',
        };
    }
  };

  const sizeClasses = getTextSizeClasses();

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
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 pb-2"
              onClick={(e) => {
                // Only add text if clicking on the container itself, not child elements
                // and only if the last item is not already a text field
                if (e.target === e.currentTarget) {
                  const lastItem = content[content.length - 1];
                  if (lastItem && lastItem.type === 'text') return;
                  
                  const newItem: ContentItem = {
                    type: 'text',
                    id: generateId(),
                    value: '',
                  };
                  setContent([...content, newItem]);
                  
                  // Focus the new text input after a short delay
                  setTimeout(() => {
                    const textInputs = document.querySelectorAll('.text-input');
                    if (textInputs.length > 0) {
                      const lastInput = textInputs[textInputs.length - 1] as HTMLTextAreaElement;
                      lastInput.focus();
                      resizeTextArea(lastInput);
                    }
                  }, 50);
                }
              }}
            >
              <input
                type="text"
                className={`bg-transparent border-b border-gray-400 outline-none ${sizeClasses.subject} font-handwriting font-semibold`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (optional)..."
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
              
              {/* Render content items in order */}
              {content.map((item, index) => (
                <div key={item.id} className="relative">
                  {item.type === 'text' && (
                    <div className="relative">
                      <textarea
                        className={`text-input w-full bg-transparent rounded outline-none resize-none overflow-hidden ${sizeClasses.message} font-handwriting min-h-[60px] p-2 text-gray-900 dark:text-gray-100`}
                        style={{ maxHeight: '2000px' }}
                        value={item.value}
                        onInput={(e) => {
                          resizeTextArea(e.currentTarget);
                          handleContentChange(item.id, { value: e.currentTarget.value });
                        }}
                        placeholder="Type text..."
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        rows={1}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-0 right-0 h-5 w-5 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContent(item.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {item.type === 'checkbox' && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={(checked) => handleContentChange(item.id, { checked: checked as boolean })}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="text"
                        className={`checkbox-input flex-1 bg-transparent border-b border-gray-300 outline-none ${sizeClasses.message} font-handwriting text-gray-900 dark:text-gray-100`}
                        value={item.text}
                        onChange={(e) => handleContentChange(item.id, { text: e.target.value })}
                        onKeyDown={(e) => handleContentKeyDown(e, item.id, index)}
                        placeholder="New item..."
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 ml-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContent(item.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {item.type === 'image' && (
                    <div className="relative">
                      <img 
                        src={item.url} 
                        alt="Note attachment" 
                        className="max-w-[100px] object-contain rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-0 right-0 h-5 w-5 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContent(item.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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
              <Popover open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-48 p-2" 
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start h-8 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddCheckbox();
                      }}
                    >
                      <CheckSquare className="h-3 w-3 mr-2" />
                      Checkbox
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start h-8 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddText();
                      }}
                    >
                      <Type className="h-3 w-3 mr-2" />
                      Text
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="justify-start h-8 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddImage();
                      }}
                    >
                      <ImageIcon className="h-3 w-3 mr-2" />
                      Image
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className="flex-1 overflow-auto"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}>
              {note.subject && (
                <p className={`${sizeClasses.subject} font-handwriting font-semibold mb-2 border-b border-gray-400 pb-1`}>
                  {note.subject}
                </p>
              )}
              
              {/* Render content items in order */}
              <div className="space-y-2">
                {content.map((item) => (
                  <div key={item.id}>
                    {item.type === 'text' && item.value && (
                      <p className={`${sizeClasses.message} whitespace-pre-wrap break-words font-handwriting`}>
                        {item.value}
                      </p>
                    )}
                    
                    {item.type === 'checkbox' && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={(checked) => {
                            const updatedContent = content.map(c =>
                              c.id === item.id ? { ...c, checked: checked as boolean } as ContentItem : c
                            );
                            setContent(updatedContent);
                            onUpdate(note.id, { content: updatedContent, updatedAt: Date.now() });
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                        />
                        <span className={`${sizeClasses.message} font-handwriting ${item.checked ? 'line-through opacity-60' : ''}`}>
                          {item.text}
                        </span>
                      </div>
                    )}
                    
                    {item.type === 'image' && (
                      <div className="mt-2">
                        <img 
                          src={item.url} 
                          alt="Note attachment" 
                          className="max-w-[140px] object-contain rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage(item.url);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className={`${sizeClasses.date} text-gray-600 font-handwriting flex-1 text-center`}>
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
                      handleDelete();
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
