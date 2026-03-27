import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, Star, Trash2, Edit, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { EditVideoModal } from '@/components/parent/EditVideoModal';
import { Video } from '@/types';

export default function ManageLibrary() {
  const [, setTick] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'hidden'>('all');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);

  const allVideos = store.videos;
  const filtered = allVideos.filter(v => {
    if (filter === 'approved') return v.is_approved && !v.is_hidden;
    if (filter === 'pending') return !v.is_approved && !v.is_hidden;
    if (filter === 'hidden') return v.is_hidden;
    return true;
  }).filter(v => {
    if (!search) return true;
    return v.title.toLowerCase().includes(search.toLowerCase());
  });

  const filterTabs = [
    { key: 'all', label: 'All', count: allVideos.length },
    { key: 'approved', label: 'Approved', count: allVideos.filter(v => v.is_approved && !v.is_hidden).length },
    { key: 'pending', label: 'Pending', count: allVideos.filter(v => !v.is_approved && !v.is_hidden).length },
    { key: 'hidden', label: 'Hidden', count: allVideos.filter(v => v.is_hidden).length },
  ] as const;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Library</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
            placeholder="Search library..."
          />
        </div>
        <div className="flex gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-ceramic-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Video</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">Age</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((video, i) => {
                const category = store.getCategory(video.category_id);
                return (
                  <motion.tr
                    key={video.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{video.title}</p>
                          <p className="text-xs text-muted-foreground">{video.source_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{category?.icon} {category?.name}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="age-badge">{video.age_min}–{video.age_max}y</span>
                    </td>
                    <td className="p-4">
                      {video.is_hidden ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><EyeOff className="w-3 h-3" /> Hidden</span>
                      ) : video.is_approved ? (
                        <span className="inline-flex items-center gap-1 text-xs text-primary"><CheckCircle className="w-3 h-3" /> Approved</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-accent"><Clock className="w-3 h-3" /> Pending</span>
                      )}
                    </td>
                     <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingVideo(video)}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { store.updateVideo(video.id, { is_approved: !video.is_approved }); toast.success(video.is_approved ? 'Unapproved' : 'Approved'); }}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title={video.is_approved ? 'Unapprove' : 'Approve'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { store.updateVideo(video.id, { is_featured: !video.is_featured }); toast.success(video.is_featured ? 'Unfeatured' : 'Featured'); }}
                          className={`p-2 rounded-lg hover:bg-muted transition-colors ${video.is_featured ? 'text-accent' : 'text-muted-foreground'}`}
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${video.is_featured ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => { store.updateVideo(video.id, { is_hidden: !video.is_hidden }); toast.success(video.is_hidden ? 'Shown' : 'Hidden'); }}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Toggle Hidden"
                        >
                          {video.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this video?')) { store.deleteVideo(video.id); toast.success('Deleted'); } }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No videos found</div>
        )}
      </div>
    </div>
  );
}
