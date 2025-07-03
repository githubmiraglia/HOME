import React, { useEffect, useState, useRef } from "react";
import "../routes/css/Photos.css";
import PhotoCarousel from "../components/PhotoCarousel";

// === Config ===
const TOTAL_TO_DISPLAY = 45;
const CHUNK_SIZE = 15;
const SCROLL_INTERVAL_MS = 30;
const SLIDE_SPEED_PX = 0.5;
const ROTATION = true;

const Photos: React.FC = () => {
  const [chunks, setChunks] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchChunk = async (): Promise<any[]> => {
    const res = await fetch(
      `http://localhost:8001/photo-index/random-chunk?from=2004&to=2007&size=${CHUNK_SIZE}`
    );
    return res.json();
  };

  const preloadImages = async (photos: any[]): Promise<string[]> => {
    return await Promise.all(
      photos.map((photo) => {
        return new Promise<string>((resolve) => {
          const img = new Image();
          const url = `http://localhost:8001/serve-image/${photo.filename}`;
          img.src = url;
          img.onload = img.onerror = () => resolve(url);
        });
      })
    );
  };

  const refillChunks = async () => {
    const newPhotos = await fetchChunk();
    const newImages = await preloadImages(newPhotos);
    setChunks((prev) => [...prev, newImages]);
  };

  useEffect(() => {
    const initialize = async () => {
      const count = ROTATION ? TOTAL_TO_DISPLAY / CHUNK_SIZE : 1;
      for (let i = 0; i < count; i++) {
        await refillChunks();
      }
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!ROTATION) return;

    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      container.scrollLeft += SLIDE_SPEED_PX;

      if (container.scrollLeft >= windowWidth) {
        container.scrollLeft = 0;
        setChunks((prev) => prev.slice(1));
        refillChunks();
      }
    }, SCROLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [chunks, windowWidth]);

  return (
    <div className="photos-container" ref={containerRef}>
      {chunks.map((chunk, idx) => (
        <PhotoCarousel
          key={idx}
          images={chunk}
          showLoading={loading && idx === 0}
        />
      ))}
    </div>
  );
};

export default Photos;