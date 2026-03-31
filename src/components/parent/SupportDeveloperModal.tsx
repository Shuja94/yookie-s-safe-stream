import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Heart, Copy, Coffee } from 'lucide-react';

const ACCOUNT_NAME = 'Sujaau Hameed';
const ACCOUNT_NUMBER = '7718499647101';

export function SupportDeveloperButton({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied! Jazakallah Khair 🙏');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
          bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20
          text-amber-700 dark:text-amber-300 hover:from-amber-500/20 hover:to-orange-500/20
          backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
          shadow-sm ${className}`}
      >
        <Coffee className="w-4 h-4" /> Support Developer ☕
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl border-amber-500/20 bg-card/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="text-center items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <DialogTitle className="text-lg font-bold">Support the Developer</DialogTitle>
            <DialogDescription className="text-sm">
              If you like this app, you can support its development ❤️
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <div className="rounded-xl bg-secondary/60 border border-border p-4 space-y-2.5">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Account Name</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{ACCOUNT_NAME}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Account Number</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 font-mono tracking-wide">{ACCOUNT_NUMBER}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyText(ACCOUNT_NUMBER)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.97]"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Number
              </button>
              <button
                onClick={() => copyText(`Account Name: ${ACCOUNT_NAME}\nAccount Number: ${ACCOUNT_NUMBER}`)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  border border-border text-foreground hover:bg-secondary transition-all active:scale-[0.97]"
              >
                <Copy className="w-3.5 h-3.5" /> Copy All
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
