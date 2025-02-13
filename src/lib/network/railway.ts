// hooks/useRailway.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ProjectsQuery,
  ServiceQuery,
  DeploymentLogsQuery,
  ServiceInstanceDeployMutation,
  DeploymentStopMutation,
  DeploymentRestartMutation,
} from './gql/graphql';

export function useProjects() {
  return useQuery<ProjectsQuery>({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then((res) => res.json()),
  });
}

export function useService(id: string) {
  return useQuery<ServiceQuery>({
    queryKey: ['service', id],
    queryFn: () => fetch(`/api/services/${id}`).then((res) => res.json()),
    enabled: !!id,
  });
}

export function useDeploymentLogs(deploymentId: string) {
  return useQuery<DeploymentLogsQuery>({
    queryKey: ['deployment-logs', deploymentId],
    queryFn: () =>
      fetch(`/api/deployments/${deploymentId}/logs`).then((res) => res.json()),
    enabled: !!deploymentId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useDeployService() {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceInstanceDeployMutation,
    Error,
    { serviceId: string; environmentId: string }
  >({
    mutationFn: ({ serviceId, environmentId }) =>
      fetch(`/api/services/${serviceId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environmentId }),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useStopDeployment() {
  const queryClient = useQueryClient();

  return useMutation<DeploymentStopMutation, Error, string>({
    mutationFn: (deploymentId) =>
      fetch(`/api/deployments/${deploymentId}/stop`, {
        method: 'POST',
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useRestartDeployment() {
  const queryClient = useQueryClient();

  return useMutation<DeploymentRestartMutation, Error, string>({
    mutationFn: (deploymentId) =>
      fetch(`/api/deployments/${deploymentId}/restart`, {
        method: 'POST',
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
