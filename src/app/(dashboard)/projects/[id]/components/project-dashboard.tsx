import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ProjectFragment } from '@/lib/network/operations';
import { ProjectStats } from './project-stats';
import { ProjectServiceCard } from './project-service-card';

export const ProjectDashboard = (props: {
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
              <ProjectServiceCard
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
