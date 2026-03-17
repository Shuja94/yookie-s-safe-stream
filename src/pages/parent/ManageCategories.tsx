import { store } from '@/lib/store';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageCategories() {
  const [, setTick] = useState(0);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📁');

  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);

  const categories = [...store.categories].sort((a, b) => a.sort_order - b.sort_order);

  const handleAdd = () => {
    if (!newName.trim()) return;
    store.addCategory({
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      icon: newIcon,
      sort_order: categories.length + 1,
      is_active: true,
    });
    setNewName('');
    setNewIcon('📁');
    toast.success('Category added');
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Categories</h1>

      {/* Add new */}
      <div className="card-ceramic-elevated p-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Add Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            className="w-14 px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="📁"
          />
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            placeholder="Category name"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl gradient-hero text-primary-foreground font-medium hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="card-ceramic flex items-center gap-4 p-4"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-grab" />
            <span className="text-xl">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{cat.name}</p>
              <p className="text-xs text-muted-foreground">/{cat.slug}</p>
            </div>
            <button
              onClick={() => {
                store.updateCategory(cat.id, { is_active: !cat.is_active });
                toast.success(cat.is_active ? 'Deactivated' : 'Activated');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                cat.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              {cat.is_active ? 'Active' : 'Inactive'}
            </button>
            <button
              onClick={() => { if (confirm('Delete category?')) { store.deleteCategory(cat.id); toast.success('Deleted'); } }}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
