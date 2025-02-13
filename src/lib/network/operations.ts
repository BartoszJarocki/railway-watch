// app/gql/operations.ts
import { graphql } from './gql';

// Get projects
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

// Get service details
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

// Deploy trigger mutation
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

// Service instance deploy
export const DEPLOY_SERVICE = graphql(`
  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {
    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)
  }
`);

// Get deployment logs
export const GET_DEPLOYMENT_LOGS = graphql(`
  query deploymentLogs($deploymentId: String!, $limit: Int) {
    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {
      message
      timestamp
      severity
    }
  }
`);

// Stop deployment
export const STOP_DEPLOYMENT = graphql(`
  mutation deploymentStop($id: String!) {
    deploymentStop(id: $id)
  }
`);

// Restart deployment
export const RESTART_DEPLOYMENT = graphql(`
  mutation deploymentRestart($id: String!) {
    deploymentRestart(id: $id)
  }
`);
