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

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {/* Parent Account */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Parent Account</h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={user?.email || ''} className={inputClass} disabled />
          </div>
          <p className="text-xs text-muted-foreground">Logged in as parent administrator.</p>
        </div>
      </section>

      {/* Child Profile */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Child Profile</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Child's Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Enter child's name" />
            <p className="text-xs text-muted-foreground mt-1">This name will appear on the kids home screen.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" min={0} max={12} value={profile.age} onChange={e => setProfile(p => ({ ...p, age: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Age Min</label>
              <input type="number" min={0} max={12} value={profile.default_age_min} onChange={e => setProfile(p => ({ ...p, default_age_min: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Age Max</label>
              <input type="number" min={0} max={12} value={profile.default_age_max} onChange={e => setProfile(p => ({ ...p, default_age_max: +e.target.value }))} className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* App Branding */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">App Branding</h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>App Name</label>
            <input type="text" defaultValue="Halal Play" className={inputClass} disabled />
          </div>
          <p className="text-xs text-muted-foreground">Safe Islamic videos for kids</p>
        </div>
      </section>

      {/* Safety Info */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Safety Features</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
            <span>🔒</span> <span>Parent lock PIN: <strong className="text-foreground">1234</strong></span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
            <span>🛡️</span> <span>YouTube embedded player — no external navigation</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
            <span>🚫</span> <span>No search for kids — category browsing only</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
            <span>✅</span> <span>Only parent-approved videos shown to kids</span>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button onClick={handleSave} className="px-8 py-3 rounded-xl gradient-hero text-primary-foreground font-semibold hover:shadow-lg transition-all">
          Save Settings
        </button>
        <button onClick={handleSignOut} className="px-6 py-3 rounded-xl border border-destructive text-destructive font-medium hover:bg-destructive/10 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
}
