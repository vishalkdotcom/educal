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

  // Content opacity — fade to black over the last 15 frames
  const contentOpacity = interpolate(frame, [0, 10, 30, 45], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Black overlay rises over the last 20 frames
  const blackOverlay = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div style={{ opacity: contentOpacity }}>
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
                fontFamily,
                fontSize: 34,
                fontWeight: 600,
                color: colors.primaryLight,
                textAlign: "center",
                letterSpacing: -0.3,
                fontStyle: "italic",
              }}
            >
              Five tools, one chat, one week — a real app for real parents.
            </div>
          </AbsoluteFill>
        </SceneBackground>
      </div>

      {/* Fade to black */}
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
