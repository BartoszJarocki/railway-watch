'use client';

import * as React from 'react';
import { AlertCircleIcon } from 'lucide-react';

import { NavProjects } from '@/components/nav-projects';
import { NavResources } from '@/components/nav-resources';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useProjects } from '@/lib/network/railway';
import { LogoDark } from './brand/logo-dark';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonItemProps {
  className?: string;
}

const SkeletonItem = ({ className }: SkeletonItemProps) => (
  <div className={cn('flex items-center gap-2', className)}>
    <Skeleton className="size-6 rounded-full shrink-0" />
    <Skeleton className="h-6 w-full" />
  </div>
);

interface ProjectSkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

const ProjectsSkeleton = ({
  count = 3,
  className,
  itemClassName,
}: ProjectSkeletonProps) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        <div className={cn('px-2 space-y-2', className)}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonItem
              key={`project-skeleton-${index}`}
              className={itemClassName}
            />
          ))}
        </div>
      </SidebarMenu>
    </SidebarGroup>
  );
};

const ErrorMessage = ({ message }: { message: string }) => (
  <Alert className="m-3 text-red-600 border-red-600">
    <AlertCircleIcon className="size-3" />
    <AlertTitle>Ugh!</AlertTitle>
    <AlertDescription>
      <Collapsible>
        <CollapsibleTrigger className="text-start text-red-600">
          An error occurred while fetching projects!
        </CollapsibleTrigger>
        <CollapsibleContent className="text-start text-red-600">
          {message}
        </CollapsibleContent>
      </Collapsible>
    </AlertDescription>
  </Alert>
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading, error } = useProjects({ first: 10 });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <LogoDark className="size-6" />
        Railway Monitor
      </SidebarHeader>
      <SidebarContent>
        {error && <ErrorMessage message={error.message} />}
        {isLoading && <ProjectsSkeleton />}
        {data && <NavProjects query={data} />}
      </SidebarContent>
      <SidebarFooter>
        <NavResources />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
