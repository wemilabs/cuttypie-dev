"use client";

import { createElement, useState } from "react";
import { cn } from "@/lib/shadcn/utils";
import { Icons } from "@/components/icons";

interface OrbitIcon {
  name: string;
}

interface OrbitRotationProps {
  icons: OrbitIcon[];
  orbitCount?: number;
  orbitGap?: number;
  centerIcon: OrbitIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function OrbitRotation({
  icons,
  orbitCount = 3,
  orbitGap = 6,
  centerIcon,
  className,
  size = "md",
  ...props
}: OrbitRotationProps) {
  const [isPaused, setIsPaused] = useState(false);
  const iconsPerOrbit = Math.ceil(icons.length / orbitCount);

  const sizeClasses = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
  };

  const iconSizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full overflow-visible",
        className
      )}
      style={{ minHeight: "32rem" }}
      {...props}
    >
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={cn(
            "bg-background/90 border-white/15 flex items-center justify-center rounded-full border shadow-xl backdrop-blur-sm",
            sizeClasses[size]
          )}
        >
          {createElement(Icons[centerIcon.name as keyof typeof Icons], {
            className: cn(iconSizeClasses[size]),
          })}
        </div>

        {[...Array(orbitCount)].map((_, orbitIdx) => {
          const orbitSize = `${8 + orbitGap * (orbitIdx + 1)}rem`;
          const angleStep = (2 * Math.PI) / iconsPerOrbit;
          const animationDuration = `${12 + orbitIdx * 6}s`;

          return (
            <div
              key={orbitIdx}
              className="absolute rounded-full border-2 border-dotted border-white/15"
              style={{
                width: orbitSize,
                height: orbitSize,
                animation: `orbit-spin ${animationDuration} linear infinite`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {icons
                .slice(
                  orbitIdx * iconsPerOrbit,
                  orbitIdx * iconsPerOrbit + iconsPerOrbit
                )
                .map((iconConfig, iconIdx) => {
                  const angle = iconIdx * angleStep;
                  const radius = 50;
                  const x = radius + radius * Math.cos(angle);
                  const y = radius + radius * Math.sin(angle);

                  return (
                    <div
                      key={iconIdx}
                      className="absolute rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%) rotate(0deg)",
                      }}
                    >
                      {createElement(
                        Icons[iconConfig.name as keyof typeof Icons],
                        { className: cn(iconSizeClasses[size]) }
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
