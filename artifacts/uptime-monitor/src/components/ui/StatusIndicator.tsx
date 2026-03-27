import { cn } from "@/lib/utils";

type Status = "up" | "down" | "paused" | "pending";

interface StatusIndicatorProps {
  status: Status;
  pulse?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({ status, pulse = true, className, size = "md" }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const bgClasses = {
    up: "bg-success",
    down: "bg-destructive",
    paused: "bg-muted-foreground",
    pending: "bg-warning",
  };

  const ringClasses = {
    up: "border-success",
    down: "border-destructive",
    paused: "border-muted-foreground",
    pending: "border-warning",
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <div className={cn("absolute inset-0 rounded-full", bgClasses[status])} />
      {pulse && status !== "paused" && (
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 animate-pulse-ring",
            ringClasses[status]
          )}
        />
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const labels = {
    up: "Operational",
    down: "Outage",
    paused: "Paused",
    pending: "Checking",
  };

  const badgeClasses = {
    up: "bg-success/10 text-success border-success/20",
    down: "bg-destructive/10 text-destructive border-destructive/20",
    paused: "bg-muted text-muted-foreground border-border",
    pending: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badgeClasses[status]
      )}
    >
      <StatusIndicator status={status} size="sm" pulse={status !== "paused"} />
      {labels[status]}
    </span>
  );
}
