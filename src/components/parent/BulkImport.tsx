import { useState, useMemo } from 'react';
import { store } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (YOUTUBE_ID_REGEX.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

interface ParsedEntry {
  raw: string;
  videoId: string | null;
  title: string;
  isDuplicate: boolean;
}

export function BulkImport() {
  const navigate = useNavigate();
  const categories = store.categories;

  const [bulkText, setBulkText] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [ageMin, setAgeMin] = useState(2);
  const [ageMax, setAgeMax] = useState(8);
  const [isNoMusic, setIsNoMusic] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const parsed = useMemo<ParsedEntry[]>(() => {
    if (!bulkText.trim()) return [];
    const lines = bulkText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const seenIds = new Set<string>();
    const existingIds = new Set(
      store.videos.map(v => v.youtube_video_id).filter(Boolean)
    );

    return lines.map(line => {
      // Support format: "URL | Title" or "URL Title" or just "URL"
      const pipeIdx = line.indexOf('|');
      let urlPart: string;
      let titlePart: string;

      if (pipeIdx > 0) {
        urlPart = line.slice(0, pipeIdx).trim();
        titlePart = line.slice(pipeIdx + 1).trim();
      } else {
        // Try to split by tab or double-space
        const tabIdx = line.indexOf('\t');
        if (tabIdx > 0) {
          urlPart = line.slice(0, tabIdx).trim();
          titlePart = line.slice(tabIdx + 1).trim();
        } else {
          urlPart = line;
          titlePart = '';
        }
      }

      const videoId = extractYouTubeId(urlPart);
      const isDuplicate = videoId
        ? existingIds.has(videoId) || seenIds.has(videoId)
        : false;

      if (videoId) seenIds.add(videoId);

      return {
        raw: line,
        videoId,
        title: titlePart || (videoId ? `Video ${videoId.slice(0, 6)}` : ''),
        isDuplicate,
      };
    });
  }, [bulkText]);

  const validEntries = parsed.filter(e => e.videoId && !e.isDuplicate);
  const invalidEntries = parsed.filter(e => !e.videoId);
  const duplicateEntries = parsed.filter(e => e.videoId && e.isDuplicate);

  const handleImport = async () => {
    if (validEntries.length === 0) {
      toast.error('No valid entries to import');
      return;
    }

    setImporting(true);
    setProgress(0);

    let imported = 0;
    for (let i = 0; i < validEntries.length; i++) {
      const entry = validEntries[i];
      const videoId = entry.videoId!;

      const result = store.addVideo({
        title: entry.title,
        description: entry.title,
        source_type: 'youtube',
        youtube_url: `https://youtube.com/watch?v=${videoId}`,
        youtube_video_id: videoId,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration_seconds: 0,
        category_id: categoryId,
        language: 'English',
        tags: [],
        age_min: ageMin,
        age_max: ageMax,
        is_featured: false,
        is_approved: true,
        is_hidden: false,
        is_no_music: isNoMusic,
      });

      if (result) imported++;
      setProgress(Math.round(((i + 1) / validEntries.length) * 100));

      // Small delay for visual feedback
      if (i % 10 === 9) {
        await new Promise(r => setTimeout(r, 50));
      }
    }

    setImporting(false);
    toast.success(`Imported ${imported} video(s) to library!`);
    navigate('/parent/library');
  };

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <h3 className="text-sm font-medium text-foreground mb-1">How to use</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste one YouTube URL or video ID per line. Optionally add a title after a <code className="bg-muted px-1 rounded">|</code> separator.<br />
          Example:<br />
          <code className="text-xs text-foreground/70">https://youtube.com/watch?v=abc12345678 | My Video Title</code><br />
          <code className="text-xs text-foreground/70">dQw4w9WgXcQ | Another Video</code>
        </p>
      </div>

      {/* Bulk text area */}
      <div>
        <label className="block text-xs font-medium text-foreground mb-1.5">
          Paste YouTube URLs / IDs (one per line)
        </label>
        <textarea
          value={bulkText}
          onChange={e => setBulkText(e.target.value)}
          className="input-field min-h-[200px] font-mono text-xs"
          placeholder={`https://youtube.com/watch?v=abc12345678 | Video Title\ndQw4w9WgXcQ | Another Video\nhttps://youtu.be/xyz98765432`}
          disabled={importing}
        />
      </div>

      {/* Settings row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="input-field"
            disabled={importing}
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
          <input type="number" min={0} max={12} value={ageMin} onChange={e => setAgeMin(+e.target.value)} className="input-field" disabled={importing} />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Age Max</label>
          <input type="number" min={0} max={12} value={ageMax} onChange={e => setAgeMax(+e.target.value)} className="input-field" disabled={importing} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer self-end pb-2">
          <input type="checkbox" checked={isNoMusic} onChange={e => setIsNoMusic(e.target.checked)} className="w-4 h-4 rounded border-border text-primary" disabled={importing} />
          <span className="text-xs text-foreground">No Music</span>
        </label>
      </div>

      {/* Parse summary */}
      {parsed.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-3.5 h-3.5" /> {validEntries.length} valid
          </span>
          {duplicateEntries.length > 0 && (
            <span className="flex items-center gap-1 text-amber-500">
              <AlertTriangle className="w-3.5 h-3.5" /> {duplicateEntries.length} duplicate
            </span>
          )}
          {invalidEntries.length > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <XCircle className="w-3.5 h-3.5" /> {invalidEntries.length} invalid
            </span>
          )}
        </div>
      )}

      {/* Progress bar during import */}
      {importing && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">Importing... {progress}%</p>
        </div>
      )}

      {/* Import button */}
      <button
        onClick={handleImport}
        disabled={validEntries.length === 0 || importing}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-hero text-primary-foreground font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
      >
        <Upload className="w-4 h-4" />
        {importing ? 'Importing...' : `Import ${validEntries.length} Video(s)`}
      </button>
    </div>
  );
}
