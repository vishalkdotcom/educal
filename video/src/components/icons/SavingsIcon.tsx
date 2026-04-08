import React from "react";

export const SavingsIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 40, color = "#90CAF9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1a5 5 0 004 4.9V15a2 2 0 002 2h2v4h2v-4h2a2 2 0 002-2v-2.1A5 5 0 0021 8V7a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 7v6M9 10h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
