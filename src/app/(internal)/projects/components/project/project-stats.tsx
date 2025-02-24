import { format } from "date-fns";
import { Clock, Database, Eye, Power } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FragmentType, useFragment } from "@/lib/network/gql";
import { EnvironmentFragment, ProjectFragment } from "@/lib/network/operations";

export const ProjectStats = (props: {
  project: FragmentType<typeof ProjectFragment>;
  environment: FragmentType<typeof EnvironmentFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);
  const currentEnv = useFragment(EnvironmentFragment, props.environment);

  // Get services for current environment
  const servicesInEnvironment = project.services.edges.filter(({ node }) =>
    node.serviceInstances.edges.some(
      ({ node }) => node.environmentId === currentEnv.id,
    ),
  );

  // Count active services in current environment
  const activeServices = servicesInEnvironment.filter(({ node }) =>
    node.serviceInstances.edges.some(
      ({ node }) =>
        node.environmentId === currentEnv.id &&
        node.latestDeployment?.status === "SUCCESS",
    ),
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Total Services</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {servicesInEnvironment.length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Active Services</CardTitle>
          <Power className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeServices}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Visibility</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {project.isPublic ? "Public" : "Private"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm">Created</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {format(new Date(project.createdAt), "MMM d, yyyy")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
