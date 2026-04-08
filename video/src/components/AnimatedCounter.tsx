import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { colors, fontFamily } from "../theme";

export const AnimatedCounter: React.FC<{
  start?: number;
  end: number;
  startFrame?: number;
  endFrame?: number;
  prefix?: string;
  suffix?: string;
  format?: "currency" | "number" | "percent";
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({
  start = 0,
  end,
  startFrame = 0,
  endFrame = 60,
  prefix = "",
  suffix = "",
  format = "number",
  fontSize = 72,
  fontWeight = 800,
  color = colors.white,
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const value = start + (end - start) * progress;

  let formatted: string;
  if (format === "currency") {
    formatted = "$" + Math.round(value).toLocaleString("en-US");
  } else if (format === "percent") {
    formatted = value.toFixed(1) + "%";
  } else {
    formatted = Math.round(value).toLocaleString("en-US");
  }

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily,
        opacity,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {prefix}
      {formatted}
      {suffix}
    </div>
  );
};
