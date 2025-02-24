import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Props {
  projectId: string;
}

export const ProjectNotFound = ({ projectId }: Props) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>No project found with ID: {projectId}</AlertDescription>
    </Alert>
  );
};
