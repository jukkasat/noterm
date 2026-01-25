import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTextSizeClasses, getFontClass } from '@/lib/utils';
import type { TextSize, FontStyle } from '@/types/note';

interface SaveBackupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (filename: string) => void;
  defaultFilename: string;
  textSize: TextSize;
  fontStyle: FontStyle;
  darkMode: boolean;
}

export const SaveBackupDialog = ({ open, onOpenChange, onSave, defaultFilename, textSize, fontStyle, darkMode }: SaveBackupDialogProps) => {
  const [filename, setFilename] = useState(defaultFilename);
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const descColor = darkMode ? '#c0b5a5' : '#58544fff';
  const sizeClasses = getTextSizeClasses(textSize);
  const fontClass = getFontClass(fontStyle);

  // Update filename when defaultFilename changes
  useEffect(() => {
    if (open) {
      setFilename(defaultFilename);
    }
  }, [open, defaultFilename]);

  const handleSave = () => {
    const trimmedFilename = filename.trim();
    if (trimmedFilename) {
      // Ensure .json extension
      const finalFilename = trimmedFilename.endsWith('.json') 
        ? trimmedFilename 
        : `${trimmedFilename}.json`;
      onSave(finalFilename);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]"
        style={{ 
          backgroundColor: dialogBg, 
          color: textColor, 
          borderColor: '#8b6f47'
        }}
      >
        <DialogHeader>
          <DialogTitle className={`${sizeClasses.title} ${fontClass}`} style={{ color: textColor }}>Save Backup</DialogTitle>
          <DialogDescription className={`${sizeClasses.description} ${fontClass}`} style={{ color: descColor }}>
            Enter a name for your backup file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename" className={`${sizeClasses.label} ${fontClass}`} style={{ color: textColor }}>Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="noter_backup.json"
              autoFocus
              className={`${sizeClasses.label} ${fontClass}`}
              style={{
                backgroundColor: darkMode ? '#2a2520' : '#fdfcfa',
                color: textColor,
                borderColor: '#8b6f47'
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            style={{ 
              borderColor: '#8b6f47', 
              color: textColor, 
              backgroundColor: darkMode ? '#2a2520' : '#fdfcfa' 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!filename.trim()}
            style={{ 
              backgroundColor: '#645033ff', 
              color: '#ffffff' 
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
