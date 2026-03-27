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
    sm: 'w-[140px] md:w-[180px]',
    md: 'w-[200px] md:w-[240px]',
    lg: 'w-[280px] md:w-[320px]',
  };

  return (
    <motion.div
      className={`flex-shrink-0 ${sizeClasses[size]} cursor-pointer group`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-background/80 text-foreground text-[10px] font-medium backdrop-blur-sm">
          {formatDuration(video.duration_seconds)}
        </div>
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-background/90"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-primary text-primary' : 'text-foreground'}`} />
        </button>
        {/* Progress bar */}
        {showProgress && progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-muted/50">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>
      <div className="pt-2 px-0.5">
        <h3 className="text-xs font-medium text-foreground line-clamp-2 leading-snug">{video.title}</h3>
        {category && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{category.name}</p>
        )}
      </div>
    </motion.div>
  );
}
