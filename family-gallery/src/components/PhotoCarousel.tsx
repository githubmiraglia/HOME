import React, { useEffect, useState } from "react";
import "./css/PhotoCarousel.css";
import { carouselFrameCoordinates } from "../carouselFrameCoordinates";

const NUM_FRAMES = 15;
const TOTAL_PHOTOS = 30;
const FRAME_BG = "/src/assets/frame1.png";

type PhotoMeta = {
  filename: string;
  date?: string;
  camera?: string;
  gps?: { lat: number; lon: number };
  location?: { country?: string; state?: string; city?: string };
};

const PhotoCarousel: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/photo-index")
      .then(res => res.json())
      .then((data: PhotoMeta[]) => {
        const filtered = data.filter(p => {
          const year = parseInt((p.date || "").substring(0, 4));
          return year >= 2004 && year <= 2007;
        });

        const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, TOTAL_PHOTOS);
        setPhotos(shuffled);
      });
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    let count = 0;
    const loadedImages: string[] = [];

    photos.forEach((photo, idx) => {
      const img = new Image();
      const url = `http://localhost:5001/photos/${photo.filename}`;
      img.src = url;
      img.onload = img.onerror = () => {
        loadedImages[idx] = url;
        count++;
        setLoadingProgress(count);
        if (count === photos.length) {
          setImages(loadedImages);
          setReady(true);
        }
      };
    });
  }, [photos]);

  const frameArray = Object.entries(carouselFrameCoordinates).map(([, value]) => value);

  return (
    <div
      className="photo-wall"
      style={{
        position: "relative",
        width: "1536px",
        height: "1024px",
        margin: "0 auto",
        backgroundImage: `url("${FRAME_BG}")`,
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      {!ready ? (
        <div
          style={{
            color: "#fff",
            fontSize: "24px",
            textAlign: "center",
            paddingTop: "480px",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          Carregando fotos {loadingProgress} de {TOTAL_PHOTOS}...
        </div>
      ) : (
        frameArray.slice(0, NUM_FRAMES).map((frame, idx) => {
          const src = images[idx];
          if (!src) return null;

          return (
            <img
              key={`photo-${idx}`}
              className="carousel-photo visible"
              src={src}
              alt={`Foto ${idx}`}
              style={{
                position: "absolute",
                objectFit: "cover",
                transition: "all 1s ease-in-out",
                ...frame,
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default PhotoCarousel;
