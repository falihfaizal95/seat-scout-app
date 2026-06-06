export default function EventCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[var(--bg-1)] overflow-hidden">
      <div className="h-40 shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3.5 w-2/5 shimmer rounded" />
          <div className="h-3.5 w-2/5 shimmer rounded" />
        </div>
        <div className="h-3 w-3/4 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
        <div className="pt-2 border-t border-white/[0.05] flex justify-between">
          <div className="h-3 w-16 shimmer rounded" />
          <div className="h-3 w-20 shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
