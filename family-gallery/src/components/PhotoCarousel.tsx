import React from "react";
import "./css/PhotoCarousel.css";
import { carouselFrameCoordinates } from "../carouselFrameCoordinates";

interface PhotoCarouselProps {
  images: string[];
  frameImage: string;
  backgroundImage: string;
  showLoading?: boolean;
  onImageClick?: (url: string) => void; // ✅ optional click handler
}

const NUM_FRAMES = 15;

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  images,
  frameImage,
  backgroundImage,
  showLoading,
  onImageClick,
}) => {
  const frameArray = Object.entries(carouselFrameCoordinates).map(([, value]) => value);

  return (
    <div
      className="photo-wall"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Frame overlay (behind photos) */}
      <img
        src={frameImage}
        alt="frame"
        className="frame-overlay"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Photos or loading */}
      {showLoading ? (
        <div className="loading-overlay">Carregando fotos...</div>
      ) : (
        frameArray.slice(0, NUM_FRAMES).map((frame, idx) => {
          const src = images[idx];
          if (!src) return null;

          return (
            <img
              key={`photo-${idx}`}
              className="carousel-photo"
              src={src}
              alt={`Foto ${idx}`}
              onClick={() => {
                console.log("Image clicked:", src);
                onImageClick?.(src);
              }}
              style={{
                position: "absolute",
                objectFit: "cover",
                width: frame.width,
                height: frame.height,
                left: frame.left,
                top: frame.top,
                zIndex: 3,
                cursor: onImageClick ? "pointer" : "default", // visual feedback
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default PhotoCarousel;