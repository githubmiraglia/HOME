// ListOfVideos.tsx
import React, { useEffect, useState, useCallback } from "react";
import "./css/ListOfVideos.css";
import { GLOBAL_BACKEND_URL } from "../App";

interface ListOfVideosProps {
  onVideoSelect: (filename: string) => void;     // for updating thumbnail
  onPlayRequest: (filename: string) => void;     // for triggering playback
}

const ListOfVideos: React.FC<ListOfVideosProps> = ({
  onVideoSelect,
  onPlayRequest,
}) => {
  const [videos, setVideos] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${GLOBAL_BACKEND_URL}/video-index/list`);
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };
    fetchVideos();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!videos.length) return;

      if (e.key === "ArrowDown") {
        setHoveredIndex((prev) => {
          const next = prev === null ? 0 : Math.min(prev + 1, videos.length - 1);
          onVideoSelect(videos[next]);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        setHoveredIndex((prev) => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0);
          onVideoSelect(videos[next]);
          return next;
        });
      } else if (e.key === "Enter") {
        if (hoveredIndex !== null && videos[hoveredIndex]) {
          const filename = videos[hoveredIndex];
          onVideoSelect(filename);
          onPlayRequest(filename);
        }
      }
    },
    [videos, hoveredIndex, onVideoSelect, onPlayRequest]
  );


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="video-list">
      {videos.map((filename, index) => (
        <div
          key={filename}
          className={`video-list-item ${hoveredIndex === index ? "hovered" : ""}`}
          onMouseEnter={() => {
            setHoveredIndex(index);
            onVideoSelect(filename); // only update thumbnail on hover
          }}
          onClick={() => {
            onVideoSelect(filename);    // update thumbnail
            onPlayRequest(filename);    // trigger fullscreen video
          }}
        >
          {filename}
        </div>
      ))}
    </div>
  );
};

export default ListOfVideos;
