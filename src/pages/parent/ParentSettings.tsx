import { store } from '@/lib/store';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Profile } from '@/types';

const AVATAR_OPTIONS = [
  'lion', 'cat', 'bear', 'rabbit', 'panda', 'fox', 'unicorn', 'penguin',
  'butterfly', 'star', 'rainbow', 'moon', 'rocket', 'flower', 'dolphin', 'owl',
];

export default function ParentSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState(4);
  const [editAvatar, setEditAvatar] = useState('lion');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);

  const startEdit = (p: Profile) => {
    setEditing(p);
    setEditName(p.name);
    setEditAge(p.age);
    setEditAvatar(p.avatar_url || 'lion');
    setAdding(false);
  };

  const startAdd = () => {
    setEditing(null);
    setEditName('');
    setEditAge(4);
    setEditAvatar('lion');
    setAdding(true);
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    if (adding) {
      store.addProfile({ name: editName.trim(), avatar_url: editAvatar, age: editAge });
      toast.success('Profile added');
    } else if (editing) {
      store.updateProfile(editing.id, { name: editName.trim(), avatar_url: editAvatar, age: editAge });
      toast.success('Profile updated');
    }
    setEditing(null);
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    if (store.profiles.length <= 1) {
      toast.error('At least one profile required');
      return;
    }
    if (confirm('Remove this profile?')) {
      store.deleteProfile(id);
      toast.success('Profile removed');
      if (editing?.id === id) setEditing(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/parent/login');
  };

  const isEditMode = editing || adding;

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

      <section className="bg-card rounded-lg border border-border p-5 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-4">Parent Account</h2>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
          <input type="email" value={user?.email || ''} className="input-field" disabled />
        </div>
      </section>

      <section className="bg-card rounded-lg border border-border p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Child Profiles</h2>
          {store.profiles.length < 5 && !isEditMode && (
            <button onClick={startAdd} className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>

        {!isEditMode ? (
          <div className="space-y-3">
            {store.profiles.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                  {getAvatarEmoji(p.avatar_url || 'lion')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">Age {p.age}</p>
                </div>
                <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {store.profiles.length > 1 && (
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="input-field" placeholder="Child's name" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Age</label>
              <input type="number" min={1} max={12} value={editAge} onChange={e => setEditAge(+e.target.value)} className="input-field w-24" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-2">Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    onClick={() => setEditAvatar(av)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      editAvatar === av ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary hover:bg-muted'
                    }`}
                  >
                    {getAvatarEmoji(av)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={!editName.trim()} className="px-5 py-2 rounded-lg gradient-hero text-primary-foreground font-medium text-sm disabled:opacity-50">
                {adding ? 'Add' : 'Save'}
              </button>
              <button onClick={() => { setEditing(null); setAdding(false); }} className="px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-secondary transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bg-card rounded-lg border border-border p-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Safety</h2>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 p-2.5 rounded-md bg-secondary">
            🔒 Parent lock PIN: <strong className="text-foreground">1234</strong>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-md bg-secondary">
            🛡️ Embedded player only — no external navigation
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-md bg-secondary">
            ✅ Only approved videos shown to kids
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button onClick={handleSignOut} className="px-5 py-2.5 rounded-lg border border-destructive text-destructive font-medium text-sm hover:bg-destructive/10 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}
