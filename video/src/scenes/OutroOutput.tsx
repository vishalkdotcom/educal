import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { SceneBackground } from "../components/SceneBackground";
import { colors, fontFamily } from "../theme";

/**
 * Outro Scene 4: OUTPUT (6s / 180 frames).
 * 2-column magazine layout:
 *   Left:  App tile — two overlapping tilted phone screenshots
 *          (school listing behind + per-child savings in front),
 *          rendered bare so tilt corners don't clip.
 *   Right: Promo (16:9) stacked on top of Tests (terminal).
 *
 * Left/right column heights are close but not identical; we use
 * alignItems: "center" so the App mockup floats vertically inside
 * the row instead of dangling above the right stack.
 */

type TileSpec = {
  label: string;
  sub: string;
  width: number;
  height: number;
  render: () => React.ReactNode;
  /**
   * When true, the Tile's outer card (border + shadow + dark bg +
   * overflow:hidden) is dropped. Used by the App two-phone mockup so
   * the tilted phones can float with their own shadows and extend
   * beyond the bounding box without getting clipped.
   */
  bare?: boolean;
};

/**
 * App two-phone mockup — classic app-store promo idiom: back phone
 * (Gemini school listing, step2) tilts right and recedes; front phone
 * (per-child savings, step3 — the payoff screen) tilts left and
 * dominates. Rendered bare (no glass card) so the tilted corners
 * don't clip.
 */
const AppMockup: React.FC = () => {
  const phoneW = 306;
  const phoneH = 680; // preserves 1080:2400 ratio
  const phoneBase: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: phoneW,
    height: phoneH,
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: colors.bgDarkLight,
  };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Back phone — school listing (Gemini), recedes */}
      <div
        style={{
          ...phoneBase,
          zIndex: 1,
          transform:
            "translate(-50%, -50%) translate(72px, -38px) rotate(6deg)",
          boxShadow: "0 14px 38px rgba(0,0,0,0.55)",
          filter: "brightness(0.82)",
        }}
      >
        <Img
          src={staticFile("screenshots/step2-school.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* Front phone — per-child savings, dominant */}
      <div
        style={{
          ...phoneBase,
          zIndex: 2,
          transform:
            "translate(-50%, -50%) translate(-56px, 38px) rotate(-5deg)",
          boxShadow: "0 22px 56px rgba(0,0,0,0.65)",
        }}
      >
        <Img
          src={staticFile("screenshots/step3-savings.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

const APP_TILE: TileSpec = {
  label: "App",
  sub: "Gemini school search\nper-child savings",
  width: 460,
  height: 780,
  render: () => <AppMockup />,
  bare: true,
};

const PROMO_TILE: TileSpec = {
  label: "Promo",
  sub: "80-second rendered\nvideo · this one",
  width: 580,
  height: 318,
  render: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Play triangle */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `65px solid ${colors.white}`,
          borderTop: "40px solid transparent",
          borderBottom: "40px solid transparent",
          marginLeft: 20,
          filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.4))",
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 800,
          color: colors.white,
          letterSpacing: 3,
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.25)",
          padding: "8px 18px",
          borderRadius: 999,
        }}
      >
        80 seconds · 1080p
      </div>
    </div>
  ),
};

const TESTS_TILE: TileSpec = {
  label: "Tests",
  sub: "Maestro E2E flows\nauthored with AI",
  width: 580,
  height: 295,
  render: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0B1220",
        padding: "24px 26px",
        fontFamily: 'Menlo, Consolas, "Courier New", monospace',
        fontSize: 18,
        lineHeight: 1.55,
        color: "#CBD5E1",
        overflow: "hidden",
      }}
    >
      {/* mac-style dots */}
      <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#FF5F57",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#FFBD2E",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#28C840",
          }}
        />
      </div>
      <div style={{ color: "#64748B" }}># onboarding.yaml</div>
      <div>
        <span style={{ color: "#90CAF9" }}>appId:</span> com.educal
      </div>
      <div style={{ color: "#64748B", marginTop: 6 }}>---</div>
      <div>
        - <span style={{ color: "#90CAF9" }}>launchApp</span>
      </div>
      <div>
        - <span style={{ color: "#90CAF9" }}>tapOn:</span>{" "}
        <span style={{ color: "#FDE68A" }}>"Add child"</span>
      </div>
      <div>
        - <span style={{ color: "#90CAF9" }}>inputText:</span>{" "}
        <span style={{ color: "#FDE68A" }}>"Aria"</span>
      </div>
      <div>
        - <span style={{ color: "#90CAF9" }}>assertVisible:</span>{" "}
        <span style={{ color: "#FDE68A" }}>"Monthly savings"</span>
      </div>
    </div>
  ),
};

const Tile: React.FC<{ tile: TileSpec; index: number }> = ({ tile, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popStart = 12 + index * 10;
  const s = spring({
    frame: Math.max(0, frame - popStart),
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const translateY = interpolate(s, [0, 1], [30, 0]);
  const scale = interpolate(s, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        width: tile.width,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: tile.width,
          height: tile.height,
          // "bare" tiles (e.g. the App two-phone mockup) drop the glass
          // card so their children can float with their own shadows and
          // extend beyond the bounding box without getting clipped.
          ...(tile.bare
            ? { overflow: "visible" }
            : {
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(144, 202, 249, 0.25)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
                background: colors.bgDarkLight,
              }),
        }}
      >
        {tile.render()}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 22,
          fontWeight: 800,
          color: colors.white,
          letterSpacing: -0.3,
          marginTop: 2,
        }}
      >
        {tile.label}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 400,
          color: colors.slate400,
          textAlign: "center",
          whiteSpace: "pre-line",
          lineHeight: 1.35,
          marginTop: -4,
        }}
      >
        {tile.sub}
      </div>
    </div>
  );
};

export const OutroOutput: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Tagline lands after the 3 tiles fully settle (last tile pops at frame 32,
  // settles ~70). Tagline is then visible from ~125 to 180 = ~55f (~1.8s).
  const taglineOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [100, 125], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "50%" }}
      glowColor={colors.primary}
      glowSize={900}
      glowOpacity={0.12}
      particleCount={28}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 40,
          paddingBottom: 20,
          gap: 48,
        }}
      >
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
          3 · Output
        </div>

        {/* 2-column magazine layout — center-align so the shorter App
            mockup floats vertically inside the taller right-column stack.
            Left = two-phone App mockup, Right = Promo stacked on Tests. */}
        <div
          style={{
            display: "flex",
            gap: 100,
            alignItems: "center",
          }}
        >
          {/* Left column — tall App portrait */}
          <Tile tile={APP_TILE} index={0} />

          {/* Right column — Promo on top, Tests below */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <Tile tile={PROMO_TILE} index={1} />
            <Tile tile={TESTS_TILE} index={2} />
          </div>
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: colors.white,
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: -0.5,
          }}
        >
          Three deliverables. Two days of code. Real output.
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
