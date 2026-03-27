import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface UptimeBarProps {
  checks: Array<{ status: "up" | "down"; date?: string }>;
  className?: string;
}

export function UptimeBar({ checks, className }: UptimeBarProps) {
  // Pad to 30 items if needed
  const displayChecks = [...checks];
  while (displayChecks.length < 30) {
    displayChecks.unshift({ status: "up" });
  }
  const finalChecks = displayChecks.slice(-30);

  return (
    <div className={cn("flex items-center gap-[2px] h-6", className)}>
      {finalChecks.map((check, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex-1 h-full rounded-[1px] cursor-pointer transition-opacity hover:opacity-75",
                check.status === "up" ? "bg-success" : "bg-destructive"
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {check.date ? new Date(check.date).toLocaleDateString() : "Historical"} - {check.status.toUpperCase()}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
