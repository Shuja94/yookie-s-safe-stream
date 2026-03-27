import { useState } from 'react';
import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video as VideoIcon, Link, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function AddContent() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'youtube' | 'hosted'>('youtube');
  const categories = store.categories;

  const [form, setForm] = useState({
    title: '',
    description: '',
    youtube_url: '',
    video_url: '',
    thumbnail_url: '',
    category_id: categories[0]?.id || '',
    language: 'English',
    tags: '',
    age_min: 2,
    age_max: 8,
    is_featured: false,
    is_approved: false,
    is_hidden: false,
    is_no_music: false,
    safe_notes: '',
  });

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleYouTubeUrl = (url: string) => {
    setForm(f => ({ ...f, youtube_url: url }));
    const vid = extractYouTubeId(url);
    if (vid) {
      setForm(f => ({
        ...f,
        thumbnail_url: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const ytId = tab === 'youtube' ? extractYouTubeId(form.youtube_url) : undefined;

    store.addVideo({
      title: form.title,
      description: form.description,
      source_type: tab,
      youtube_url: tab === 'youtube' ? form.youtube_url : undefined,
      youtube_video_id: ytId || undefined,
      video_url: tab === 'hosted' ? form.video_url : undefined,
      thumbnail_url: form.thumbnail_url || 'https://via.placeholder.com/640x360',
      duration_seconds: 0,
      category_id: form.category_id,
      language: form.language,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      age_min: form.age_min,
      age_max: form.age_max,
      is_featured: form.is_featured,
      is_approved: form.is_approved,
      is_hidden: form.is_hidden,
      is_no_music: form.is_no_music,
      safe_notes: form.safe_notes,
    });

    toast.success('Video added successfully!');
    navigate('/parent/library');
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Add Content</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['youtube', 'hosted'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t === 'youtube' ? <Link className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
            {t === 'youtube' ? 'YouTube Link' : 'Hosted Video'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {tab === 'youtube' ? (
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input
              type="url"
              value={form.youtube_url}
              onChange={e => handleYouTubeUrl(e.target.value)}
              className={inputClass}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              type="url"
              value={form.video_url}
              onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
              className={inputClass}
              placeholder="https://example.com/video.mp4"
            />
          </div>
        )}

        {/* Thumbnail preview */}
        {form.thumbnail_url && (
          <div className="rounded-card-inner overflow-hidden aspect-video max-w-xs">
            <img src={form.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} placeholder="Video title" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className={inputClass}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputClass} min-h-[80px]`} placeholder="Brief description..." />
        </div>

        <div>
          <label className={labelClass}>Thumbnail URL</label>
          <input type="url" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} className={inputClass} placeholder="Auto-filled for YouTube" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Language</label>
            <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputClass}>
              <option>English</option>
              <option>Arabic</option>
              <option>Dhivehi</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Age Min</label>
            <input type="number" min={0} max={12} value={form.age_min} onChange={e => setForm(f => ({ ...f, age_min: +e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Age Max</label>
            <input type="number" min={0} max={12} value={form.age_max} onChange={e => setForm(f => ({ ...f, age_max: +e.target.value }))} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className={inputClass} placeholder="learning, quran, fun" />
        </div>

        <div>
          <label className={labelClass}>Safety Notes</label>
          <textarea value={form.safe_notes} onChange={e => setForm(f => ({ ...f, safe_notes: e.target.value }))} className={`${inputClass} min-h-[60px]`} placeholder="Any notes about content safety..." />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          {[
            { key: 'is_approved', label: 'Approved' },
            { key: 'is_featured', label: 'Featured' },
            { key: 'is_hidden', label: 'Hidden' },
          ].map(toggle => (
            <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(form as Record<string, unknown>)[toggle.key] as boolean}
                onChange={e => setForm(f => ({ ...f, [toggle.key]: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-foreground">{toggle.label}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="px-8 py-3 rounded-xl gradient-hero text-primary-foreground font-medium hover:shadow-lg transition-all">
          Save Video
        </button>
      </form>
    </div>
  );
}
