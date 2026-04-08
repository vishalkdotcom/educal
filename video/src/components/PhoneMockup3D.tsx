import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const BORDER_RADIUS = 40;
const BEZEL = 8;
const NOTCH_WIDTH = 120;
const NOTCH_HEIGHT = 24;

export const PhoneMockup3D: React.FC<{
  children: React.ReactNode;
  scale?: number;
  delay?: number;
  entryDirection?: "bottom" | "left" | "right" | "none";
  rotateX?: number;
  rotateY?: number;
  showReflection?: boolean;
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  scale = 1,
  delay = 0,
  entryDirection = "bottom",
  rotateX = 12,
  rotateY = -5,
  showReflection = false,
  glowColor = "rgba(33, 150, 243, 0.2)",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) return null;

  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  // 3D rotation that eases to 0
  const rx = interpolate(entrance, [0, 1], [rotateX, 0]);
  const ry = interpolate(entrance, [0, 1], [rotateY, 0]);
  const tz = interpolate(entrance, [0, 1], [-80, 0]);

  // Entry position
  let entryX = 0;
  let entryY = 0;
  if (entryDirection === "bottom") {
    entryY = interpolate(entrance, [0, 1], [120, 0]);
  } else if (entryDirection === "left") {
    entryX = interpolate(entrance, [0, 1], [-200, 0]);
  } else if (entryDirection === "right") {
    entryX = interpolate(entrance, [0, 1], [200, 0]);
  }

  const opacity = interpolate(entrance, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        perspective: 1200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      <div
        style={{
          transform: `
            translate(${entryX}px, ${entryY}px)
            rotateX(${rx}deg)
            rotateY(${ry}deg)
            translateZ(${tz}px)
            scale(${scale})
          `,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Phone frame */}
        <div
          style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            borderRadius: BORDER_RADIUS,
            background: "#1a1a2e",
            padding: BEZEL,
            boxShadow: `
              0 25px 60px rgba(0, 0, 0, 0.6),
              0 0 60px ${glowColor},
              0 0 120px ${glowColor}
            `,
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: BEZEL,
              left: "50%",
              transform: "translateX(-50%)",
              width: NOTCH_WIDTH,
              height: NOTCH_HEIGHT,
              background: "#1a1a2e",
              borderRadius: "0 0 16px 16px",
              zIndex: 10,
            }}
          />
          {/* Screen */}
          <div
            style={{
              width: PHONE_WIDTH - BEZEL * 2,
              height: PHONE_HEIGHT - BEZEL * 2,
              borderRadius: BORDER_RADIUS - BEZEL,
              overflow: "hidden",
              position: "relative",
              background: "#000",
            }}
          >
            {children}
          </div>
        </div>

        {/* Reflection */}
        {showReflection && (
          <div
            style={{
              width: PHONE_WIDTH,
              height: 100,
              background: `linear-gradient(
                to bottom,
                rgba(255,255,255,0.04),
                transparent
              )`,
              borderRadius: "0 0 20px 20px",
              transform: "scaleY(-0.3) translateY(-10px)",
              opacity: 0.4,
              filter: "blur(4px)",
            }}
          />
        )}
      </div>
    </div>
  );
};
