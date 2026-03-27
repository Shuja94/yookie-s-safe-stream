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
      {/* Hero thumbnail */}
      <div className="relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-background/60 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative cursor-pointer group"
          onClick={() => navigate(`/player/${video.id}`)}
        >
          <div className="aspect-video md:aspect-[21/9]">
            <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-primary-foreground fill-current ml-0.5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 md:px-12 mt-6"
      >
        <h1 className="text-xl md:text-3xl font-bold text-foreground mb-3">{video.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {category && <span className="text-sm text-muted-foreground">{category.icon} {category.name}</span>}
          <span className="age-badge">{video.age_min}–{video.age_max}y</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" /> {formatDuration(video.duration_seconds)}
          </span>
          {video.is_no_music && <span className="age-badge">🔇 No Music</span>}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mb-6">{video.description}</p>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => navigate(`/player/${video.id}`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-hero text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" /> Watch Now
          </button>
          <button
            onClick={handleFavorite}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border font-medium transition-all active:scale-95 ${
              isFav ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            {isFav ? 'Favorited' : 'Favorite'}
          </button>
        </div>

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {video.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                <Tag className="w-3 h-3" /> {tag}
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
