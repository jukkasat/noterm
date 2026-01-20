import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import notermAddress from '@/noterm_address.png';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode?: boolean;
}

export function SupportDialog({ open, onOpenChange, darkMode = false }: SupportDialogProps) {
  const dialogBg = darkMode ? '#3a3530' : '#ffffff';
  const textColor = darkMode ? '#e0d5c5' : '#5a4a2f';
  const descColor = darkMode ? '#c0b5a5' : '#58544fff';


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
            SUPPORT NOTER M. DEVELOPMENT 
          </DialogDescription>
          {/* <p className="pt-2 text-center">_______</p> */}
        </DialogHeader>

        <div className="py-4 pl-1 text-center" >
          <p className="text-sm mb-4" style={{ color: textColor }}>
            Support <b>noter m.</b> development and maintenance via Lightning or eCash <a href="lightning:21s@minibits.cash" className='underline'>21s@minibits.cash</a>
          </p>
          <p className="pb-6 text-center">_______</p>
          <p className="text-sm mb-2" style={{ color: textColor }}>
            Support <b>noter m.</b> development via Bolt12:
          </p>

          <div className="flex justify-center mb-4">
            <a 
              href="bitcoin:?lno=lno1pggxjmnrdakkjmn8ypcxz7tdv4h8gy8wqwryaup9lh50kkranzgcdnn2fgvx390wgj5jd07rwr3vxeje0glc7qete7raa0km2tv383x2jevq6gjv5cgthparak08a7hggrfn2ng85spqxlqgchx24dpqlhd7y65axprhspwqds5f2qhymvflrlpkulurhe78qqe7hldwa5gjgkuajcpk08qa6h3cvdx74uc93qyl3r96hlcdph6jx3psmen0y95a8xlq4ruum805m2qmpfcmsq60gafufk882qnxnpzqqpz4zt23tyjnhpyauk37dvkwljm3fuu28cqryh08tz9ljlezyf6zhrx3kraxqzvha53e0fkw6utwjgtzxh45jsfy2f702gcq63snw4jt400qnpwn9jkqk"
              className="cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={notermAddress} 
                alt="noter m. Bolt12 support" 
                className="max-w-[400px] object-contain rounded hover:opacity-80 transition-opacity"
              />
            </a>
          </div>

          <p className="text-sm mb-4" style={{ color: textColor }}>
            <b>Happy noting!</b>
          </p>
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

export default SupportDialog;