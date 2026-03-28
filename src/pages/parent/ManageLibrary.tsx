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

  const allSelected = filtered.length > 0 && filtered.every(v => selected.has(v.id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      setSelected(new Set(filtered.map(v => v.id)));
    }
  };

  const bulkAction = (action: 'approve' | 'unapprove' | 'hide' | 'show' | 'feature' | 'unfeature' | 'delete') => {
    const ids = Array.from(selected);
    if (action === 'delete') {
      if (!confirm(`Delete ${ids.length} video(s)?`)) return;
      ids.forEach(id => store.deleteVideo(id));
      toast.success(`Deleted ${ids.length} video(s)`);
    } else {
      const updates: Partial<Video> = 
        action === 'approve' ? { is_approved: true } :
        action === 'unapprove' ? { is_approved: false } :
        action === 'hide' ? { is_hidden: true } :
        action === 'show' ? { is_hidden: false } :
        action === 'feature' ? { is_featured: true } :
        { is_featured: false };
      ids.forEach(id => store.updateVideo(id, updates));
      const label = action.charAt(0).toUpperCase() + action.slice(1);
      toast.success(`${label}d ${ids.length} video(s)`);
    }
    clearSelection();
  };

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
              onClick={() => { setFilter(tab.key); clearSelection(); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <span className="text-xs font-medium text-foreground mr-2">{selected.size} selected</span>
            <button onClick={() => bulkAction('approve')} className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Approve
            </button>
            <button onClick={() => bulkAction('unapprove')} className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
              Unapprove
            </button>
            <button onClick={() => bulkAction('hide')} className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
              Hide
            </button>
            <button onClick={() => bulkAction('show')} className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
              Show
            </button>
            <button onClick={() => bulkAction('feature')} className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
              Feature
            </button>
            <button onClick={() => bulkAction('delete')} className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors ml-auto">
              Delete
            </button>
            <button onClick={clearSelection} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors" title="Clear selection">
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3">Video</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3 hidden md:table-cell">Category</th>
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3">Status</th>
                <th className="text-right text-[10px] font-medium text-muted-foreground uppercase tracking-wider p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((video) => {
                const category = store.getCategory(video.category_id);
                const isSelected = selected.has(video.id);
                return (
                  <tr key={video.id} className={`transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-secondary/30'}`}>
                    <td className="p-3 w-10">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(video.id)} />
                    </td>
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
                        <span className="inline-flex items-center gap-1 text-[10px] text-accent-foreground"><Clock className="w-3 h-3" /> Pending</span>
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
                        <button onClick={() => { store.updateVideo(video.id, { is_featured: !video.is_featured }); toast.success(video.is_featured ? 'Unfeatured' : 'Featured'); }} className={`p-1.5 rounded hover:bg-secondary transition-colors ${video.is_featured ? 'text-primary' : 'text-muted-foreground'}`} title="Toggle Featured">
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
