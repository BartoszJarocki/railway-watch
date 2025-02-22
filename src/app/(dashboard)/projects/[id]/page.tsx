'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/lib/network/railway';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProjectDashboard } from './components/project-dashboard';

type PageParams = Record<'id', string>;

export default function ProjectPage() {
  const { id } = useParams<PageParams>();
  const { data, isLoading, error } = useProject({ id });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-4">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading project: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="container mx-auto p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No project found with ID: {id}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <ProjectDashboard project={data.project} />
    </div>
  );
}
