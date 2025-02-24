"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { FragmentType, useFragment } from "@/lib/network/gql";
import { EnvironmentFragment } from "@/lib/network/operations";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  GetEnvironmentMetricsQuery,
  MetricMeasurement,
} from "../../../../../lib/network/gql/graphql";
import { useMetrics } from "../../../../../lib/network/railway";

/**
 * Formats timestamp to locale time string
 * @param ts - Timestamp in seconds
 */
const formatDate = (ts: number) => {
  return new Date(ts * 1000).toLocaleTimeString();
};

/**
 * Formats gigabytes to human-readable bytes
 * @param gb - Size in gigabytes
 */
const formatBytes = (gb: number) => {
  const bytes = gb * 1024 * 1024 * 1024;
  if (bytes >= 1000000) {
    return `${(bytes / 1000000).toFixed(1)}MB`;
  }
  return `${(bytes / 1000).toFixed(1)}KB`;
};

/**
 * Formats CPU usage to percentage
 * @param value - CPU usage as decimal
 */
const formatCPU = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

interface EnvironmentMetricsProps {
  environment: FragmentType<typeof EnvironmentFragment>;
}

interface MetricsData {
  cpuMetrics: Array<{ ts: number; value: number }>;
  memoryMetrics: Array<{ ts: number; value: number }>;
  networkRxMetrics: Array<{ ts: number; value: number }>;
  networkTxMetrics: Array<{ ts: number; value: number }>;
}

const useProcessedMetrics = (
  data?: GetEnvironmentMetricsQuery,
): MetricsData => {
  return useMemo(
    () => ({
      cpuMetrics:
        data?.metrics.find((m) => m.measurement === "CPU_USAGE")?.values || [],
      memoryMetrics:
        data?.metrics.find(
          (m) => m.measurement === MetricMeasurement.MemoryUsageGb,
        )?.values || [],
      networkRxMetrics:
        data?.metrics.find(
          (m) => m.measurement === MetricMeasurement.NetworkRxGb,
        )?.values || [],
      networkTxMetrics:
        data?.metrics.find(
          (m) => m.measurement === MetricMeasurement.NetworkTxGb,
        )?.values || [],
    }),
    [data],
  );
};

export const EnvironmentMetrics = (props: EnvironmentMetricsProps) => {
  const environment = useFragment(EnvironmentFragment, props.environment);

  const startDate = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    return date;
  }, []);

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

  const { cpuMetrics, memoryMetrics, networkRxMetrics, networkTxMetrics } =
    useProcessedMetrics(data);

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
              <LineChart data={cpuMetrics}>
                <XAxis
                  dataKey="ts"
                  tickFormatter={formatDate}
                  fontSize={12}
                  suppressHydrationWarning
                />
                <YAxis
                  tickFormatter={formatCPU}
                  fontSize={12}
                  suppressHydrationWarning
                />
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
              <LineChart data={memoryMetrics}>
                <XAxis
                  dataKey="ts"
                  tickFormatter={formatDate}
                  fontSize={12}
                  suppressHydrationWarning
                />
                <YAxis
                  tickFormatter={formatBytes}
                  fontSize={12}
                  suppressHydrationWarning
                />
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
              <LineChart data={networkRxMetrics}>
                <XAxis
                  dataKey="ts"
                  tickFormatter={formatDate}
                  fontSize={12}
                  suppressHydrationWarning
                />
                <YAxis
                  tickFormatter={formatBytes}
                  fontSize={12}
                  suppressHydrationWarning
                />
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
                  data={networkTxMetrics}
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

export default EnvironmentMetrics;
