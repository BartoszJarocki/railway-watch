import { Button } from '@/components/ui/button';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { ServiceInstanceFragment } from '@/lib/network/operations';
import { useScaleService, useRestartDeployment } from '@/lib/network/railway';
import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  Globe,
  Layers,
  Minus,
  Plus,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';

export const ProjectServiceInstance = (props: {
  instance: FragmentType<typeof ServiceInstanceFragment>;
}) => {
  const instance = useFragment(ServiceInstanceFragment, props.instance);
  const scaleServiceMutation = useScaleService();
  const restartDeploymentMutation = useRestartDeployment();

  const latestDeployment = instance.latestDeployment;
  if (!latestDeployment) {
    return null;
  }

  const handleScale = async (delta: number) => {
    const currentReplicas = instance.numReplicas || 0;
    const newReplicas = Math.max(0, currentReplicas + delta);

    scaleServiceMutation.mutate({
      serviceId: instance.serviceId,
      environmentId: instance.environmentId,
      input: {
        numReplicas: newReplicas,
      },
    });
  };

  const handleDeploymentRestart = async () => {
    restartDeploymentMutation.mutate({
      id: latestDeployment.id,
    });
  };

  const isLoading = scaleServiceMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          Deployed {formatDistanceToNow(
            new Date(latestDeployment.createdAt)
          )}{' '}
          ago
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 justify-end">
          <Globe className="h-4 w-4" />
          {instance.region || 'No region'}
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
            onClick={() => handleScale(-1)}
          >
            <Minus className="h-4 w-4" />
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
            onClick={() => handleScale(1)}
          >
            <Plus className="h-4 w-4" />
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

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={handleDeploymentRestart}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Redeploy
        </Button>
      </div>
    </div>
  );
};
