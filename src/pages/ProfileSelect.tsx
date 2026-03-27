import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, Play } from 'lucide-react';
import { store } from '@/lib/store';
import { useState } from 'react';
import { ParentLockModal } from '@/components/shared/ParentLockModal';
import { getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSelect() {
  const navigate = useNavigate();
  const profile = store.profile;
  const [lockOpen, setLockOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {user && (
          <button
            onClick={() => navigate('/parent/dashboard')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Parent Panel
          </button>
        )}
        <button
          onClick={() => setLockOpen(true)}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/home')}
        className="card-ceramic-elevated p-6 md:p-8 flex flex-col items-center gap-4 cursor-pointer group"
      >
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <span className="text-6xl md:text-7xl">{getAvatarEmoji(profile.avatar_url || 'lion')}</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">Age {profile.age}</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-hero text-primary-foreground text-sm font-semibold">
          <Play className="w-4 h-4 fill-current" /> Start Watching
        </div>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-xs text-muted-foreground font-medium"
      >
        Halal Play • Safe Islamic videos for kids
      </motion.p>
    </div>
  );
}
