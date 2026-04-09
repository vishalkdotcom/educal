import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * Outro Scene 6: NEXT TIME (3s / 90 frames).
 * Three bullets pop in one-by-one. Matches the "5 required items".
 */

type Bullet = {
  who: string;
  text: string;
};

const BULLETS: Bullet[] = [
  {
    who: "Vishal",
    text: "Next time I'm not babysitting. The AI can plan, build, test and fix itself.",
  },
  {
    who: "Kavya",
    text: "Start with AI-generated test plans. End with tests that fix themselves.",
  },
  {
    who: "Imam",
    text: "Spec first, prompt second. The tighter the brief, the closer the draft gets to production.",
  },
];

const Row: React.FC<{ bullet: Bullet; index: number }> = ({
  bullet,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = 14 + index * 14;
  const s = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: { damping: 16, stiffness: 140 },
  });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "18px 36px",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(144, 202, 249, 0.2)",
        borderRadius: 18,
        width: 1500,
      }}
    >
      {/* Arrow bullet */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: colors.primary,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily,
          fontSize: 26,
          fontWeight: 800,
          color: colors.white,
          flexShrink: 0,
          boxShadow: `0 4px 16px rgba(33, 150, 243, 0.4)`,
        }}
      >
        →
      </div>

      {/* Name chip */}
      <div
        style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 800,
          color: colors.primaryDark,
          background: colors.primaryContainer,
          padding: "6px 14px",
          borderRadius: 999,
          letterSpacing: 1,
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        {bullet.who}
      </div>

      {/* Text */}
      <div
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 500,
          color: colors.white,
          lineHeight: 1.3,
        }}
      >
        {bullet.text}
      </div>
    </div>
  );
};

export const OutroNextTime: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "50%" }}
      glowColor={colors.primary}
      glowSize={900}
      glowOpacity={0.12}
      particleCount={25}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          paddingTop: 80,
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
            marginBottom: 24,
          }}
        >
          5 · Next Time
        </div>

        {BULLETS.map((bullet, i) => (
          <Row key={bullet.who} bullet={bullet} index={i} />
        ))}
      </AbsoluteFill>
    </SceneBackground>
  );
};
