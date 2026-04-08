import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const GlassCard: React.FC<{
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  blur?: number;
  bgOpacity?: number;
  borderRadius?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  width = "auto",
  height = "auto",
  blur = 20,
  bgOpacity = 0.05,
  borderRadius = 20,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) return null;

  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        width,
        height,
        background: `rgba(255, 255, 255, ${bgOpacity})`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
