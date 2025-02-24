import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProjectParams {
  defaultProjectId?: string;
  defaultEnvironmentId?: string;
}

export const useProjectParams = ({
  defaultProjectId,
  defaultEnvironmentId,
}: ProjectParams = {}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const projectId = searchParams.get('projectId') || defaultProjectId || null;
  const environmentId =
    searchParams.get('environmentId') || defaultEnvironmentId || null;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let shouldUpdate = false;

    if (defaultProjectId && !params.has('projectId')) {
      params.set('projectId', defaultProjectId);
      shouldUpdate = true;
    }

    if (defaultEnvironmentId && !params.has('environmentId')) {
      params.set('environmentId', defaultEnvironmentId);
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [defaultProjectId, defaultEnvironmentId, pathname, router, searchParams]);

  const setQuery = (
    newParams: Partial<{
      projectId: string | null;
      environmentId: string | null;
    }>
  ) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.projectId !== undefined) {
      if (newParams.projectId === null) {
        params.delete('projectId');
      } else {
        params.set('projectId', newParams.projectId);
      }
    }

    if (newParams.environmentId !== undefined) {
      if (newParams.environmentId === null) {
        params.delete('environmentId');
      } else {
        params.set('environmentId', newParams.environmentId);
      }
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return [{ projectId, environmentId }, setQuery] as const;
};
