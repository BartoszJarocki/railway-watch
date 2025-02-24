import { graphql } from './gql';

export const EnvironmentFragment = graphql(`
  fragment EnvironmentItem on Environment {
    id
    name
    serviceInstances {
      edges {
        node {
          id
          serviceName
          serviceId
          latestDeployment {
            ...DeploymentItem
          }
          ...ServiceInstanceItem
        }
      }
    }
  }
`);

export const DeploymentFragment = graphql(`
  fragment DeploymentItem on Deployment {
    id
    status
    createdAt
    url
    staticUrl
    suggestAddServiceDomain
  }
`);

export const ServiceInstanceFragment = graphql(`
  fragment ServiceInstanceItem on ServiceInstance {
    id
    environmentId
    latestDeployment {
      id
      createdAt
      url
      status
      serviceId
      ...DeploymentItem
    }
    healthcheckPath
    numReplicas
    region
    serviceId
    serviceName
  }
`);

export const ServiceFragment = graphql(`
  fragment ServiceItem on Service {
    id
    name
    icon
    deletedAt
    projectId
    deployments {
      edges {
        node {
          url
          environmentId
          ...DeploymentItem
        }
      }
    }
  }
`);

export const ProjectFragment = graphql(`
  fragment ProjectItem on Project {
    id
    name
    description
    createdAt
    isPublic
    environments {
      edges {
        node {
          id
          name
          serviceInstances {
            edges {
              node {
                serviceId
              }
            }
          }
          ...EnvironmentItem
        }
      }
    }
    services {
      edges {
        node {
          id
          name
          serviceInstances {
            edges {
              node {
                id
                environmentId
                latestDeployment {
                  status
                  ...DeploymentItem
                }
              }
            }
          }
          ...ServiceItem
        }
      }
    }
  }
`);

export const SCALE_SERVICE = graphql(`
  mutation serviceInstanceUpdate(
    $serviceId: String!
    $environmentId: String
    $input: ServiceInstanceUpdateInput!
  ) {
    serviceInstanceUpdate(
      serviceId: $serviceId
      environmentId: $environmentId
      input: $input
    )
  }
`);

export const GET_PROJECTS = graphql(`
  query projects($after: String, $before: String, $first: Int, $last: Int) {
    projects(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          environments {
            edges {
              node {
                id
              }
            }
          }
          ...ProjectItem
        }
      }
    }
  }
`);

export const GET_PROJECT_BY_ID = graphql(`
  query project($id: String!) {
    project(id: $id) {
      id
      ...ProjectItem
    }
  }
`);

export const REDEPLOY_SERVICE = graphql(`
  mutation serviceInstanceRedeploy(
    $environmentId: String!
    $serviceId: String!
  ) {
    serviceInstanceRedeploy(
      environmentId: $environmentId
      serviceId: $serviceId
    )
  }
`);

export const GET_DEPLOYMENT_LOGS = graphql(`
  query deploymentLogs($deploymentId: String!, $limit: Int) {
    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
      message
      timestamp
      severity
    }
  }
`);

export const STOP_DEPLOYMENT = graphql(`
  mutation deploymentStop($id: String!) {
    deploymentStop(id: $id)
  }
`);

export const RESTART_DEPLOYMENT = graphql(`
  mutation deploymentRestart($id: String!) {
    deploymentRestart(id: $id)
  }
`);

export const GET_ENVIRONMENT_METRICS = graphql(`
  query getEnvironmentMetrics(
    $environmentId: String!
    $startDate: DateTime!
    $measurements: [MetricMeasurement!]!
  ) {
    metrics(
      environmentId: $environmentId
      startDate: $startDate
      measurements: $measurements
    ) {
      measurement
      values {
        ts
        value
      }
      tags {
        serviceId
      }
    }
  }
`);
