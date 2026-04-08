import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { colors, fontFamily } from "../theme";

type KineticMode = "word" | "character" | "line";

const AnimatedUnit: React.FC<{
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  isSpace?: boolean;
  startFrame: number;
}> = ({ text, fontSize, fontWeight, color, isSpace, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (isSpace) {
    return <span style={{ fontSize, display: "inline-block" }}>&nbsp;</span>;
  }

  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) {
    return (
      <span
        style={{
          display: "inline-block",
          opacity: 0,
          fontSize,
          fontWeight,
          fontFamily,
        }}
      >
        {text}
      </span>
    );
  }

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [25, 0]);

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px)`,
        fontSize,
        fontWeight,
        color,
        fontFamily,
      }}
    >
      {text}
    </span>
  );
};

export const KineticText: React.FC<{
  text: string;
  mode?: KineticMode;
  staggerFrames?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  delay?: number;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  style?: React.CSSProperties;
  /** Color override for specific words (0-indexed) */
  highlightWords?: { index: number; color: string }[];
}> = ({
  text,
  mode = "word",
  staggerFrames = 4,
  fontSize = 64,
  fontWeight = 800,
  color = colors.white,
  delay = 0,
  textAlign = "center",
  lineHeight = 1.3,
  style,
  highlightWords = [],
}) => {
  const units = React.useMemo(() => {
    if (mode === "line") {
      return text.split("\n");
    }
    if (mode === "character") {
      return text.split("");
    }
    // word mode — split into words and spaces
    return text.split(/(\s+)/).filter(Boolean);
  }, [text, mode]);

  const highlightMap = React.useMemo(() => {
    const map = new Map<number, string>();
    let wordIndex = 0;
    units.forEach((unit, i) => {
      if (mode === "word" && /^\s+$/.test(unit)) return;
      const highlight = highlightWords.find((h) => h.index === wordIndex);
      if (highlight) {
        map.set(i, highlight.color);
      }
      wordIndex++;
    });
    return map;
  }, [units, highlightWords, mode]);

  // Calculate start frame for each non-space unit
  let nonSpaceIndex = 0;

  return (
    <div
      style={{
        textAlign,
        lineHeight,
        whiteSpace: mode === "line" ? "pre-line" : "pre-wrap",
        ...style,
      }}
    >
      {units.map((unit, i) => {
        const isSpace = mode === "word" && /^\s+$/.test(unit);
        const unitColor = highlightMap.get(i) || color;
        const startFrame = isSpace ? 0 : delay + nonSpaceIndex * staggerFrames;

        if (!isSpace) nonSpaceIndex++;

        return (
          <AnimatedUnit
            key={i}
            text={unit}
            fontSize={fontSize}
            fontWeight={fontWeight}
            color={unitColor}
            isSpace={isSpace}
            startFrame={startFrame}
          />
        );
      })}
    </div>
  );
};
