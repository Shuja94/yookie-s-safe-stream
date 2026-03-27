import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Video } from '@/types';
import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

interface HeroBannerProps {
  videos: Video[];
}

export function HeroBanner({ videos }: HeroBannerProps) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const featured = videos[current];

  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % videos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [videos.length]);

  if (!featured) return null;

  return (
    <div className="px-4 md:px-8 mb-8 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[var(--card-radius)] overflow-hidden cursor-pointer group"
          onClick={() => navigate(`/video/${featured.id}`)}
          style={{ boxShadow: 'var(--shadow-elevated)' }}
        >
          <div className="aspect-[16/9] md:aspect-[21/9]">
            <img
              src={featured.thumbnail_url}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <div className="safe-badge mb-2">✨ Featured for {store.profile.name}</div>
            <h1 className="text-xl md:text-3xl font-bold text-white mb-1.5 drop-shadow-lg line-clamp-2">
              {featured.title}
            </h1>
            <p className="text-white/70 text-xs md:text-sm max-w-xl line-clamp-2 mb-3">
              {featured.description}
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-hero text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95">
              <Play className="w-4 h-4 fill-current" />
              Watch Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      {videos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {videos.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
