"use client";

import { useEffect, useRef } from "react";

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 10;

      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Sky layer */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: "translate(calc(var(--mouse-x, 0px) * 0.1), calc(var(--mouse-y, 0px) * 0.1))",
          background: `
            radial-gradient(ellipse at 30% 20%, oklch(0.25 0.1 280) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, oklch(0.2 0.08 300) 0%, transparent 40%),
            linear-gradient(to bottom, oklch(0.08 0.05 280) 0%, oklch(0.12 0.04 280) 100%)
          `,
        }}
      >
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 60 + "%",
                backgroundColor: `oklch(0.9 0.05 ${Math.random() * 60 + 260})`,
                animationDelay: Math.random() * 3 + "s",
                animationDuration: 2 + Math.random() * 2 + "s",
              }}
            />
          ))}
        </div>
        {/* Moon */}
        <div
          className="absolute w-20 h-20 rounded-full"
          style={{
            top: "10%",
            right: "15%",
            background: `radial-gradient(circle at 35% 35%, oklch(0.95 0.02 280) 0%, oklch(0.8 0.05 280) 50%, oklch(0.6 0.1 280) 100%)`,
            boxShadow: `0 0 60px 20px oklch(0.5 0.1 280 / 0.3)`,
          }}
        />
      </div>

      {/* Far mountains */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%] transition-transform duration-300 ease-out"
        style={{
          transform: "translate(calc(var(--mouse-x, 0px) * 0.3), calc(var(--mouse-y, 0px) * 0.2))",
        }}
      >
        <svg viewBox="0 0 1440 400" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,400 L0,280 Q180,180 360,250 Q540,150 720,220 Q900,120 1080,200 Q1260,140 1440,180 L1440,400 Z"
            fill="oklch(0.15 0.06 280)"
          />
        </svg>
      </div>

      {/* Mid scenery */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] transition-transform duration-300 ease-out"
        style={{
          transform: "translate(calc(var(--mouse-x, 0px) * 0.5), calc(var(--mouse-y, 0px) * 0.3))",
        }}
      >
        <svg viewBox="0 0 1440 300" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,300 L0,200 Q120,150 240,180 Q360,100 480,160 Q600,80 720,140 Q840,60 960,120 Q1080,80 1200,150 Q1320,120 1440,170 L1440,300 Z"
            fill="oklch(0.12 0.05 280)"
          />
          {/* Trees silhouettes */}
          <path d="M100,200 L110,140 L120,200 Z" fill="oklch(0.1 0.04 280)" />
          <path d="M130,200 L145,120 L160,200 Z" fill="oklch(0.1 0.04 280)" />
          <path d="M350,180 L365,100 L380,180 Z" fill="oklch(0.1 0.04 280)" />
          <path d="M600,160 L620,70 L640,160 Z" fill="oklch(0.1 0.04 280)" />
          <path d="M900,140 L920,50 L940,140 Z" fill="oklch(0.1 0.04 280)" />
          <path d="M1100,170 L1120,80 L1140,170 Z" fill="oklch(0.1 0.04 280)" />
          <path d="M1300,150 L1320,60 L1340,150 Z" fill="oklch(0.1 0.04 280)" />
        </svg>
      </div>

      {/* Ground layer */}
      <div
        className="absolute inset-x-0 bottom-0 h-[25%] transition-transform duration-300 ease-out"
        style={{
          transform: "translate(calc(var(--mouse-x, 0px) * 0.8), calc(var(--mouse-y, 0px) * 0.4))",
        }}
      >
        <svg viewBox="0 0 1440 200" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.1 0.04 280)" />
              <stop offset="100%" stopColor="oklch(0.08 0.03 280)" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 L0,80 Q180,60 360,90 Q540,50 720,70 Q900,40 1080,80 Q1260,60 1440,100 L1440,200 Z"
            fill="url(#groundGradient)"
          />
          {/* Grass tufts */}
          <g fill="oklch(0.15 0.06 280)">
            <path d="M50,100 Q55,85 60,100" />
            <path d="M200,90 Q205,75 210,90" />
            <path d="M400,85 Q405,70 410,85" />
            <path d="M650,80 Q655,65 660,80" />
            <path d="M850,95 Q855,80 860,95" />
            <path d="M1050,75 Q1055,60 1060,75" />
            <path d="M1250,90 Q1255,75 1260,90" />
          </g>
        </svg>
      </div>

      {/* Atmospheric fog */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, oklch(0.1 0.04 280 / 0.6) 0%, transparent 30%),
            radial-gradient(ellipse at 50% 100%, oklch(0.15 0.06 280 / 0.4) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
