import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { EnvironmentFragment, ProjectFragment } from '@/lib/network/operations';
import { ProjectStats } from './project-stats';
import { ProjectServiceCard } from './project-service-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseAsString, useQueryState } from 'nuqs';
import { MetricMeasurement } from '../../../../../lib/network/gql/graphql';
import { useMetrics } from '../../../../../lib/network/railway';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import { ResponsiveContainer, XAxis, YAxis, Line, LineChart } from 'recharts';

// Get metrics for last 24 hours
const startDate = new Date();
startDate.setHours(startDate.getHours() - 1);

export const EnvironmentMetrics = (props: {
  environment: FragmentType<typeof EnvironmentFragment>;
}) => {
  const environment = useFragment(EnvironmentFragment, props.environment);

  const { data } = useMetrics({
    environmentId: environment.id,
    startDate,
    measurements: [
      MetricMeasurement.CpuUsage,
      MetricMeasurement.MemoryUsageGb,
      MetricMeasurement.NetworkRxGb,
      MetricMeasurement.NetworkTxGb,
    ],
  });

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleTimeString();
  };

  const formatBytes = (gb: number) => {
    const bytes = gb * 1024 * 1024 * 1024;
    if (bytes >= 1000000) {
      return `${(bytes / 1000000).toFixed(1)}MB`;
    }
    return `${(bytes / 1000).toFixed(1)}KB`;
  };

  const formatCPU = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>CPU Usage</CardTitle>
          <CardDescription>Last hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  data?.metrics.find((m) => m.measurement === 'CPU_USAGE')
                    ?.values || []
                }
              >
                <XAxis dataKey="ts" tickFormatter={formatDate} fontSize={12} />
                <YAxis tickFormatter={formatCPU} fontSize={12} />
                <Line
                  type="basis"
                  dataKey="value"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Memory Usage</CardTitle>
          <CardDescription>Last hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  data?.metrics.find(
                    (m) => m.measurement === MetricMeasurement.MemoryUsageGb
                  )?.values || []
                }
              >
                <XAxis dataKey="ts" tickFormatter={formatDate} fontSize={12} />
                <YAxis tickFormatter={formatBytes} fontSize={12} />
                <Line
                  type="basis"
                  dataKey="value"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Network Traffic</CardTitle>
          <CardDescription>RX/TX last hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={
                  data?.metrics.find(
                    (m) => m.measurement === MetricMeasurement.NetworkRxGb
                  )?.values || []
                }
              >
                <XAxis dataKey="ts" tickFormatter={formatDate} fontSize={12} />
                <YAxis tickFormatter={formatBytes} fontSize={12} />
                <Line
                  type="basis"
                  dataKey="value"
                  name="Received"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
                <Line
                  type="basis"
                  data={
                    data?.metrics.find(
                      (m) => m.measurement === MetricMeasurement.NetworkTxGb
                    )?.values || []
                  }
                  dataKey="value"
                  name="Transmitted"
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProjectDashboard = (props: {
  project: FragmentType<typeof ProjectFragment>;
}) => {
  const project = useFragment(ProjectFragment, props.project);

  const defaultEnvironment = project.environments.edges[0]?.node;
  const [environment, setEnvironment] = useQueryState(
    'env',
    parseAsString.withDefault(defaultEnvironment.name)
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
        defaultValue={environment}
        onValueChange={setEnvironment}
        className="space-y-6"
      >
        <TabsList>
          {project.environments.edges.map(({ node: environment }) => (
            <TabsTrigger key={environment.id} value={environment.name}>
              {environment.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <ProjectStats project={props.project} />

        {project.environments.edges.map(({ node: currentEnv }) => (
          <TabsContent key={currentEnv.id} value={currentEnv.name}>
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
                  {project.services.edges.map(({ node: service }) => {
                    return (
                      <ProjectServiceCard
                        key={service.id}
                        service={service}
                        environment={currentEnv}
                      />
                    );
                  })}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No services found in this environment. Create a new service
                    to get started.
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
