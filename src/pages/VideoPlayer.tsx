import { useParams, useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, SkipForward } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = store.getVideo(id || '');
  const [isFav, setIsFav] = useState(video ? store.isFavorite(video.id) : false);

  // Track progress
  useEffect(() => {
    if (!video) return;
    // Simulate watch progress tracking
    const interval = setInterval(() => {
      store.updateWatchProgress(video.id, 60, false);
    }, 30000);
    return () => clearInterval(interval);
  }, [video]);

  const handleFavorite = useCallback(() => {
    if (!video) return;
    store.toggleFavorite(video.id);
    setIsFav(!isFav);
  }, [video, isFav]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-foreground">
        <p className="text-primary-foreground">Video not found</p>
      </div>
    );
  }

  const recommendations = store.getRecommendations(video.id, store.profile.age, 4);
  const nextVideo = recommendations[0];

  const getEmbedUrl = () => {
    if (video.source_type === 'youtube' && video.youtube_video_id) {
      return `https://www.youtube-nocookie.com/embed/${video.youtube_video_id}?rel=0&modestbranding=1&showinfo=0&autoplay=1&controls=1`;
    }
    return video.video_url || '';
  };

  return (
    <div className="min-h-screen bg-foreground">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4"
      >
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-foreground/50 text-primary-foreground backdrop-blur-sm hover:bg-foreground/70 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button onClick={handleFavorite} className="p-2 rounded-lg bg-foreground/50 text-primary-foreground backdrop-blur-sm hover:bg-foreground/70 transition-colors">
            <Heart className={`w-5 h-5 ${isFav ? 'fill-accent text-accent' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Player */}
      <div className="w-full aspect-video md:h-[70vh] bg-foreground">
        {video.source_type === 'youtube' ? (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <video
            src={video.video_url}
            className="w-full h-full"
            controls
            autoPlay
          />
        )}
      </div>

      {/* Info below player */}
      <div className="bg-background p-4 md:p-8">
        <h2 className="text-xl font-bold text-foreground mb-1">{video.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{video.description}</p>

        {/* Next up */}
        {nextVideo && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Up Next</h3>
            <button
              onClick={() => navigate(`/player/${nextVideo.id}`)}
              className="flex items-center gap-4 p-3 rounded-card bg-card hover:bg-muted transition-colors w-full text-left"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <div className="w-32 aspect-video rounded-card-inner overflow-hidden flex-shrink-0">
                <img src={nextVideo.thumbnail_url} alt={nextVideo.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2">{nextVideo.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{store.getCategory(nextVideo.category_id)?.name}</p>
              </div>
              <SkipForward className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
