import { useParams, useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { Play, Heart, ArrowLeft, Clock, Tag } from 'lucide-react';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';
import { useState } from 'react';

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = store.getVideo(id || '');
  const [isFav, setIsFav] = useState(video ? store.isFavorite(video.id) : false);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Video not found</p>
      </div>
    );
  }

  const category = store.getCategory(video.category_id);
  const recommendations = store.getRecommendations(video.id, store.profile.age);

  const formatDuration = (s: number) => `${Math.floor(s / 60)} min`;

  const handleFavorite = () => {
    store.toggleFavorite(video.id);
    setIsFav(!isFav);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero area */}
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-background/50 backdrop-blur-md text-foreground hover:bg-background/70 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative cursor-pointer group"
          onClick={() => navigate(`/player/${video.id}`)}
        >
          <div className="aspect-video md:aspect-[2.2/1]">
            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-foreground/90 flex items-center justify-center shadow-elevated"
              >
                <Play className="w-7 h-7 md:w-8 md:h-8 text-background fill-current ml-1" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="px-5 md:px-12 mt-5"
      >
        <h1 className="text-xl md:text-3xl font-extrabold text-foreground mb-3 leading-tight">{video.title}</h1>
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {category && (
            <span className="text-xs text-muted-foreground font-medium">{category.icon} {category.name}</span>
          )}
          <span className="age-badge">{video.age_min}–{video.age_max}y</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> {formatDuration(video.duration_seconds)}
          </span>
          {video.is_no_music && <span className="age-badge">🔇 No Music</span>}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">{video.description}</p>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => navigate(`/player/${video.id}`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-bold text-sm hover:bg-foreground/90 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" /> Watch Now
          </button>
          <button
            onClick={handleFavorite}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all active:scale-95 ${
              isFav
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-surface-2 text-foreground border border-border hover:bg-surface-3'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            {isFav ? 'Favorited' : 'Favorite'}
          </button>
        </div>

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {video.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2 text-muted-foreground text-[11px] font-medium">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {recommendations.length > 0 && (
        <VideoRow title="More Like This" delay={0.2}>
          {recommendations.map(v => (
            <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
          ))}
        </VideoRow>
      )}

      <div className="h-8" />
    </div>
  );
}
