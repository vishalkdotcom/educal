import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";
import { OutroProblem } from "./OutroProblem";
import { OutroTools } from "./OutroTools";
import { OutroOutput } from "./OutroOutput";
import { OutroNextTime } from "./OutroNextTime";
import { OutroFade } from "./OutroFade";

/**
 * OutroSlide — a single-frame composite of the 5 outro cards + an EduCal
 * logo cell, arranged as a 2×3 grid. Rendered as a still PNG via
 * `bun run slide` (see package.json) and used as the PowerPoint backup
 * slide for presentation day.
 *
 * Approach:
 *  - 5 of the 6 tiles reuse the existing OutroX scenes via <Freeze> at a
 *    frame where their internal animations have fully settled. Each scene
 *    renders at its native 1920×1080 and is CSS-scaled to fit its cell.
 *  - The LEARNINGS tile is inlined as a custom 3-quote stack, because
 *    OutroLearnings crossfades one quote at a time and no single frame
 *    shows all three.
 */

const CELL_W = 600;
const CELL_H = 338; // 600 * 9/16 preserves scene aspect
const SCALE = CELL_W / 1920; // ≈ 0.3125
const GRID_GAP = 22;

const cellCardStyle: React.CSSProperties = {
  width: CELL_W,
  height: CELL_H,
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid rgba(144, 202, 249, 0.28)",
  boxShadow: "0 10px 36px rgba(0, 0, 0, 0.5)",
  background: colors.bgDarkLight,
  position: "relative",
};

/**
 * Wrap a full-size (1920×1080) scene in a zoomed box that clips to the
 * grid cell. Uses CSS `zoom` (not `transform: scale`) because zoom
 * affects layout rather than paint — the inner AbsoluteFill descendants
 * size themselves against the zoomed box at its reduced dimensions,
 * which avoids the containing-block / absolute-positioning breakage
 * that `transform: scale` causes in headless Chromium here.
 */
const ScaledScene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={cellCardStyle}>
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        zoom: SCALE,
      }}
    >
      {children}
    </div>
  </div>
);

type MiniQuote = { name: string; role: string; text: string };

const LEARNINGS: MiniQuote[] = [
  {
    name: "Vishal",
    role: "Engineering",
    text: "First composition, first grounding, first Remotion — all wired into one chat via MCP.",
  },
  {
    name: "Kavya",
    role: "Testing",
    text: "Natural-language to Maestro YAML collapsed test authoring time. The AI caught edge cases I'd have missed.",
  },
  {
    name: "Imam",
    role: "Design",
    text: "Stitch is a phenomenal draft partner — but not a production finisher. Front-load the spec.",
  },
];

const LearningsTile: React.FC = () => (
  <div
    style={{
      ...cellCardStyle,
      padding: "22px 26px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div
      style={{
        fontFamily,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: colors.primaryLight,
      }}
    >
      4 · Learnings
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 2,
      }}
    >
      {LEARNINGS.map((q, i) => (
        <div
          key={q.name}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            paddingTop: i === 0 ? 0 : 10,
            borderTop:
              i === 0 ? "none" : "1px solid rgba(144, 202, 249, 0.12)",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 15,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.2,
            }}
          >
            {q.name}
            <span
              style={{
                fontWeight: 500,
                color: colors.slate400,
                marginLeft: 8,
                fontSize: 13,
              }}
            >
              · {q.role}
            </span>
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 400,
              color: colors.slate300,
              lineHeight: 1.35,
              fontStyle: "italic",
            }}
          >
            “{q.text}”
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const OutroSlide: React.FC = () => {
  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "50%" }}
      glowColor={colors.primary}
      glowSize={1100}
      glowOpacity={0.12}
      particleCount={30}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "60px 80px 48px",
        }}
      >
        {/* Top title strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: colors.primaryLight,
            }}
          >
            How we built it
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 56,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -1,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Five tools. One chat. One week.
          </div>
        </div>

        {/* 2×3 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, ${CELL_W}px)`,
            gridTemplateRows: `repeat(2, ${CELL_H}px)`,
            columnGap: GRID_GAP,
            rowGap: GRID_GAP,
          }}
        >
          {/* (0,0) PROBLEM */}
          <Freeze frame={80}>
            <ScaledScene>
              <OutroProblem />
            </ScaledScene>
          </Freeze>

          {/* (0,1) TOOLS — the hero cell */}
          <Freeze frame={220}>
            <ScaledScene>
              <OutroTools />
            </ScaledScene>
          </Freeze>

          {/* (0,2) OUTPUT */}
          <Freeze frame={150}>
            <ScaledScene>
              <OutroOutput />
            </ScaledScene>
          </Freeze>

          {/* (1,0) LEARNINGS — inline custom 3-stack */}
          <LearningsTile />

          {/* (1,1) NEXT TIME */}
          <Freeze frame={110}>
            <ScaledScene>
              <OutroNextTime />
            </ScaledScene>
          </Freeze>

          {/* (1,2) LOGO + pitch close */}
          <Freeze frame={55}>
            <ScaledScene>
              <OutroFade />
            </ScaledScene>
          </Freeze>
        </div>

        {/* Bottom stamp */}
        <div
          style={{
            fontFamily,
            fontSize: 26,
            fontWeight: 600,
            color: colors.primaryLight,
            textAlign: "center",
            fontStyle: "italic",
            letterSpacing: -0.2,
          }}
        >
          A real app for real parents.
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
