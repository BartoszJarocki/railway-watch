import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ProjectFragment } from '@/lib/network/operations';

export const ProjectStats = (props: {
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
