import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { store } from '@/lib/store';
import { useState } from 'react';
import { ParentLockModal } from '@/components/shared/ParentLockModal';
import { getAvatarEmoji } from '@/components/child/AvatarPickerModal';

export default function ProfileSelect() {
  const navigate = useNavigate();
  const profile = store.profile;
  const [lockOpen, setLockOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Parent access - locked */}
      <button
        onClick={() => setLockOpen(true)}
        className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      <ParentLockModal
        open={lockOpen}
        onClose={() => setLockOpen(false)}
        onUnlock={() => { setLockOpen(false); navigate('/parent/login'); }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Who's watching?</h1>
        <p className="text-muted-foreground text-sm">Tap your profile to start</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/home')}
        className="card-ceramic-elevated p-6 md:p-8 flex flex-col items-center gap-4 cursor-pointer"
      >
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] gradient-sky flex items-center justify-center overflow-hidden">
          <img src={yookieAvatar} alt="Yookie" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">Age {profile.age}</p>
        </div>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-xs text-muted-foreground"
      >
        Halal Play • Safe Islamic videos for kids
      </motion.p>
    </div>
  );
}
