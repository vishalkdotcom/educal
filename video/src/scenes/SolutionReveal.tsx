import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { LogoReveal } from "../components/LogoReveal";
import { KineticText } from "../components/KineticText";
import { GlassCard } from "../components/GlassCard";
import { colors } from "../theme";

/**
 * Scene 3: "Introducing EduCal" (16-22s, 180 frames)
 * Hero product reveal — logo, tagline, glass card.
 */
export const SolutionReveal: React.FC = () => {
  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "40%" }}
      glowColor={colors.primary}
      glowSize={800}
      glowOpacity={0.1}
      particleCount={30}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Glass card backdrop */}
        <GlassCard
          delay={5}
          width={700}
          bgOpacity={0.03}
          blur={30}
          borderRadius={32}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 80px",
            gap: 36,
          }}
        >
          {/* Logo */}
          <Sequence from={10} layout="none">
            <LogoReveal width={420} />
          </Sequence>

          {/* Tagline: "Calculate. Plan. Save." */}
          <Sequence from={40} layout="none">
            <KineticText
              text="Calculate.  Plan.  Save."
              mode="word"
              staggerFrames={12}
              fontSize={44}
              fontWeight={600}
              color={colors.primaryLight}
              textAlign="center"
              highlightWords={[
                { index: 0, color: colors.primary },
                { index: 1, color: colors.primaryLight },
                { index: 2, color: colors.success },
              ]}
            />
          </Sequence>

          {/* Sub-tagline */}
          <Sequence from={90} layout="none">
            <KineticText
              text="The smarter way to plan for education."
              mode="word"
              staggerFrames={3}
              fontSize={28}
              fontWeight={400}
              color={colors.slate400}
              textAlign="center"
            />
          </Sequence>
        </GlassCard>
      </AbsoluteFill>
    </SceneBackground>
  );
};
