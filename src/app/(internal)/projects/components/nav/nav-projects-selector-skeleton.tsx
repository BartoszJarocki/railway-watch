import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const NavProjectsSelectorSkeleton = () => {
  return (
    <div className={cn('flex w-[200px] justify-between gap-2')}>
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="flex-1 h-5" />
    </div>
  );
};
