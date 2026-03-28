import { useState } from 'react';
import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  // Direct 11-char ID
  if (YOUTUBE_ID_REGEX.test(trimmed)) return trimmed;
  // URL patterns
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function AddContent() {
  const navigate = useNavigate();
  const categories = store.categories;

  const [youtubeInput, setYoutubeInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [ageMin, setAgeMin] = useState(2);
  const [ageMax, setAgeMax] = useState(8);
  const [isNoMusic, setIsNoMusic] = useState(false);
  const [tags, setTags] = useState('');

  const extractedId = extractYouTubeId(youtubeInput);
  const thumbnailUrl = extractedId
    ? `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`
    : null;

  const isValid = !!(extractedId && title.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!extractedId) {
      toast.error('Please enter a valid YouTube URL or video ID');
      return;
    }
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (title.trim().length > 120) {
      toast.error('Title must be under 120 characters');
      return;
    }

    // Check for duplicate YouTube ID
    const existing = store.videos.find(v => v.youtube_video_id === extractedId);
    if (existing) {
      toast.error(`This video already exists: "${existing.title}"`);
      return;
    }

    store.addVideo({
      title: title.trim(),
      description: description.trim() || title.trim(),
      source_type: 'youtube',
      youtube_url: `https://youtube.com/watch?v=${extractedId}`,
      youtube_video_id: extractedId,
      thumbnail_url: thumbnailUrl!,
      duration_seconds: 0,
      category_id: categoryId,
      language: 'English',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      age_min: ageMin,
      age_max: ageMax,
      is_featured: false,
      is_approved: true,
      is_hidden: false,
      is_no_music: isNoMusic,
    });

    toast.success('Video added to library!');
    navigate('/parent/library');
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-foreground mb-6">Add YouTube Video</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* YouTube URL / ID input */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">
            YouTube URL or Video ID
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={youtubeInput}
              onChange={e => setYoutubeInput(e.target.value)}
              className="input-field pl-9 pr-9"
              placeholder="https://youtube.com/watch?v=... or paste video ID"
            />
            {youtubeInput && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {extractedId ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
            )}
          </div>
          {youtubeInput && !extractedId && (
            <p className="text-xs text-destructive mt-1">
              Could not extract a valid YouTube video ID
            </p>
          )}
        </div>

        {/* Thumbnail preview */}
        {thumbnailUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg overflow-hidden aspect-video max-w-xs border border-border"
          >
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
            className="input-field"
            placeholder="Video title"
          />
        </div>

        {/* Category + Age */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="input-field"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Age Min</label>
            <input
              type="number"
              min={0}
              max={12}
              value={ageMin}
              onChange={e => setAgeMin(+e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Age Max</label>
            <input
              type="number"
              min={0}
              max={12}
              value={ageMax}
              onChange={e => setAgeMax(+e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={500}
            className="input-field min-h-[70px]"
            placeholder="Brief description (optional)"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="input-field"
            placeholder="quran, learning, kids"
          />
        </div>

        {/* No music toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNoMusic}
            onChange={e => setIsNoMusic(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
          />
          <span className="text-xs text-foreground">No Music</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-2.5 rounded-lg gradient-hero text-primary-foreground font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
        >
          Add Video
        </button>
      </form>
    </div>
  );
}
