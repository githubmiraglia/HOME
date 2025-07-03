import React, { useEffect, useState } from "react";
import "./css/PhotoCarousel.css";
import { carouselFrameCoordinates } from "../carouselFrameCoordinates";

const NUM_FRAMES = 15;
const FRAME_BG = "/src/assets/frame1.png"; // Make sure this path is correct or use public assets

type PhotoMeta = {
  filename: string;
  date?: string;
  camera?: string;
  gps?: { lat: number; lon: number };
  location?: { country?: string; state?: string; city?: string };
  angle?: number;
};

const PhotoCarousel: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Fetch 15 randomized filtered photos from the backend
    fetch("http://localhost:8001/photo-index/random-chunk?from=2004&to=2007&size=15")
      .then(res => res.json())
      .then((data: PhotoMeta[]) => {
        setPhotos(data);
      })
      .catch(err => console.error("Failed to fetch photo chunk:", err));
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    let count = 0;
    const loadedImages: string[] = [];

    photos.forEach((photo, idx) => {
      const img = new Image();
      console.log(photo.filename)
      const url = `http://localhost:8001/serve-image/${photo.filename}`;
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
          Carregando fotos {loadingProgress} de {photos.length}...
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