import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Globe,
  Layers,
  Minus,
  Plus,
  RefreshCcw,
  StopCircleIcon,
} from "lucide-react";

import { RailwayComponentId } from "@/components/railway-compontent-id";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FragmentType, useFragment } from "@/lib/network/gql";
import { ServiceInstanceFragment } from "@/lib/network/operations";
import {
  useRestartDeployment,
  useStopDeployment,
  useUpdateService,
} from "@/lib/network/railway";
import { cn } from "@/lib/utils";

import { ProjectDeploymentStatus } from "./project-deployment-status";

export const ProjectServiceInstance = (props: {
  className?: string;
  instance: FragmentType<typeof ServiceInstanceFragment>;
  projectId: string;
}) => {
  const { className } = props;

  const instance = useFragment(ServiceInstanceFragment, props.instance);
  const scaleServiceMutation = useUpdateService();
  const restartDeploymentMutation = useRestartDeployment();
  const stopDeploymentMutation = useStopDeployment();

  const latestDeployment = instance.latestDeployment;
  if (!latestDeployment) {
    return null;
  }

  const scaleService = async (scale: "up" | "down") => {
    const currentReplicas = instance.numReplicas || 0;
    const delta = scale === "up" ? 1 : -1;
    const numReplicas = Math.max(0, currentReplicas + delta);

    scaleServiceMutation.mutate({
      serviceId: instance.serviceId,
      environmentId: instance.environmentId,
      input: {
        numReplicas,
      },
    });
  };

  const handleDeploymentRestart = async () => {
    restartDeploymentMutation.mutate({
      id: latestDeployment.id,
    });
  };

  const handleDeploymentStop = async () => {
    stopDeploymentMutation.mutate({
      id: latestDeployment.id,
    });
  };

  const isLoading = scaleServiceMutation.isPending;

  return (
    <Card className={cn("relative", className)}>
      <Badge
        className="flex items-center gap-1 justify-end text-xs absolute -top-3 right-4 bg-background"
        variant="outline"
      >
        <Globe className="size-3" />
        {instance.region || "Region unknown"}
      </Badge>

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Instance</CardTitle>
        <RailwayComponentId name="Instance id" value={instance.id} />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            Deployed {formatDistanceToNow(
              new Date(latestDeployment.createdAt),
            )}{" "}
            ago
          </div>
          <div>
            <div className="flex gap-2">
              {instance.latestDeployment && (
                <ProjectDeploymentStatus
                  deployment={instance.latestDeployment}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Layers className="h-4 w-4" />
            Replicas
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading || instance.numReplicas === 0}
              onClick={() => scaleService("down")}
            >
              <Minus className="size-3" />
            </Button>
            <span className="min-w-[3ch] text-center">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                instance.numReplicas || 0
              )}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => scaleService("up")}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>

        {instance.healthcheckPath && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4" />
            Health: {instance.healthcheckPath}
          </div>
        )}

        {latestDeployment.url && (
          <div className="flex items-center gap-2 text-sm">
            <a
              href={latestDeployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              View Deployment →
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-5 py-3 flex gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={handleDeploymentRestart}
        >
          <RefreshCcw className="size-3" />
          Restart
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={handleDeploymentStop}
        >
          <StopCircleIcon className="size-3" />
          Stop
        </Button>
      </CardFooter>
    </Card>
  );
};
