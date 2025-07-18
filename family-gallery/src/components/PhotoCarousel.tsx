import React from "react";
import "./css/PhotoCarousel.css";
import { carouselFrameCoordinates } from "../carouselFrameCoordinates";
import {
  BASE_IMAGE_WIDTH,
  BASE_IMAGE_HEIGHT,
  IS_RESPONSIVE_DEV,
} from "../App";
import { preload } from "react-dom";

interface PhotoCarouselProps {
  images: string[];
  frameImage: string;
  backgroundImage: string;
  showLoading?: boolean;
  onImageClick?: (url: string) => void;
}

const NUM_FRAMES = 15;

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  images,
  frameImage,
  backgroundImage,
  showLoading,
  onImageClick,
}) => {
  // Convert % coordinates to pixel values if in responsive mode
  const frameArray = Object.entries(carouselFrameCoordinates).map(([, frame]) => {
    if (!IS_RESPONSIVE_DEV) return frame;

    const parse = (percentStr: string, base: number) =>
      (parseFloat(percentStr) / 100) * base + "px";

    return {
      left: parse(frame.left, BASE_IMAGE_WIDTH),
      top: parse(frame.top, BASE_IMAGE_HEIGHT),
      width: parse(frame.width, BASE_IMAGE_WIDTH),
      height: parse(frame.height, BASE_IMAGE_HEIGHT),
    };
  });

  
  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  };
  const isMobile = isMobileDevice();

  //const scale = scaleX * (isMobile ? 0.85 : 1); // Stretch horizontally
  const scaleX = window.innerWidth / BASE_IMAGE_WIDTH;
  const scaleY = scaleX * (isMobile ? 0.85 : 1)
  
  const verticalOffset = `calc(50% - ${(BASE_IMAGE_HEIGHT * scaleY) / 2}px)`;
  

  return (
    <div
      className="photo-wall"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <div
        className="scaled-content"
        style={{
          position: "absolute",
          top: verticalOffset,
          left: 0,
          width: BASE_IMAGE_WIDTH,
          height: BASE_IMAGE_HEIGHT,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      >
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

        {showLoading ? (
          <div className="loading-overlay">Carregando fotos...</div>
        ) : (
          frameArray.slice(0, NUM_FRAMES).map((frame, idx) => {
            const src = images[idx];
            if (!src) return null;

            const computedStyle: React.CSSProperties = IS_RESPONSIVE_DEV
              ? {
                  position: "absolute",
                  objectFit: "cover",
                  objectPosition: "center center",
                  width: frame.width,
                  height: frame.height,
                  left: frame.left,
                  top: frame.top,
                  zIndex: 3,
                  cursor: onImageClick ? "pointer" : "default",
                }
              : {
                  position: "absolute",
                  objectFit: "cover",
                  width: frame.width,
                  height: frame.height,
                  left: frame.left,
                  top: frame.top,
                  zIndex: 3,
                  cursor: onImageClick ? "pointer" : "default",
                };

            return (
              <img
                key={`photo-${idx}`}
                className="carousel-photo"
                src={src}
                alt={`Foto ${idx}`}
                onClick={() => onImageClick?.(src)}
                style={computedStyle}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default PhotoCarousel;