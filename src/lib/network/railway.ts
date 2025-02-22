'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from 'graphql-request';
import {
  ProjectsQuery,
  ProjectsQueryVariables,
  ServiceQuery,
  DeploymentLogsQuery,
  ServiceInstanceDeployMutation,
  ServiceInstanceDeployMutationVariables,
  DeploymentStopMutation,
  DeploymentStopMutationVariables,
  DeploymentRestartMutation,
  DeploymentRestartMutationVariables,
  ServiceInstanceUpdateMutation,
  ServiceInstanceUpdateMutationVariables,
  ProjectQuery,
} from './gql/graphql';
import {
  GET_PROJECTS,
  GET_SERVICE,
  GET_DEPLOYMENT_LOGS,
  DEPLOY_SERVICE,
  STOP_DEPLOYMENT,
  RESTART_DEPLOYMENT,
  SCALE_SERVICE,
  GET_PROJECT_BY_ID,
} from './operations';

export const GRAPHQL_ENDPOINT = `${window.location.origin}/api/graphql`;

export function useProjects(variables: ProjectsQueryVariables) {
  return useQuery<ProjectsQuery>({
    queryKey: ['projects', variables],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_PROJECTS, variables),
  });
}

export function useProject(id: string) {
  return useQuery<ProjectQuery>({
    queryKey: ['project', id],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_PROJECT_BY_ID, { id }),
    enabled: !!id,
  });
}

export function useService(id: string) {
  return useQuery<ServiceQuery>({
    queryKey: ['service', id],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_SERVICE, { id }),
    enabled: !!id,
  });
}

export function useDeploymentLogs(deploymentId: string) {
  return useQuery<DeploymentLogsQuery>({
    queryKey: ['deployment-logs', deploymentId],
    queryFn: () =>
      request(GRAPHQL_ENDPOINT, GET_DEPLOYMENT_LOGS, {
        deploymentId,
        limit: 100,
      }),
    enabled: !!deploymentId,
    refetchInterval: 5000,
  });
}

export function useDeployService() {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceInstanceDeployMutation,
    Error,
    ServiceInstanceDeployMutationVariables
  >({
    mutationFn: (variables) => request(GRAPHQL_ENDPOINT, DEPLOY_SERVICE, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useStopDeployment() {
  const queryClient = useQueryClient();

  return useMutation<
    DeploymentStopMutation,
    Error,
    DeploymentStopMutationVariables
  >({
    mutationFn: (variables) => request(GRAPHQL_ENDPOINT, STOP_DEPLOYMENT, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useRestartDeployment() {
  const queryClient = useQueryClient();

  return useMutation<
    DeploymentRestartMutation,
    Error,
    DeploymentRestartMutationVariables
  >({
    mutationFn: (variables) => request(GRAPHQL_ENDPOINT, RESTART_DEPLOYMENT, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useScaleService() {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceInstanceUpdateMutation,
    Error,
    ServiceInstanceUpdateMutationVariables
  >({
    mutationFn: (variables) => request(GRAPHQL_ENDPOINT, SCALE_SERVICE, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
 