import React from "react";
import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { PhoneMockup3D } from "../components/PhoneMockup3D";
import { FeatureStep } from "../components/FeatureStep";
import { FamilyIcon } from "../components/icons/FamilyIcon";
import { SchoolIcon } from "../components/icons/SchoolIcon";
import { SavingsIcon } from "../components/icons/SavingsIcon";
import { colors } from "../theme";

/**
 * Scene 4: "How It Works" (22-38s, 480 frames)
 * Three feature steps with phone recordings, alternating layout.
 */
export const FeatureShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const steps = [
    {
      title: "Add Your Family",
      description:
        "Tell us about your children — their ages, your location, and your financial snapshot.",
      video: "recordings/step1-family.mp4",
      icon: <FamilyIcon size={36} />,
      layout: "right" as const,
      startFrame: 0,
      duration: 150,
    },
    {
      title: "Find Schools with AI",
      description:
        "Our AI searches real schools near you with up-to-date costs — powered by Gemini.",
      video: "recordings/step2-school.mp4",
      icon: <SchoolIcon size={36} />,
      layout: "left" as const,
      startFrame: 160,
      duration: 150,
    },
    {
      title: "Get Your Savings Plan",
      description:
        "See exactly how much to save each month to reach your education goals.",
      video: "recordings/step3-savings.mp4",
      icon: <SavingsIcon size={36} />,
      layout: "right" as const,
      startFrame: 320,
      duration: 160,
    },
  ];

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "50%" }}
      glowColor={colors.primary}
      glowSize={600}
      glowOpacity={0.05}
      particleCount={20}
      showGrid={false}
    >
      {steps.map((step, i) => {
        // Cross-fade between steps
        const fadeIn = interpolate(
          frame,
          [step.startFrame, step.startFrame + 20],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const fadeOut = interpolate(
          frame,
          [
            step.startFrame + step.duration - 20,
            step.startFrame + step.duration,
          ],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const isLast = i === steps.length - 1;
        const opacity = fadeIn * (isLast ? 1 : fadeOut);

        if (
          frame < step.startFrame - 5 ||
          frame > step.startFrame + step.duration + 5
        ) {
          return null;
        }

        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <Sequence from={step.startFrame} durationInFrames={step.duration}>
              <FeatureStep
                title={step.title}
                description={step.description}
                stepNumber={i + 1}
                icon={step.icon}
                layout={step.layout}
                delay={10}
                phone={
                  <PhoneMockup3D
                    scale={0.85}
                    delay={5}
                    entryDirection={
                      step.layout === "right" ? "left" : "right"
                    }
                    rotateX={8}
                    rotateY={step.layout === "right" ? -6 : 6}
                  >
                    <OffthreadVideo
                      src={staticFile(step.video)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </PhoneMockup3D>
                }
              />
            </Sequence>
          </AbsoluteFill>
        );
      })}
    </SceneBackground>
  );
};
