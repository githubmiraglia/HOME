import React from "react";

const FullscreenToggle: React.FC = () => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      style={{
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: 1000,
        padding: "8px 12px",
        background: "#444",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Toggle Fullscreen
    </button>
  );
};

export default FullscreenToggle;
