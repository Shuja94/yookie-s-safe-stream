import { useState } from 'react';
import { X } from 'lucide-react';
import { Video } from '@/types';
import { store } from '@/lib/store';
import { toast } from 'sonner';

interface Props {
  video: Video;
  onClose: () => void;
}

export function EditVideoModal({ video, onClose }: Props) {
  const categories = store.categories;
  const [form, setForm] = useState({
    title: video.title,
    description: video.description,
    thumbnail_url: video.thumbnail_url,
    youtube_url: video.youtube_url || '',
    video_url: video.video_url || '',
    category_id: video.category_id,
    language: video.language,
    tags: video.tags.join(', '),
    age_min: video.age_min,
    age_max: video.age_max,
    is_approved: video.is_approved,
    is_featured: video.is_featured,
    is_hidden: video.is_hidden,
    is_no_music: video.is_no_music,
    safe_notes: video.safe_notes || '',
  });

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    
    const ytMatch = form.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);

    store.updateVideo(video.id, {
      title: form.title,
      description: form.description,
      thumbnail_url: form.thumbnail_url,
      youtube_url: video.source_type === 'youtube' ? form.youtube_url : undefined,
      youtube_video_id: ytMatch ? ytMatch[1] : video.youtube_video_id,
      video_url: video.source_type === 'hosted' ? form.video_url : undefined,
      category_id: form.category_id,
      language: form.language,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      age_min: form.age_min,
      age_max: form.age_max,
      is_approved: form.is_approved,
      is_featured: form.is_featured,
      is_hidden: form.is_hidden,
      is_no_music: form.is_no_music,
      safe_notes: form.safe_notes,
    });
    toast.success('Video updated');
    onClose();
  };

  const inputClass = "w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Edit Video</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>{video.source_type === 'youtube' ? 'YouTube URL' : 'Video URL'}</label>
            <input
              type="url"
              value={video.source_type === 'youtube' ? form.youtube_url : form.video_url}
              onChange={e => setForm(f => ({ ...f, [video.source_type === 'youtube' ? 'youtube_url' : 'video_url']: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Thumbnail URL</label>
            <input type="url" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} className={inputClass} />
          </div>
          {form.thumbnail_url && (
            <div className="rounded-xl overflow-hidden aspect-video max-w-[200px]">
              <img src={form.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className={inputClass}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Language</label>
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputClass}>
                <option>English</option><option>Arabic</option><option>Dhivehi</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputClass} min-h-[60px]`} />
          </div>

          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className={inputClass} />
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { key: 'is_approved', label: 'Approved' },
              { key: 'is_featured', label: 'Featured' },
              { key: 'is_hidden', label: 'Hidden' },
              { key: 'is_no_music', label: 'No Music 🔇' },
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

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:shadow-lg transition-all">
              Save Changes
            </button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
