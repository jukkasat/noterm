import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { AboutDialog } from '@/components/AboutDialog';
import type { TextSize } from '@/types/note';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  textSize: TextSize;
  onTextSizeChange: (size: TextSize) => void;
}

export function SettingsDialog({ open, onOpenChange, darkMode, onDarkModeChange, textSize, onTextSizeChange }: SettingsDialogProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const descColor = darkMode ? '#c0b5a5' : '#58544fff';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[425px]"
          style={{ backgroundColor: dialogBg, color: textColor, borderColor: '#8b6f47' }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: textColor}}>Settings</DialogTitle>
            <p className="pb-4">______</p>
            <DialogDescription style={{ color: descColor }}>
              Customize your noter m. experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="cursor-pointer" style={{ color: textColor }}>
                Theme
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={onDarkModeChange}
                className="data-[state=checked]:bg-[#5a4a2f]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label style={{ color: textColor }}>Text size</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => textSize > 1 && onTextSizeChange((textSize - 1) as TextSize)}
                  disabled={textSize === 1}
                  className="h-6 w-6 p-0"
                  style={{ 
                    borderColor: '#8b6f47', 
                    color: textSize === 1 ? '#999' : textColor, 
                    backgroundColor: darkMode ? '#2a2520' : '#fdfcfa' 
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-semibold" style={{ color: textColor }}>
                  {textSize}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => textSize < 5 && onTextSizeChange((textSize + 1) as TextSize)}
                  disabled={textSize === 5}
                  className="h-6 w-6 p-0"
                  style={{ 
                    borderColor: '#8b6f47', 
                    color: textSize === 5 ? '#999' : textColor, 
                    backgroundColor: darkMode ? '#2a2520' : '#fdfcfa' 
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
            <div className="grid gap-4">
              <div className="flex justify-left">
                <button
                  type="button"
                  onClick={() => setIsAboutOpen(true)}
                  className="text-left"
                  style={{ background: 'transparent', border: 'none', paddingTop: 24, color: textColor, fontWeight: 'bold', cursor: 'pointer' }}
                >
                  About
                </button>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} darkMode={darkMode} />
    </>
  );
}
