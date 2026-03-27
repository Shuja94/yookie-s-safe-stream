export function LoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden px-5 md:px-12">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[220px] md:w-[260px]">
          <div className="aspect-video rounded-lg skeleton-shimmer" />
          <div className="pt-2.5 space-y-2">
            <div className="h-3.5 rounded skeleton-shimmer w-4/5" />
            <div className="h-3 rounded skeleton-shimmer w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
