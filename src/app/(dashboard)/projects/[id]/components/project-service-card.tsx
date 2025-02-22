import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ServiceFragment } from '@/lib/network/operations';
import { ProjectDeploymentStatus } from './project-deployment-status';
import { ProjectServiceInstance } from './project-service-instance';

export const ProjectServiceCard = (props: {
  service: FragmentType<typeof ServiceFragment>;
}) => {
  const service = useFragment(ServiceFragment, props.service);
  const instances = service.serviceInstances.edges;
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
      </CardHeader>
      <CardContent>
        {instances.length > 0 ? (
          <div className="space-y-4">
            {instances.map(({ node: instance }, index) => (
              <div
                key={instance.id}
                className={index > 0 ? 'border-t pt-4' : ''}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">
                    Instance {index + 1}
                  </span>
                  {instance.latestDeployment && (
                    <ProjectDeploymentStatus
                      deployment={instance.latestDeployment}
                    />
                  )}
                </div>
                <ProjectServiceInstance instance={instance} />
              </div>
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
