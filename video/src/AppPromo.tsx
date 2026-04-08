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
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionReveal } from "./scenes/SolutionReveal";
import { FeatureShowcase } from "./scenes/FeatureShowcase";
import { DashboardDemo } from "./scenes/DashboardDemo";
import { CTAScene } from "./scenes/CTAScene";
import {
  SCENE_HOOK,
  SCENE_PROBLEM,
  SCENE_SOLUTION,
  SCENE_FEATURES,
  SCENE_DASHBOARD,
  SCENE_CTA,
  TRANSITION_DURATION,
} from "./theme";

const FADE_TRANSITION = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
  />
);

export const AppPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Music volume: fade in over first 0.5s, sustain, fade out over last 3s
  const musicVolume = interpolate(
    frame,
    [0, 15, durationInFrames - 90, durationInFrames],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      {/* Background music */}
      <Audio src={staticFile("music.mp3")} volume={musicVolume} />

      {/* Scene sequence with transitions */}
      <TransitionSeries>
        {/* Scene 1: Emotional Hook — 8s */}
        <TransitionSeries.Sequence durationInFrames={SCENE_HOOK.duration}>
          <HookScene />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Scene 2: The Problem — 8s */}
        <TransitionSeries.Sequence durationInFrames={SCENE_PROBLEM.duration}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        {/* Zoom-blur-like transition: fade with longer duration */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 3: Solution Reveal — 6s */}
        <TransitionSeries.Sequence durationInFrames={SCENE_SOLUTION.duration}>
          <SolutionReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITION_DURATION,
          })}
        />

        {/* Scene 4: Feature Showcase — 16s */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FEATURES.duration}>
          <FeatureShowcase />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Scene 5: Dashboard Demo — 8s */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DASHBOARD.duration}>
          <DashboardDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 6: CTA — 4s */}
        <TransitionSeries.Sequence durationInFrames={SCENE_CTA.duration}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
