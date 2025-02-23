import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { EnvironmentFragment, ServiceFragment } from '@/lib/network/operations';
import { ProjectServiceInstance } from './project-service-instance';
import { RailwayComponentId } from '../../../../../components/railway-compontent-id';

export const ProjectServiceCard = (props: {
  service: FragmentType<typeof ServiceFragment>;
  environment: FragmentType<typeof EnvironmentFragment>;
}) => {
  const service = useFragment(ServiceFragment, props.service);
  const environment = useFragment(EnvironmentFragment, props.environment);
  // Filter instances to only show those belonging to this service
  const serviceInstances = environment.serviceInstances.edges.filter(
    ({ node }) => node.serviceId === service.id
  );

  const deploymentsCount = service.deployments.edges.filter(
    ({ node }) => node.environmentId === environment.id
  ).length;
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
        <RailwayComponentId name="Service id" value={service.id} />
      </CardHeader>
      <CardContent>
        {serviceInstances.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-5">
            {serviceInstances.map(({ node: instance }) => (
              <ProjectServiceInstance
                className="flex-1"
                key={instance.id}
                instance={instance}
              />
            ))}
          </div>
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
