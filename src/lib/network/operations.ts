import { graphql } from './gql';

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
          services {
            edges {
              node {
                id
                name
                serviceInstances {
                  edges {
                    node {
                      id
                      # Latest deployment for status
                      latestDeployment {
                        id
                        status
                        createdAt
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
