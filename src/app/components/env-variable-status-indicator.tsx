import { Code } from "@/components/code";
import { Badge } from "@/components/ui/badge";
import { RAILWAY_LINKS } from "@/lib/data/links";
import { cn } from "@/lib/utils";

interface Props {
  isLoading: boolean;
  isApplicationReady?: boolean;
  variableName: string;
}

export const EnvVariableStatusIndicator: React.FC<Props> = ({
  isLoading,
  isApplicationReady,
  variableName,
}) => {
  const badgeColor = isApplicationReady ? "bg-green-500" : "bg-gray-500";

  return (
    <div className="flex items-center justify-center gap-6">
      <span className="relative inline-flex">
        <div className="inline-flex items-center leading-6 font-semibold">
          <Code>{variableName}</Code>
        </div>
        <span
          className="absolute top-0 right-0 -mt-1 -mr-0.5 flex size-2"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-muted-foreground opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-muted-foreground" />
        </span>
      </span>

      <Badge className={cn(`text-xs ${badgeColor}`)}>
        {isLoading
          ? "Checking..."
          : isApplicationReady
            ? "Configured"
            : "Not set"}
      </Badge>

      <a
        className="text-xs text-foreground shrink-0 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2"
        href={RAILWAY_LINKS.CREATE_TOKEN_PAGE}
        target="_blank"
        rel="noopener noreferrer"
      >
        Where can I find it?
      </a>
    </div>
  );
};
