import { Composition } from "remotion";
import { AppPromo } from "./AppPromo";
import "./index.css";
import { FPS, HEIGHT, TOTAL_DURATION, WIDTH } from "./theme";
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
       * Session 2 previews — temporary standalone compositions for each
       * outro scene so they can be inspected in Remotion Studio.
       * Kept until Session 3 wires them into AppPromo.
       */}
      <Composition
        id="Preview-OutroTitle"
        component={OutroTitle}
        durationInFrames={45}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroProblem"
        component={OutroProblem}
        durationInFrames={90}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroTools"
        component={OutroTools}
        durationInFrames={270}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroOutput"
        component={OutroOutput}
        durationInFrames={120}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroLearnings"
        component={OutroLearnings}
        durationInFrames={210}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroNextTime"
        component={OutroNextTime}
        durationInFrames={90}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Preview-OutroFade"
        component={OutroFade}
        durationInFrames={45}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
