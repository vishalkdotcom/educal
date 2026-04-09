import React from "react";
import { colors, fontFamily } from "../theme";
import { TOOL_NODES, TOOLS_HEADER, TOOLS_BOTTOM_STAMP } from "./outroContent";

/**
 * Static rendering of the 5-node tools pipeline for backup slides.
 *
 * This is the centerpiece of the presentation and the main reason the
 * previous grid-based backup slide failed — the video version uses
 * 320×260 glass cards on a ~1816px row, which becomes illegible when
 * crushed into a 600px grid cell.
 *
 * Sizing here: cards 260×220, gaps 36px → row width 1444px, fits
 * comfortably inside the 1776px safe area with 166px gutters.
 *
 * Shared between BackupSlideBuild and BackupSlideHero so the hero
 * treatment is identical on both slide variants.
 */

const CARD_WIDTH = 260;
const CARD_HEIGHT = 220;
const CARD_GAP = 36;
const ROW_WIDTH =
  TOOL_NODES.length * CARD_WIDTH + (TOOL_NODES.length - 1) * CARD_GAP;

const StaticNode: React.FC<{ node: (typeof TOOL_NODES)[number] }> = ({
  node,
}) => {
  const isStretch = node.stampKind === "stretch";
  return (
    <div
      style={{
        position: "relative",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        zIndex: 2,
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
          borderRadius: 18,
          boxShadow: isStretch
            ? "0 8px 40px rgba(33, 150, 243, 0.4)"
            : "0 8px 28px rgba(0, 0, 0, 0.42)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "22px 20px",
          gap: 14,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 800,
            color: colors.white,
            textAlign: "center",
            letterSpacing: -0.4,
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

      {/* Attribution stamp */}
      <div
        style={{
          position: "absolute",
          top: -14,
          right: -10,
          transform: "rotate(4deg)",
          transformOrigin: "center",
          background: isStretch ? colors.primary : colors.primaryContainer,
          color: isStretch ? colors.white : colors.primaryDark,
          fontFamily,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          padding: "7px 13px",
          borderRadius: 999,
          border: `2px solid ${colors.primary}`,
          boxShadow: "0 4px 14px rgba(33, 150, 243, 0.4)",
          whiteSpace: "nowrap",
        }}
      >
        {node.stamp}
      </div>
    </div>
  );
};

/**
 * Props.showHeader: include the section eyebrow + big header text above
 * the pipeline row. Both backup slides currently want this, but flipping
 * it off lets the pipeline be embedded inside a different layout without
 * doubling up on the scene label.
 */
export const ToolsPipeline: React.FC<{ showHeader?: boolean }> = ({
  showHeader = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      {showHeader && (
        <>
          <div
            style={{
              fontFamily,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: colors.primaryLight,
            }}
          >
            2 · Tools
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 38,
              fontWeight: 800,
              color: colors.white,
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: -0.8,
              maxWidth: 1400,
            }}
          >
            {TOOLS_HEADER}
          </div>
        </>
      )}

      {/* Pipeline row */}
      <div
        style={{
          position: "relative",
          width: ROW_WIDTH,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          isolation: "isolate",
        }}
      >
        {/* Static dim track */}
        <div
          style={{
            position: "absolute",
            left: CARD_WIDTH / 2,
            right: CARD_WIDTH / 2,
            top: "50%",
            height: 3,
            transform: "translateY(-50%)",
            background: "rgba(144, 202, 249, 0.18)",
            borderRadius: 2,
            zIndex: 1,
          }}
        />
        {/* Glowing wire */}
        <div
          style={{
            position: "absolute",
            left: CARD_WIDTH / 2,
            right: CARD_WIDTH / 2,
            top: "50%",
            height: 3,
            transform: "translateY(-50%)",
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
            borderRadius: 2,
            boxShadow: `0 0 16px ${colors.primary}`,
            zIndex: 1,
          }}
        />

        {TOOL_NODES.map((node) => (
          <StaticNode key={node.name} node={node} />
        ))}
      </div>

      {/* Bottom stamp */}
      <div
        style={{
          fontFamily,
          fontSize: 22,
          fontWeight: 600,
          color: colors.primaryLight,
          textAlign: "center",
          fontStyle: "italic",
          letterSpacing: -0.2,
        }}
      >
        {TOOLS_BOTTOM_STAMP}
      </div>
    </div>
  );
};
