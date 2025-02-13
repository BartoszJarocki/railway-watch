/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n                serviceInstances {\n                  edges {\n                    node {\n                      id\n                      # Latest deployment for status\n                      latestDeployment {\n                        id\n                        status\n                        createdAt\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ProjectsDocument,
    "\n  query service($id: String!) {\n    service(id: $id) {\n      id\n      name\n      deployments {\n        edges {\n          node {\n            id\n            status\n            createdAt\n            url\n            staticUrl\n            suggestAddServiceDomain\n          }\n        }\n      }\n    }\n  }\n": typeof types.ServiceDocument,
    "\n  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {\n    deploymentTriggerCreate(input: $input) {\n      id\n      projectId\n      serviceId\n      branch\n      repository\n    }\n  }\n": typeof types.DeploymentTriggerCreateDocument,
    "\n  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {\n    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)\n  }\n": typeof types.ServiceInstanceDeployDocument,
    "\n  query deploymentLogs($deploymentId: String!, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {\n      message\n      timestamp\n      severity\n    }\n  }\n": typeof types.DeploymentLogsDocument,
    "\n  mutation deploymentStop($id: String!) {\n    deploymentStop(id: $id)\n  }\n": typeof types.DeploymentStopDocument,
    "\n  mutation deploymentRestart($id: String!) {\n    deploymentRestart(id: $id)\n  }\n": typeof types.DeploymentRestartDocument,
};
const documents: Documents = {
    "\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n                serviceInstances {\n                  edges {\n                    node {\n                      id\n                      # Latest deployment for status\n                      latestDeployment {\n                        id\n                        status\n                        createdAt\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ProjectsDocument,
    "\n  query service($id: String!) {\n    service(id: $id) {\n      id\n      name\n      deployments {\n        edges {\n          node {\n            id\n            status\n            createdAt\n            url\n            staticUrl\n            suggestAddServiceDomain\n          }\n        }\n      }\n    }\n  }\n": types.ServiceDocument,
    "\n  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {\n    deploymentTriggerCreate(input: $input) {\n      id\n      projectId\n      serviceId\n      branch\n      repository\n    }\n  }\n": types.DeploymentTriggerCreateDocument,
    "\n  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {\n    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)\n  }\n": types.ServiceInstanceDeployDocument,
    "\n  query deploymentLogs($deploymentId: String!, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {\n      message\n      timestamp\n      severity\n    }\n  }\n": types.DeploymentLogsDocument,
    "\n  mutation deploymentStop($id: String!) {\n    deploymentStop(id: $id)\n  }\n": types.DeploymentStopDocument,
    "\n  mutation deploymentRestart($id: String!) {\n    deploymentRestart(id: $id)\n  }\n": types.DeploymentRestartDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n                serviceInstances {\n                  edges {\n                    node {\n                      id\n                      # Latest deployment for status\n                      latestDeployment {\n                        id\n                        status\n                        createdAt\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n                serviceInstances {\n                  edges {\n                    node {\n                      id\n                      # Latest deployment for status\n                      latestDeployment {\n                        id\n                        status\n                        createdAt\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query service($id: String!) {\n    service(id: $id) {\n      id\n      name\n      deployments {\n        edges {\n          node {\n            id\n            status\n            createdAt\n            url\n            staticUrl\n            suggestAddServiceDomain\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query service($id: String!) {\n    service(id: $id) {\n      id\n      name\n      deployments {\n        edges {\n          node {\n            id\n            status\n            createdAt\n            url\n            staticUrl\n            suggestAddServiceDomain\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {\n    deploymentTriggerCreate(input: $input) {\n      id\n      projectId\n      serviceId\n      branch\n      repository\n    }\n  }\n"): (typeof documents)["\n  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {\n    deploymentTriggerCreate(input: $input) {\n      id\n      projectId\n      serviceId\n      branch\n      repository\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {\n    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)\n  }\n"): (typeof documents)["\n  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {\n    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query deploymentLogs($deploymentId: String!, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {\n      message\n      timestamp\n      severity\n    }\n  }\n"): (typeof documents)["\n  query deploymentLogs($deploymentId: String!, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {\n      message\n      timestamp\n      severity\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deploymentStop($id: String!) {\n    deploymentStop(id: $id)\n  }\n"): (typeof documents)["\n  mutation deploymentStop($id: String!) {\n    deploymentStop(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deploymentRestart($id: String!) {\n    deploymentRestart(id: $id)\n  }\n"): (typeof documents)["\n  mutation deploymentRestart($id: String!) {\n    deploymentRestart(id: $id)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;