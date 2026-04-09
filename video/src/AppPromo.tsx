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
import { OutroTitle } from "./scenes/OutroTitle";
import { OutroProblem } from "./scenes/OutroProblem";
import { OutroTools } from "./scenes/OutroTools";
import { OutroOutput } from "./scenes/OutroOutput";
import { OutroLearnings } from "./scenes/OutroLearnings";
import { OutroNextTime } from "./scenes/OutroNextTime";
import { OutroFade } from "./scenes/OutroFade";
import {
  SCENE_HOOK,
  SCENE_PROBLEM,
  SCENE_SOLUTION,
  SCENE_FEATURES,
  SCENE_DASHBOARD,
  SCENE_CTA,
  SCENE_OUTRO_TITLE,
  SCENE_OUTRO_PROBLEM,
  SCENE_OUTRO_TOOLS,
  SCENE_OUTRO_OUTPUT,
  SCENE_OUTRO_LEARNINGS,
  SCENE_OUTRO_NEXT,
  SCENE_OUTRO_FADE,
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

        {FADE_TRANSITION}

        {/* === "How we built it" outro (~53s) === */}

        {/* Outro 1: Title card — 1.5s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_TITLE.duration}
        >
          <OutroTitle />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Outro 2: Problem — 5s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_PROBLEM.duration}
        >
          <OutroProblem />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Outro 3: Tools pipeline — 10s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_TOOLS.duration}
        >
          <OutroTools />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Outro 4: Output (3 deliverables) — 6s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_OUTPUT.duration}
        >
          <OutroOutput />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Outro 5: Learnings (3 quote cards) — 19s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_LEARNINGS.duration}
        >
          <OutroLearnings />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Outro 6: Next time (3 bullets) — 10s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_NEXT.duration}
        >
          <OutroNextTime />
        </TransitionSeries.Sequence>

        {FADE_TRANSITION}

        {/* Outro 7: Logo + fade to black — 1.5s */}
        <TransitionSeries.Sequence
          durationInFrames={SCENE_OUTRO_FADE.duration}
        >
          <OutroFade />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
