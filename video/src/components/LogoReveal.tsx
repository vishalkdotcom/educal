import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

export const LogoReveal: React.FC<{
  delay?: number;
  width?: number;
  glowColor?: string;
}> = ({ delay = 0, width = 500, glowColor = "rgba(33, 150, 243, 0.3)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) return null;

  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.6, 1]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse that fades in and subtly pulses
  const glowIntensity = interpolate(
    adjustedFrame,
    [0, 20, 40, 60],
    [0, 1, 0.7, 0.5],
    { extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Glow burst behind logo */}
      <div
        style={{
          position: "absolute",
          width: width * 1.5,
          height: width * 0.8,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          opacity: glowIntensity,
          filter: "blur(30px)",
        }}
      />
      {/* Logo */}
      <Img
        src={staticFile("logo_landscape_no_text.png")}
        style={{
          width,
          opacity,
          transform: `scale(${scale})`,
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
};
