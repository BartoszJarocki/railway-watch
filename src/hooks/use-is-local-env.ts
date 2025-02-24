import { useEffect, useState } from "react";

export const useIsLocalEnvironment = (): boolean => {
  const [isLocal, setIsLocal] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsLocal(
        hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname.startsWith("192.168.") ||
          hostname.startsWith("10.") ||
          hostname.endsWith(".local"),
      );
    } else {
      setIsLocal(process.env.NODE_ENV === "development");
    }
  }, []);

  return isLocal;
};
