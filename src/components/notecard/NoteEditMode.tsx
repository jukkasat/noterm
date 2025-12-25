import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, CheckSquare, Image as ImageIcon, Type, Trash2, Palette } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { generateId } from '@/lib/utils';
import type { ContentItem } from '@/types/note';
import { useEffect, useState } from 'react';

interface NoteEditModeProps {
  subject: string;
  content: ContentItem[];
  sizeClasses: { subject: string; message: string; date: string };
  onSubjectChange: (value: string) => void;
  onContentChange: (id: string, updates: Partial<ContentItem>) => void;
  onRemoveContent: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddCheckbox: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  isAddMenuOpen: boolean;
  setIsAddMenuOpen: (open: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setContent: (content: ContentItem[]) => void;
  resizeTextArea: (textarea: HTMLTextAreaElement) => void;
  onColorChange: () => void;
}

export function NoteEditMode({
  subject,
  content,
  sizeClasses,
  onSubjectChange,
  onContentChange,
  onRemoveContent,
  onSave,
  onCancel,
  onAddCheckbox,
  onAddText,
  onAddImage,
  isAddMenuOpen,
  setIsAddMenuOpen,
  fileInputRef,
  handleImageUpload,
  setContent,
  resizeTextArea,
  onColorChange,
}: NoteEditModeProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const savedDarkMode = localStorage.getItem('noter-dark-mode');
      setDarkMode(savedDarkMode === 'true');
    };
    
    // Check immediately
    checkDarkMode();
    
    // Check every 100ms for changes
    const interval = setInterval(checkDarkMode, 100);
    
    return () => clearInterval(interval);
  }, []);

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

  return (
    <>
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2 pb-2"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const lastItem = content[content.length - 1];
            if (lastItem && lastItem.type === 'text') return;
            
            const newItem: ContentItem = {
              type: 'text',
              id: generateId(),
              value: '',
            };
            setContent([...content, newItem]);
          }
        }}
      >
        <input
          type="text"
          className={`bg-transparent border-b border-gray-400 outline-none ${sizeClasses.subject} font-handwriting font-semibold`}
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="Subject (optional)..."
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
        
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
                    onContentChange(item.id, { value: e.currentTarget.value });
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
                    onRemoveContent(item.id);
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
                  onCheckedChange={(checked) => onContentChange(item.id, { checked: checked as boolean })}
                  onClick={(e) => e.stopPropagation()}
                />
                <input
                  type="text"
                  className={`checkbox-input flex-1 bg-transparent border-b border-gray-300 outline-none ${sizeClasses.message} font-handwriting text-gray-900 dark:text-gray-100 min-w-0`}
                  value={item.text}
                  onChange={(e) => onContentChange(item.id, { text: e.target.value })}
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
                    onRemoveContent(item.id);
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
                    onRemoveContent(item.id);
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
            onSave();
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
            onCancel();
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
            className="w-48 p-2 border-gray-200" 
            style={{ 
              backgroundColor: darkMode ? '#3a3530' : '#ffffff',
              color: darkMode ? '#e0d5c5' : '#3a3530',
              borderColor: darkMode ? '#8b6f47' : '#e5e7eb'
            }}
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
                  onAddCheckbox();
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
                  onAddText();
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
                  onAddImage();
                }}
              >
                <ImageIcon className="h-3 w-3 mr-2" />
                Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onColorChange();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          title="Change color"
        >
          <Palette className="h-3 w-3" />
        </Button>
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
  );
}
