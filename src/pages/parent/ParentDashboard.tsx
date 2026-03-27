import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { Film, CheckCircle, Clock, EyeOff, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const allVideos = store.videos;
  const approved = allVideos.filter(v => v.is_approved && !v.is_hidden);
  const pending = allVideos.filter(v => !v.is_approved && !v.is_hidden);
  const hidden = allVideos.filter(v => v.is_hidden);
  const history = store.getWatchHistory();

  const stats = [
    { label: 'Approved Videos', value: approved.length, icon: CheckCircle, color: 'bg-primary/10 text-primary' },
    { label: 'Pending Review', value: pending.length, icon: Clock, color: 'bg-accent/10 text-accent' },
    { label: 'Hidden', value: hidden.length, icon: EyeOff, color: 'bg-muted text-muted-foreground' },
    { label: 'Watch Events', value: history.length, icon: TrendingUp, color: 'bg-secondary text-secondary-foreground' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your child's video library</p>
        </div>
        <button
          onClick={() => navigate('/parent/add')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-ceramic-elevated p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent watch history */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-ceramic-elevated p-5"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Recently Watched</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No watch history yet</p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map(wh => (
              <div key={wh.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                {wh.video && (
                  <>
                    <div className="w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <img src={wh.video.thumbnail_url} alt={wh.video.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{wh.video.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(wh.watched_seconds / 60)} min watched • {wh.completed ? '✅ Completed' : '⏸ In progress'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(wh.last_watched_at).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
