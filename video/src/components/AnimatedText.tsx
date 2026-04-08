import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { colors } from "../theme";

type AnimationType = "fadeUp" | "fadeIn" | "spring";

export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  animation?: AnimationType;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  fontSize = 48,
  fontWeight = 700,
  color = colors.white,
  animation = "fadeUp",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) return null;

  let opacity = 1;
  let translateY = 0;
  let scale = 1;

  if (animation === "fadeUp") {
    opacity = interpolate(adjustedFrame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });
    translateY = interpolate(adjustedFrame, [0, 15], [30, 0], {
      extrapolateRight: "clamp",
    });
  } else if (animation === "fadeIn") {
    opacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
      extrapolateRight: "clamp",
    });
  } else if (animation === "spring") {
    const s = spring({ frame: adjustedFrame, fps, config: { damping: 200 } });
    opacity = s;
    scale = interpolate(s, [0, 1], [0.8, 1]);
  }

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontSize,
        fontWeight,
        color,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        textAlign: "center",
        lineHeight: 1.2,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
