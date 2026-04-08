import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { colors, fontFamily } from "../theme";

export const FeatureStep: React.FC<{
  title: string;
  description: string;
  stepNumber: number;
  icon: React.ReactNode;
  layout: "left" | "right";
  phone: React.ReactNode;
  delay?: number;
}> = ({ title, description, stepNumber, icon, layout, phone, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - delay;

  if (adjustedFrame < 0) return null;

  const textEntrance = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);
  const textX = interpolate(
    textEntrance,
    [0, 1],
    [layout === "left" ? -60 : 60, 0],
  );

  const isPhoneLeft = layout === "left";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 80,
        flexDirection: isPhoneLeft ? "row" : "row-reverse",
        padding: "0 120px",
      }}
    >
      {/* Phone side */}
      <div style={{ flex: "0 0 auto" }}>{phone}</div>

      {/* Text side */}
      <div
        style={{
          flex: 1,
          maxWidth: 600,
          opacity: textOpacity,
          transform: `translateX(${textX}px)`,
        }}
      >
        {/* Step number badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: colors.white,
              fontFamily,
            }}
          >
            {stepNumber}
          </div>
          <div style={{ width: 40, height: 40 }}>{icon}</div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: colors.white,
            fontFamily,
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: colors.slate400,
            fontFamily,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};
