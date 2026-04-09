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
    </>
  );
};
