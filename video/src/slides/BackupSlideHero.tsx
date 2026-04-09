import React from "react";
import { Img, staticFile } from "remotion";
import { colors, fontFamily } from "../theme";
import { BackupSlideShell } from "./BackupSlideShell";
import { ToolsPipeline } from "./ToolsPipeline";
import {
  HERO_EYEBROW,
  HERO_TITLE,
  HERO_BOTTOM_STAMP,
  PROBLEM_HEADLINE,
  PROBLEM_SUBHEAD,
  LEARNINGS_DISTILLED,
  NEXT_BULLETS_SHORT,
  PITCH_CLOSE,
} from "./outroContent";

/**
 * BackupSlideHero — single-slide alternative backup PNG.
 *
 * Unlike the two-slide set, this packs all 6 outro sections into one
 * 1920×1080 canvas. Rehearsal picks between this and the two-slide
 * set depending on whether the presenter wants to flip through 2 slides
 * or stay on one.
 *
 * Layout (1920×1080, tighter top strip at 100px):
 *   [100]  Top title strip               (shell, titleStripHeight=100)
 *   [ 16]  gap
 *   [ 88]  Problem ribbon
 *   [ 20]  gap
 *   [440]  Tools hero (shared ToolsPipeline)
 *   [ 20]  gap
 *   [240]  Bottom quad: Output | Learnings (distilled) | Next Time (short) | Logo close
 *   [ 40]  Bottom stamp                   (shell, bottomStampHeight=40)
 *
 * Trade-off vs two-slide: Learnings and Next Time are distilled to
 * ~10-word versions because full quotes don't fit at a readable size
 * in the 440px-wide bottom quad cells.
 */

// ─── Problem ribbon (tighter than Slide 1's 96px) ───────────────────
const ProblemRibbon: React.FC = () => (
  <div
    style={{
      height: 88,
      display: "flex",
      alignItems: "center",
      gap: 24,
      padding: "0 28px",
      border: "1px solid rgba(144, 202, 249, 0.28)",
      borderRadius: 14,
      background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.45)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontSize: 24,
          fontWeight: 800,
          color: colors.white,
          boxShadow: "0 4px 14px rgba(33, 150, 243, 0.45)",
        }}
      >
        1
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.primaryLight,
        }}
      >
        Problem
      </div>
    </div>

    <div
      style={{
        width: 1,
        alignSelf: "stretch",
        margin: "10px 0",
        background: "rgba(144, 202, 249, 0.2)",
      }}
    />

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 800,
          color: colors.white,
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}
      >
        {PROBLEM_HEADLINE}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 16,
          fontWeight: 400,
          color: colors.slate300,
          fontStyle: "italic",
          lineHeight: 1.3,
        }}
      >
        {PROBLEM_SUBHEAD}
      </div>
    </div>
  </div>
);

// ─── Tools hero block ───────────────────────────────────────────────
const ToolsBlock: React.FC = () => (
  <div
    style={{
      height: 440,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <ToolsPipeline />
  </div>
);

// ─── Bottom quad — 4 unequal cells ──────────────────────────────────
const quadCardBase: React.CSSProperties = {
  height: "100%",
  borderRadius: 14,
  border: "1px solid rgba(144, 202, 249, 0.22)",
  background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
  boxShadow: "0 6px 22px rgba(0, 0, 0, 0.42)",
  padding: "14px 16px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const quadLabelStyle: React.CSSProperties = {
  fontFamily,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 3,
  textTransform: "uppercase",
  color: colors.primaryLight,
  marginBottom: 8,
};

const OutputCell: React.FC = () => (
  <div style={{ ...quadCardBase, flex: "0 0 500px" }}>
    <div style={quadLabelStyle}>3 · Output</div>
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: 10,
        minHeight: 0,
      }}
    >
      {/* Phone mockup */}
      <div
        style={{
          flex: "0 0 112px",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          background: colors.bgDark,
        }}
      >
        <Img
          src={staticFile("screenshots/step3-savings.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* Right column: promo + tests stacked */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 0,
        }}
      >
        {/* Promo tile */}
        <div
          style={{
            flex: 1,
            borderRadius: 8,
            background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "0 12px",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `18px solid ${colors.white}`,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              marginLeft: 4,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
            }}
          />
          <div
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.1,
            }}
          >
            Promo · 80s
          </div>
        </div>
        {/* Tests tile */}
        <div
          style={{
            flex: 1,
            borderRadius: 8,
            background: "#0B1220",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              fontFamily: 'Menlo, Consolas, "Courier New", monospace',
              fontSize: 10,
              color: "#64748B",
            }}
          >
            # onboarding.yaml
          </div>
          <div
            style={{
              fontFamily: 'Menlo, Consolas, "Courier New", monospace',
              fontSize: 10,
              color: "#CBD5E1",
            }}
          >
            - <span style={{ color: "#90CAF9" }}>tapOn:</span>{" "}
            <span style={{ color: "#FDE68A" }}>&quot;Add child&quot;</span>
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 11,
              fontWeight: 700,
              color: colors.white,
              marginTop: 2,
            }}
          >
            Maestro E2E
          </div>
        </div>
      </div>
    </div>
    <div
      style={{
        fontFamily,
        fontSize: 11,
        fontWeight: 600,
        color: colors.primaryLight,
        textAlign: "center",
        marginTop: 6,
        fontStyle: "italic",
      }}
    >
      Three deliverables · one week
    </div>
  </div>
);

