import { Composition } from "remotion";
import { AppPromo } from "./AppPromo";
import "./index.css";
import { FPS, HEIGHT, TOTAL_DURATION, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AppPromo"
      component={AppPromo}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
