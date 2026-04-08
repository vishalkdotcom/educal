import React from "react";

export const ChartIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 40, color = "#90CAF9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 20h18M6 16v-4M10 16V8M14 16v-6M18 16V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
