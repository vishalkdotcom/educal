import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { seededRandom, randomInRange } from "../lib/random";
import { colors } from "../theme";

export const ParticleField: React.FC<{
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  maxOpacity?: number;
}> = ({
  count = 40,
  color = colors.white,
  minSize = 2,
  maxSize = 5,
  speed = 0.15,
  maxOpacity = 0.3,
}) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: randomInRange(i * 3, 0, 100),
      y: randomInRange(i * 3 + 1, 0, 100),
      size: randomInRange(i * 3 + 2, minSize, maxSize),
      opacity: randomInRange(i * 7, 0.08, maxOpacity),
      drift: randomInRange(i * 11, -0.02, 0.02),
    }));
  }, [count, minSize, maxSize, maxOpacity]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const yOffset = frame * speed * (0.5 + seededRandom(i * 13) * 0.5);
        const xOffset = Math.sin(frame * 0.02 + i) * 8 * p.drift * 10;
        const currentY = p.y - (yOffset % 120);
        const wrappedY = currentY < -5 ? currentY + 105 : currentY;

        const fadeIn = interpolate(frame, [0, 30], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + xOffset}%`,
              top: `${wrappedY}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity: p.opacity * fadeIn,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
