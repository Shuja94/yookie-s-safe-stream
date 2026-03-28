import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyPin } from '@/lib/pin';

interface Props {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export function ParentLockModal({ open, onClose, onUnlock }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d: string) => {
    const next = input + d;
    setError(false);
    if (next.length === 4) {
      if (verifyPin(next)) {
        setInput('');
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => { setInput(''); setError(false); }, 600);
      }
    } else {
      setInput(next);
    }
  };

  const handleDelete = () => {
    setInput(i => i.slice(0, -1));
    setError(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl gradient-hero mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Parent Access</h3>
          <p className="text-xs text-muted-foreground mb-6">Enter your 4-digit PIN</p>

          {/* PIN dots */}
          <div className="flex justify-center gap-4 mb-7">
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={error ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error ? 'bg-destructive' :
                  i < input.length ? 'bg-primary scale-125 shadow-md shadow-primary/30' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[210px] mx-auto">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(key => (
              <button
                key={key}
                onClick={() => key === '⌫' ? handleDelete() : key && handleDigit(key)}
                disabled={!key}
                className={`h-13 rounded-xl text-lg font-semibold transition-all duration-150 ${
                  key ? 'bg-secondary hover:bg-muted text-foreground active:scale-90 active:bg-primary/20' : ''
                } ${!key ? 'invisible' : ''}`}
              >
                {key}
              </button>
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-destructive font-medium mt-4"
            >
              Incorrect PIN. Try again.
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
