import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { HookScene } from "./scenes/HookScene";
import { OnboardingDemo } from "./scenes/OnboardingDemo";
import { DashboardShowcase } from "./scenes/DashboardShowcase";
import { CTAScene } from "./scenes/CTAScene";

const TRANSITION = 10; // frames

export const AppPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Music volume: fade out over last 2 seconds (60 frames)
  const musicVolume = interpolate(
    frame,
    [0, 10, durationInFrames - 60, durationInFrames],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      {/* Background music */}
      <Audio src={staticFile("music.mp3")} volume={musicVolume} />

      {/* Scene sequence with transitions */}
      <TransitionSeries>
        {/* Scene 1: Hook — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION })}
        />

        {/* Scene 2: Onboarding Demo — 10s */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <OnboardingDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 3: Dashboard Showcase — 6s */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <DashboardShowcase />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* Scene 4: CTA — 4s + extra to absorb transitions */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
