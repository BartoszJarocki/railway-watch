'use client';

import { useSearchParams } from 'next/navigation';
import { useProject } from '@/lib/network/railway';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProjectDashboard } from './components/project-dashboard';

export default function ProjectPage() {
  const params = useSearchParams();
  const projectId = params.get('projectId')!;
  const { data, isLoading, error } = useProject({ id: projectId });

  if (isLoading || !projectId) {
    return (
      <div className="space-y-4">
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading project: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.project) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No project found with ID: {projectId}
        </AlertDescription>
      </Alert>
    );
  }

  return <ProjectDashboard project={data.project} />;
}
