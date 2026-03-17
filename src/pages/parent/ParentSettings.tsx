import { store } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ParentSettings() {
  const [profile, setProfile] = useState({ ...store.profile });

  const handleSave = () => {
    store.profile = { ...profile };
    toast.success('Settings saved');
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {/* App Settings */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">App Branding</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>App Name</label>
            <input type="text" defaultValue="YookiePlay" className={inputClass} disabled />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input type="text" defaultValue="A safe little world of videos for Yookie" className={inputClass} disabled />
          </div>
          <p className="text-xs text-muted-foreground">Branding customization will be available with backend integration.</p>
        </div>
      </section>

      {/* Child Profile */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Child Profile</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className={inputClass} />
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

      {/* Future features */}
      <section className="card-ceramic-elevated p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Coming Soon</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <span>🔒</span> <span>Child mode lock (PIN protection)</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <span>⏰</span> <span>Daily watch time limit</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <span>🌙</span> <span>Bedtime mode transition</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <span>👥</span> <span>Multiple child profiles</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <span>📥</span> <span>Offline downloads</span>
          </div>
        </div>
      </section>

      <button onClick={handleSave} className="px-8 py-3 rounded-xl gradient-hero text-primary-foreground font-medium hover:shadow-lg transition-all">
        Save Settings
      </button>
    </div>
  );
}
