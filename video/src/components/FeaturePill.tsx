import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { colors } from "../theme";

export const FeaturePill: React.FC<{
  text: string;
  delay?: number;
  icon?: string;
}> = ({ text, delay = 0, icon = "✨" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
        background: "rgba(33, 150, 243, 0.15)",
        border: `1px solid ${colors.primaryLight}`,
        borderRadius: 24,
        padding: "10px 24px",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: colors.white,
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        {text}
      </span>
    </div>
  );
};
