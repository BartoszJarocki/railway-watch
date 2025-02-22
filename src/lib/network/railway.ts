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
  ProjectQueryVariables,
  ServiceQueryVariables,
  DeploymentLogsQueryVariables,
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

export const GRAPHQL_ENDPOINT =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/graphql`
    : 'http://localhost:3000/api/graphql';

export function useProjects(variables: ProjectsQueryVariables) {
  return useQuery<ProjectsQuery>({
    queryKey: ['projects', variables],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_PROJECTS, variables),
  });
}

export function useProject(variables: ProjectQueryVariables) {
  return useQuery<ProjectQuery>({
    queryKey: ['project', variables.id],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_PROJECT_BY_ID, variables),
    enabled: !!variables.id,
  });
}

export function useService(variables: ServiceQueryVariables) {
  return useQuery<ServiceQuery>({
    queryKey: ['service', variables.id],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_SERVICE, variables),
    enabled: !!variables.id,
  });
}

export function useDeploymentLogs(
  variables: DeploymentLogsQueryVariables,
  refetchInterval: number = 5000
) {
  return useQuery<DeploymentLogsQuery>({
    queryKey: ['deployment-logs', variables.deploymentId],
    queryFn: () => request(GRAPHQL_ENDPOINT, GET_DEPLOYMENT_LOGS, variables),
    enabled: !!variables.deploymentId,
    refetchInterval,
  });
}

export function useDeployService() {
  const queryClient = useQueryClient();

  return useMutation<
    ServiceInstanceDeployMutation,
    Error,
    ServiceInstanceDeployMutationVariables
  >({
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, DEPLOY_SERVICE, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
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
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, STOP_DEPLOYMENT, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
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
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, RESTART_DEPLOYMENT, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
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
    mutationFn: (variables) =>
      request(GRAPHQL_ENDPOINT, SCALE_SERVICE, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
}
