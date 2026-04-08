import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { colors } from "../theme";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = logoSpring;

  // Tagline
  const taglineOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge slide up
  const badgeSpring = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const badgeY = interpolate(badgeSpring, [0, 1], [60, 0]);

  // "Download Free" text
  const dlOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${colors.bgDark} 0%, #0a1628 50%, ${colors.bgDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 60%)`,
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        <Img
          src={staticFile("logo_landscape.png")}
          style={{ width: 500, objectFit: "contain" }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: 40,
          fontWeight: 500,
          color: colors.primaryLight,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: "center",
          marginBottom: 60,
          letterSpacing: 0.5,
        }}
      >
        Secure Their Academic Future
      </div>

      {/* Google Play Badge */}
      <div
        style={{
          opacity: badgeSpring,
          transform: `translateY(${badgeY}px)`,
          marginBottom: 20,
        }}
      >
        <Img
          src={staticFile("google-play-badge.png")}
          style={{ width: 280, objectFit: "contain" }}
        />
      </div>

      {/* Download Free text */}
      <div
        style={{
          opacity: dlOpacity,
          fontSize: 30,
          fontWeight: 600,
          color: colors.success,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: "center",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Download Free
      </div>
    </AbsoluteFill>
  );
};
