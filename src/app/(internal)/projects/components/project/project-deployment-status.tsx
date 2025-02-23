import { Badge } from '@/components/ui/badge';
import { useFragment, FragmentType } from '@/lib/network/gql';
import { DeploymentFragment } from '@/lib/network/operations';

function getStatusColor(status: string) {
  switch (status) {
    case 'SUCCESS':
      return 'bg-green-500';
    case 'FAILED':
      return 'bg-red-500';
    case 'BUILDING':
    case 'DEPLOYING':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

export const ProjectDeploymentStatus = (props: {
  deployment: FragmentType<typeof DeploymentFragment>;
}) => {
  const deployment = useFragment(DeploymentFragment, props.deployment);

  return (
    <Badge
      variant="secondary"
      className={`${getStatusColor(deployment.status)} text-white`}
    >
      {deployment.status.toLowerCase()}
    </Badge>
  );
};
