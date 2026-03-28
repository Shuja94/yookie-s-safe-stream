import { store } from '@/lib/store';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { AvatarPickerModal, getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { Settings, Plus } from 'lucide-react';
import { ParentLockModal } from '@/components/shared/ParentLockModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Video } from '@/types';

/** Fisher-Yates shuffle (non-mutating) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Spread thumbnails so consecutive cards look visually different */
function spreadBySeries(videos: Video[]): Video[] {
  // Group by series prefix (first word of title or category)
  const groups = new Map<string, Video[]>();
  for (const v of videos) {
    const key = v.title.split(/[\s–-]/)[0].toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  const result: Video[] = [];
  const queues = Array.from(groups.values()).sort((a, b) => b.length - a.length);
  while (queues.some(q => q.length > 0)) {
    for (const q of queues) {
      const item = q.shift();
      if (item) result.push(item);
    }
  }
  return result;
}

export default function ChildHome() {
  const profile = store.profile;
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [addLockOpen, setAddLockOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const age = profile.age;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Build all rows with deduplication
  const rows = useMemo(() => {
    const approved = store.getApprovedVideos(age);
    const featured = store.getFeaturedVideos(age);
    const continueWatching = store.getContinueWatching(age);
    const favorites = store.getFavoriteVideos(age);
    const categories = store.categories.filter(c => c.is_active);
    const noMusic = store.getNoMusicVideos(age);

    // Track which video IDs have been shown
    const shown = new Set<string>();
    const markShown = (vids: Video[]) => vids.forEach(v => shown.add(v.id));

    // Featured (hero) — mark but always show
    markShown(featured);

    // Continue Watching — always show, mark as shown
    const cwVideos = continueWatching.map(wh => wh.video);
    markShown(cwVideos);

    // Recommended — pick unseen videos, shuffled
    const recommendedPool = approved.filter(v => !shown.has(v.id));
    const recommended = spreadBySeries(shuffle(recommendedPool)).slice(0, 14);
    markShown(recommended);

    // Popular — pick from unseen, shuffled
    const popularPool = approved.filter(v => !shown.has(v.id));
    const popular = spreadBySeries(shuffle(popularPool)).slice(0, 12);
    markShown(popular);

    // No Music — pick unseen no-music videos
    const noMusicFiltered = noMusic.filter(v => !shown.has(v.id));
    const noMusicRow = spreadBySeries(shuffle(noMusicFiltered)).slice(0, 12);
    markShown(noMusicRow);

    // Favorites — always show even if seen
    // (don't mark, they're user-selected)

    // Category rows — for each category, show up to 14 unseen videos
    // If a category has <4 unseen, allow already-shown ones to fill
    const categoryRows = categories.map(cat => {
      const allCatVids = store.getVideosByCategory(cat.id, age);
      const unseen = allCatVids.filter(v => !shown.has(v.id));
      let vids: Video[];
      if (unseen.length >= 4) {
        vids = spreadBySeries(shuffle(unseen)).slice(0, 14);
      } else {
        // Pad with already-shown ones but prioritize unseen
        const seen = allCatVids.filter(v => shown.has(v.id));
        vids = spreadBySeries([...shuffle(unseen), ...shuffle(seen)]).slice(0, 14);
      }
      markShown(vids);
      return { cat, vids };
    }).filter(r => r.vids.length > 0);

    // Recently Added — newest unseen
    const recentPool = approved.filter(v => !shown.has(v.id));
    const recent = [...recentPool]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 12);

    return { featured, continueWatching, recommended, popular, noMusicRow, favorites, categoryRows, recent };
  }, [age]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 px-5 md:px-12 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, hsl(228 12% 7%) 60%, transparent)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => { store.clearActiveProfile(); navigate('/profile'); }}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-lg hover:scale-110 active:scale-90 transition-transform ring-2 ring-primary/20"
          >
            {getAvatarEmoji(profile.avatar_url || 'lion')}
          </button>
          <div>
            <h1 className="text-sm md:text-base font-bold text-foreground leading-tight">
              Hi, {profile.name} 👋
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight">What shall we watch?</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAddLockOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            aria-label="Add Video"
          >
            <Plus className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setLockOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            aria-label="Parent settings"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>
      </motion.header>

      <AvatarPickerModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        currentAvatar={profile.avatar_url || 'lion'}
        onSelect={(id) => store.setAvatar(id)}
      />

      <ParentLockModal
        open={lockOpen}
        onClose={() => setLockOpen(false)}
        onUnlock={() => { setLockOpen(false); navigate(user ? '/parent/dashboard' : '/parent/login'); }}
      />

      <ParentLockModal
        open={addLockOpen}
        onClose={() => setAddLockOpen(false)}
        onUnlock={() => {
          setAddLockOpen(false);
          navigate(user ? '/parent/add' : '/parent/login');
        }}
      />

      {/* Hero */}
      {rows.featured.length > 0 && <HeroBanner videos={rows.featured} />}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-8 mt-4">
          <div>
            <div className="h-4 w-40 skeleton-shimmer rounded ml-5 md:ml-12 mb-3" />
            <LoadingSkeleton />
          </div>
          <div>
            <div className="h-4 w-32 skeleton-shimmer rounded ml-5 md:ml-12 mb-3" />
            <LoadingSkeleton />
          </div>
        </div>
      ) : (
        <>
          {rows.continueWatching.length > 0 && (
            <VideoRow title="Continue Watching" delay={0.05}>
              {rows.continueWatching.map(wh => (
                <VideoCard
                  key={wh.id}
                  video={wh.video}
                  category={store.getCategory(wh.video.category_id)}
                  progress={wh.video.duration_seconds > 0 ? wh.watched_seconds / wh.video.duration_seconds : 0}
                  showProgress
                />
              ))}
            </VideoRow>
          )}

          {rows.recommended.length > 0 && (
            <VideoRow title={`Recommended for ${profile.name}`} delay={0.1}>
              {rows.recommended.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {rows.popular.length > 0 && (
            <VideoRow title="🔥 Popular" delay={0.14}>
              {rows.popular.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {rows.noMusicRow.length > 0 && (
            <VideoRow title="🔇 No Music" delay={0.18}>
              {rows.noMusicRow.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {rows.favorites.length > 0 && (
            <VideoRow title={`❤️ ${profile.name}'s Favorites`} delay={0.2}>
              {rows.favorites.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {rows.categoryRows.map(({ cat, vids }, i) => (
            <VideoRow key={cat.id} title={`${cat.icon} ${cat.name}`} delay={0.22 + i * 0.03}>
              {vids.map(v => (
                <VideoCard key={v.id} video={v} category={cat} />
              ))}
            </VideoRow>
          ))}

          {rows.recent.length > 0 && (
            <VideoRow title="✨ Recently Added" delay={0.4}>
              {rows.recent.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}
        </>
      )}

      <div className="h-24" />
    </div>
  );
}
