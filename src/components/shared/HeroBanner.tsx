import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
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
    <div className="relative mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative cursor-pointer group"
          onClick={() => navigate(`/video/${featured.id}`)}
        >
          <div className="aspect-[16/9] md:aspect-[21/9] w-full">
            <img
              src={featured.thumbnail_url}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              ✦ Featured for {store.profile.name}
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 max-w-2xl leading-tight">
              {featured.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl line-clamp-2 mb-5">
              {featured.description}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-hero text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 right-6 md:right-12 flex gap-1.5">
          {videos.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`h-1 rounded-full transition-all ${
                i === current ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
