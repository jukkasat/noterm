import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode?: boolean;
}

export function ContactDialog({ open, onOpenChange, darkMode = false }: ContactDialogProps) {
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const descColor = darkMode ? '#c0b5a5' : '#58544fff';

  const [category, setCategory] = useState('Help / Support');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`noter m. - ${category}`);
    const body = encodeURIComponent(content);
    window.location.href = `mailto:studio21@gmx.com?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]" /* ~2x size of Settings (425px) */
        style={{ backgroundColor: dialogBg, color: textColor, borderColor: '#8b6f47' }}
      >
        <DialogHeader>
          <DialogTitle>
            <p className="text-6xl mb-1 flex justify-center" style={{ color: textColor, fontFamily: 'Sacramento, cursive', fontWeight: 'normal'}}>
              noterm.
            </p>
          </DialogTitle>
          <p className="pb-6 text-center">_______</p>
          <DialogDescription className="text-center" style={{ color: descColor }}>
            HELP / SUPPORT / IDEAS
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 pl-1 text-center" >
          <p className="text-sm mb-6" style={{ color: textColor }}>
            If in need for help or support about using <b>noter m.</b> or if you have new ideas how to make it even better, you can reach us by following form:
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 pl-4 pr-4">
            <div className="text-left">
              <Label htmlFor="category" style={{ color: textColor }} className="mb-2 ml-1 block">
                Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-2/3 rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{
                  backgroundColor: darkMode ? '#2a2520' : '#ffffff',
                  color: textColor,
                  borderColor: '#8b6f47'
                }}
              >
                <option value="Help / Support">Help / Support</option>
                <option value="New Idea / Feature">New Idea / Feature</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="text-left">
              <Label htmlFor="content" style={{ color: textColor }} className="mb-2 ml. block">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your message or idea here..."
                rows={6}
                required
                className="resize-none"
                style={{
                  backgroundColor: darkMode ? '#2a2520' : '#ffffff',
                  color: textColor,
                  borderColor: '#8b6f47'
                }}
              />
            </div>
            <div className='flex justify-end'>
              <Button 
                type="submit" 
                style={{ backgroundColor: '#645033ff', color: '#ffffff' }}
                className="w-1/4"
              >
                Send
              </Button>
            </div>

          </form>
          <p></p>
          <p></p>
          <div className="pt-6 flex justify-center">
            <Button onClick={() => onOpenChange(false)} style={{ backgroundColor: '#645033ff', color: '#ffffff' }}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ContactDialog;