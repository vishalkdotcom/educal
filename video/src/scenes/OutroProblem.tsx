import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * Outro Scene 2: PROBLEM (3s / 90 frames).
 * Card 1 of the "5 required items" — headline + subhead, matches frozen copy.
 */
export const OutroProblem: React.FC = () => {
  const frame = useCurrentFrame();

  // Label "1. PROBLEM" pips in after the incoming 15f crossfade completes
  const labelOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Headline
  const headlineOpacity = interpolate(frame, [23, 39], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineY = interpolate(frame, [23, 39], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subhead
  const subOpacity = interpolate(frame, [37, 53], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [37, 53], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit fade over last 15 frames (scene is 150f)
  const exitOpacity = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "45%" }}
      glowColor={colors.primary}
      glowSize={800}
      glowOpacity={0.1}
      particleCount={25}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
          gap: 28,
          opacity: exitOpacity,
        }}
      >
        <div
          style={{
            opacity: labelOpacity,
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: colors.primaryLight,
          }}
        >
          1 · Problem
        </div>

        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily,
            fontSize: 88,
            fontWeight: 800,
            color: colors.white,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 1500,
          }}
        >
          Planning your child's education starts with three questions.
        </div>

        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontFamily,
            fontSize: 40,
            fontWeight: 400,
            color: colors.slate300,
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: 1300,
          }}
        >
          How much? When? How do I save for it?
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
