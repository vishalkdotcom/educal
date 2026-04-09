import React from "react";
import { Img, staticFile } from "remotion";
import { colors, fontFamily } from "../theme";
import { BackupSlideShell } from "./BackupSlideShell";
import {
  REFLECT_EYEBROW,
  REFLECT_TITLE,
  REFLECT_BOTTOM_STAMP,
  LEARNINGS,
  NEXT_BULLETS,
  PITCH_CLOSE,
} from "./outroContent";

/**
 * BackupSlideReflect — Slide 2 of the two-slide backup set ("The Reflection").
 *
 * Layout (1920×1080, 1776×976 usable):
 *   [120]  Top title strip               (shell)
 *   [ 32]  gap
 *   [560]  Main content — two 50/50 columns:
 *            Left 858×560 : LEARNINGS (3 stacked quote cards)
 *            Right 858×560: NEXT TIME (3 stacked bullet cards)
 *   [ 32]  gap
 *   [200]  LOGO close block
 *   [ 44]  Bottom stamp                  (shell)
 *
 * Preserves the 3 Learnings quotes verbatim — this is the specific
 * win of the two-slide path over the single hero slide.
 */

// ─── Learnings column ───────────────────────────────────────────────
const LearningsColumn: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}
  >
    {/* Section label */}
    <div
      style={{
        fontFamily,
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: colors.primaryLight,
        marginBottom: 4,
      }}
    >
      4 · Learnings
    </div>

    {/* 3 stacked quote cards */}
    {LEARNINGS.map((q) => (
      <div
        key={q.name}
        style={{
          flex: 1,
          display: "flex",
          gap: 18,
          alignItems: "center",
          padding: "18px 22px",
          borderRadius: 14,
          border: "1px solid rgba(144, 202, 249, 0.22)",
          background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
          boxShadow: "0 6px 22px rgba(0, 0, 0, 0.42)",
          minHeight: 0,
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontSize: 26,
            fontWeight: 800,
            color: colors.white,
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(33, 150, 243, 0.4)",
          }}
        >
          {q.name[0]}
        </div>

        {/* Name + role + quote */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: 20,
                fontWeight: 800,
                color: colors.white,
                letterSpacing: -0.2,
              }}
            >
              {q.name}
            </div>
            <div
              style={{
                fontFamily,
                fontSize: 13,
                fontWeight: 700,
                color: colors.primaryLight,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {q.role}
            </div>
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 17,
              fontWeight: 400,
              color: colors.slate300,
              lineHeight: 1.4,
              fontStyle: "italic",
            }}
          >
            &ldquo;{q.text}&rdquo;
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Next Time column ───────────────────────────────────────────────
const NextTimeColumn: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}
  >
    {/* Section label */}
    <div
      style={{
        fontFamily,
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: colors.primaryLight,
        marginBottom: 4,
      }}
    >
      5 · Next Time
    </div>

    {/* 3 stacked bullet cards */}
    {NEXT_BULLETS.map((b) => (
      <div
        key={b.who}
        style={{
          flex: 1,
          display: "flex",
          gap: 18,
          alignItems: "center",
          padding: "18px 22px",
          borderRadius: 14,
          border: "1px solid rgba(144, 202, 249, 0.22)",
          background: `linear-gradient(160deg, ${colors.bgDarkLight} 0%, ${colors.bgDark} 100%)`,
          boxShadow: "0 6px 22px rgba(0, 0, 0, 0.42)",
          minHeight: 0,
        }}
      >
        {/* Arrow badge */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontSize: 26,
            fontWeight: 800,
            color: colors.white,
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(33, 150, 243, 0.45)",
          }}
        >
          →
        </div>

        {/* Name chip + text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minWidth: 0,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              fontFamily,
              fontSize: 12,
              fontWeight: 800,
              color: colors.primaryDark,
              background: colors.primaryContainer,
              padding: "4px 10px",
              borderRadius: 999,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {b.who}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: 500,
              color: colors.white,
              lineHeight: 1.35,
            }}
          >
            {b.text}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Logo close block ───────────────────────────────────────────────
const LogoClose: React.FC = () => (
  <div
    style={{
      height: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 14,
      background: `radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.18), transparent 70%)`,
      borderRadius: 16,
    }}
  >
    <Img
      src={staticFile("logo_landscape_no_text.png")}
      style={{
        width: 320,
        height: "auto",
      }}
    />
    <div
      style={{
        fontFamily,
        fontSize: 22,
        fontWeight: 600,
        color: colors.primaryLight,
        fontStyle: "italic",
        letterSpacing: -0.1,
        textAlign: "center",
        maxWidth: 900,
        lineHeight: 1.3,
      }}
    >
      {PITCH_CLOSE}
    </div>
  </div>
);

// ─── Composite slide ────────────────────────────────────────────────
export const BackupSlideReflect: React.FC = () => {
  return (
    <BackupSlideShell
      eyebrow={REFLECT_EYEBROW}
      title={REFLECT_TITLE}
      bottomStamp={REFLECT_BOTTOM_STAMP}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingTop: 32,
          gap: 32,
          minHeight: 0,
        }}
      >
        {/* Two-column main row */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 60,
            minHeight: 0,
          }}
        >
          <LearningsColumn />
          <NextTimeColumn />
        </div>

        {/* Logo close */}
        <LogoClose />
      </div>
    </BackupSlideShell>
  );
};
