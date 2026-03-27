import { store } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ParentSettings() {
  const [profile, setProfile] = useState({ ...store.profile });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSave = () => {
    store.profile = { ...profile };
    toast.success('Settings saved');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/parent/login');
  };

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
        <h2 className="text-sm font-semibold text-foreground mb-4">Child Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Child's Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Enter child's name" />
            <p className="text-[10px] text-muted-foreground mt-1">Shown on kids home screen</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Age</label>
              <input type="number" min={0} max={12} value={profile.age} onChange={e => setProfile(p => ({ ...p, age: +e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Min Age</label>
              <input type="number" min={0} max={12} value={profile.default_age_min} onChange={e => setProfile(p => ({ ...p, default_age_min: +e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Max Age</label>
              <input type="number" min={0} max={12} value={profile.default_age_max} onChange={e => setProfile(p => ({ ...p, default_age_max: +e.target.value }))} className="input-field" />
            </div>
          </div>
        </div>
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
        <button onClick={handleSave} className="px-6 py-2.5 rounded-lg gradient-hero text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
          Save Settings
        </button>
        <button onClick={handleSignOut} className="px-5 py-2.5 rounded-lg border border-destructive text-destructive font-medium text-sm hover:bg-destructive/10 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}
