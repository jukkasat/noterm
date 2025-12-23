import { useState, useRef, useEffect } from 'react';
import type { ContentItem, Note } from '@/types/note';
import { generateId } from '@/lib/utils';

interface UseNoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDragStart: (id: string) => void;
}

// export function useNoteCard(note: Note, onUpdate: (id: string, updates: Partial<Note>) => void) {
export function useNoteCard({ note, onUpdate, onDragStart }: UseNoteCardProps) {
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

  // Sync with note prop changes
  useEffect(() => {
    setSubject(note.subject || '');
    setContent(note.content || []);
  }, [note.subject, note.content]);

  // Auto-resize textareas
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

  const handleSave = () => {
    onUpdate(note.id, { subject, content, updatedAt: Date.now() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSubject(note.subject || '');
    setContent(note.content || []);
    setIsEditing(false);
  };

  const handleContentChange = (id: string, updates: Partial<ContentItem>) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, ...updates } as ContentItem : item
    ));
  };

  const handleRemoveContent = (id: string) => {
    setContent(content.filter(item => item.id !== id));
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
  };

  const handleAddText = () => {
    const newItem: ContentItem = {
      type: 'text',
      id: generateId(),
      value: '',
    };
    setContent([...content, newItem]);
    setIsAddMenuOpen(false);
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
    setIsAddMenuOpen(false);
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

  const handleDragStart = (clientX: number, clientY: number) => {
    if (isEditing || isResizing) return;

    const parent = cardRef.current?.offsetParent as HTMLElement | null;
    const boardRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };

    setIsDragging(true);
    setDragOffset({
      x: clientX - boardRect.left - note.x,
      y: clientY - boardRect.top - note.y,
    });
    onDragStart(note.id);
  };

  return {
    subject,
    setSubject,
    content,
    setContent,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    zoomedImage,
    setZoomedImage,
    dragOffset,
    setDragOffset,
    resizeStart,
    setResizeStart,
    isAddMenuOpen,
    setIsAddMenuOpen,
    cardRef,
    fileInputRef,
    handleSave,
    handleCancel,
    handleContentChange,
    handleRemoveContent,
    handleAddCheckbox,
    handleAddText,
    handleAddImage,
    handleImageUpload,
    handleDragStart,
  };
}
