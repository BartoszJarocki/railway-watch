import { useFragment, FragmentType } from '@/lib/network/gql';
import { EnvironmentFragment } from '@/lib/network/operations';
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
