import React from "react";
import "./css/SoloPhotoOverlay.css";

interface SoloPhotoOverlayProps {
  filename: string;
  frameImage: string;
  backgroundImage: string;
  imageUrl: string;
  onClose: () => void;
}

const SoloPhotoOverlay: React.FC<SoloPhotoOverlayProps> = ({
  filename,
  frameImage,
  backgroundImage,
  imageUrl,
  onClose,
}) => {
  return (
    <div className="solo-overlay">
      <div
        className="solo-content"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          src={frameImage}
          alt="Frame"
          className="solo-frame"
        />
        <img
          src={imageUrl}
          alt={`Solo ${filename}`}
          className="solo-photo"
        />
        <button className="go-back-button" onClick={onClose}>Go Back</button>
      </div>
    </div>
  );
};

export default SoloPhotoOverlay;