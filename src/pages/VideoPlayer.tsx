import { useParams, useNavigate } from 'react-router-dom';
import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { VideoCard } from '@/components/shared/VideoCard';
import { VideoRow } from '@/components/shared/VideoRow';

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = store.getVideo(id || '');
  const [isFav, setIsFav] = useState(video ? store.isFavorite(video.id) : false);

  useEffect(() => {
    if (!video) return;
    store.updateWatchProgress(video.id, 30, false);
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Video not found</p>
      </div>
    );
  }

  const recommendations = store.getRecommendations(video.id, store.profile.age, 10);
  const category = store.getCategory(video.category_id);

  const getEmbedUrl = () => {
    if (video.source_type === 'youtube' && video.youtube_video_id) {
      return `https://www.youtube-nocookie.com/embed/${video.youtube_video_id}?rel=0&modestbranding=1&showinfo=0&autoplay=1&controls=1&disablekb=0&fs=1&iv_load_policy=3&playsinline=1`;
    }
    return video.video_url || '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top controls */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-full bg-background/50 backdrop-blur-md text-foreground hover:bg-background/70 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleFavorite}
          className="p-2.5 rounded-full bg-background/50 backdrop-blur-md text-foreground hover:bg-background/70 transition-all"
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-primary text-primary' : ''}`} />
        </button>
      </motion.div>

      {/* Player */}
      <div className="w-full aspect-video md:aspect-[2.2/1] bg-background relative">
        {video.source_type === 'youtube' ? (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        ) : (
          <video src={video.video_url} className="w-full h-full" controls autoPlay />
        )}
      </div>

      {/* Video info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 md:px-12 py-5"
      >
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-1.5">{video.title}</h2>
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="text-xs text-muted-foreground">{category.icon} {category.name}</span>
          )}
          {video.is_no_music && <span className="age-badge text-[10px]">🔇 No Music</span>}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{video.description}</p>
      </motion.div>

      {/* More Like This */}
      {recommendations.length > 0 && (
        <VideoRow title="More Like This" delay={0.1}>
          {recommendations.map(v => (
            <VideoCard key={v.id} video={v} category={store.getCategory(v.category_id)} />
          ))}
        </VideoRow>
      )}

      <div className="h-8" />
    </div>
  );
};

export default VideoPlayer;
