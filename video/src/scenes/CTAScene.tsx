import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { LogoReveal } from "../components/LogoReveal";
import { AnimatedText } from "../components/AnimatedText";
import { colors } from "../theme";

/**
 * Scene 6: "Start Today" (46-50s, 120 frames)
 * CTA with logo, tagline, download badge, website.
 */
export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge entrance
  const badgeSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);
  const badgeY = interpolate(badgeSpring, [0, 1], [30, 0]);

  // "Download Free" text
  const dlOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Website URL
  const urlOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "40%" }}
      glowColor={colors.primary}
      glowSize={800}
      glowOpacity={0.12}
      particleCount={40}
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
        {/* Logo with glow */}
        <Sequence from={0} layout="none">
          <LogoReveal width={460} />
        </Sequence>

        {/* Tagline */}
        <Sequence from={20} layout="none">
          <AnimatedText
            text="Plan your child's education journey today."
            fontSize={36}
            fontWeight={500}
            color={colors.primaryLight}
            animation="fadeUp"
          />
        </Sequence>

        {/* Google Play Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
            marginTop: 16,
          }}
        >
          <Img
            src={staticFile("google-play-badge.png")}
            style={{ width: 260, objectFit: "contain" }}
          />
        </div>

        {/* "Download Free" text */}
        <div
          style={{
            opacity: dlOpacity,
            fontSize: 22,
            fontWeight: 700,
            color: colors.success,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            textAlign: "center",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          DOWNLOAD FREE
        </div>

        {/* Website URL */}
        <div
          style={{
            opacity: urlOpacity,
            fontSize: 20,
            fontWeight: 400,
            color: colors.slate400,
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            textAlign: "center",
          }}
        >
          www.educal.app
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
