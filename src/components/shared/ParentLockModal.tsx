import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const PIN = '1234';

export function ParentLockModal({ open, onClose, onUnlock }: Props) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d: string) => {
    const next = input + d;
    setError(false);
    if (next.length === 4) {
      if (next === PIN) {
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-xl gradient-hero mx-auto mb-3 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Parent Lock</h3>
          <p className="text-xs text-muted-foreground mb-5">Enter PIN to access parent settings</p>

          {/* PIN dots */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  error ? 'bg-destructive animate-pulse' :
                  i < input.length ? 'bg-primary scale-110' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(key => (
              <button
                key={key}
                onClick={() => key === '⌫' ? handleDelete() : key && handleDigit(key)}
                disabled={!key}
                className={`h-12 rounded-xl text-lg font-medium transition-all ${
                  key ? 'bg-muted hover:bg-muted/70 text-foreground active:scale-95' : ''
                } ${!key ? 'invisible' : ''}`}
              >
                {key}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground mt-4">Default PIN: 1234</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
