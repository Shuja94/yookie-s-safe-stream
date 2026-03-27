import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { Film, CheckCircle, Clock, EyeOff, TrendingUp, Plus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAvatarEmoji } from '@/components/child/AvatarPickerModal';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const allVideos = store.videos;
  const approved = allVideos.filter(v => v.is_approved && !v.is_hidden);
  const pending = allVideos.filter(v => !v.is_approved && !v.is_hidden);
  const hidden = allVideos.filter(v => v.is_hidden);
  const history = store.getWatchHistory();

  const stats = [
    { label: 'Approved', value: approved.length, icon: CheckCircle, color: 'text-primary', path: '/parent/library?filter=approved' },
    { label: 'Pending', value: pending.length, icon: Clock, color: 'text-yellow-500', path: '/parent/library?filter=pending' },
    { label: 'Hidden', value: hidden.length, icon: EyeOff, color: 'text-muted-foreground', path: '/parent/library?filter=hidden' },
    { label: 'Watch History', value: history.length, icon: TrendingUp, color: 'text-blue-400', path: '/parent/history' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user?.email?.split('@')[0] || 'Parent'}</p>
        </div>
        <button
          onClick={() => navigate('/parent/add')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-hero text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg p-4 border border-border"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Child profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-lg p-5 border border-border mb-6"
      >
        <h2 className="text-sm font-semibold text-foreground mb-3">Child Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
            {getAvatarEmoji(store.profile.avatar_url || 'lion')}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{store.profile.name}</p>
            <p className="text-xs text-muted-foreground">Age {store.profile.age} • Content {store.profile.default_age_min}–{store.profile.default_age_max}y</p>
          </div>
          <button
            onClick={() => navigate('/parent/settings')}
            className="text-xs text-primary font-medium hover:underline"
          >
            Edit
          </button>
        </div>
      </motion.div>

      {/* Recent watch history */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg border border-border overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recently Watched</h2>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No watch history yet</p>
        ) : (
          <div className="divide-y divide-border">
            {history.slice(0, 5).map(wh => (
              <div key={wh.id} className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors">
                {wh.video && (
                  <>
                    <div className="w-16 aspect-video rounded-md overflow-hidden flex-shrink-0">
                      <img src={wh.video.thumbnail_url} alt={wh.video.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{wh.video.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor(wh.watched_seconds / 60)}m watched • {wh.completed ? '✅ Done' : '⏸ In progress'}
                      </p>
                    </div>
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
