import type * as React from "react";
import { cn } from "@/lib/utils";

interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  variant?: "default" | "alert" | "info";
}

export function StatusBar({
  leftContent,
  rightContent,
  variant = "default",
  className,
  ...props
}: StatusBarProps) {
  const variantStyles = {
    alert: "border-destructive/50 bg-destructive/10",
    default: "border-border bg-muted/50",
    info: "border-primary/50 bg-primary/10",
  };

  return (
    <div
      data-slot="tron-status-bar"
      data-variant={variant}
      className={cn(
        "flex items-center justify-between border-y px-4 py-2 font-mono text-xs uppercase tracking-widest",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4 text-foreground/80">
        {leftContent}
      </div>
      <div className="flex items-center gap-4 text-foreground/80">
        {rightContent}
      </div>
    </div>
  );
}

interface InfoPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "active" | "pending" | "complete";
  subtitle?: string;
  timestamp?: string;
  title: string;
}

export function InfoPanel({
  title,
  subtitle,
  timestamp,
  status = "active",
  children,
  className,
  ...props
}: InfoPanelProps) {
  const statusIndicator = {
    active: "bg-green-500",
    complete: "bg-primary",
    pending: "animate-pulse bg-amber-500",
  };

  return (
    <div
      data-slot="tron-info-panel"
      data-status={status}
      className={cn(
        "relative overflow-hidden rounded border border-border/50 bg-card/50 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-border/50 border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-3">
          <div
            className={cn("h-2 w-2 rounded-full", statusIndicator[status])}
          />
          <span className="font-mono text-[10px] text-foreground/80 uppercase tracking-widest">
            {subtitle}
          </span>
        </div>
        {timestamp ? (
          <span className="font-mono text-[10px] text-foreground/80">
            {timestamp}
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="mb-2 font-bold font-mono text-foreground text-lg uppercase tracking-wider">
          {title}
        </h3>
        {children}
      </div>

      <div className="pointer-events-none absolute top-2 right-2 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }, (_, index) => `dot-${index}`).map((dot) => (
          <div key={dot} className="h-1 w-1 rounded-full bg-primary/20" />
        ))}
      </div>
    </div>
  );
}

interface UplinkBarProps extends React.HTMLAttributes<HTMLDivElement> {
  channel: string;
  signal?: "strong" | "medium" | "weak";
  status?: string;
}

const SIGNAL_BARS = [5, 8, 11, 14];

export function UplinkBar({
  channel,
  status,
  signal = "strong",
  className,
  ...props
}: UplinkBarProps) {
  const signalBars = {
    medium: 2,
    strong: 4,
    weak: 1,
  };

  return (
    <div
      data-slot="tron-uplink-bar"
      data-signal={signal}
      className={cn(
        "flex items-center justify-between border-primary/30 border-y bg-primary/5 px-4 py-2 font-mono text-xs",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="text-glow">⚡</span>
        <span className="text-primary uppercase tracking-widest">
          UPLINK: {channel}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {status ? (
          <span className="text-foreground/80 uppercase tracking-widest">
            {status}
          </span>
        ) : null}

        <div className="flex items-end gap-0.5">
          {SIGNAL_BARS.map((height, index) => (
            <div
              key={height}
              className={cn(
                "w-1 rounded-t",
                index < signalBars[signal] ? "bg-primary" : "bg-primary/20",
              )}
              style={{ height }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProgressTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  currentLabel?: string;
  markers?: { position: number; label?: string; active?: boolean }[];
  progress: number;
}

export function ProgressTimeline({
  progress,
  markers = [],
  currentLabel,
  className,
  ...props
}: ProgressTimelineProps) {
  return (
    <div
      data-slot="tron-progress-timeline"
      className={cn("space-y-2", className)}
      {...props}
    >
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />

        <div
          data-slot="tron-progress-indicator"
          className="absolute top-0 h-full w-1 bg-destructive"
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        />

        {markers.map((marker) => (
          <div
            key={`${marker.position}-${marker.label ?? "marker"}`}
            className={cn(
              "absolute top-1/2 h-3 w-0.5 -translate-y-1/2",
              marker.active ? "bg-primary" : "bg-muted-foreground/50",
            )}
            style={{ left: `${marker.position}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-foreground/80 uppercase tracking-widest">
        <span>00:00</span>
        {currentLabel ? (
          <span className="text-primary">{currentLabel}</span>
        ) : null}
        <span>END</span>
      </div>
    </div>
  );
}
