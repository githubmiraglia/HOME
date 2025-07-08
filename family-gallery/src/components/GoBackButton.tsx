import React from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
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
      Go Back
    </button>
  );
};

export default GoBackButton;