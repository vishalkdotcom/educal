import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * OutroSlideStatic — alternative to OutroSlide.tsx.
 *
 * Instead of reusing the full-screen outro scenes via <Freeze> + CSS scale,
 * this variant builds 6 dedicated mini-card components authored directly
 * at the grid-cell size (~600×338). It duplicates the frozen copy strings
 * from docs/PRESENTATION_COPY.md but gives pixel-precise control over
 * typography, padding, and visual hierarchy at the small cell size.
 *
 * Compare against OutroSlide to decide which renders more cleanly when
 * dropped full-bleed into PowerPoint.
 */

const CELL_W = 600;
const CELL_H = 338;
const GRID_GAP = 22;

const cellBase: React.CSSProperties = {
  width: CELL_W,
  height: CELL_H,
  borderRadius: 16,
  border: "1px solid rgba(144, 202, 249, 0.28)",
  boxShadow: "0 10px 36px rgba(0, 0, 0, 0.5)",
  background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
  padding: "22px 26px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
};

const labelStyle: React.CSSProperties = {
  fontFamily,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 3,
  textTransform: "uppercase",
  color: colors.primaryLight,
};

// ─── Tile 1: PROBLEM ──────────────────────────────────────────────────
const ProblemTile: React.FC = () => (
  <div style={cellBase}>
    <div style={labelStyle}>1 · Problem</div>
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        textAlign: "center",
        padding: "0 8px",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 800,
          color: colors.white,
          lineHeight: 1.18,
          letterSpacing: -0.6,
        }}
      >
        Planning your child&apos;s education starts with three questions.
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 16,
          fontWeight: 400,
          color: colors.slate300,
          lineHeight: 1.35,
          fontStyle: "italic",
        }}
      >
        How much? When? How do I save for it?
      </div>
    </div>
  </div>
);

// ─── Tile 2: TOOLS ────────────────────────────────────────────────────
type ToolNode = {
  name: string;
  who: string;
  stretch?: boolean;
};
const TOOL_NODES: ToolNode[] = [
  { name: "Stitch", who: "Imam" },
  { name: "Claude Code", who: "Vishal", stretch: true },
  { name: "Gemini API", who: "Vishal" },
  { name: "Maestro", who: "Kavya" },
  { name: "Remotion", who: "Vishal" },
];

