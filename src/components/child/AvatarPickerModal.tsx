import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

const KID_AVATARS = [
  { id: 'lion', emoji: '🦁', label: 'Lion' },
  { id: 'cat', emoji: '🐱', label: 'Cat' },
  { id: 'bear', emoji: '🐻', label: 'Bear' },
  { id: 'rabbit', emoji: '🐰', label: 'Rabbit' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'fox', emoji: '🦊', label: 'Fox' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'rainbow', emoji: '🌈', label: 'Rainbow' },
  { id: 'moon', emoji: '🌙', label: 'Moon' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'dolphin', emoji: '🐬', label: 'Dolphin' },
  { id: 'owl', emoji: '🦉', label: 'Owl' },
  { id: 'turtle', emoji: '🐢', label: 'Turtle' },
  { id: 'bee', emoji: '🐝', label: 'Bee' },
  { id: 'koala', emoji: '🐨', label: 'Koala' },
  { id: 'dinosaur', emoji: '🦕', label: 'Dino' },
];

interface AvatarPickerModalProps {
  open: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSelect: (avatarId: string) => void;
}

export function AvatarPickerModal({ open, onClose, currentAvatar, onSelect }: AvatarPickerModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Pick Your Avatar!</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-3 py-2">
          {KID_AVATARS.map((av, i) => (
            <motion.button
              key={av.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { onSelect(av.id); onClose(); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                currentAvatar === av.id
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <span className="text-3xl">{av.emoji}</span>
              <span className="text-[9px] text-muted-foreground font-medium">{av.label}</span>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function getAvatarEmoji(id: string): string {
  return KID_AVATARS.find(a => a.id === id)?.emoji ?? '🦁';
}
