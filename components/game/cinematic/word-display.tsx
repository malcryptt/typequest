"use client";

import { cn } from "@/lib/utils";

interface WordDisplayProps {
  word: string;
  typedChars: string;
  className?: string;
}

export function WordDisplay({ word, typedChars, className }: WordDisplayProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div
          className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-widest flex"
          style={{
            textShadow: "0 0 20px var(--world-accent-color), 0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          {word.split("").map((char, index) => {
            const typedChar = typedChars[index];
            let status: "correct" | "wrong" | "pending" = "pending";
            
            if (typedChar !== undefined) {
              status = typedChar.toLowerCase() === char.toLowerCase() ? "correct" : "wrong";
            }
            
            return (
              <span
                key={index}
                className={cn(
                  "relative transition-all duration-100",
                  status === "correct" && "text-[var(--correct-color)] scale-105",
                  status === "wrong" && "text-[var(--wrong-color)] animate-shake",
                  status === "pending" && "text-[var(--pending-color)]"
                )}
                style={{
                  textShadow:
                    status === "correct"
                      ? "0 0 20px var(--correct-color), 0 0 40px var(--correct-color)"
                      : status === "wrong"
                      ? "0 0 20px var(--wrong-color), 0 0 40px var(--wrong-color)"
                      : "0 0 10px var(--world-accent-color)",
                }}
              >
                {char}
                {/* Blinking cursor after the last typed character */}
                {index === typedChars.length && (
                  <span
                    className="absolute -right-0.5 top-0 bottom-0 w-0.5 bg-[var(--world-accent-color)] animate-blink"
                    style={{
                      boxShadow: "0 0 10px var(--world-accent-color)",
                    }}
                  />
                )}
              </span>
            );
          })}
          {/* Cursor at the start if nothing typed */}
          {typedChars.length === 0 && (
            <span
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--world-accent-color)] animate-blink"
              style={{
                boxShadow: "0 0 10px var(--world-accent-color)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
