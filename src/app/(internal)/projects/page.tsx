'use client';

import { useSearchParams } from 'next/navigation';
import { useProject } from '@/lib/network/railway';
import ProjectDashboard from './components/project/project-dashboard';
import { ProjectLoadingSkeleton } from './components/project/project-loading-skeleton';
import { ErrorScreen } from '../../../components/error-screen';
import { ProjectNotFound } from './components/project/project-not-found';

export default function ProjectPage() {
  const params = useSearchParams();
  const projectId = params.get('projectId');
  const { data, isLoading, error } = useProject({ id: projectId ?? '' });

  if (isLoading || !projectId) {
    return <ProjectLoadingSkeleton />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!data?.project) {
    return <ProjectNotFound projectId={projectId} />;
  }

  return <ProjectDashboard project={data.project} />;
}
