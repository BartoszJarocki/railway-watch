import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
