import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ProjectFragment } from '@/lib/network/operations';
import { ProjectStats } from './project-stats';
import { ProjectServiceCard } from './project-service-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseAsString, useQueryState } from 'nuqs';
import { EnvironmentMetrics } from './project-environment-metrics';
import { RailwayComponentId } from '../../../../../components/railway-compontent-id';

export const ProjectDashboard = (props: {
  project: FragmentType<typeof ProjectFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);

  const defaultEnvironment = project.environments.edges[0]?.node;
  const [environmentId, setEnvironmentId] = useQueryState(
    'environmentId',
    parseAsString.withDefault(defaultEnvironment.id)
  );

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
      <Tabs
        defaultValue={environmentId}
        onValueChange={setEnvironmentId}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            {project.environments.edges.map(({ node: environment }) => (
              <TabsTrigger key={environment.id} value={environment.id}>
                {environment.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <RailwayComponentId name="Environment id" value={environmentId} />
        </div>

        <ProjectStats project={props.project} />

        {project.environments.edges.map(({ node: currentEnv }) => (
          <TabsContent key={currentEnv.id} value={currentEnv.id}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Services</h2>
                <Badge variant="outline">
                  {currentEnv.serviceInstances.edges.length} service
                  {currentEnv.serviceInstances.edges.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {currentEnv.serviceInstances.edges.length > 0 ? (
                <div className="grid gap-4">
                  {project.services.edges
                    .filter(({ node }) =>
                      node.serviceInstances.edges.filter(
                        ({ node }) => node.environmentId === currentEnv.id
                      )
                    )
                    .map(({ node: service }) => (
                      <ProjectServiceCard
                        key={service.id}
                        service={service}
                        environment={currentEnv}
                      />
                    ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No services instances found in this environment.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <EnvironmentMetrics environment={currentEnv} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
