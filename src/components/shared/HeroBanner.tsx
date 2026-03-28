import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Video } from '@/types';
import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

interface HeroBannerProps {
  videos: Video[];
}

export function HeroBanner({ videos: rawVideos }: HeroBannerProps) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());

  // Filter out videos with broken thumbnails
  const videos = rawVideos.filter(v => v.thumbnail_url && !failedIds.has(v.id));
  const featured = videos[current % Math.max(videos.length, 1)];

  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % videos.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [videos.length]);

  if (!featured) return null;

  const category = store.getCategory(featured.category_id);

  return (
    <div className="relative w-full mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full cursor-pointer"
          onClick={() => navigate(`/video/${featured.id}`)}
        >
          {/* Image */}
          <div className="relative aspect-[16/9] md:aspect-[2.4/1] w-full overflow-hidden">
            <img
              src={featured.thumbnail_url}
              alt={featured.title}
              className="w-full h-full object-cover"
              onError={() => setFailedIds(prev => new Set(prev).add(featured.id))}
            />
            {/* Multi-layer gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 lg:p-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {category && (
                <span className="inline-block text-primary text-[11px] font-bold uppercase tracking-[0.15em] mb-2">
                  {category.icon} {category.name}
                </span>
              )}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-2 max-w-xl leading-[1.1] drop-shadow-lg">
                {featured.title}
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm max-w-md line-clamp-2 mb-4 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/player/${featured.id}`); }}
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-lg bg-foreground text-background font-bold text-sm transition-all hover:bg-foreground/90 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Now
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/video/${featured.id}`); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 md:py-3 rounded-lg bg-muted/60 backdrop-blur-sm text-foreground font-medium text-sm transition-all hover:bg-muted/80 active:scale-95"
                >
                  <Info className="w-4 h-4" />
                  More Info
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      {videos.length > 1 && (
        <div className="absolute bottom-3 right-5 md:right-10 flex items-center gap-1.5">
          {videos.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? 'w-5 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-foreground/25 hover:bg-foreground/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
