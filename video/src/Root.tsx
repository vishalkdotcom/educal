import { Composition } from "remotion";
import { AppPromo } from "./AppPromo";
import "./index.css";
import {
  FPS,
  HEIGHT,
  TOTAL_DURATION,
  WIDTH,
  SCENE_OUTRO_TITLE,
  SCENE_OUTRO_PROBLEM,
  SCENE_OUTRO_TOOLS,
  SCENE_OUTRO_OUTPUT,
  SCENE_OUTRO_LEARNINGS,
  SCENE_OUTRO_NEXT,
  SCENE_OUTRO_FADE,
} from "./theme";
import { OutroTitle } from "./scenes/OutroTitle";
import { OutroProblem } from "./scenes/OutroProblem";
import { OutroTools } from "./scenes/OutroTools";
import { OutroOutput } from "./scenes/OutroOutput";
import { OutroLearnings } from "./scenes/OutroLearnings";
import { OutroNextTime } from "./scenes/OutroNextTime";
import { OutroFade } from "./scenes/OutroFade";
import { OutroSlide } from "./scenes/OutroSlide";
import { OutroSlideStatic } from "./scenes/OutroSlideStatic";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppPromo"
        component={AppPromo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/*
       * Session 2/3 standalone previews — kept around so each outro scene
       * can still be inspected on its own in Remotion Studio after wiring.
       * Durations track theme.ts so they always match the live AppPromo.
       */}
      <Composition
        id="Preview-OutroTitle"
        component={OutroTitle}
        durationInFrames={SCENE_OUTRO_TITLE.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroProblem"
        component={OutroProblem}
        durationInFrames={SCENE_OUTRO_PROBLEM.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroTools"
        component={OutroTools}
        durationInFrames={SCENE_OUTRO_TOOLS.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroOutput"
        component={OutroOutput}
        durationInFrames={SCENE_OUTRO_OUTPUT.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroLearnings"
        component={OutroLearnings}
        durationInFrames={SCENE_OUTRO_LEARNINGS.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroNextTime"
        component={OutroNextTime}
        durationInFrames={SCENE_OUTRO_NEXT.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroFade"
        component={OutroFade}
        durationInFrames={SCENE_OUTRO_FADE.duration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/*
       * Session 4 — Backup slide PNGs. Rendered as stills via
       * `bun run slide` / `bun run slide-static`. OutroSlide reuses the
       * live outro scenes via <Freeze> + CSS zoom; OutroSlideStatic is a
       * dedicated mini-card rebuild for comparison.
       *
       * NOTE: durationInFrames MUST be ≥ the largest Freeze frame used
       * inside OutroSlide (currently 220 for OutroTools). Remotion's
       * useCurrentFrame() internally clamps to durationInFrames - 1, so
       * a 1-frame composition would force every Freeze(frame=80+) back
       * to 0 and render the scenes in their pre-entry state.
       */}
      <Composition
        id="OutroSlide"
        component={OutroSlide}
        durationInFrames={300}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="OutroSlideStatic"
        component={OutroSlideStatic}
        durationInFrames={1}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
