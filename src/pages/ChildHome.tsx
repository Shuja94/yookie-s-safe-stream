import { store } from '@/lib/store';
import yookieAvatar from '@/assets/yookie-avatar.png';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { motion } from 'framer-motion';

export default function ChildHome() {
  const profile = store.profile;
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
        className="px-4 md:px-8 pt-6 pb-4 flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Hello, {profile.name}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">What would you like to watch today?</p>
        </div>
        <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center text-lg">
          🧒
        </div>
      </motion.header>

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

      {/* Favorites */}
      {favorites.length > 0 && (
        <VideoRow title="Yookie's Favorites ❤️" delay={0.2}>
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
          <VideoRow key={cat.id} title={`${cat.icon} ${cat.name}`} delay={0.15 + i * 0.05}>
            {vids.map(v => (
              <VideoCard key={v.id} video={v} category={cat} />
            ))}
          </VideoRow>
        );
      })}

      {/* Recently Added */}
      {approved.length > 0 && (
        <VideoRow title="Recently Added ✨" delay={0.4}>
          {[...approved].reverse().slice(0, 8).map(v => (
            <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
          ))}
        </VideoRow>
      )}

      <div className="h-8" />
    </div>
  );
}
