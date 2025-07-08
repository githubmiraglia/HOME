// Selector_Photos.tsx
import React from "react";
import "./css/Selector_Photos.css";

// Frame options
export const frameOptions = [
  { path: "/frame1_brownish.png", label: "Brown" },
  { path: "/frame1_white.png", label: "White" },
  { path: "/frame1_silver_tinted.png", label: "Silver Tint" },
];

// Background options
export const backgroundOptions = [
  { path: "/background_white.png", label: "White" },
  { path: "/background_rose.png", label: "Rose" },
  { path: "/background_grey.png", label: "Grey" },
  { path: "/background_wood.png", label: "Wood" },
  { path: "/background_brick.png", label: "Brick" },
];

// Mapping small frame to large frame for overlay use
export const frameToLargeFrameMap: Record<string, string> = {
  "/frame1_brownish.png": "/frame_large_brownish.png",
  "/frame1_white.png": "/frame_large_white.png",
  "/frame1_silver_tinted.png": "/frame_large_silver_tint.png",
};

interface SelectorPhotosProps {
  selectedFrame: string;
  selectedBackground: string;
  onFrameChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  fromYear: number;
  toYear: number;
  onFromYearChange: (value: number) => void;
  onToYearChange: (value: number) => void;
  hasFaces: boolean;
  onHasFacesChange: (value: boolean) => void;
}

const SelectorPhotos: React.FC<SelectorPhotosProps> = ({
  selectedFrame,
  selectedBackground,
  onFrameChange,
  onBackgroundChange,
  fromYear,
  toYear,
  onFromYearChange,
  onToYearChange,
  hasFaces,
  onHasFacesChange,
}) => {
  return (
    <div className="selector-ui">
      <label>Frame:</label>
      <select onChange={(e) => onFrameChange(e.target.value)} value={selectedFrame}>
        {frameOptions.map((f) => (
          <option key={f.path} value={f.path}>
            {f.label}
          </option>
        ))}
      </select>

      <label>Background:</label>
      <select onChange={(e) => onBackgroundChange(e.target.value)} value={selectedBackground}>
        {backgroundOptions.map((b) => (
          <option key={b.path} value={b.path}>
            {b.label}
          </option>
        ))}
      </select>

      <div className="year-range">
        <label>From Year:</label>
        <input
          type="number"
          value={fromYear}
          onChange={(e) => onFromYearChange(Number(e.target.value))}
        />

        <label>To Year:</label>
        <input
          type="number"
          value={toYear}
          onChange={(e) => onToYearChange(Number(e.target.value))}
        />
      </div>

      <label>
        <input
          type="checkbox"
          checked={hasFaces}
          onChange={(e) => onHasFacesChange(e.target.checked)}
        />
        Only with Faces
      </label>
    </div>
  );
};

export default SelectorPhotos;