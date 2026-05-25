"use client";

import { cn } from "@/lib/utils";

interface HudPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function HudPanel({ children, className }: HudPanelProps) {
  return (
    <div
      className={cn(
        "relative px-4 py-2 rounded-xl",
        "bg-[var(--glass-bg)] backdrop-blur-md",
        "border border-[var(--glass-border)]",
        "shadow-[0_4px_30px_rgba(0,0,0,0.3)]",
        "before:absolute before:inset-0 before:rounded-xl",
        "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
        "before:pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatDisplayProps {
  icon: React.ReactNode;
  value: string | number;
  label?: string;
  accentColor?: string;
}

export function StatDisplay({ icon, value, label, accentColor }: StatDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xl"
        style={{ color: accentColor || "var(--world-accent-color)" }}
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground tabular-nums">
          {value}
        </span>
        {label && (
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
