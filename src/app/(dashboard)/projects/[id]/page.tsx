'use client';

import { useParams } from 'next/navigation';
import { useProject, useScaleService } from '@/lib/network/railway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Clock,
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Globe,
  Layers,
  Minus,
  Plus,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useFragment, FragmentType } from '@/lib/network/gql';
import {
  DeploymentFragment,
  ServiceInstanceFragment,
  ServiceFragment,
  ProjectFragment,
} from '@/lib/network/operations';

type PageParams = Record<'id', string>;

function getStatusColor(status: string) {
  switch (status) {
    case 'SUCCESS':
      return 'bg-green-500';
    case 'FAILED':
      return 'bg-red-500';
    case 'BUILDING':
    case 'DEPLOYING':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

const DeploymentStatus = (props: {
  deployment: FragmentType<typeof DeploymentFragment>;
}) => {
  const deployment = useFragment(DeploymentFragment, props.deployment);

  return (
    <Badge
      variant="secondary"
      className={`${getStatusColor(deployment.status)} text-white`}
    >
      {deployment.status}
    </Badge>
  );
};

const ServiceInstance = (props: {
  instance: FragmentType<typeof ServiceInstanceFragment>;
  environmentId: string;
}) => {
  const instance = useFragment(ServiceInstanceFragment, props.instance);
  const scaleService = useScaleService();

  if (!instance.latestDeployment) {
    return null;
  }

  const handleScale = async (delta: number) => {
    const currentReplicas = instance.numReplicas || 0;
    const newReplicas = Math.max(0, currentReplicas + delta); // Prevent negative replicas

    try {
      await scaleService.mutateAsync({
        serviceId: instance.serviceId,
        environmentId: props.environmentId,
        input: {
          numReplicas: newReplicas,
        },
      });
    } catch (error) {
      console.error('Failed to scale service:', error);
    }
  };

  const isLoading = scaleService.isPending;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          Deployed{' '}
          {formatDistanceToNow(
            new Date(instance.latestDeployment.createdAt)
          )}{' '}
          ago
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
          <Globe className="h-4 w-4" />
          {instance.region || 'No region'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Layers className="h-4 w-4" />
          Replicas
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading || instance.numReplicas === 0}
            onClick={() => handleScale(-1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[3ch] text-center">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              instance.numReplicas || 0
            )}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => handleScale(1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {instance.healthcheckPath && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 className="h-4 w-4" />
          Health: {instance.healthcheckPath}
        </div>
      )}

      {instance.latestDeployment.url && (
        <div className="flex items-center gap-2 text-sm">
          <a
            href={instance.latestDeployment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            View Deployment →
          </a>
        </div>
      )}

      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={isLoading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Redeploy
        </Button>
      </div>
    </div>
  );
};

const ServiceCard = (props: {
  service: FragmentType<typeof ServiceFragment>;
  environmentId: string;
}) => {
  const service = useFragment(ServiceFragment, props.service);
  const firstInstance = service.serviceInstances.edges[0]?.node;
  const deploymentsCount = service.deployments.edges.length;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            {service.name}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {deploymentsCount} deployment{deploymentsCount !== 1 ? 's' : ''}
          </p>
        </div>
        {firstInstance?.latestDeployment && (
          <DeploymentStatus deployment={firstInstance.latestDeployment} />
        )}
      </CardHeader>
      <CardContent>
        {firstInstance ? (
          <ServiceInstance
            instance={firstInstance}
            environmentId={props.environmentId}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No deployments found for this service
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectStats = (props: {
  project: FragmentType<typeof ProjectFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);
  const services = project.services.edges;
  const activeServices = services.filter(
    (edge) =>
      edge.node.serviceInstances.edges[0]?.node.latestDeployment?.status ===
      'SUCCESS'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Created</span>
              <span className="font-medium">
                {format(new Date(project.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Services</span>
              <span className="font-medium">{services.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Services</span>
              <span className="font-medium">{activeServices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Visibility</span>
              <Badge variant={project.isPublic ? 'secondary' : 'outline'}>
                {project.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map(({ node: service }) => {
              const status =
                service.serviceInstances.edges[0]?.node.latestDeployment
                  ?.status;
              return (
                <div
                  key={service.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600">{service.name}</span>
                  {status === 'SUCCESS' ? (
                    <Badge>Healthy</Badge>
                  ) : status === 'FAILED' ? (
                    <Badge variant="destructive">Failed</Badge>
                  ) : status ? (
                    <Badge variant="secondary">{status}</Badge>
                  ) : (
                    <Badge variant="outline">No Status</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectDashboard = (props: {
  project: FragmentType<typeof ProjectFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);
  const services = project.services.edges;

  // Get the first environment as default
  const defaultEnvironment = project.environments.edges[0]?.node;

  if (!defaultEnvironment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No environments found in this project
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Environment: {defaultEnvironment.name}
          </Badge>
        </div>
      </div>

      <ProjectStats project={props.project} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Services</h2>
          <Badge variant="outline">
            {services.length} service{services.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          {services.length > 0 ? (
            services.map(({ node: service }) => (
              <ServiceCard
                key={service.id}
                service={service}
                environmentId={defaultEnvironment.id}
              />
            ))
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No services found in this project. Create a new service to get
                started.
              </AlertDescription>
            </Alert>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default function DynamicPage() {
  const { id } = useParams<PageParams>();
  const { data, isLoading, error } = useProject(id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-4">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading project: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="container mx-auto p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No project found with ID: {id}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <ProjectDashboard project={data.project} />
    </div>
  );
}
