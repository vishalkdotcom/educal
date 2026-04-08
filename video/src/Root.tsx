import "./index.css";
import { Composition } from "remotion";
import { AppPromo } from "./AppPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AppPromo"
        component={AppPromo}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
