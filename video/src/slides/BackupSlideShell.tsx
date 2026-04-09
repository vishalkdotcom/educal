import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * BackupSlideShell — shared chrome for all backup PNG slides.
 *
 * Wraps SceneBackground with the same glow/particle config used by the
 * outro scenes and gives every slide identical:
 *  - safe margins (72px horizontal / 56px top / 48px bottom)
 *  - top title strip (eyebrow + headline)
 *  - bottom stamp strip
 *  - a flex-1 middle region where slide-specific content renders
 *
 * Keeping the chrome in one place means Slide-Build, Slide-Reflect and
 * Slide-Hero read as visual siblings when dropped back-to-back in PPTX.
 */

type Props = {
  eyebrow: string;
  title: string;
  bottomStamp: string;
  children: React.ReactNode;
  // Allow per-slide tightening of the top strip (hero slide wants 100 not 120)
  titleStripHeight?: number;
  bottomStampHeight?: number;
};

export const BackupSlideShell: React.FC<Props> = ({
  eyebrow,
  title,
  bottomStamp,
  children,
  titleStripHeight = 120,
  bottomStampHeight = 44,
}) => {
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
          padding: "56px 72px 48px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Top title strip ─────────────────────────────────────── */}
        <div
          style={{
            height: titleStripHeight,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: colors.primaryLight,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 52,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -1,
              textAlign: "center",
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
        </div>

        {/* ── Middle region (slide-specific content) ──────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {children}
        </div>

        {/* ── Bottom stamp ────────────────────────────────────────── */}
        <div
          style={{
            height: bottomStampHeight,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily,
            fontSize: 22,
            fontWeight: 600,
            color: colors.primaryLight,
            fontStyle: "italic",
            letterSpacing: -0.2,
            textAlign: "center",
          }}
        >
          {bottomStamp}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
