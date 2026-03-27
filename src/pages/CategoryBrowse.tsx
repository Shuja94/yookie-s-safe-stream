import { useState } from 'react';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';
import { motion } from 'framer-motion';

export default function CategoryBrowse() {
  const categories = store.categories.filter(c => c.is_active);
  const age = store.profile.age;
  const [noMusicOnly, setNoMusicOnly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 md:px-12 pt-6 pb-4"
      >
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Explore</h1>
        <p className="text-sm text-muted-foreground">Browse by category</p>
      </motion.header>

      {/* Filter chips */}
      <div className="px-5 md:px-12 flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setNoMusicOnly(!noMusicOnly)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            noMusicOnly
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          🔇 No Music Only
        </button>
      </div>

      {/* Category rows */}
      {categories.map((cat, i) => {
        const allVids = store.getVideosByCategory(cat.id, age);
        const vids = noMusicOnly ? allVids.filter(v => v.is_no_music) : allVids;
        if (vids.length === 0) return null;
        return (
          <VideoRow key={cat.id} title={`${cat.icon} ${cat.name}`} delay={0.05 + i * 0.03}>
            {vids.map(v => (
              <VideoCard key={v.id} video={v} category={cat} />
            ))}
          </VideoRow>
        );
      })}
    </div>
  );
}
