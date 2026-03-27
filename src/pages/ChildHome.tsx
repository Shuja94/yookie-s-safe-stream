import { store } from '@/lib/store';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AvatarPickerModal, getAvatarEmoji } from '@/components/child/AvatarPickerModal';
import { Settings } from 'lucide-react';
import { ParentLockModal } from '@/components/shared/ParentLockModal';
import { useNavigate } from 'react-router-dom';

export default function ChildHome() {
  const profile = store.profile;
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const navigate = useNavigate();
  const age = profile.age;
  const approved = store.getApprovedVideos(age);
  const featured = store.getFeaturedVideos(age);
  const continueWatching = store.getContinueWatching(age);
  const favorites = store.getFavoriteVideos(age);
  const categories = store.categories.filter(c => c.is_active);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 md:px-12 pt-5 pb-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAvatarOpen(true)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-transform"
          >
            {getAvatarEmoji(profile.avatar_url || 'lion')}
          </button>
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground">
              Hi, {profile.name}! 👋
            </h1>
            <p className="text-xs text-muted-foreground">What shall we watch?</p>
          </div>
        </div>
        <button
          onClick={() => setLockOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Parent settings"
        >
          <Settings className="w-5 h-5" />
        </button>
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
        onUnlock={() => { setLockOpen(false); navigate('/parent/login'); }}
      />

      {/* Hero */}
      {featured.length > 0 && <HeroBanner videos={featured} />}

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <VideoRow title="Continue Watching" delay={0.1}>
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

      {/* Recommended */}
      {approved.length > 0 && (
        <VideoRow title={`Recommended for ${profile.name}`} delay={0.12}>
          {approved.slice(0, 12).map(v => (
            <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
          ))}
        </VideoRow>
      )}

      {/* No Music */}
      {(() => {
        const noMusic = store.getNoMusicVideos(age);
        return noMusic.length > 0 ? (
          <VideoRow title="No Music" delay={0.15}>
            {noMusic.slice(0, 12).map(v => (
              <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
            ))}
          </VideoRow>
        ) : null;
      })()}

      {/* Favorites */}
      {favorites.length > 0 && (
        <VideoRow title={`${profile.name}'s Favorites`} delay={0.18}>
          {favorites.map(v => (
            <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
          ))}
        </VideoRow>
      )}

      {/* Category rows */}
      {categories.map((cat, i) => {
        const vids = store.getVideosByCategory(cat.id, age);
        if (vids.length === 0) return null;
        return (
          <VideoRow key={cat.id} title={`${cat.icon} ${cat.name}`} delay={0.2 + i * 0.03}>
            {vids.slice(0, 12).map(v => (
              <VideoCard key={v.id} video={v} category={cat} />
            ))}
          </VideoRow>
        );
      })}

      {/* Recently Added */}
      {approved.length > 0 && (
        <VideoRow title="Recently Added" delay={0.35}>
          {[...approved].reverse().slice(0, 10).map(v => (
            <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
          ))}
        </VideoRow>
      )}

      <div className="h-24" />
    </div>
  );
}
