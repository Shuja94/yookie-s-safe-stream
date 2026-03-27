import { useState } from 'react';
import { store } from '@/lib/store';
import { VideoCard } from '@/components/shared/VideoCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CategoryBrowse() {
  const navigate = useNavigate();
  const categories = store.categories.filter(c => c.is_active);
  const age = store.profile.age;
  const [noMusicOnly, setNoMusicOnly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-8 pt-6 pb-4"
      >
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Explore 🔍</h1>
        <p className="text-sm text-muted-foreground">Browse by category</p>
      </motion.header>

      {/* Filter chips */}
      <div className="px-4 md:px-8 flex flex-wrap gap-2 mb-6">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setNoMusicOnly(!noMusicOnly)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors border ${
            noMusicOnly
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border text-foreground hover:bg-muted'
          }`}
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <span>🔇</span>
          <span>No Music Only</span>
        </motion.button>
        {categories.map((cat, i) => {
          const count = store.getVideosByCategory(cat.id, age).length;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-xs text-muted-foreground">({count})</span>
            </motion.button>
          );
        })}
      </div>

      {/* All categories with their videos */}
      {categories.map((cat, i) => {
        const allVids = store.getVideosByCategory(cat.id, age);
        const vids = noMusicOnly ? allVids.filter(v => v.is_no_music) : allVids;
        if (vids.length === 0) return null;
        return (
          <motion.section
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-foreground px-4 md:px-8 mb-3">
              {cat.icon} {cat.name}
            </h2>
            <div className="px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vids.map(v => (
                <VideoCard key={v.id} video={v} category={cat} size="sm" />
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
