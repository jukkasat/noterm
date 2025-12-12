import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode?: boolean;
}

export function AboutDialog({ open, onOpenChange, darkMode = false }: AboutDialogProps) {
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#645033ff';
  const descColor = darkMode ? '#c0b5a5' : '#9b9b9bff';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[800px]" /* ~2x size of Settings (425px) */
        style={{ backgroundColor: dialogBg, color: textColor, borderColor: '#8b6f47' }}
      >
        <DialogHeader>
          {/* <DialogTitle style={{ color: textColor }}>about noter memo</DialogTitle>
           */}
           <DialogTitle>
            <p className="text-6xl mb-1 flex justify-center" style={{ color: textColor, fontFamily: 'Sacramento, cursive', fontWeight: 'normal'}}>
              noterm.
            </p>
           </DialogTitle>
          <DialogDescription style={{ color: descColor }}>
            <b>noter memo</b> (noter m.) is a lightweight, digital note board - create, edit, move, resize and export your post‑it style notes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4" style={{ paddingLeft: '4px'}}>
          <p className="text-sm mb-4" style={{ color: textColor }}>
            <b>noter m.</b> aims to be the best note app. Available for everyone. Minimal. Focused.
          </p>
          <p className="text-sm mb-4" style={{ color: textColor }}>
            <b>noter m.</b> is fully usable offline without an Internet connection.
          </p>
          <p className="text-sm mb-4" style={{ color: textColor }}>
            All your notes are persisted only on your local storage and never leaves your device - Your data, your notes!
          </p>
          <p className="text-sm mb-4" style={{ color: textColor }}>
            Save and load notes easily as JSON files.
          </p>
          <p className="text-xs mb-4" style={{ color: descColor }}>
            <b>TIP!</b> Use Chrome or other PWA (Progressive Web App) supported browser to install noter m. as desktop / mobile app all without needing any app stores!
          </p>
          <p className="text-sm mb-4" style={{ color: textColor }}>
            <b>Happy noting!</b>
          </p>
          <p>______</p>
          <p></p>
          <p></p>
          <div className="flex justify-center" style={{ paddingTop: '30px'}}>
            <Button onClick={() => onOpenChange(false)} style={{ backgroundColor: '#645033ff', color: '#ffffff' }}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AboutDialog;