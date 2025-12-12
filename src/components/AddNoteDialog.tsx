import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (message: string, subject?: string) => void;
  darkMode?: boolean;
}

export function AddNoteDialog({ open, onOpenChange, onAdd, darkMode = false }: AddNoteDialogProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onAdd(message, subject.trim() || undefined);
      setSubject('');
      setMessage('');
      onOpenChange(false);
    }
  };

  const dialogBg = darkMode ? '#3a3530' : '#faf8f3';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const descColor = darkMode ? '#c0b5a5' : '#8b7355';
  const inputBg = darkMode ? '#e0d5c5' : '#f5f0e8';
  const inputText = darkMode ? '#5a4a2f' : '#5a4a2f';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{ backgroundColor: dialogBg, color: textColor, borderColor: '#8b6f47' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: textColor }}>Add New Note</DialogTitle>
          <DialogDescription style={{ color: descColor }}>
            Create a new note for your board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject" style={{ color: textColor }}>Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Note subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={darkMode ? 'border-gray-600 placeholder:text-[#5a4a2f]' : 'border-[#d4c4a8]'}
                style={{ backgroundColor: inputBg, color: inputText }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" style={{ color: textColor }}>Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your note message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={darkMode ? 'border-gray-600 min-h-[100px] placeholder:text-[#5a4a2f]' : 'min-h-[100px] border-[#d4c4a8]'}
                style={{ backgroundColor: inputBg, color: inputText }}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              style={{ backgroundColor: '#8b6f47', color: '#ffffff' }}
            >
              Add Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
