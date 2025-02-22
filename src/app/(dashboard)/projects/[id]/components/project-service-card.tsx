import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ServiceFragment } from '@/lib/network/operations';
import { ProjectDeploymentStatus } from './project-deployment-status';
import { ProjectServiceInstance } from './project-service-instance';

export const ProjectServiceCard = (props: {
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
          <ProjectDeploymentStatus
            deployment={firstInstance.latestDeployment}
          />
        )}
      </CardHeader>
      <CardContent>
        {firstInstance ? (
          <ProjectServiceInstance
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
