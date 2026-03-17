export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden px-4 md:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[220px] md:w-[280px]">
          <div className="card-ceramic">
            <div className="aspect-video rounded-card-inner skeleton-shimmer" />
            <div className="px-1 pt-3 pb-1 space-y-2">
              <div className="h-4 rounded skeleton-shimmer w-3/4" />
              <div className="h-3 rounded skeleton-shimmer w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
