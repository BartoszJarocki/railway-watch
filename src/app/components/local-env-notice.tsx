import { Code } from "@/components/code";

export const LocalEnvironmentNotice: React.FC = () => (
  <p className="mt-6 bg-muted rounded-md px-3 py-2 text-xs text-muted-foreground text-pretty">
    On local environment, you can set the environment variables by creating{" "}
    <Code className="px-0">.env</Code> or{" "}
    <Code className="px-0">.env.local</Code> file in the root of your project.
  </p>
);
