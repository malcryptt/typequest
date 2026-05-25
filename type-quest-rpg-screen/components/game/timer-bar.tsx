"use client";

import { cn } from "@/lib/utils";

interface TimerBarProps {
  progress: number; // 0 to 1, where 1 is full
  className?: string;
}

export function TimerBar({ progress, className }: TimerBarProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const isLow = clampedProgress < 0.25;
  const isCritical = clampedProgress < 0.1;

  return (
    <div
      className={cn(
        "relative h-3 rounded-full overflow-hidden",
        "bg-[var(--glass-bg)] backdrop-blur-sm",
        "border border-[var(--glass-border)]",
        className
      )}
    >
      {/* Background glow */}
      <div
        className={cn(
          "absolute inset-0 opacity-30 transition-colors duration-300",
          isCritical && "bg-[var(--wrong-color)]",
          isLow && !isCritical && "bg-amber-500",
          !isLow && "bg-[var(--world-accent-color)]"
        )}
      />
      
      {/* Progress fill - drains from right to left */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full transition-all duration-100",
          isCritical && "bg-[var(--wrong-color)] animate-pulse",
          isLow && !isCritical && "bg-gradient-to-r from-amber-500 to-amber-400",
          !isLow && "bg-gradient-to-r from-[var(--world-accent-color)] to-[var(--accent)]"
        )}
        style={{
          width: `${clampedProgress * 100}%`,
          boxShadow: isCritical
            ? "0 0 20px var(--wrong-color), inset 0 1px 2px rgba(255,255,255,0.3)"
            : isLow
            ? "0 0 15px rgba(245, 158, 11, 0.5), inset 0 1px 2px rgba(255,255,255,0.3)"
            : "0 0 15px var(--world-accent-color), inset 0 1px 2px rgba(255,255,255,0.3)",
        }}
      />
      
      {/* Shine effect */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
