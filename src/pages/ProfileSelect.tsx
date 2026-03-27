import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { Plus, Lock, Edit2, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types';

const AVATAR_OPTIONS = [
  'lion', 'cat', 'bear', 'rabbit', 'panda', 'fox', 'unicorn', 'penguin',
  'butterfly', 'star', 'rainbow', 'moon', 'rocket', 'flower', 'dolphin', 'owl',
];

function AddChildModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('lion');
  const [age, setAge] = useState(4);

  const handleAdd = () => {
    if (!name.trim()) return;
    store.addProfile({ name: name.trim(), avatar_url: avatar, age });
    setName('');
    setAvatar('lion');
    setAge(4);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">Add Child</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                placeholder="Child's name"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Age</label>
              <input
                type="number"
                min={1}
                max={12}
                value={age}
                onChange={e => setAge(+e.target.value)}
                className="input-field w-24"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-2">Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      avatar === av
                        ? 'bg-primary/20 ring-2 ring-primary scale-110'
                        : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {getAvatarEmoji(av)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="w-full py-2.5 rounded-lg gradient-hero text-primary-foreground font-semibold text-sm disabled:opacity-50 transition-all"
            >
              Add Profile
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EditChildModal({ open, onClose, profile }: { open: boolean; onClose: () => void; profile: Profile }) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar_url || 'lion');
  const [age, setAge] = useState(profile.age);

  const handleSave = () => {
    if (!name.trim()) return;
    store.updateProfile(profile.id, { name: name.trim(), avatar_url: avatar, age });
    onClose();
  };

  const handleDelete = () => {
    if (store.profiles.length <= 1) return;
    if (confirm(`Remove ${profile.name}'s profile?`)) {
      store.deleteProfile(profile.id);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">Edit Profile</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Age</label>
              <input type="number" min={1} max={12} value={age} onChange={e => setAge(+e.target.value)} className="input-field w-24" />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-2">Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      avatar === av ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {getAvatarEmoji(av)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 py-2.5 rounded-lg gradient-hero text-primary-foreground font-semibold text-sm disabled:opacity-50"
              >
                Save
              </button>
              {store.profiles.length > 1 && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-lg border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProfileSelect() {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const { user } = useAuth();
  const [, setTick] = useState(0);

  // Subscribe to store changes
  useState(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return () => unsub();
  });

  const handleSelectProfile = (profileId: string) => {
    if (isManaging) {
      const p = store.profiles.find(pr => pr.id === profileId);
      if (p) setEditProfile(p);
      return;
    }
    store.selectProfile(profileId);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary font-extrabold text-lg tracking-tight"
        >
          Halal Play
        </motion.p>
        <div className="flex items-center gap-2">
          {isManaging ? (
            <button
              onClick={() => setIsManaging(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Done
            </button>
          ) : (
            <button
              onClick={() => setIsManaging(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" /> Manage
            </button>
          )}
          <button
            onClick={() => navigate(user ? '/parent/dashboard' : '/parent/login')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Parent
          </button>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
          Who's watching?
        </h1>
        <p className="text-muted-foreground text-sm mb-12">Select a profile to start watching</p>

        {/* Profile grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {store.profiles.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.08, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectProfile(p.id)}
              className="flex flex-col items-center gap-3 group relative"
            >
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-surface-2 flex items-center justify-center text-5xl md:text-6xl border-2 transition-all duration-300 shadow-card ${
                isManaging
                  ? 'border-primary/50 ring-2 ring-primary/20'
                  : 'border-transparent group-hover:border-primary'
              }`}>
                {getAvatarEmoji(p.avatar_url || 'lion')}
                {isManaging && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Edit2 className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {p.name}
              </span>
            </motion.button>
          ))}

          {/* Add Child */}
          {store.profiles.length < 5 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: store.profiles.length * 0.08 }}
              whileHover={{ scale: 1.08, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddOpen(true)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/60 transition-all duration-300">
                <Plus className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Add Child
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-6 text-[11px] text-muted-foreground/60 font-medium"
      >
        Halal Play • Safe Islamic content for kids
      </motion.p>

      <AddChildModal open={addOpen} onClose={() => setAddOpen(false)} />
      {editProfile && (
        <EditChildModal
          open={!!editProfile}
          onClose={() => setEditProfile(null)}
          profile={editProfile}
        />
      )}
    </div>
  );
}
