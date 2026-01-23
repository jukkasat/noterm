import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { ContentItem, Note } from '@/types/note';

interface NoteReadModeProps {
  note: Note;
  content: ContentItem[];
  sizeClasses: { subject: string; message: string; date: string };
  fontClass: string;
  onEdit: () => void;
  onDelete: () => void;
  onImageClick: (url: string) => void;
  formatDate: (timestamp: number) => string;
  setContent: (content: ContentItem[]) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export function NoteReadMode({
  note,
  content,
  sizeClasses,
  fontClass,
  onEdit,
  onDelete,
  onImageClick,
  formatDate,
  setContent,
  onUpdate,
}: NoteReadModeProps) {
  return (
    <>
      <div
        className="flex-1 overflow-auto"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}>
        {note.subject && (
          <p className={`${sizeClasses.subject} ${fontClass} font-semibold mb-2 border-b border-gray-400 pb-1 text-gray-800`}>
            {note.subject}
          </p>
        )}
        
        <div className="space-y-2">
          {content.map((item) => (
            <div key={item.id}>
              {item.type === 'text' && item.value && (
                <p className={`${sizeClasses.message} whitespace-pre-wrap break-words ${fontClass} text-gray-800`}>
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
                  <span className={`${sizeClasses.message} ${fontClass} text-gray-800 ${item.checked ? 'line-through opacity-60' : ''}`}>
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
                      onImageClick(item.url);
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
          <p className={`${sizeClasses.date} text-gray-600 ${fontClass} flex-1 text-center`}>
            {formatDate(note.updatedAt)}
          </p>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
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
                onDelete();
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
  );
}
