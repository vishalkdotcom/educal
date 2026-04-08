import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { colors } from "../theme";
import { ParticleField } from "./ParticleField";

export const SceneBackground: React.FC<{
  gradient?: string;
  showGrid?: boolean;
  showParticles?: boolean;
  particleCount?: number;
  particleColor?: string;
  glowPosition?: { x: string; y: string };
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;
  children?: React.ReactNode;
}> = ({
  gradient,
  showGrid = true,
  showParticles = true,
  particleCount = 40,
  particleColor = colors.white,
  glowPosition = { x: "50%", y: "40%" },
  glowColor = colors.primary,
  glowSize = 600,
  glowOpacity = 0.08,
  children,
}) => {
  const frame = useCurrentFrame();

  const defaultGradient = `linear-gradient(170deg, ${colors.bgDark} 0%, ${colors.bgDeep} 100%)`;

  // Slow drift on the glow
  const glowX = interpolate(frame, [0, 1500], [0, 30], {
    extrapolateRight: "clamp",
  });
  const glowY = interpolate(frame, [0, 1500], [0, -15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <AbsoluteFill style={{ background: gradient || defaultGradient }} />

      {/* Subtle grid pattern */}
      {showGrid && (
        <AbsoluteFill
          style={{
            opacity: 0.035,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: `translateY(${frame * 0.05}px)`,
          }}
        />
      )}

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          left: glowPosition.x,
          top: glowPosition.y,
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: glowOpacity,
          transform: `translate(-50%, -50%) translate(${glowX}px, ${glowY}px)`,
          filter: "blur(40px)",
        }}
      />

      {/* Particles */}
      {showParticles && (
        <ParticleField count={particleCount} color={particleColor} />
      )}

      {/* Children (scene content) */}
      {children}
    </AbsoluteFill>
  );
};
