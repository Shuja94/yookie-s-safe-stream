import { store } from '@/lib/store';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AvatarPickerModal, getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { Settings, Plus } from 'lucide-react';
import { ParentLockModal } from '@/components/shared/ParentLockModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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

  const approved = store.getApprovedVideos(age);
  const featured = store.getFeaturedVideos(age);
  const continueWatching = store.getContinueWatching(age);
  const favorites = store.getFavoriteVideos(age);
  const categories = store.categories.filter(c => c.is_active);

  const popular = [...approved].sort(() => 0.5 - Math.random()).slice(0, 12);

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

      {/* Add Video PIN gate */}
      <ParentLockModal
        open={addLockOpen}
        onClose={() => setAddLockOpen(false)}
        onUnlock={() => {
          setAddLockOpen(false);
          if (user) {
            navigate('/parent/add');
          } else {
            navigate('/parent/login');
          }
        }}
      />

      {/* Hero */}
      {featured.length > 0 && <HeroBanner videos={featured} />}

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
          {continueWatching.length > 0 && (
            <VideoRow title="Continue Watching" delay={0.05}>
              {continueWatching.map(wh => (
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

          {approved.length > 0 && (
            <VideoRow title={`Recommended for ${profile.name}`} delay={0.1}>
              {approved.slice(0, 14).map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {popular.length > 0 && (
            <VideoRow title="🔥 Popular" delay={0.14}>
              {popular.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {(() => {
            const noMusic = store.getNoMusicVideos(age);
            return noMusic.length > 0 ? (
              <VideoRow title="🔇 No Music" delay={0.18}>
                {noMusic.slice(0, 12).map(v => (
                  <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
                ))}
              </VideoRow>
            ) : null;
          })()}

          {favorites.length > 0 && (
            <VideoRow title={`❤️ ${profile.name}'s Favorites`} delay={0.2}>
              {favorites.map(v => (
                <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
              ))}
            </VideoRow>
          )}

          {categories.map((cat, i) => {
            const vids = store.getVideosByCategory(cat.id, age);
            if (vids.length === 0) return null;
            return (
              <VideoRow key={cat.id} title={`${cat.icon} ${cat.name}`} delay={0.22 + i * 0.03}>
                {vids.slice(0, 14).map(v => (
                  <VideoCard key={v.id} video={v} category={cat} />
                ))}
              </VideoRow>
            );
          })}

          {approved.length > 0 && (
            <VideoRow title="✨ Recently Added" delay={0.4}>
              {[...approved].reverse().slice(0, 12).map(v => (
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
