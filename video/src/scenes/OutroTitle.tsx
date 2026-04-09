import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * Outro Scene 1: "How we built it" title card (1.5s / 45 frames).
 * Lightweight ident that signals the video is pivoting from promo to process.
 */
export const OutroTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 15], [20, 0], {
    extrapolateRight: "clamp",
  });

  const underlineWidth = interpolate(frame, [8, 28], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "50%" }}
      glowColor={colors.primary}
      glowSize={900}
      glowOpacity={0.14}
      particleCount={30}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily,
            fontSize: 96,
            fontWeight: 800,
            color: colors.white,
            textAlign: "center",
            letterSpacing: -1.5,
          }}
        >
          How we built it
        </div>
        <div
          style={{
            width: underlineWidth,
            height: 6,
            borderRadius: 3,
            background: colors.primary,
            boxShadow: `0 0 24px ${colors.primary}`,
          }}
        />
      </AbsoluteFill>
    </SceneBackground>
  );
};
