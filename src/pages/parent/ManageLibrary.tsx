import { store } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Eye, EyeOff, Star, Trash2, Edit, CheckCircle, Clock, CheckSquare, Square, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { EditVideoModal } from '@/components/parent/EditVideoModal';
import { Video } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

type FilterKey = 'all' | 'approved' | 'pending' | 'hidden';

export default function ManageLibrary() {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as FilterKey) || 'all';
  const [, setTick] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>(initialFilter);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = () => setSelected(new Set());

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
  }).filter(v => !search || v.title.toLowerCase().includes(search.toLowerCase()));

  const filterTabs = [
    { key: 'all', label: 'All', count: allVideos.length },
    { key: 'approved', label: 'Approved', count: allVideos.filter(v => v.is_approved && !v.is_hidden).length },
    { key: 'pending', label: 'Pending', count: allVideos.filter(v => !v.is_approved && !v.is_hidden).length },
    { key: 'hidden', label: 'Hidden', count: allVideos.filter(v => v.is_hidden).length },
  ] as const;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-xl font-bold text-foreground mb-6">Library</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search..." />
        </div>
        <div className="flex gap-1.5">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3">Video</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3 hidden md:table-cell">Category</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3">Status</th>
                <th className="text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((video) => {
                const category = store.getCategory(video.category_id);
                return (
                  <tr key={video.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 aspect-video rounded overflow-hidden flex-shrink-0 bg-secondary">
                          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-medium text-foreground truncate max-w-[180px]">{video.title}</p>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{category?.icon} {category?.name}</span>
                    </td>
                    <td className="p-3">
                      {video.is_hidden ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><EyeOff className="w-3 h-3" /> Hidden</span>
                      ) : video.is_approved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-primary"><CheckCircle className="w-3 h-3" /> Approved</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-yellow-500"><Clock className="w-3 h-3" /> Pending</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <button onClick={() => setEditingVideo(video)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground transition-colors" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { store.updateVideo(video.id, { is_approved: !video.is_approved }); toast.success(video.is_approved ? 'Unapproved' : 'Approved'); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground transition-colors" title="Toggle Approve">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { store.updateVideo(video.id, { is_featured: !video.is_featured }); toast.success(video.is_featured ? 'Unfeatured' : 'Featured'); }} className={`p-1.5 rounded hover:bg-secondary transition-colors ${video.is_featured ? 'text-yellow-500' : 'text-muted-foreground'}`} title="Toggle Featured">
                          <Star className={`w-3.5 h-3.5 ${video.is_featured ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => { store.updateVideo(video.id, { is_hidden: !video.is_hidden }); toast.success(video.is_hidden ? 'Shown' : 'Hidden'); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground transition-colors" title="Toggle Hidden">
                          {video.is_hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => { if (confirm('Delete?')) { store.deleteVideo(video.id); toast.success('Deleted'); } }} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-xs">No videos found</div>
        )}
      </div>

      {editingVideo && (
        <EditVideoModal video={editingVideo} onClose={() => { setEditingVideo(null); setTick(t => t + 1); }} />
      )}
    </div>
  );
}
