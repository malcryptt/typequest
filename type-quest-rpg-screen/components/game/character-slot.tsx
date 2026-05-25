"use client";

interface CharacterSlotProps {
  characterEmoji?: string;
}

export function CharacterSlot({ characterEmoji = "🧙" }: CharacterSlotProps) {
  return (
    <div className="relative">
      {/* Character with drop shadow compositing */}
      <div
        className="relative text-7xl md:text-8xl lg:text-9xl select-none"
        style={{
          filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))",
          transform: "translateY(-10px)",
        }}
      >
        <span
          className="block animate-float"
          style={{
            animation: "float 3s ease-in-out infinite",
          }}
        >
          {characterEmoji}
        </span>
      </div>
      
      {/* Ground shadow ellipse */}
      <div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full animate-pulse"
        style={{
          background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, transparent 70%)",
        }}
      />
      
      {/* Magical aura */}
      <div
        className="absolute inset-0 -z-10 animate-pulse"
        style={{
          filter: "blur(20px)",
          background: "radial-gradient(circle, var(--world-accent-color) 0%, transparent 70%)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
