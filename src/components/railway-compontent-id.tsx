import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { cn } from "../lib/utils";

interface Props {
  className?: string;
  name: string;
  value: string;
}

export const RailwayComponentId = ({ className, name, value }: Props) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${name} copied to clipboard`);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "text-xs font-mono text-muted-foreground hover:text-muted-foreground/80 transition-colors cursor-pointer inline-flex flex-col items-start gap-1 leading-none",
            className,
          )}
          onClick={handleCopy}
        >
          <span className="text-muted-foreground/90">{name}</span>
          <span>{value}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to copy to clipboard</p>
      </TooltipContent>
    </Tooltip>
  );
};
