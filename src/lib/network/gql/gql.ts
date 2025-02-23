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
    "\n  fragment EnvironmentItem on Environment {\n    id\n    name\n    serviceInstances {\n      edges {\n        node {\n          id\n          serviceName\n          serviceId\n          latestDeployment {\n            ...DeploymentItem\n          }\n          ...ServiceInstanceItem\n        }\n      }\n    }\n  }\n": typeof types.EnvironmentItemFragmentDoc,
    "\n  fragment DeploymentItem on Deployment {\n    id\n    status\n    createdAt\n    url\n    staticUrl\n    suggestAddServiceDomain\n  }\n": typeof types.DeploymentItemFragmentDoc,
    "\n  fragment ServiceInstanceItem on ServiceInstance {\n    id\n    environmentId\n    latestDeployment {\n      id\n      createdAt\n      url\n      status\n      serviceId\n      ...DeploymentItem\n    }\n    healthcheckPath\n    numReplicas\n    region\n    serviceId\n    serviceName\n  }\n": typeof types.ServiceInstanceItemFragmentDoc,
    "\n  fragment ServiceItem on Service {\n    id\n    name\n    icon\n    deletedAt\n    projectId\n    deployments {\n      edges {\n        node {\n          url\n          environmentId\n          ...DeploymentItem\n        }\n      }\n    }\n  }\n": typeof types.ServiceItemFragmentDoc,
    "\n  fragment ProjectItem on Project {\n    id\n    name\n    description\n    createdAt\n    isPublic\n    environments {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                serviceId\n              }\n            }\n          }\n          ...EnvironmentItem\n        }\n      }\n    }\n    services {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                id\n                environmentId\n                latestDeployment {\n                  status\n                  ...DeploymentItem\n                }\n              }\n            }\n          }\n          ...ServiceItem\n        }\n      }\n    }\n  }\n": typeof types.ProjectItemFragmentDoc,
    "\n  mutation serviceInstanceUpdate(\n    $serviceId: String!\n    $environmentId: String\n    $input: ServiceInstanceUpdateInput!\n  ) {\n    serviceInstanceUpdate(\n      serviceId: $serviceId\n      environmentId: $environmentId\n      input: $input\n    )\n  }\n": typeof types.ServiceInstanceUpdateDocument,
    "\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          ...ProjectItem\n        }\n      }\n    }\n  }\n": typeof types.ProjectsDocument,
    "\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      ...ProjectItem\n    }\n  }\n": typeof types.ProjectDocument,
    "\n  query service($id: String!) {\n    service(id: $id) {\n      id\n      name\n      deployments {\n        edges {\n          node {\n            id\n            status\n            createdAt\n            url\n            staticUrl\n            suggestAddServiceDomain\n          }\n        }\n      }\n    }\n  }\n": typeof types.ServiceDocument,
    "\n  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {\n    deploymentTriggerCreate(input: $input) {\n      id\n      projectId\n      serviceId\n      branch\n      repository\n    }\n  }\n": typeof types.DeploymentTriggerCreateDocument,
    "\n  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {\n    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)\n  }\n": typeof types.ServiceInstanceDeployDocument,
    "\n  query deploymentLogs($deploymentId: String!, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {\n      message\n      timestamp\n      severity\n    }\n  }\n": typeof types.DeploymentLogsDocument,
    "\n  mutation deploymentStop($id: String!) {\n    deploymentStop(id: $id)\n  }\n": typeof types.DeploymentStopDocument,
    "\n  mutation deploymentRestart($id: String!) {\n    deploymentRestart(id: $id)\n  }\n": typeof types.DeploymentRestartDocument,
    "\n  query getEnvironmentMetrics(\n    $environmentId: String!\n    $startDate: DateTime!\n    $measurements: [MetricMeasurement!]!\n  ) {\n    metrics(\n      environmentId: $environmentId\n      startDate: $startDate\n      measurements: $measurements\n    ) {\n      measurement\n      values {\n        ts\n        value\n      }\n      tags {\n        serviceId\n      }\n    }\n  }\n": typeof types.GetEnvironmentMetricsDocument,
};
const documents: Documents = {
    "\n  fragment EnvironmentItem on Environment {\n    id\n    name\n    serviceInstances {\n      edges {\n        node {\n          id\n          serviceName\n          serviceId\n          latestDeployment {\n            ...DeploymentItem\n          }\n          ...ServiceInstanceItem\n        }\n      }\n    }\n  }\n": types.EnvironmentItemFragmentDoc,
    "\n  fragment DeploymentItem on Deployment {\n    id\n    status\n    createdAt\n    url\n    staticUrl\n    suggestAddServiceDomain\n  }\n": types.DeploymentItemFragmentDoc,
    "\n  fragment ServiceInstanceItem on ServiceInstance {\n    id\n    environmentId\n    latestDeployment {\n      id\n      createdAt\n      url\n      status\n      serviceId\n      ...DeploymentItem\n    }\n    healthcheckPath\n    numReplicas\n    region\n    serviceId\n    serviceName\n  }\n": types.ServiceInstanceItemFragmentDoc,
    "\n  fragment ServiceItem on Service {\n    id\n    name\n    icon\n    deletedAt\n    projectId\n    deployments {\n      edges {\n        node {\n          url\n          environmentId\n          ...DeploymentItem\n        }\n      }\n    }\n  }\n": types.ServiceItemFragmentDoc,
    "\n  fragment ProjectItem on Project {\n    id\n    name\n    description\n    createdAt\n    isPublic\n    environments {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                serviceId\n              }\n            }\n          }\n          ...EnvironmentItem\n        }\n      }\n    }\n    services {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                id\n                environmentId\n                latestDeployment {\n                  status\n                  ...DeploymentItem\n                }\n              }\n            }\n          }\n          ...ServiceItem\n        }\n      }\n    }\n  }\n": types.ProjectItemFragmentDoc,
    "\n  mutation serviceInstanceUpdate(\n    $serviceId: String!\n    $environmentId: String\n    $input: ServiceInstanceUpdateInput!\n  ) {\n    serviceInstanceUpdate(\n      serviceId: $serviceId\n      environmentId: $environmentId\n      input: $input\n    )\n  }\n": types.ServiceInstanceUpdateDocument,
    "\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          ...ProjectItem\n        }\n      }\n    }\n  }\n": types.ProjectsDocument,
    "\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      ...ProjectItem\n    }\n  }\n": types.ProjectDocument,
    "\n  query service($id: String!) {\n    service(id: $id) {\n      id\n      name\n      deployments {\n        edges {\n          node {\n            id\n            status\n            createdAt\n            url\n            staticUrl\n            suggestAddServiceDomain\n          }\n        }\n      }\n    }\n  }\n": types.ServiceDocument,
    "\n  mutation deploymentTriggerCreate($input: DeploymentTriggerCreateInput!) {\n    deploymentTriggerCreate(input: $input) {\n      id\n      projectId\n      serviceId\n      branch\n      repository\n    }\n  }\n": types.DeploymentTriggerCreateDocument,
    "\n  mutation serviceInstanceDeploy($environmentId: String!, $serviceId: String!) {\n    serviceInstanceDeploy(environmentId: $environmentId, serviceId: $serviceId)\n  }\n": types.ServiceInstanceDeployDocument,
    "\n  query deploymentLogs($deploymentId: String!, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, limit: $limit) {\n      message\n      timestamp\n      severity\n    }\n  }\n": types.DeploymentLogsDocument,
    "\n  mutation deploymentStop($id: String!) {\n    deploymentStop(id: $id)\n  }\n": types.DeploymentStopDocument,
    "\n  mutation deploymentRestart($id: String!) {\n    deploymentRestart(id: $id)\n  }\n": types.DeploymentRestartDocument,
    "\n  query getEnvironmentMetrics(\n    $environmentId: String!\n    $startDate: DateTime!\n    $measurements: [MetricMeasurement!]!\n  ) {\n    metrics(\n      environmentId: $environmentId\n      startDate: $startDate\n      measurements: $measurements\n    ) {\n      measurement\n      values {\n        ts\n        value\n      }\n      tags {\n        serviceId\n      }\n    }\n  }\n": types.GetEnvironmentMetricsDocument,
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
export function graphql(source: "\n  fragment EnvironmentItem on Environment {\n    id\n    name\n    serviceInstances {\n      edges {\n        node {\n          id\n          serviceName\n          serviceId\n          latestDeployment {\n            ...DeploymentItem\n          }\n          ...ServiceInstanceItem\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment EnvironmentItem on Environment {\n    id\n    name\n    serviceInstances {\n      edges {\n        node {\n          id\n          serviceName\n          serviceId\n          latestDeployment {\n            ...DeploymentItem\n          }\n          ...ServiceInstanceItem\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DeploymentItem on Deployment {\n    id\n    status\n    createdAt\n    url\n    staticUrl\n    suggestAddServiceDomain\n  }\n"): (typeof documents)["\n  fragment DeploymentItem on Deployment {\n    id\n    status\n    createdAt\n    url\n    staticUrl\n    suggestAddServiceDomain\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ServiceInstanceItem on ServiceInstance {\n    id\n    environmentId\n    latestDeployment {\n      id\n      createdAt\n      url\n      status\n      serviceId\n      ...DeploymentItem\n    }\n    healthcheckPath\n    numReplicas\n    region\n    serviceId\n    serviceName\n  }\n"): (typeof documents)["\n  fragment ServiceInstanceItem on ServiceInstance {\n    id\n    environmentId\n    latestDeployment {\n      id\n      createdAt\n      url\n      status\n      serviceId\n      ...DeploymentItem\n    }\n    healthcheckPath\n    numReplicas\n    region\n    serviceId\n    serviceName\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ServiceItem on Service {\n    id\n    name\n    icon\n    deletedAt\n    projectId\n    deployments {\n      edges {\n        node {\n          url\n          environmentId\n          ...DeploymentItem\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ServiceItem on Service {\n    id\n    name\n    icon\n    deletedAt\n    projectId\n    deployments {\n      edges {\n        node {\n          url\n          environmentId\n          ...DeploymentItem\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectItem on Project {\n    id\n    name\n    description\n    createdAt\n    isPublic\n    environments {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                serviceId\n              }\n            }\n          }\n          ...EnvironmentItem\n        }\n      }\n    }\n    services {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                id\n                environmentId\n                latestDeployment {\n                  status\n                  ...DeploymentItem\n                }\n              }\n            }\n          }\n          ...ServiceItem\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectItem on Project {\n    id\n    name\n    description\n    createdAt\n    isPublic\n    environments {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                serviceId\n              }\n            }\n          }\n          ...EnvironmentItem\n        }\n      }\n    }\n    services {\n      edges {\n        node {\n          id\n          name\n          serviceInstances {\n            edges {\n              node {\n                id\n                environmentId\n                latestDeployment {\n                  status\n                  ...DeploymentItem\n                }\n              }\n            }\n          }\n          ...ServiceItem\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation serviceInstanceUpdate(\n    $serviceId: String!\n    $environmentId: String\n    $input: ServiceInstanceUpdateInput!\n  ) {\n    serviceInstanceUpdate(\n      serviceId: $serviceId\n      environmentId: $environmentId\n      input: $input\n    )\n  }\n"): (typeof documents)["\n  mutation serviceInstanceUpdate(\n    $serviceId: String!\n    $environmentId: String\n    $input: ServiceInstanceUpdateInput!\n  ) {\n    serviceInstanceUpdate(\n      serviceId: $serviceId\n      environmentId: $environmentId\n      input: $input\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          ...ProjectItem\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query projects($after: String, $before: String, $first: Int, $last: Int) {\n    projects(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          id\n          name\n          ...ProjectItem\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      ...ProjectItem\n    }\n  }\n"): (typeof documents)["\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      ...ProjectItem\n    }\n  }\n"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getEnvironmentMetrics(\n    $environmentId: String!\n    $startDate: DateTime!\n    $measurements: [MetricMeasurement!]!\n  ) {\n    metrics(\n      environmentId: $environmentId\n      startDate: $startDate\n      measurements: $measurements\n    ) {\n      measurement\n      values {\n        ts\n        value\n      }\n      tags {\n        serviceId\n      }\n    }\n  }\n"): (typeof documents)["\n  query getEnvironmentMetrics(\n    $environmentId: String!\n    $startDate: DateTime!\n    $measurements: [MetricMeasurement!]!\n  ) {\n    metrics(\n      environmentId: $environmentId\n      startDate: $startDate\n      measurements: $measurements\n    ) {\n      measurement\n      values {\n        ts\n        value\n      }\n      tags {\n        serviceId\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;