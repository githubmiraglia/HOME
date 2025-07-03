import React from "react";
import "./css/PhotoCarousel.css";
import { carouselFrameCoordinates } from "../carouselFrameCoordinates";

interface PhotoCarouselProps {
  images: string[];
  showLoading?: boolean;
}

const NUM_FRAMES = 15;

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  images,
  showLoading,
}) => {
  const frameArray = Object.entries(carouselFrameCoordinates).map(([, value]) => value);

  return (
    <div className="photo-wall">
      {/* Frame Overlay */}
      <img
        src="/src/assets/frame1_brownish.png"
        alt="frame"
        className="frame-overlay"
      />
      
      {/* Photos */}
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
              style={{
                position: "absolute",
                objectFit: "cover", // ensures it fills the frame, cropping if needed
                width: frame.width,  // explicitly set frame dimensions
                height: frame.height,
                left: frame.left,
                top: frame.top,
                zIndex: 3,
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default PhotoCarousel;