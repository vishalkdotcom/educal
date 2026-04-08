import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { colors } from "../theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated counter: 0 → 8
  const counterProgress = interpolate(frame, [10, 50], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const counterValue = Math.round(counterProgress);

  // "Education costs rose" text
  const topTextOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const topTextY = interpolate(frame, [0, 15], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Percentage reveal
  const percentSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Subtext: "Is your family financially ready?"
  const subTextOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subTextY = interpolate(frame, [60, 80], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${colors.bgDark} 0%, ${colors.bgDarkLight} 50%, ${colors.bgDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(33,150,243,0.08) 0%, transparent 70%)`,
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Main text */}
      <div
        style={{
          opacity: topTextOpacity,
          transform: `translateY(${topTextY}px)`,
          fontSize: 42,
          fontWeight: 400,
          color: colors.onSurfaceVariant,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: 1,
        }}
      >
        Education costs rose
      </div>

      {/* Big animated percentage */}
      <div
        style={{
          transform: `scale(${0.5 + percentSpring * 0.5})`,
          opacity: percentSpring,
          fontSize: 160,
          fontWeight: 800,
          color: colors.primary,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: "center",
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {counterValue}%
      </div>

      <div
        style={{
          opacity: topTextOpacity,
          fontSize: 36,
          fontWeight: 400,
          color: colors.onSurfaceVariant,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        this year alone
      </div>

      {/* Subtext */}
      <div
        style={{
          opacity: subTextOpacity,
          transform: `translateY(${subTextY}px)`,
          fontSize: 44,
          fontWeight: 600,
          color: colors.white,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 800,
        }}
      >
        Is your family{"\n"}financially ready?
      </div>
    </AbsoluteFill>
  );
};
