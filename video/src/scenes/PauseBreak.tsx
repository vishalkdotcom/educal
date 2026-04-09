import React from "react";
import { SceneBackground } from "../components/SceneBackground";
import { colors } from "../theme";

/**
 * A brief breath between the CTA (end of app promo) and the "How we
 * built it" outro title. Pure dark canvas with a subtle centered glow —
 * lets the viewer register the pivot from promo to build-story without
 * a harsh hard cut.
 */
export const PauseBreak: React.FC = () => {
  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "50%" }}
      glowColor={colors.primary}
      glowSize={500}
      glowOpacity={0.06}
      showGrid={false}
      showParticles={false}
    />
  );
};
