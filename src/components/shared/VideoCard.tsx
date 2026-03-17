import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';
import { Video, Category } from '@/types';
import { store } from '@/lib/store';
import { useState, useCallback } from 'react';

interface VideoCardProps {
  video: Video;
  category?: Category;
  progress?: number; // 0-1
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
    sm: 'w-[160px] md:w-[200px]',
    md: 'w-[220px] md:w-[280px]',
    lg: 'w-[300px] md:w-[380px]',
  };

  return (
    <motion.div
      className={`flex-shrink-0 ${sizeClasses[size]} cursor-pointer group`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="card-ceramic">
        <div className="relative aspect-video rounded-card-inner overflow-hidden">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-foreground/70 text-primary-foreground text-xs font-medium">
            {formatDuration(video.duration_seconds)}
          </div>
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
          </button>
          {/* Safe badge */}
          {video.is_approved && (
            <div className="absolute top-2 left-2">
              <div className="safe-badge">
                <Shield className="w-3 h-3" />
                Safe
              </div>
            </div>
          )}
          {/* Progress bar */}
          {showProgress && progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
        </div>
        <div className="px-1 pt-2 pb-1">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {category && (
              <span className="text-xs text-muted-foreground">{category.icon} {category.name}</span>
            )}
            <span className="age-badge text-[10px]">{video.age_min}–{video.age_max}y</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
