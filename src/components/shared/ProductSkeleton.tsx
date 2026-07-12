import { cn } from "@/lib/cn";

interface ProductSkeletonProps {
  className?: string;
}

export function ProductSkeleton({ className }: ProductSkeletonProps) {
  return (
    <article className={cn("flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-5 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="h-5 w-20 rounded-full border border-line bg-canvas animate-pulse" />
        <div className="h-5 w-16 rounded-full border border-line bg-canvas animate-pulse" />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <div className="mb-6 aspect-[4/3] rounded-[1.35rem] border border-line/70 bg-canvas animate-pulse" />
        <div className="h-8 w-3/4 rounded-[1.35rem] bg-canvas animate-pulse" />
        <div className="mt-3 h-4 w-full bg-canvas animate-pulse" />
        <div className="mt-2 h-4 w-5/6 bg-canvas animate-pulse" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-6 w-20 rounded-full border border-line bg-canvas animate-pulse" />
        ))}
      </div>
      <div className="mt-6 h-5 w-24 rounded-full bg-canvas animate-pulse" />
    </article>
  );
}