import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { AboutDialog } from '@/components/AboutDialog';
import type { TextSize } from '@/types/note';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';

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
              <RadioGroup value={textSize} onValueChange={(value) => onTextSizeChange(value as TextSize)} className="flex items-center gap-4">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small" className="cursor-pointer text-xs" style={{ color: textColor }}>
                    Small
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="cursor-pointer text-xs" style={{ color: textColor }}>
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="cursor-pointer text-xs" style={{ color: textColor }}>
                    Large
                  </Label>
                </div>
              </RadioGroup>
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
