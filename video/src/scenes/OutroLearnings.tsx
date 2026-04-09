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
 * Each card's static read window is sized to its word count (~0.18s/word
 * scan speed), with 25-frame crossfades between cards.
 *   Vishal (28 words): frames   0 – 200  (readable 20-175 ≈ 5.2s)
 *   Kavya  (17 words): frames 190 – 355  (readable 215-325 ≈ 3.7s)
 *   Imam   (31 words): frames 340 – 570  (readable 365-540 ≈ 5.8s)
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
// Total scene = 570 frames; sized to give each quote enough static read time.
const WINDOWS: [number, number, number, number][] = [
  [0, 20, 175, 200], // Vishal
  [190, 215, 325, 355], // Kavya
  [340, 365, 540, 570], // Imam
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
    config: { damping: 18, stiffness: 120 },
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

  const labelOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

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
