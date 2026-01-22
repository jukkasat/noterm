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
import { ContactDialog } from '@/components/ContactDialog';
import { SupportDialog } from '@/components/SupportDialog';
import type { TextSize, SwimlanesCount } from '@/types/note';
import { getTextSizeClasses } from '@/lib/utils';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  textSize: TextSize;
  onTextSizeChange: (size: TextSize) => void;
  swimlanesCount: SwimlanesCount;
  onSwimlanesCountChange: (count: SwimlanesCount) => void;
}

export function SettingsDialog({ open, onOpenChange, darkMode, onDarkModeChange, textSize, onTextSizeChange, swimlanesCount, onSwimlanesCountChange }: SettingsDialogProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const descColor = darkMode ? '#c0b5a5' : '#58544fff';
  const sizeClasses = getTextSizeClasses(textSize);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto !translate-y-0 sm:!translate-y-[-50%] !top-[30px] sm:!top-[50%]"
          style={{ 
            backgroundColor: dialogBg, 
            color: textColor, 
            borderColor: '#8b6f47'
          }}
        >
          <DialogHeader>
            <DialogTitle className={sizeClasses.title} style={{ color: textColor}}>Settings</DialogTitle>
            <p className="pb-4">______</p>
            <DialogDescription className={sizeClasses.description} style={{ color: descColor }}>
              Customize your noter m. experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className={`cursor-pointer ${sizeClasses.label}`} style={{ color: textColor }}>
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
              <Label className={sizeClasses.label} style={{ color: textColor }}>Text size</Label>
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
                <span className={`w-8 text-center font-semibold ${sizeClasses.label}`} style={{ color: textColor }}>
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

            <div className="flex items-center justify-between">
              <Label className={sizeClasses.label} style={{ color: textColor }}>Swimlanes / Kanban</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => swimlanesCount > 0 && onSwimlanesCountChange((swimlanesCount - 1) as SwimlanesCount)}
                  disabled={swimlanesCount === 0}
                  className="h-6 w-6 p-0"
                  style={{ 
                    borderColor: '#8b6f47', 
                    color: swimlanesCount === 0 ? '#999' : textColor, 
                    backgroundColor: darkMode ? '#2a2520' : '#fdfcfa' 
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className={`w-8 text-center font-semibold ${sizeClasses.label}`} style={{ color: textColor }}>
                  {swimlanesCount}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => swimlanesCount < 5 && onSwimlanesCountChange((swimlanesCount + 1) as SwimlanesCount)}
                  disabled={swimlanesCount === 5}
                  className="h-6 w-6 p-0"
                  style={{ 
                    borderColor: '#8b6f47', 
                    color: swimlanesCount === 5 ? '#999' : textColor, 
                    backgroundColor: darkMode ? '#2a2520' : '#fdfcfa' 
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
            <div className="grid gap-4">
              <p className="pb-4">______</p>
              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className={`text-left ${sizeClasses.button}`}
                style={{ background: 'transparent', border: 'none', color: textColor, fontWeight: 'bold', cursor: 'pointer' }}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className={`text-left ${sizeClasses.button}`}
                style={{ background: 'transparent', border: 'none', color: textColor, fontWeight: 'bold', cursor: 'pointer' }}
              >
                Contact
              </button>
              <button
                type="button"
                onClick={() => setIsSupportOpen(true)}
                className={`text-left ${sizeClasses.button}`}
                style={{ background: 'transparent', border: 'none', color: textColor, fontWeight: 'bold', cursor: 'pointer' }}
              >
                Support
              </button>
              {/* </div> */}
            <div className="pt-6 flex justify-center">
              <Button onClick={() => onOpenChange(false)} style={{ backgroundColor: '#645033ff', color: '#ffffff' }}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} darkMode={darkMode} />
      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} darkMode={darkMode} />
      <SupportDialog open={isSupportOpen} onOpenChange={setIsSupportOpen} darkMode={darkMode} />
    </>
  );
}
