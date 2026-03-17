import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Video } from '@/types';

interface HeroBannerProps {
  videos: Video[];
}

export function HeroBanner({ videos }: HeroBannerProps) {
  const navigate = useNavigate();
  const featured = videos[0];

  if (!featured) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 md:px-8 mb-8"
    >
      <div
        className="relative rounded-card overflow-hidden cursor-pointer group"
        onClick={() => navigate(`/video/${featured.id}`)}
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        <div className="aspect-[21/9] md:aspect-[3/1]">
          <img
            src={featured.thumbnail_url}
            alt={featured.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="safe-badge mb-3">✨ Featured for Yookie</div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
            {featured.title}
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base max-w-xl line-clamp-2 mb-4">
            {featured.description}
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-hero text-primary-foreground font-medium transition-all hover:shadow-lg hover:scale-105">
            <Play className="w-5 h-5 fill-current" />
            Watch Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
