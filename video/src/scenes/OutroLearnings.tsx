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
 * Outro Scene 5: LEARNINGS (19s / 570 frames).
 * Three crossfading quote cards — one per teammate. Quotes are verbatim
 * from docs/PRESENTATION_COPY.md.
 *
 * Each card's static read window is sized to its word count. All windows
 * are pushed 15f forward so the first card doesn't spring-pop during the
 * incoming crossfade. Card spring is softer (damping 22 / stiffness 90)
 * so cards drift in rather than pop in.
 *   Vishal (28 words): frames  15 – 200  (readable 40-175 ≈ 4.5s)
 *   Kavya  (17 words): frames 195 – 360  (readable 220-330 ≈ 3.7s)
 *   Imam   (31 words): frames 350 – 570  (readable 375-540 ≈ 5.5s)
 */

type Quote = {
  name: string;
  role: string;
  text: string;
};

const QUOTES: Quote[] = [
  {
    name: "Vishal",
    role: "Engineering",
    text: "I've used Claude Code and Gemini before. The stretch was wiring Stitch, Maestro, and Remotion into the same chat via MCP — first composition, first grounding, first Remotion.",
  },
  {
    name: "Kavya",
    role: "Testing",
    text: "Natural-language to Maestro YAML collapsed test authoring time. The AI caught edge cases I would have missed.",
  },
  {
    name: "Imam",
    role: "Design",
    text: "Stitch was a new drafting partner for me. AI is a phenomenal draft and inspect partner — but not a production finisher. Front-load the requirement doc; it saves tokens and rework.",
  },
];

// Card show windows (frames): [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
// Total scene = 570 frames; first card fadeInStart pushed to 15 so it doesn't
// spring-pop during the incoming 15f crossfade.
const WINDOWS: [number, number, number, number][] = [
  [15, 40, 175, 200], // Vishal
  [195, 220, 330, 360], // Kavya
  [350, 375, 540, 570], // Imam
];

const QuoteCard: React.FC<{ quote: Quote; index: number }> = ({
  quote,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [fiStart, fiEnd, foStart, foEnd] = WINDOWS[index];

  const opacity = interpolate(
    frame,
    [fiStart, fiEnd, foStart, foEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const s = spring({
    frame: Math.max(0, frame - fiStart),
    fps,
    config: { damping: 22, stiffness: 90 },
  });
  const translateY = interpolate(s, [0, 1], [30, 0]);
  const scale = interpolate(s, [0, 1], [0.96, 1]);

  // Short-circuit: if this card isn't visible at all, skip rendering
  if (frame < fiStart || frame > foEnd) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 160px",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {/* Quote mark */}
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 160,
          fontWeight: 800,
          color: colors.primary,
          lineHeight: 0.8,
          marginBottom: 20,
          opacity: 0.6,
        }}
      >
        "
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 44,
          fontWeight: 500,
          color: colors.white,
          textAlign: "center",
          lineHeight: 1.35,
          letterSpacing: -0.3,
          maxWidth: 1500,
          fontStyle: "italic",
        }}
      >
        {quote.text}
      </div>

      <div
        style={{
          marginTop: 44,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily,
            fontSize: 28,
            fontWeight: 800,
            color: colors.white,
            boxShadow: `0 4px 16px rgba(33, 150, 243, 0.4)`,
          }}
        >
          {quote.name[0]}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 800,
              color: colors.white,
              lineHeight: 1.1,
            }}
          >
            {quote.name}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: 500,
              color: colors.primaryLight,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {quote.role}
          </div>
        </div>
      </div>
    </div>
  );
};

export const OutroLearnings: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacityIn = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacityOut = interpolate(frame, [540, 570], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity = labelOpacityIn * labelOpacityOut;

  return (
    <SceneBackground
      glowPosition={{ x: "50%", y: "55%" }}
      glowColor={colors.primary}
      glowSize={950}
      glowOpacity={0.12}
      particleCount={25}
      particleColor={colors.primaryLight}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 70,
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
          4 · Learnings
        </div>
      </AbsoluteFill>

      {/* Crossfading quote cards */}
      {QUOTES.map((quote, i) => (
        <QuoteCard key={quote.name} quote={quote} index={i} />
      ))}
    </SceneBackground>
  );
};
