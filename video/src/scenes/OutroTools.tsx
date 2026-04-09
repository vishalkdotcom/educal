import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * Outro Scene 3: TOOLS (9s / 270 frames) — the hero card of the outro.
 *
 * A 5-node pipeline: Stitch → Claude Code → Gemini → Maestro → Remotion.
 * A wire draws left→right behind the nodes; each glass-card pops in on
 * spring, followed by its "new"/"stretch" attribution pill. A bottom stamp
 * lands last. Matches the frozen copy in docs/PRESENTATION_COPY.md.
 */

type PipelineNode = {
  name: string;
  micro: string;
  stamp: string;
  stampKind: "new" | "stretch";
};

const NODES: PipelineNode[] = [
  {
    name: "Stitch",
    micro: "drafting UI/UX",
    stamp: "new · Imam",
    stampKind: "new",
  },
  {
    name: "Claude Code",
    micro: "one chat, via MCP",
    stamp: "stretch · Vishal",
    stampKind: "stretch",
  },
  {
    name: "Gemini API",
    micro: "maps + search grounding",
    stamp: "new · Vishal",
    stampKind: "new",
  },
  {
    name: "Maestro",
    micro: "YAML test flows",
    stamp: "new · Kavya",
    stampKind: "new",
  },
  {
    name: "Remotion",
    micro: "this promo video",
    stamp: "new · Vishal",
    stampKind: "new",
  },
];

const CARD_WIDTH = 280;
const CARD_HEIGHT = 200;
const CARD_GAP = 50;
const ROW_WIDTH = NODES.length * CARD_WIDTH + (NODES.length - 1) * CARD_GAP;

const NODE_POP_START = 30;
const NODE_POP_STEP = 18;

const Node: React.FC<{ node: PipelineNode; index: number }> = ({
  node,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popStart = NODE_POP_START + index * NODE_POP_STEP;
  const nodeSpring = spring({
    frame: Math.max(0, frame - popStart),
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const opacity = interpolate(nodeSpring, [0, 1], [0, 1]);
  const scale = interpolate(nodeSpring, [0, 1], [0.75, 1]);
  const translateY = interpolate(nodeSpring, [0, 1], [20, 0]);

  // Stamp pops 10 frames after the node
  const stampStart = popStart + 10;
  const stampSpring = spring({
    frame: Math.max(0, frame - stampStart),
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 1]);
  const stampScale = interpolate(stampSpring, [0, 1], [0.6, 1]);

  const isStretch = node.stampKind === "stretch";

  return (
    <div
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {/* Glass card */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid rgba(144, 202, 249, ${isStretch ? 0.5 : 0.25})`,
          borderRadius: 20,
          boxShadow: isStretch
            ? `0 8px 40px rgba(33, 150, 243, 0.35)`
            : `0 8px 32px rgba(0, 0, 0, 0.35)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px 20px",
          gap: 14,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 34,
            fontWeight: 800,
            color: colors.white,
            textAlign: "center",
            letterSpacing: -0.5,
            lineHeight: 1.1,
          }}
        >
          {node.name}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 18,
            fontWeight: 400,
            color: colors.slate300,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {node.micro}
        </div>
      </div>

      {/* Attribution stamp (top-right pill) */}
      <div
        style={{
          position: "absolute",
          top: -16,
          right: -12,
          opacity: stampOpacity,
          transform: `scale(${stampScale}) rotate(4deg)`,
          transformOrigin: "center",
          background: isStretch ? colors.primary : colors.primaryContainer,
          color: isStretch ? colors.white : colors.primaryDark,
          fontFamily,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 1,
          textTransform: "uppercase",
          padding: "8px 14px",
          borderRadius: 999,
          border: `2px solid ${colors.primary}`,
          boxShadow: `0 4px 16px rgba(33, 150, 243, 0.4)`,
          whiteSpace: "nowrap",
        }}
      >
        {node.stamp}
      </div>
    </div>
  );
};

export const OutroTools: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label + header
  const labelOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerOpacity = interpolate(frame, [6, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [6, 20], [22, 0], {
    extrapolateRight: "clamp",
  });

  // Wire draws behind nodes
  const wireProgress = interpolate(frame, [15, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom stamp lands last
  const stampSpring = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const bottomStampOpacity = interpolate(stampSpring, [0, 1], [0, 1]);
  const bottomStampY = interpolate(stampSpring, [0, 1], [20, 0]);
  const bottomStampScale = interpolate(stampSpring, [0, 1], [0.9, 1]);

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "55%" }}
      glowColor={colors.primary}
      glowSize={1100}
      glowOpacity={0.16}
      particleCount={35}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 90,
          paddingBottom: 90,
          gap: 36,
        }}
      >
        {/* Label */}
        <div
          style={{
            opacity: labelOpacity,
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: colors.primaryLight,
          }}
        >
          2 · Tools
        </div>

        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            fontFamily,
            fontSize: 60,
            fontWeight: 800,
            color: colors.white,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -1,
            maxWidth: 1500,
          }}
        >
          Five stretches. One chat. MCP as the wiring.
        </div>

        {/* Pipeline row */}
        <div
          style={{
            position: "relative",
            width: ROW_WIDTH,
            marginTop: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Wire track (dim) */}
          <div
            style={{
              position: "absolute",
              left: CARD_WIDTH / 2,
              right: CARD_WIDTH / 2,
              top: "50%",
              height: 4,
              transform: "translateY(-50%)",
              background: "rgba(144, 202, 249, 0.15)",
              borderRadius: 2,
            }}
          />
          {/* Wire progress (glowing) */}
          <div
            style={{
              position: "absolute",
              left: CARD_WIDTH / 2,
              top: "50%",
              height: 4,
              width: `${wireProgress * (ROW_WIDTH - CARD_WIDTH)}px`,
              transform: "translateY(-50%)",
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
              borderRadius: 2,
              boxShadow: `0 0 16px ${colors.primary}`,
            }}
          />

          {NODES.map((node, i) => (
            <Node key={node.name} node={node} index={i} />
          ))}
        </div>

        {/* Bottom stamp */}
        <div
          style={{
            opacity: bottomStampOpacity,
            transform: `translateY(${bottomStampY}px) scale(${bottomStampScale})`,
            marginTop: "auto",
            fontFamily,
            fontSize: 32,
            fontWeight: 600,
            color: colors.primaryLight,
            textAlign: "center",
            fontStyle: "italic",
            maxWidth: 1400,
            lineHeight: 1.3,
          }}
        >
          Five tools, one chat. Manual chain today — autonomous tomorrow.
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
