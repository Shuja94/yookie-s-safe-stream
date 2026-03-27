import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { Settings, Play } from 'lucide-react';
import { useState } from 'react';
import { ParentLockModal } from '@/components/shared/ParentLockModal';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSelect() {
  const navigate = useNavigate();
  const profile = store.profile;
  const [lockOpen, setLockOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Top controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {user && (
          <button
            onClick={() => navigate('/parent/dashboard')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Parent Panel
          </button>
        )}
        <button
          onClick={() => setLockOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <ParentLockModal
        open={lockOpen}
        onClose={() => setLockOpen(false)}
        onUnlock={() => { setLockOpen(false); navigate('/parent/login'); }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1.5">Who's watching?</h1>
        <p className="text-muted-foreground text-sm mb-12">Select a profile to start</p>

        <div className="flex flex-wrap justify-center gap-10">
          {/* Child */}
          <motion.button
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-surface-2 flex items-center justify-center text-5xl border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-card">
              {getAvatarEmoji(profile.avatar_url || 'lion')}
            </div>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{profile.name}</span>
          </motion.button>

          {/* Parent */}
          <motion.button
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/parent/login')}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-surface-2 flex items-center justify-center text-5xl border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-card">
              👨‍👩‍👧
            </div>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Parent</span>
          </motion.button>
        </div>

        <p className="mt-14 text-[11px] text-muted-foreground font-medium">Halal Play • Safe Islamic videos for kids</p>
      </motion.div>
    </div>
  );
}
