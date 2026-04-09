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
 * Outro Scene 4: OUTPUT (4s / 120 frames).
 * Three stacked thumbnails (App / Promo / Tests) + tagline.
 */

type Tile = {
  label: string;
  sub: string;
  render: () => React.ReactNode;
};

const TILES: Tile[] = [
  {
    label: "App",
    sub: "Gemini school search\nper-child savings",
    render: () => (
      <Img
        src={staticFile("screenshots/step3-savings.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
        }}
      />
    ),
  },
  {
    label: "Promo",
    sub: "50-second rendered\nvideo · this one",
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
          gap: 18,
        }}
      >
        {/* Play triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `70px solid ${colors.white}`,
            borderTop: "44px solid transparent",
            borderBottom: "44px solid transparent",
            marginLeft: 18,
            filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.4))",
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 800,
            color: colors.white,
            letterSpacing: 3,
            textTransform: "uppercase",
            background: "rgba(0,0,0,0.25)",
            padding: "6px 14px",
            borderRadius: 999,
          }}
        >
          00:50 · 1920×1080
        </div>
      </div>
    ),
  },
  {
    label: "Tests",
    sub: "Maestro E2E flows\nauthored with AI",
    render: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B1220",
          padding: "24px 20px",
          fontFamily:
            'Menlo, Consolas, "Courier New", monospace',
          fontSize: 15,
          lineHeight: 1.55,
          color: "#CBD5E1",
          overflow: "hidden",
        }}
      >
        {/* mac-style dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "#FF5F57",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "#FFBD2E",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
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
  },
];

const TILE_W = 440;
const TILE_H = 300;
const TILE_GAP = 60;

const Tile: React.FC<{ tile: Tile; index: number }> = ({ tile, index }) => {
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
        width: TILE_W,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          width: TILE_W,
          height: TILE_H,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(144, 202, 249, 0.25)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          background: colors.bgDarkLight,
        }}
      >
        {tile.render()}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 800,
          color: colors.white,
          letterSpacing: -0.3,
        }}
      >
        {tile.label}
      </div>
      <div
        style={{
          fontFamily,
          fontSize: 18,
          fontWeight: 400,
          color: colors.slate400,
          textAlign: "center",
          whiteSpace: "pre-line",
          lineHeight: 1.4,
          marginTop: -6,
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
  const taglineOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [70, 90], [18, 0], {
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
          alignItems: "center",
          paddingTop: 80,
          paddingBottom: 80,
          gap: 36,
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

        <div
          style={{
            display: "flex",
            gap: TILE_GAP,
            alignItems: "flex-start",
            marginTop: 20,
          }}
        >
          {TILES.map((tile, i) => (
            <Tile key={tile.label} tile={tile} index={i} />
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
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
