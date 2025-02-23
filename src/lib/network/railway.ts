'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from 'graphql-request';
import {
  ProjectsQuery,
  ProjectsQueryVariables,
  DeploymentLogsQuery,
  DeploymentStopMutation,
  DeploymentStopMutationVariables,
  DeploymentRestartMutation,
  DeploymentRestartMutationVariables,
  ServiceInstanceUpdateMutation,
  ServiceInstanceUpdateMutationVariables,
  ProjectQuery,
  ProjectQueryVariables,
  DeploymentLogsQueryVariables,
  GetEnvironmentMetricsQueryVariables,
  GetEnvironmentMetricsQuery,
  ServiceInstanceRedeployMutation,
  ServiceInstanceRedeployMutationVariables,
} from './gql/graphql';
import {
  GET_PROJECTS,
  GET_DEPLOYMENT_LOGS,
  REDEPLOY_SERVICE,
  STOP_DEPLOYMENT,
  RESTART_DEPLOYMENT,
  SCALE_SERVICE,
  GET_PROJECT_BY_ID,
  GET_ENVIRONMENT_METRICS,
} from './operations';
import { toast } from 'sonner';

/**
 * GraphQL endpoint that adapts to the environment
 */
export const GRAPHQL_ENDPOINT =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/graphql`
    : 'http://localhost:3000/api/graphql';

/**
 * Centralized query keys for React Query
 */
export const queryKeys = {
  projects: {
    all: ['projects'],
    list: (variables: ProjectsQueryVariables) => [
      ...queryKeys.projects.all,
      variables,
    ],
    detail: (id: string) => ['project', id],
  },

  deployments: {
    logs: (deploymentId: string) => ['deployment-logs', deploymentId],
  },

  metrics: {
    all: ['metrics'],
    byEnvironment: (variables: GetEnvironmentMetricsQueryVariables) => [
      ...queryKeys.metrics.all,
      variables,
    ],
  },
} as const;

type MutationContext = {
  toastId: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

/**
 * Toast helper for mutations
 */
const mutationToast = {
  loading: (title: string, description?: string) => {
    return toast.loading(title, { description });
  },
  success: (title: string, description?: string, toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    }
    return toast.success(title, { description });
  },
  error: (error: Error, title: string, toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    }
    return toast.error(title, {
      description: error.message,
      action: {
        label: 'Copy',
        onClick: () => {
          try {
            navigator.clipboard.writeText(JSON.stringify(error, null, 2));
            toast('Error message copied to clipboard');
          } catch (error) {
            console.error('Failed to copy error message', error);
          }
        },
      },
    });
  },
};

/**
 * Hook to fetch projects list
 */
export function useProjects(variables: ProjectsQueryVariables) {
  return useQuery<ProjectsQuery>({
    queryKey: queryKeys.projects.list(variables),
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_PROJECTS, variables),
  });
}

/**
 * Hook to fetch single project details
 */
export function useProject(variables: ProjectQueryVariables) {
  return useQuery<ProjectQuery>({
    queryKey: queryKeys.projects.detail(variables.id),
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_PROJECT_BY_ID, variables),
    enabled: !!variables.id,
    refetchInterval: 5000,
  });
}

/**
 * Hook to fetch deployment logs with auto-refresh
 */
export function useDeploymentLogs(
  variables: DeploymentLogsQueryVariables,
  refetchInterval: number = 5000
) {
  return useQuery<DeploymentLogsQuery>({
    queryKey: queryKeys.deployments.logs(variables.deploymentId),
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_DEPLOYMENT_LOGS, variables),
    enabled: !!variables.deploymentId,
    refetchInterval,
  });
}

/**
 * Hook for redeploying a service
 */
export function useRedeployService(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceInstanceRedeployMutation,
    Error,
    ServiceInstanceRedeployMutationVariables,
    MutationContext
  >({
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, REDEPLOY_SERVICE, variables),
    onMutate: (variables) => {
      const toastId = mutationToast.loading(
        'Redeploying service...',
        `Service ID: ${variables.serviceId}`
      );
      return { toastId };
    },
    onError: (error, _, context) => {
      mutationToast.error(
        error,
        'Failed to redeploy service.',
        context?.toastId
      );
    },
    onSuccess: (_, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });

      mutationToast.success(
        'Service redeployment triggered.',
        `Service ID: ${variables.serviceId}`,
        context?.toastId
      );
    },
  });
}

/**
 * Hook for stopping a deployment
 */
export function useStopDeployment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    DeploymentStopMutation,
    Error,
    DeploymentStopMutationVariables,
    MutationContext
  >({
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, STOP_DEPLOYMENT, variables),
    onMutate: (variables) => {
      const toastId = mutationToast.loading(
        'Stopping deployment...',
        `Deployment ID: ${variables.id}`
      );
      return { toastId };
    },
    onError: (error, _, context) => {
      mutationToast.error(
        error,
        'Failed to stop deployment.',
        context?.toastId
      );
    },
    onSuccess: (_, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });

      mutationToast.success(
        'Deployment stopped.',
        `Deployment ID: ${variables.id}`,
        context?.toastId
      );
    },
  });
}

/**
 * Hook for restarting a deployment
 */
export function useRestartDeployment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    DeploymentRestartMutation,
    Error,
    DeploymentRestartMutationVariables,
    MutationContext
  >({
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, RESTART_DEPLOYMENT, variables),
    onMutate: (variables) => {
      const toastId = mutationToast.loading(
        'Restarting deployment...',
        `Deployment ID: ${variables.id}`
      );
      return { toastId };
    },
    onError: (error, _, context) => {
      mutationToast.error(
        error,
        'Failed to restart deployment.',
        context?.toastId
      );
    },
    onSuccess: (_, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });

      mutationToast.success(
        'Deployment restarted.',
        `Deployment ID: ${variables.id}`,
        context?.toastId
      );
    },
  });
}

/**
 * Hook for updating service configuration
 */
export function useUpdateService(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceInstanceUpdateMutation,
    Error,
    ServiceInstanceUpdateMutationVariables,
    MutationContext
  >({
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, SCALE_SERVICE, variables),
    onMutate: (variables) => {
      const toastId = mutationToast.loading(
        'Updating service...',
        `Target replicas: ${variables.input.numReplicas}`
      );
      return { toastId };
    },
    onError: (error, _, context) => {
      mutationToast.error(error, 'Failed to scale service.', context?.toastId);
    },
    onSuccess: (_, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });

      mutationToast.success(
        'Service updated successfully.',
        `Current instance count: ${variables.input.numReplicas}`,
        context?.toastId
      );
    },
  });
}

/**
 * Hook for fetching environment metrics with auto-refresh
 */
export function useMetrics(
  variables: GetEnvironmentMetricsQueryVariables,
  refetchInterval: number = 5 * 60000 // 5 min
) {
  return useQuery<GetEnvironmentMetricsQuery>({
    queryKey: queryKeys.metrics.byEnvironment(variables),
    queryFn: () =>
      request(GRAPHQL_ENDPOINT, GET_ENVIRONMENT_METRICS, variables),
    refetchInterval,
  });
}
