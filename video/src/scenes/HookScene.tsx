import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { KineticText } from "../components/KineticText";
import { colors } from "../theme";

/**
 * Scene 1: "Every Parent's Dream" (0-8s, 240 frames)
 * Emotional hook — no product, no stats yet.
 * Three lines build aspirational → concern.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Line 3 shifts color toward muted to convey concern
  const line3Opacity = interpolate(frame, [140, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "45%" }}
      glowColor={colors.primary}
      glowSize={700}
      glowOpacity={0.06}
      particleCount={35}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: "0 200px",
        }}
      >
        {/* Line 1: Aspirational */}
        <KineticText
          text="You dream of the best for your child."
          mode="word"
          staggerFrames={4}
          fontSize={62}
          fontWeight={700}
          color={colors.white}
          delay={15}
          textAlign="center"
        />

        {/* Line 2: Builds on the dream */}
        <KineticText
          text="The best schools. The best future."
          mode="word"
          staggerFrames={4}
          fontSize={54}
          fontWeight={600}
          color={colors.primaryLight}
          delay={70}
          textAlign="center"
        />

        {/* Line 3: The turn — concern */}
        <div style={{ opacity: line3Opacity, marginTop: 20 }}>
          <KineticText
            text="But rising costs make it feel impossible."
            mode="word"
            staggerFrames={4}
            fontSize={50}
            fontWeight={500}
            color={colors.slate300}
            delay={140}
            textAlign="center"
          />
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
