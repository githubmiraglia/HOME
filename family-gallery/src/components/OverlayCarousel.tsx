// OverlayCarousel.tsx
import React, { useState, useEffect } from "react";
import "./css/OverlayCarousel.css";
import { frameToLargeFrameMap } from "./Selector_Photos";
import { RotateCcw, Trash2 } from "lucide-react";

interface OverlayCarouselProps {
  photoIndex: { filename: string }[];
  startIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  selectedFrame: string;
  selectedBackground: string;
  onDelete: (filename: string) => void; // 🆕 notify parent of deletion
}

// 🔁 Read from environment variable (default fallback for safety)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

const OverlayCarousel: React.FC<OverlayCarouselProps> = ({
  photoIndex,
  startIndex,
  onClose,
  onPrev,
  onNext,
  selectedFrame,
  selectedBackground,
  onDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loadingMap, setLoadingMap] = useState<{ [filename: string]: string }>({});

  const getImageUrl = (filename: string) =>
    `${BACKEND_URL}/serve-image/${encodeURIComponent(filename)}`;

  const visiblePhotos = photoIndex.slice(currentIndex, currentIndex + 3);
  const largeFrame = frameToLargeFrameMap[selectedFrame] || selectedFrame;

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const handleDelete = async (filename: string) => {
    setLoadingMap((prev) => ({ ...prev, [filename]: "Deleting Photo..." }));

    await fetch(`${BACKEND_URL}/photo-index/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    setLoadingMap((prev) => {
      const copy = { ...prev };
      delete copy[filename];
      return copy;
    });

    onDelete(filename); // ✅ inform parent
    onNext(); // move to next photo
  };

  const handleRotate = async (filename: string) => {
    setLoadingMap((prev) => ({ ...prev, [filename]: "Updating Photo..." }));

    await fetch(`${BACKEND_URL}/photo-index/rotate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    setLoadingMap((prev) => {
      const copy = { ...prev };
      delete copy[filename];
      return copy;
    });

    const img = document.getElementById(`photo-${filename}`) as HTMLImageElement;
    if (img) {
      const cleanUrl = getImageUrl(filename).split("?")[0];
      img.src = `${cleanUrl}?t=${Date.now()}`;
    }
  };

  return (
    <div className="overlay-modal">
      <div className="overlay-backdrop" onClick={onClose} />

      <div
        className="overlay-content"
        style={{ backgroundImage: `url(${selectedBackground})` }}
      >
        <button className="nav-button left" onClick={onPrev}>◀</button>

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
                src={getImageUrl(photo.filename)}
                alt={`Overlay ${idx}`}
                className="overlay-photo"
                style={{ zIndex: 2 }}
              />

              <div className="photo-action-icons">
                <Trash2
                  className="action-icon trash-icon"
                  onClick={() => handleDelete(photo.filename)}
                />
                <RotateCcw
                  className="action-icon rotate-icon"
                  onClick={() => handleRotate(photo.filename)}
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

        <button className="nav-button right" onClick={onNext}>▶</button>
      </div>

      <button className="go-back-button" onClick={onClose}>Go Back</button>
    </div>
  );
};

export default OverlayCarousel;