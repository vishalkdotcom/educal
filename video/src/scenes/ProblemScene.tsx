import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { AnimatedText } from "../components/AnimatedText";
import { colors, fontFamily } from "../theme";

/**
 * Scene 2: "The Reality" (8-16s, 240 frames)
 * Animated cost counters + rising bar chart.
 */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Bar chart animation
  const barProgress = interpolate(frame, [30, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bars = [
    { year: "2020", height: 45, color: colors.primaryLight },
    { year: "2025", height: 62, color: colors.primary },
    { year: "2030", height: 78, color: colors.primary },
    { year: "2035", height: 92, color: colors.amber },
    { year: "2040", height: 100, color: colors.amber },
  ];

  return (
    <SceneBackground
      glowPosition={{ x: "30%", y: "50%" }}
      glowColor={colors.amber}
      glowSize={500}
      glowOpacity={0.05}
      particleCount={25}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          gap: 100,
        }}
      >
        {/* Left side: Stats */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 32,
            maxWidth: 700,
          }}
        >
          <Sequence from={0} layout="none">
            <AnimatedText
              text="Education costs rose"
              fontSize={36}
              fontWeight={500}
              color={colors.slate300}
              animation="fadeUp"
              style={{ textAlign: "left" }}
            />
          </Sequence>

          <Sequence from={10} layout="none">
            <AnimatedCounter
              end={8}
              startFrame={0}
              endFrame={40}
              format="percent"
              fontSize={120}
              fontWeight={800}
              color={colors.amber}
              style={{ textAlign: "left" }}
            />
          </Sequence>

          <Sequence from={20} layout="none">
            <AnimatedText
              text="this year alone."
              fontSize={36}
              fontWeight={500}
              color={colors.slate300}
              animation="fadeUp"
              style={{ textAlign: "left" }}
            />
          </Sequence>

          <Sequence from={80} layout="none">
            <div style={{ marginTop: 20 }}>
              <AnimatedText
                text="Average college cost:"
                fontSize={28}
                fontWeight={400}
                color={colors.slate400}
                animation="fadeUp"
                style={{ textAlign: "left" }}
              />
            </div>
          </Sequence>

          <Sequence from={90} layout="none">
            <AnimatedCounter
              end={54320}
              startFrame={0}
              endFrame={50}
              format="currency"
              fontSize={64}
              fontWeight={700}
              color={colors.white}
              style={{ textAlign: "left" }}
            />
          </Sequence>

          <Sequence from={150} layout="none">
            <div>
              <AnimatedText
                text="By 2040, it could be:"
                fontSize={28}
                fontWeight={400}
                color={colors.slate400}
                animation="fadeUp"
                style={{ textAlign: "left" }}
              />
            </div>
          </Sequence>

          <Sequence from={165} layout="none">
            <AnimatedCounter
              end={142000}
              startFrame={0}
              endFrame={60}
              format="currency"
              fontSize={72}
              fontWeight={800}
              color={colors.amber}
              style={{ textAlign: "left" }}
            />
          </Sequence>
        </div>

        {/* Right side: Bar chart */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 24,
            height: 400,
            paddingBottom: 40,
          }}
        >
          {bars.map((bar, i) => {
            const barDelay = i * 0.15;
            const adjustedProgress = Math.max(
              0,
              Math.min(1, (barProgress - barDelay) / (1 - barDelay)),
            );
            const barHeight = bar.height * 3.5 * adjustedProgress;

            return (
              <div
                key={bar.year}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: barHeight,
                    background: `linear-gradient(to top, ${bar.color}, ${bar.color}88)`,
                    borderRadius: "8px 8px 0 0",
                    boxShadow: `0 0 20px ${bar.color}33`,
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    color: colors.slate400,
                    fontFamily,
                    fontWeight: 500,
                  }}
                >
                  {bar.year}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
