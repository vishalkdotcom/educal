import React from "react";
import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { PhoneMockup3D } from "../components/PhoneMockup3D";
import { FloatingStatCard } from "../components/FloatingStatCard";
import { ProgressRing } from "../components/ProgressRing";
import { KineticText } from "../components/KineticText";
import { colors, fontFamily } from "../theme";

/**
 * Scene 5: "Watch Your Savings Grow" (38-46s, 240 frames)
 * Dashboard demo with floating stat cards and progress ring.
 */
export const DashboardDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Switch between two dashboard recordings at midpoint
  const showSecondVideo = frame >= 120;

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "45%" }}
      glowColor={colors.success}
      glowSize={600}
      glowOpacity={0.06}
      particleCount={25}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Title */}
        <Sequence from={0} layout="none">
          <KineticText
            text="Track every milestone."
            mode="word"
            staggerFrames={5}
            fontSize={52}
            fontWeight={700}
            color={colors.white}
            highlightWords={[{ index: 2, color: colors.success }]}
          />
        </Sequence>

        {/* Phone + floating cards layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 60,
            position: "relative",
          }}
        >
          {/* Left floating cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              position: "relative",
              zIndex: 2,
            }}
          >
            <FloatingStatCard
              label="Monthly Goal"
              value="$425/mo"
              icon="💰"
              delay={40}
            />
            <FloatingStatCard
              label="Savings Progress"
              value="34%"
              icon="📈"
              delay={60}
            />
          </div>

          {/* Phone */}
          <PhoneMockup3D
            scale={0.8}
            delay={15}
            entryDirection="bottom"
            rotateX={6}
            rotateY={0}
            glowColor="rgba(16, 185, 129, 0.2)"
          >
            {!showSecondVideo ? (
              <OffthreadVideo
                src={staticFile("recordings/dashboard-home.mp4")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <OffthreadVideo
                src={staticFile("recordings/dashboard-progress.mp4")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </PhoneMockup3D>

          {/* Right side: progress ring + stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Sequence from={80} layout="none">
              <div style={{ position: "relative" }}>
                <ProgressRing
                  progress={0.67}
                  size={140}
                  strokeWidth={10}
                  color={colors.success}
                  startFrame={0}
                  duration={60}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.white,
                    fontFamily,
                  }}
                >
                  67%
                </div>
              </div>
            </Sequence>

            <FloatingStatCard
              label="On Track"
              value="2 of 3 kids"
              icon="✅"
              delay={100}
            />
          </div>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
