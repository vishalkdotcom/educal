import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const ProgressRing: React.FC<{
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  startFrame?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#2196F3",
  trackColor = "rgba(255, 255, 255, 0.08)",
  startFrame = 0,
  duration = 60,
  style,
}) => {
  const frame = useCurrentFrame();

  const animatedProgress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, progress],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - animatedProgress);

  return (
    <svg width={size} height={size} style={style}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};
