import React from "react";

// Phone frame dimensions (modeling a modern Android phone)
const PHONE_WIDTH = 380;
const PHONE_HEIGHT = 820;
const BORDER_RADIUS = 40;
const BEZEL = 8;
const NOTCH_WIDTH = 120;
const NOTCH_HEIGHT = 24;

export const PhoneMockup: React.FC<{
  children: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ children, scale = 1, style }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <div
        style={{
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          borderRadius: BORDER_RADIUS,
          background: "#1a1a2e",
          padding: BEZEL,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(33,150,243,0.15)",
          position: "relative",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: BEZEL,
            left: "50%",
            transform: "translateX(-50%)",
            width: NOTCH_WIDTH,
            height: NOTCH_HEIGHT,
            background: "#1a1a2e",
            borderRadius: "0 0 16px 16px",
            zIndex: 10,
          }}
        />
        {/* Screen */}
        <div
          style={{
            width: PHONE_WIDTH - BEZEL * 2,
            height: PHONE_HEIGHT - BEZEL * 2,
            borderRadius: BORDER_RADIUS - BEZEL,
            overflow: "hidden",
            position: "relative",
            background: "#000",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
