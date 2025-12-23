import { useEffect } from 'react';
import { clamp } from '@/lib/utils';
import type { Note } from '@/types/note';

export function useNoteDragResize(
  isDragging: boolean,
  isResizing: boolean,
  dragOffset: { x: number; y: number },
  resizeStart: { x: number; y: number; width: number; height: number },
  note: Note,
  onUpdate: (id: string, updates: Partial<Note>) => void,
  setIsDragging: (value: boolean) => void,
  setIsResizing: (value: boolean) => void,
  cardRef: React.RefObject<HTMLDivElement>
) {
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const parent = cardRef.current?.offsetParent as HTMLElement | null;
        const boardRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        
        const scrollOffset = {
          left: parent?.scrollLeft || 0,
          top: parent?.scrollTop || 0,
        };

        const boardX = clientX - boardRect.left + scrollOffset.left;
        const boardY = clientY - boardRect.top + scrollOffset.top;

        let newX = boardX - dragOffset.x;
        let newY = boardY - dragOffset.y;

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
  }, [isDragging, isResizing, dragOffset, resizeStart, note.id, note.width, note.height, onUpdate, setIsDragging, setIsResizing, cardRef]);
}
