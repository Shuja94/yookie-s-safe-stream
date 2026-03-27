import { store } from '@/lib/store';
import { VideoCard } from '@/components/shared/VideoCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Favorites() {
  const [, setTick] = useState(0);
  const favorites = store.getFavoriteVideos(store.profile.age);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 md:px-12 pt-6 pb-3"
      >
        <h1 className="text-xl md:text-2xl font-extrabold text-foreground">❤️ {store.profile.name}'s Favorites</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Videos you love</p>
      </motion.header>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12 text-primary" />}
          title="No favorites yet"
          description="Tap the heart on any video to add it here!"
        />
      ) : (
        <div className="px-5 md:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {favorites.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <VideoCard video={v} category={store.getCategory(v.category_id)} size="sm" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
