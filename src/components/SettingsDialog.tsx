import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange, darkMode, onDarkModeChange }: SettingsDialogProps) {
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#000000';
  const descColor = darkMode ? '#c0b5a5' : '#71717a';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{ backgroundColor: dialogBg, color: textColor, borderColor: '#8b6f47' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: textColor }}>Settings</DialogTitle>
          <DialogDescription style={{ color: descColor }}>
            Customize your noter m. experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="cursor-pointer" style={{ color: textColor }}>
              Dark Theme
            </Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={onDarkModeChange}
              className="data-[state=checked]:bg-[#5a4a2f]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
