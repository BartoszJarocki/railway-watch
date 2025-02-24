// hooks/useEnvCheck.ts
import type { EnvCheckResponse } from "@/app/api/rest/check-env/route";
import { useQuery } from "@tanstack/react-query";

interface UseEnvCheckOptions {
  /**
   * The name of the environment variable to check
   */
  variableName: string;
  /**
   * Refetch interval in milliseconds (default: 5000ms)
   */
  refetchInterval?: number;
  /**
   * Callback when status changes
   */
  onSuccess?: (data: EnvCheckResponse) => void;
}

/**
 * Custom hook to check environment variable status
 */
export function useEnvCheck({
  variableName,
  refetchInterval = 5000,
}: UseEnvCheckOptions) {
  return useQuery({
    queryKey: ["env", variableName],
    queryFn: async (): Promise<EnvCheckResponse> => {
      const response = await fetch(
        `/api/rest/check-env?variable=${encodeURIComponent(variableName)}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    refetchInterval,
    refetchIntervalInBackground: true,
  });
}
