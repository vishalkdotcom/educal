import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { PhoneMockup } from "../components/PhoneMockup";
import { AnimatedText } from "../components/AnimatedText";
import { colors } from "../theme";

const CLIP_DURATION = 90; // 3s each at 30fps
const CLIPS = [
  { src: "recordings/step1-family.mp4", caption: "Add your family", trimBefore: 1 },
  { src: "recordings/step2-school.mp4", caption: "Find schools with AI", trimBefore: 1.5 },
  { src: "recordings/step3-savings.mp4", caption: "Get your savings plan", trimBefore: 1 },
];

export const OnboardingDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance animation
  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const phoneY = interpolate(phoneEntrance, [0, 1], [100, 0]);
  const phoneOpacity = phoneEntrance;

  // Determine which clip is active
  const clipIndex = Math.min(
    Math.floor(frame / CLIP_DURATION),
    CLIPS.length - 1,
  );
  const clipFrame = frame - clipIndex * CLIP_DURATION;

  // Caption text animation per clip
  const captionOpacity = interpolate(clipFrame, [0, 12, CLIP_DURATION - 8, CLIP_DURATION], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(clipFrame, [0, 12], [15, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.bgDark} 0%, #0a1628 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Blue glow behind phone */}
      <div
        style={{
          position: "absolute",
          width: 450,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(33,150,243,0.12) 0%, transparent 70%)`,
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* "Meet EduCal" header */}
      <div style={{ position: "absolute", top: 120 }}>
        <AnimatedText
          text="Meet EduCal"
          fontSize={56}
          fontWeight={700}
          color={colors.white}
          animation="spring"
        />
      </div>

      {/* Phone with recordings */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `translateY(${phoneY}px)`,
          marginTop: 80,
        }}
      >
        <PhoneMockup scale={1.8}>
          {CLIPS.map((clip, i) => (
            <Sequence
              key={clip.src}
              from={i * CLIP_DURATION}
              durationInFrames={CLIP_DURATION}
            >
              <Video
                src={staticFile(clip.src)}
                trimBefore={clip.trimBefore}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                volume={0}
              />
            </Sequence>
          ))}
        </PhoneMockup>
      </div>

      {/* Caption below phone */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: colors.primaryLight,
            fontFamily: 'Inter, -apple-system, sans-serif',
            textAlign: "center",
          }}
        >
          {CLIPS[clipIndex].caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};
