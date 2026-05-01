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
export function ChatSidebarSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatWindowSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="h-16 border-b-2 border-black flex items-center px-6 bg-zinc-50 gap-3">
        <Skeleton className="w-10 h-10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-24" />
        </div>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <Skeleton className={`h-16 w-1/3 ${i % 2 === 0 ? "bg-red-50" : "bg-white"}`} />
          </div>
        ))}
      </div>
      <div className="p-4 border-t-2 border-black">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><Skeleton className="h-96 w-full" /></div>
        <div><Skeleton className="h-96 w-full" /></div>
      </div>
    </div>
  );
}
