import { store } from '@/lib/store';
import { motion } from 'framer-motion';

export default function WatchHistoryPage() {
  const history = store.getWatchHistory();

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Watch History</h1>

      {history.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No watch history yet</div>
      ) : (
        <div className="card-ceramic-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Video</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">Duration Watched</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4 hidden md:table-cell">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">Last Watched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((wh, i) => (
                <motion.tr
                  key={wh.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {wh.video && (
                        <>
                          <div className="w-16 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                            <img src={wh.video.thumbnail_url} alt={wh.video.title} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{wh.video.title}</p>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{Math.floor(wh.watched_seconds / 60)} min</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs font-medium ${wh.completed ? 'text-primary' : 'text-accent'}`}>
                      {wh.completed ? '✅ Completed' : '⏸ In progress'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{new Date(wh.last_watched_at).toLocaleString()}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
