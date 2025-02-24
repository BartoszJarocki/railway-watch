import { Skeleton } from '@/components/ui/skeleton';

export const ProjectLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-[300px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
      <Skeleton className="h-[400px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    </div>
  );
};
