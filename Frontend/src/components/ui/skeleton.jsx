import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("shimmer-bg rounded-sm", className)}
      {...props}
    />
  );
}

export function IncidentRowSkeleton() {
  return (
    <div className="grid grid-cols-12 px-5 py-4 border-b border-zinc-100 items-center">
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="col-span-2 hidden md:block"><Skeleton className="h-5 w-20" /></div>
      <div className="col-span-2 hidden md:block"><Skeleton className="h-5 w-24" /></div>
      <div className="col-span-2 text-right"><Skeleton className="h-3 w-16 ml-auto" /></div>
    </div>
  );
}

export function IncidentDetailSkeleton() {
  return (
    <div className="p-6 space-y-5 max-w-7xl">
      <Skeleton className="h-4 w-24" />
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-10 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 mt-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
