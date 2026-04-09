import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { LogoReveal } from "../components/LogoReveal";
import { colors, fontFamily } from "../theme";

/**
 * Outro Scene 7: FADE (1.5s / 45 frames).
 * Logo stamp + pitch close, fade to black.
 */
export const OutroFade: React.FC = () => {
  const frame = useCurrentFrame();

  // Tagline fades in as its own small entrance
  const taglineOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [8, 22], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Black overlay rises over the last 20 frames (fade to black)
  const blackOverlay = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Solid background from frame 0 — no wrapping opacity */}
      <SceneBackground
        glowPosition={{ x: "50%", y: "50%" }}
        glowColor={colors.primary}
        glowSize={800}
        glowOpacity={0.14}
        particleCount={20}
        particleColor={colors.primaryLight}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
          }}
        >
          <LogoReveal width={420} />
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
              fontFamily,
              fontSize: 34,
              fontWeight: 600,
              color: colors.primaryLight,
              textAlign: "center",
              letterSpacing: -0.3,
              fontStyle: "italic",
            }}
          >
            Five tools, one chat, one week. A real app for real parents.
          </div>
        </AbsoluteFill>
      </SceneBackground>

      {/* Fade to black — the only thing that controls the exit */}
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: blackOverlay,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
