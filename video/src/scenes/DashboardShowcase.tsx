import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { PhoneMockup } from "../components/PhoneMockup";
import { FeaturePill } from "../components/FeaturePill";
import { colors } from "../theme";

const CLIP_DURATION = 90; // 3s each

export const DashboardShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #0a1628 0%, ${colors.bgDark} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Blue glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(33,150,243,0.1) 0%, transparent 70%)`,
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: colors.white,
            fontFamily: 'Inter, -apple-system, sans-serif',
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Track progress.
          <br />
          <span style={{ color: colors.primary }}>Watch it grow.</span>
        </div>
      </div>

      {/* Phone with dashboard recordings */}
      <div style={{ marginTop: 60 }}>
        <PhoneMockup scale={1.7}>
          <Sequence from={0} durationInFrames={CLIP_DURATION}>
            <Video
              src={staticFile("recordings/dashboard-home.mp4")}
              trimBefore={0.5}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              volume={0}
            />
          </Sequence>
          <Sequence from={CLIP_DURATION} durationInFrames={CLIP_DURATION}>
            <Video
              src={staticFile("recordings/dashboard-progress.mp4")}
              trimBefore={1}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              volume={0}
            />
          </Sequence>
        </PhoneMockup>
      </div>

      {/* Feature pills at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        <FeaturePill text="AI School Search" delay={20} icon="🔍" />
        <FeaturePill text="Growth Projections" delay={35} icon="📈" />
        <FeaturePill text="Savings Tracker" delay={50} icon="💰" />
      </div>
    </AbsoluteFill>
  );
};
