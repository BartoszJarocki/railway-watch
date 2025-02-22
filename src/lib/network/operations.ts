import { graphql } from './gql';

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
    serviceInstances {
      edges {
        node {
          id
          latestDeployment {
            ...DeploymentItem
          }
          ...ServiceInstanceItem
        }
      }
    }
    deployments {
      edges {
        node {
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

export const GET_SERVICE = graphql(`
  query service($id: String!) {
    service(id: $id) {
      id
      name
      deployments {
        edges {
          node {
            id
            status
            createdAt
            url
            staticUrl
            suggestAddServiceDomain
          }
        }
      }
    }
  }
`);

export const DEPLOY_TRIGGER = graphql(`
  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {
    deploymentTriggerCreate(input: $input) {
      id
      projectId
      serviceId
      branch
      repository
    }
  }
`);

export const DEPLOY_SERVICE = graphql(`
  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {
    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)
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
