import { useState, useMemo, useCallback } from 'react';
import { store } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, XCircle, AlertTriangle, List, PlaySquare, Tv } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (YOUTUBE_ID_REGEX.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function extractChannelId(url: string): string | null {
  // /channel/UCxxxx
  let match = url.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  // /@handle
  match = url.match(/youtube\.com\/@([a-zA-Z0-9_.-]+)/);
  if (match) return match[1];
  // /c/name or /user/name
  match = url.match(/youtube\.com\/(?:c|user)\/([a-zA-Z0-9_.-]+)/);
  if (match) return match[1];
  return null;
}

interface ParsedEntry {
  raw: string;
  videoId: string | null;
  title: string;
  isDuplicate: boolean;
}

interface FetchedVideo {
  videoId: string;
  title: string;
  thumbnail: string;
}

type ImportMode = 'paste' | 'playlist' | 'channel';

export function BulkImport() {
  const navigate = useNavigate();
  const categories = store.categories;

  const [mode, setMode] = useState<ImportMode>('paste');
  const [bulkText, setBulkText] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [ageMin, setAgeMin] = useState(2);
  const [ageMax, setAgeMax] = useState(8);
  const [isNoMusic, setIsNoMusic] = useState(false);
  const [importing, setImporting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fetchedVideos, setFetchedVideos] = useState<FetchedVideo[]>([]);

  // Parse paste mode entries
  const parsed = useMemo<ParsedEntry[]>(() => {
    if (mode !== 'paste' || !bulkText.trim()) return [];
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const seenIds = new Set<string>();
    const existingIds = new Set(store.videos.map(v => v.youtube_video_id).filter(Boolean));

    return lines.map(line => {
      const pipeIdx = line.indexOf('|');
      let urlPart: string, titlePart: string;
      if (pipeIdx > 0) {
        urlPart = line.slice(0, pipeIdx).trim();
        titlePart = line.slice(pipeIdx + 1).trim();
      } else {
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
      const isDuplicate = videoId ? existingIds.has(videoId) || seenIds.has(videoId) : false;
      if (videoId) seenIds.add(videoId);
      return { raw: line, videoId, title: titlePart || (videoId ? `Video ${videoId.slice(0, 6)}` : ''), isDuplicate };
    });
  }, [bulkText, mode]);

  const validPasteEntries = parsed.filter(e => e.videoId && !e.isDuplicate);
  const invalidEntries = parsed.filter(e => !e.videoId);
  const duplicateEntries = parsed.filter(e => e.videoId && e.isDuplicate);

  // Fetched videos dedup
  const validFetched = useMemo(() => {
    const existingIds = new Set(store.videos.map(v => v.youtube_video_id).filter(Boolean));
    return fetchedVideos.filter(v => !existingIds.has(v.videoId));
  }, [fetchedVideos]);

  const fetchFromYouTube = useCallback(async () => {
    const url = youtubeUrl.trim();
    if (!url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    let type: 'playlist' | 'channel';
    let id: string | null;

    if (mode === 'playlist') {
      id = extractPlaylistId(url);
      type = 'playlist';
      if (!id) {
        toast.error('Could not find a playlist ID in this URL. Make sure it contains ?list=...');
        return;
      }
    } else {
      id = extractChannelId(url);
      type = 'channel';
      if (!id) {
        toast.error('Could not extract channel from this URL');
        return;
      }
    }

    setFetching(true);
    setFetchedVideos([]);

    try {
      let allVideos: FetchedVideo[] = [];
      let pageToken: string | undefined;
      let pages = 0;
      const maxPages = 4; // up to 200 videos

      do {
        const { data, error } = await supabase.functions.invoke('youtube-fetch', {
          body: { type, id, pageToken },
        });

        if (error) throw new Error(error.message);
        if (!data?.success) throw new Error(data?.error || 'Failed to fetch');

        allVideos = [...allVideos, ...data.videos];
        pageToken = data.nextPageToken;
        pages++;
        setFetchedVideos([...allVideos]);
      } while (pageToken && pages < maxPages);

      toast.success(`Found ${allVideos.length} video(s)`);
    } catch (err: any) {
      console.error('Fetch error:', err);
      toast.error(err.message || 'Failed to fetch videos from YouTube');
    } finally {
      setFetching(false);
    }
  }, [youtubeUrl, mode]);

  const importVideos = async (entries: { videoId: string; title: string }[]) => {
    if (entries.length === 0) {
      toast.error('No valid entries to import');
      return;
    }

    setImporting(true);
    setProgress(0);

    let imported = 0;
    for (let i = 0; i < entries.length; i++) {
      const { videoId, title } = entries[i];
      const result = store.addVideo({
        title,
        description: title,
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
      setProgress(Math.round(((i + 1) / entries.length) * 100));
      if (i % 10 === 9) await new Promise(r => setTimeout(r, 50));
    }

    setImporting(false);
    toast.success(`Imported ${imported} video(s) to library!`);
    navigate('/parent/library');
  };

  const modes = [
    { key: 'paste' as ImportMode, label: 'Paste URLs', icon: List },
    { key: 'playlist' as ImportMode, label: 'Playlist', icon: PlaySquare },
    { key: 'channel' as ImportMode, label: 'Channel', icon: Tv },
  ];

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="flex gap-1.5">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setFetchedVideos([]); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === m.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            <m.icon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Settings row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input-field" disabled={importing}>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
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

      {/* PASTE MODE */}
      {mode === 'paste' && (
        <>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste one YouTube URL or ID per line. Add a title with a <code className="bg-muted px-1 rounded">|</code> separator:<br />
              <code className="text-xs text-foreground/70">https://youtube.com/watch?v=abc12345678 | My Title</code>
            </p>
          </div>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            className="input-field min-h-[180px] font-mono text-xs"
            placeholder={`https://youtube.com/watch?v=abc12345678 | Video Title\ndQw4w9WgXcQ | Another Video`}
            disabled={importing}
          />
          {parsed.length > 0 && (
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-3.5 h-3.5" /> {validPasteEntries.length} valid</span>
              {duplicateEntries.length > 0 && <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="w-3.5 h-3.5" /> {duplicateEntries.length} duplicate</span>}
              {invalidEntries.length > 0 && <span className="flex items-center gap-1 text-destructive"><XCircle className="w-3.5 h-3.5" /> {invalidEntries.length} invalid</span>}
            </div>
          )}
          {importing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">Importing... {progress}%</p>
            </div>
          )}
          <button
            onClick={() => importVideos(validPasteEntries.map(e => ({ videoId: e.videoId!, title: e.title })))}
            disabled={validPasteEntries.length === 0 || importing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-hero text-primary-foreground font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : `Import ${validPasteEntries.length} Video(s)`}
          </button>
        </>
      )}

      {/* PLAYLIST / CHANNEL MODE */}
      {(mode === 'playlist' || mode === 'channel') && (
        <>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mode === 'playlist'
                ? 'Paste a YouTube playlist URL. The app will fetch all videos from it automatically.'
                : 'Paste a YouTube channel URL. The app will fetch the latest videos from it.'}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="input-field flex-1"
              placeholder={
                mode === 'playlist'
                  ? 'https://youtube.com/playlist?list=PLxxxxxx'
                  : 'https://youtube.com/@channelname'
              }
              disabled={fetching || importing}
            />
            <button
              onClick={fetchFromYouTube}
              disabled={!youtubeUrl.trim() || fetching}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              {fetching ? 'Fetching...' : 'Fetch'}
            </button>
          </div>

          {/* Fetched results */}
          {fetchedVideos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">
                  Found {fetchedVideos.length} video(s) • <span className="text-green-600">{validFetched.length} new</span>
                  {fetchedVideos.length - validFetched.length > 0 && (
                    <span className="text-amber-500"> • {fetchedVideos.length - validFetched.length} already in library</span>
                  )}
                </p>
              </div>

              {/* Preview grid */}
              <div className="max-h-[300px] overflow-y-auto rounded-lg border border-border bg-card p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {validFetched.slice(0, 30).map(v => (
                  <div key={v.videoId} className="flex gap-2 items-center p-1.5 rounded bg-secondary/30">
                    <img src={v.thumbnail} alt="" className="w-16 aspect-video rounded object-cover flex-shrink-0" />
                    <p className="text-[11px] text-foreground truncate">{v.title}</p>
                  </div>
                ))}
                {validFetched.length > 30 && (
                  <p className="text-xs text-muted-foreground col-span-full text-center py-2">
                    ...and {validFetched.length - 30} more
                  </p>
                )}
              </div>

              {importing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">Importing... {progress}%</p>
                </div>
              )}

              <button
                onClick={() => importVideos(validFetched.map(v => ({ videoId: v.videoId, title: v.title })))}
                disabled={validFetched.length === 0 || importing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-hero text-primary-foreground font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
              >
                <Upload className="w-4 h-4" />
                {importing ? 'Importing...' : `Import ${validFetched.length} Video(s)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
