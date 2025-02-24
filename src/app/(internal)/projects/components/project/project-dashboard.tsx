import { AlertCircle } from "lucide-react";

import { RailwayComponentId } from "@/components/railway-compontent-id";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectParams } from "@/hooks/use-project-params";
import { FragmentType, useFragment } from "@/lib/network/gql";
import { ProjectFragment } from "@/lib/network/operations";

import { EnvironmentMetrics } from "./project-environment-metrics";
import { ProjectServiceCard } from "./project-service-card";
import { ProjectStats } from "./project-stats";

const ProjectDashboard = (props: {
  project: FragmentType<typeof ProjectFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);

  const defaultEnvironment = project.environments.edges[0]?.node;
  const [{ environmentId }, setProjectParams] = useProjectParams({
    defaultEnvironmentId: defaultEnvironment.id,
  });

  const currentEnvironment = project.environments.edges.find(
    ({ node }) => node.id === environmentId,
  )?.node;

  if (!currentEnvironment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No environment found with ID: {environmentId}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={currentEnvironment.id}
        onValueChange={(value) => setProjectParams({ environmentId: value })}
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

          <RailwayComponentId
            name="Environment id"
            value={currentEnvironment.id}
          />
        </div>

        <ProjectStats
          project={props.project}
          environment={currentEnvironment}
        />

        {project.environments.edges.map(({ node: currentEnv }) => (
          <TabsContent
            key={currentEnv.id}
            value={currentEnv.id}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Services</h2>
              </div>

              {currentEnv.serviceInstances.edges.length > 0 ? (
                <div className="grid gap-4">
                  {project.services.edges
                    .filter(({ node }) =>
                      node.serviceInstances.edges.some(
                        ({ node }) => node.environmentId === currentEnv.id,
                      ),
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

export default ProjectDashboard;
