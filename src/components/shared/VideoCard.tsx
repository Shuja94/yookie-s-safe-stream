import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Video, Category } from '@/types';
import { store } from '@/lib/store';
import { useState, useCallback } from 'react';

interface VideoCardProps {
  video: Video;
  category?: Category;
  progress?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VideoCard({ video, category, progress, showProgress, size = 'md' }: VideoCardProps) {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(store.isFavorite(video.id));

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleFavorite(video.id);
    setIsFav(!isFav);
  }, [video.id, isFav]);

  const sizeClasses = {
    sm: 'w-[150px] md:w-[190px]',
    md: 'w-[220px] md:w-[260px]',
    lg: 'w-[300px] md:w-[340px]',
  };

  return (
    <motion.div
      className={`flex-shrink-0 ${sizeClasses[size]} cursor-pointer group`}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-2 shadow-card">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Duration pill */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-sm bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-semibold tabular-nums">
          {formatDuration(video.duration_seconds)}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background/70"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-primary text-primary' : 'text-foreground/80'}`} />
        </button>

        {/* Play indicator on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-foreground/90 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-background ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-muted/30">
            <div className="h-full bg-primary transition-all rounded-r-full" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
          </div>
        )}
      </div>

      {/* Title & meta */}
      <div className="pt-2.5 px-0.5">
        <h3 className="text-[13px] font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
          {video.title}
        </h3>
        {category && (
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
