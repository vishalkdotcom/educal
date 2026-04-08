import React from "react";

export const SchoolIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 40, color = "#90CAF9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