const LearningsCell: React.FC = () => (
  <div style={{ ...quadCardBase, flex: "0 0 440px" }}>
    <div style={quadLabelStyle}>4 · Learnings</div>
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "space-between",
        minHeight: 0,
      }}
    >
      {LEARNINGS_DISTILLED.map((q, i) => (
        <div
          key={q.name}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingTop: i === 0 ? 0 : 6,
            borderTop:
              i === 0 ? "none" : "1px solid rgba(144, 202, 249, 0.12)",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 13,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.1,
            }}
          >
            {q.name}
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                color: colors.primaryLight,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              · {q.role}
            </span>
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 12,
              fontWeight: 400,
              color: colors.slate300,
              lineHeight: 1.35,
              fontStyle: "italic",
            }}
          >
            &ldquo;{q.text}&rdquo;
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NextTimeCell: React.FC = () => (
  <div style={{ ...quadCardBase, flex: "0 0 440px" }}>
    <div style={quadLabelStyle}>5 · Next Time</div>
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "space-between",
        minHeight: 0,
      }}
    >
      {NEXT_BULLETS_SHORT.map((b, i) => (
        <div
          key={b.who}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            paddingTop: i === 0 ? 0 : 6,
            borderTop:
              i === 0 ? "none" : "1px solid rgba(144, 202, 249, 0.12)",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 10,
              fontWeight: 800,
              color: colors.primaryDark,
              background: colors.primaryContainer,
              padding: "3px 8px",
              borderRadius: 999,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            {b.who}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 12,
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

const LogoCloseCell: React.FC = () => (
  <div
    style={{
      ...quadCardBase,
      flex: "0 0 356px",
      background: `radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.22), ${colors.bgDark} 75%)`,
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 18px",
      gap: 10,
    }}
  >
    <Img
      src={staticFile("logo_landscape_no_text.png")}
      style={{ width: 220, height: "auto" }}
    />
    <div
      style={{
        fontFamily,
        fontSize: 12,
        fontWeight: 600,
        color: colors.primaryLight,
        fontStyle: "italic",
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      {PITCH_CLOSE}
    </div>
  </div>
);

const BottomQuad: React.FC = () => (
  <div
    style={{
      height: 240,
      display: "flex",
      gap: 16,
    }}
  >
    <OutputCell />
    <LearningsCell />
    <NextTimeCell />
    <LogoCloseCell />
  </div>
);

// ─── Composite slide ────────────────────────────────────────────────
export const BackupSlideHero: React.FC = () => {
  return (
    <BackupSlideShell
      eyebrow={HERO_EYEBROW}
      title={HERO_TITLE}
      bottomStamp={HERO_BOTTOM_STAMP}
      titleStripHeight={100}
      bottomStampHeight={40}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: 16,
          paddingBottom: 8,
          gap: 20,
          minHeight: 0,
        }}
      >
        <ProblemRibbon />
        <ToolsBlock />
        <BottomQuad />
      </div>
    </BackupSlideShell>
  );
};
