import React from "react";
import { Img, staticFile } from "remotion";
import { colors, fontFamily } from "../theme";
import { BackupSlideShell } from "./BackupSlideShell";
import { ToolsPipeline } from "./ToolsPipeline";
import {
  BUILD_EYEBROW,
  BUILD_TITLE,
  BUILD_BOTTOM_STAMP,
  PROBLEM_HEADLINE,
  PROBLEM_SUBHEAD,
  OUTPUT_ITEMS,
} from "./outroContent";

/**
 * BackupSlideBuild — Slide 1 of the two-slide backup set ("The Build").
 *
 * Layout (1920×1080, after 72/56/48 safe margins → 1776×976 usable):
 *   [120]  Top title strip              (handled by shell)
 *   [ 24]  gap
 *   [ 96]  PROBLEM ribbon               (horizontal banner, not a grid cell)
 *   [ 32]  gap
 *   [440]  TOOLS hero pipeline          (the centerpiece — full width)
 *   [ 28]  gap
 *   [196]  OUTPUT strip                 (3 columns)
 *   [ 16]  gap
 *   [ 44]  Bottom stamp                 (handled by shell)
 */

// ─── Problem ribbon ──────────────────────────────────────────────────
const ProblemRibbon: React.FC = () => (
  <div
    style={{
      height: 96,
      display: "flex",
      alignItems: "center",
      gap: 28,
      padding: "0 32px",
      border: "1px solid rgba(144, 202, 249, 0.28)",
      borderRadius: 16,
      background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.45)",
    }}
  >
    {/* Left: "1" badge + PROBLEM label */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontSize: 28,
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
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.primaryLight,
        }}
      >
        Problem
      </div>
    </div>

    {/* Vertical divider */}
    <div
      style={{
        width: 1,
        alignSelf: "stretch",
        margin: "12px 0",
        background: "rgba(144, 202, 249, 0.2)",
      }}
    />

    {/* Right: headline + subhead stacked tightly */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 32,
          fontWeight: 800,
          color: colors.white,
          letterSpacing: -0.6,
          lineHeight: 1.1,
        }}
      >
        {PROBLEM_HEADLINE}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 18,
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

// ─── Tools hero block (wraps the shared ToolsPipeline) ──────────────
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

// ─── Output strip ────────────────────────────────────────────────────
const outputCardBase: React.CSSProperties = {
  flex: 1,
  height: "100%",
  borderRadius: 14,
  border: "1px solid rgba(144, 202, 249, 0.22)",
  background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const OutputStrip: React.FC = () => (
  <div
    style={{
      height: 196,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    {/* Section label */}
    <div
      style={{
        fontFamily,
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: colors.primaryLight,
      }}
    >
      3 · Output
    </div>

    {/* 3 columns */}
    <div
      style={{
        flex: 1,
        display: "flex",
        gap: 22,
        minHeight: 0,
      }}
    >
      {/* App card — phone mockup + caption */}
      <div style={outputCardBase}>
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 14,
            alignItems: "stretch",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: "0 0 96px",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              background: colors.bgDark,
            }}
          >
            <Img
              src={staticFile("screenshots/step3-savings.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: 24,
                fontWeight: 800,
                color: colors.white,
                letterSpacing: -0.3,
              }}
            >
              {OUTPUT_ITEMS.app.title}
            </div>
            <div
              style={{
                fontFamily,
                fontSize: 14,
                fontWeight: 400,
                color: colors.slate300,
                lineHeight: 1.35,
              }}
            >
              {OUTPUT_ITEMS.app.caption}
            </div>
            <div
              style={{
                fontFamily,
                fontSize: 12,
                fontWeight: 500,
                color: colors.primaryLight,
                marginTop: 4,
              }}
            >
              Gemini school search
            </div>
          </div>
        </div>
      </div>

      {/* Promo card — gradient background */}
      <div
        style={{
          ...outputCardBase,
          background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          border: "1px solid rgba(144, 202, 249, 0.5)",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Play triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `34px solid ${colors.white}`,
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              marginLeft: 8,
              filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.4))",
            }}
          />
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.2,
            }}
          >
            {OUTPUT_ITEMS.promo.title}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: 0.4,
            }}
          >
            {OUTPUT_ITEMS.promo.caption}
          </div>
        </div>
      </div>

      {/* Tests card — dark terminal */}
      <div
        style={{
          ...outputCardBase,
          background: "#0B1220",
          padding: "14px 18px",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#FF5F57",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#FFBD2E",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#28C840",
            }}
          />
        </div>
        {/* Mini YAML */}
        <div
          style={{
            fontFamily: 'Menlo, Consolas, "Courier New", monospace',
            fontSize: 12,
            lineHeight: 1.5,
            color: "#CBD5E1",
            flex: 1,
          }}
        >
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
        {/* Caption */}
        <div
          style={{
            fontFamily,
            fontSize: 13,
            fontWeight: 700,
            color: colors.white,
            marginTop: 6,
            letterSpacing: 0.3,
          }}
        >
          {OUTPUT_ITEMS.tests.title}{" "}
          <span
            style={{
              color: colors.primaryLight,
              fontWeight: 500,
              fontSize: 12,
            }}
          >
            · {OUTPUT_ITEMS.tests.caption}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Composite slide ────────────────────────────────────────────────
export const BackupSlideBuild: React.FC = () => {
  return (
    <BackupSlideShell
      eyebrow={BUILD_EYEBROW}
      title={BUILD_TITLE}
      bottomStamp={BUILD_BOTTOM_STAMP}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 0,
          paddingTop: 24,
          paddingBottom: 16,
        }}
      >
        <ProblemRibbon />
        <ToolsBlock />
        <OutputStrip />
      </div>
    </BackupSlideShell>
  );
};
