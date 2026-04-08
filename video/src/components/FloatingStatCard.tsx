import React from "react";
import { GlassCard } from "./GlassCard";
import { colors, fontFamily } from "../theme";

export const FloatingStatCard: React.FC<{
  label: string;
  value: string;
  icon?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ label, value, icon = "📊", delay = 0, style }) => {
  return (
    <GlassCard
      delay={delay}
      borderRadius={16}
      bgOpacity={0.08}
      style={{
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        ...style,
      }}
    >
      <span style={{ fontSize: 32 }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: colors.white,
            fontFamily,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: colors.slate400,
            fontFamily,
          }}
        >
          {label}
        </div>
      </div>
    </GlassCard>
  );
};
