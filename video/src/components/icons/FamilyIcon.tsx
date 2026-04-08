import React from "react";

export const FamilyIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 40, color = "#90CAF9" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.5" />
    <circle cx="17" cy="7" r="2.5" stroke={color} strokeWidth="1.5" />
    <path
      d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17 11a3 3 0 013 3v3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