const ToolsTile: React.FC = () => {
  const nodeW = 92;
  const nodeH = 90;
  const gap = 10;
  return (
    <div style={cellBase}>
      <div style={labelStyle}>2 · Tools</div>
      <div
        style={{
          fontFamily,
          fontSize: 18,
          fontWeight: 800,
          color: colors.white,
          lineHeight: 1.15,
          letterSpacing: -0.4,
          marginTop: 6,
          textAlign: "center",
        }}
      >
        Five stretches. One chat. MCP as the wiring.
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap,
            position: "relative",
          }}
        >
          {/* Connector wire — behind nodes */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 8,
              right: 8,
              height: 2,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
              borderRadius: 1,
              boxShadow: `0 0 8px ${colors.primary}`,
              transform: "translateY(-50%)",
              zIndex: 0,
            }}
          />
          {TOOL_NODES.map((n) => (
            <div
              key={n.name}
              style={{
                width: nodeW,
                height: nodeH,
                borderRadius: 10,
                border: `1px solid rgba(144, 202, 249, ${n.stretch ? 0.6 : 0.3})`,
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(6px)",
                boxShadow: n.stretch
                  ? `0 4px 18px rgba(33, 150, 243, 0.45)`
                  : `0 4px 14px rgba(0, 0, 0, 0.45)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "6px 4px",
                gap: 4,
                zIndex: 1,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily,
                  fontSize: 12,
                  fontWeight: 800,
                  color: colors.white,
                  textAlign: "center",
                  lineHeight: 1.1,
                  letterSpacing: -0.2,
                }}
              >
                {n.name}
              </div>
              <div
                style={{
                  fontFamily,
                  fontSize: 9,
                  fontWeight: 700,
                  color: n.stretch ? colors.primary : colors.primaryLight,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                }}
              >
                {n.stretch ? "stretch" : "new"} · {n.who}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 13,
          fontWeight: 600,
          color: colors.primaryLight,
          textAlign: "center",
          fontStyle: "italic",
          lineHeight: 1.3,
        }}
      >
        Manual chain today. Autonomous tomorrow.
      </div>
    </div>
  );
};

// ─── Tile 3: OUTPUT ───────────────────────────────────────────────────
const OutputTile: React.FC = () => (
  <div style={cellBase}>
    <div style={labelStyle}>3 · Output</div>
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: 12,
        alignItems: "stretch",
        marginTop: 10,
      }}
    >
      {/* App mockup — tall phone shape */}
      <div
        style={{
          flex: "0 0 140px",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          background: colors.bgDark,
          position: "relative",
        }}
      >
        <Img
          src={staticFile("screenshots/step3-savings.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* Right column — Promo over Tests */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Promo card */}
        <div
          style={{
            flex: 1,
            borderRadius: 10,
            background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `22px solid ${colors.white}`,
              borderTop: "14px solid transparent",
              borderBottom: "14px solid transparent",
              marginLeft: 6,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
            }}
          />
          <div
            style={{
              fontFamily,
              fontSize: 9,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              background: "rgba(0,0,0,0.25)",
              padding: "3px 8px",
              borderRadius: 999,
            }}
          >
            Promo · 80s
          </div>
        </div>
        {/* Tests card — mini terminal */}
        <div
          style={{
            flex: 1,
            borderRadius: 10,
            background: "#0B1220",
            padding: "10px 12px",
            fontFamily: 'Menlo, Consolas, "Courier New", monospace',
            fontSize: 9,
            lineHeight: 1.45,
            color: "#CBD5E1",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FF5F57" }} />
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FFBD2E" }} />
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#28C840" }} />
          </div>
          <div style={{ color: "#64748B" }}># onboarding.yaml</div>
          <div>
            - <span style={{ color: "#90CAF9" }}>launchApp</span>
          </div>
          <div>
            - <span style={{ color: "#90CAF9" }}>tapOn:</span>{" "}
            <span style={{ color: "#FDE68A" }}>&quot;Add child&quot;</span>
          </div>
          <div>
            - <span style={{ color: "#90CAF9" }}>assertVisible:</span>{" "}
            <span style={{ color: "#FDE68A" }}>&quot;Monthly&quot;</span>
          </div>
        </div>
      </div>
    </div>
    <div
      style={{
        fontFamily,
        fontSize: 12,
        fontWeight: 600,
        color: colors.white,
        textAlign: "center",
        marginTop: 8,
        letterSpacing: -0.1,
      }}
    >
      Three deliverables. One week. Real output.
    </div>
  </div>
);

// ─── Tile 4: LEARNINGS ────────────────────────────────────────────────
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
  <div style={{ ...cellBase, gap: 10 }}>
    <div style={labelStyle}>4 · Learnings</div>
    <div
      style={{
        flex: 1,
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

// ─── Tile 5: NEXT TIME ────────────────────────────────────────────────
type NextBullet = { who: string; text: string };
const NEXT_BULLETS: NextBullet[] = [
  {
    who: "Vishal",
    text: "Next time I'm not babysitting. The AI can plan, build, test and fix itself.",
  },
  {
    who: "Kavya",
    text: "Start with AI-generated test plans. End with tests that fix themselves.",
  },
  {
    who: "Imam",
    text: "Spec first, prompt second. The tighter the brief, the closer the draft gets to production.",
  },
];

const NextTimeTile: React.FC = () => (
  <div style={{ ...cellBase, gap: 10 }}>
    <div style={labelStyle}>5 · Next Time</div>
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 4,
        justifyContent: "center",
      }}
    >
      {NEXT_BULLETS.map((b) => (
        <div
          key={b.who}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 13,
              fontWeight: 800,
              color: colors.primary,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              minWidth: 54,
              paddingTop: 2,
            }}
          >
            {b.who}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 500,
              color: colors.white,
              lineHeight: 1.35,
              flex: 1,
            }}
          >
            {b.text}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Tile 6: LOGO + PITCH CLOSE ───────────────────────────────────────
const LogoTile: React.FC = () => (
  <div
    style={{
      ...cellBase,
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
      background: `radial-gradient(circle at 50% 50%, rgba(33,150,243,0.25), ${colors.bgDark} 70%)`,
    }}
  >
    <Img
      src={staticFile("logo_landscape_no_text.png")}
      style={{ width: 260, height: "auto" }}
    />
    <div
      style={{
        fontFamily,
        fontSize: 14,
        fontWeight: 600,
        color: colors.primaryLight,
        textAlign: "center",
        fontStyle: "italic",
        letterSpacing: -0.1,
        maxWidth: 460,
        lineHeight: 1.35,
      }}
    >
      Five tools, one chat, one week. A real app for real parents.
    </div>
  </div>
);

// ─── Composite slide ──────────────────────────────────────────────────
export const OutroSlideStatic: React.FC = () => {
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

        {/* 2×3 grid of dedicated mini cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, ${CELL_W}px)`,
            gridTemplateRows: `repeat(2, ${CELL_H}px)`,
            columnGap: GRID_GAP,
            rowGap: GRID_GAP,
          }}
        >
          <ProblemTile />
          <ToolsTile />
          <OutputTile />
          <LearningsTile />
          <NextTimeTile />
          <LogoTile />
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
