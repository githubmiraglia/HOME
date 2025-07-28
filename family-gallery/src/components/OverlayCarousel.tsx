import React, { useState, useEffect } from "react";
import "./css/OverlayCarousel.css";
import { frameToLargeFrameMap } from "./Selector_Photos";
import { RotateCw, Trash2, Download } from "lucide-react";
import {
  GLOBAL_BACKEND_URL,
  BASE_IMAGE_WIDTH,
  BASE_IMAGE_HEIGHT,
} from "../App";
import SoloPhotoOverlay from "./SoloPhotoOverlay";

interface OverlayCarouselProps {
  photoIndex: { filename: string }[];
  startIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  selectedFrame: string;
  selectedBackground: string;
  onDelete: (filename: string) => void;
  preloadedUrls?: { [filename: string]: string };
}

const OverlayCarousel: React.FC<OverlayCarouselProps> = ({
  photoIndex,
  startIndex,
  onClose,
  onPrev,
  onNext,
  selectedFrame,
  selectedBackground,
  onDelete,
  preloadedUrls = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loadingMap, setLoadingMap] = useState<{ [filename: string]: string }>({});
  const [soloPhoto, setSoloPhoto] = useState<string | null>(null);

  const safeEncodePath = (path: string) =>
    path.split("/").map(encodeURIComponent).join("/");

  const getImageUrl = (filename: string) =>
    `${GLOBAL_BACKEND_URL}/serve-image/${safeEncodePath(filename)}`;

  const visiblePhotos = photoIndex.slice(currentIndex, currentIndex + 3);
  const largeFrame = frameToLargeFrameMap[selectedFrame] || selectedFrame;

  const isMobileDevice = () =>
    /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

  const isMobile = isMobileDevice();
  const scaleX = (window.innerWidth / BASE_IMAGE_WIDTH) * (isMobile ? 0.9 : 1);
  const scaleY = scaleX;
  const verticalOffset = `calc(50% - ${(BASE_IMAGE_HEIGHT * scaleY) / 2}px)`;
  const horizontalOffset = `calc(50% - ${(BASE_IMAGE_WIDTH * scaleX) / 2}px)`;

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const handleDownload = (filename: string) => {
    const url = `${GLOBAL_BACKEND_URL}/download-photo/${encodeURIComponent(filename)}?t=${Date.now()}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.split("/").pop() || "photo.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (filename: string) => {
    console.log(`[Overlay] Deleting: ${filename}`);
    setLoadingMap((prev) => ({ ...prev, [filename]: "Deleting Photo..." }));

    try {
      await fetch(`${GLOBAL_BACKEND_URL}/photo-index/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
    } catch (err) {
      console.error("Error deleting photo:", err);
    }

    setLoadingMap((prev) => {
      const copy = { ...prev };
      delete copy[filename];
      return copy;
    });

    onDelete(filename);
    onNext();
  };

  const handleRotate = async (filename: string) => {
    console.log(`[Overlay] Rotating: ${filename}`);
    setLoadingMap((prev) => ({ ...prev, [filename]: "Updating Photo..." }));

    try {
      await fetch(`${GLOBAL_BACKEND_URL}/photo-index/rotate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
    } catch (err) {
      console.error("Error rotating photo:", err);
    }

    setLoadingMap((prev) => {
      const copy = { ...prev };
      delete copy[filename];
      return copy;
    });

    const img = document.getElementById(`photo-${filename}`) as HTMLImageElement | null;
    if (img) {
      const cleanUrl = getImageUrl(filename).split("?")[0];
      img.src = `${cleanUrl}?t=${Date.now()}`;
    }
  };

  return (
    <div className="overlay-modal">
      <div className="overlay-backdrop" onClick={onClose} />

      {!soloPhoto && (
        <div className="go-back-button-container">
          <button className="go-back-button" onClick={onClose}>
            Go Back
          </button>
        </div>
      )}

      <div
        className="overlay-content"
        style={{
          backgroundImage: `url(${selectedBackground})`,
          position: "absolute",
          top: verticalOffset,
          left: horizontalOffset,
          width: BASE_IMAGE_WIDTH,
          height: BASE_IMAGE_HEIGHT,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      >
        <button className="nav-button left" onClick={onPrev}>
          ◀
        </button>

        <div className="overlay-carousel-inner">
          {visiblePhotos.map((photo, idx) => (
            <div key={idx} className="photo-frame-container">
              <img
                src={largeFrame}
                alt="Frame"
                className="overlay-frame-image"
                style={{ zIndex: 1 }}
              />
              <img
                id={`photo-${photo.filename}`}
                src={preloadedUrls[photo.filename] || getImageUrl(photo.filename)}
                alt={`Overlay ${idx}`}
                className="overlay-photo"
                style={{
                  zIndex: 2,
                  cursor: "pointer",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                onClick={() => setSoloPhoto(photo.filename)}
              />
               <div className="photo-action-icons">
                  <Trash2
                    className="action-icon trash-icon"
                    onClick={() => handleDelete(photo.filename)}
                  />
                  <RotateCw
                    className="action-icon rotate-icon"
                    onClick={() => handleRotate(photo.filename)}
                  />
                  <Download
                    className="action-icon download-icon"
                    onClick={() => handleDownload(photo.filename)}
                  />
              </div>

              {loadingMap[photo.filename] && (
                <div className="photo-overlay-message">
                  {loadingMap[photo.filename]}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="nav-button right" onClick={onNext}>
          ▶
        </button>
      </div>

      {soloPhoto && (
        <SoloPhotoOverlay
          filename={soloPhoto}
          frameImage={largeFrame}
          backgroundImage={selectedBackground}
          imageUrl={getImageUrl(soloPhoto)}
          onClose={() => setSoloPhoto(null)}
        />
      )}
    </div>
  );
};

export default OverlayCarousel;
