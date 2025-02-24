import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  projectId: string | null;
}

export const ProjectNotFound = ({ projectId }: Props) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No project found</AlertTitle>
      {projectId && (
        <AlertDescription>Project ID: {projectId}</AlertDescription>
      )}
    </Alert>
  );
};
