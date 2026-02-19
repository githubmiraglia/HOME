import React, {
  useEffect,
  useState,
  useRef,
} from "react";
import "./css/ListOfVideos.css";
import { GLOBAL_BACKEND_URL } from "../App";

interface ListOfVideosProps {
  onVideoSelect: (filename: string) => void;
  onPlayRequest: (filename: string) => void;
}

const ListOfVideos: React.FC<ListOfVideosProps> = ({
  onVideoSelect,
  onPlayRequest,
}) => {
  const [videos, setVideos] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Get scroll container (.video-list-panel)
  useEffect(() => {
    if (listRef.current) {
      panelRef.current = listRef.current.closest(
        ".video-list-panel"
      ) as HTMLDivElement;
    }
  }, []);

  // 🔥 Hover-driven edge auto-scroll
  useEffect(() => {
    if (!panelRef.current) return;

    const container = panelRef.current;

    let animationFrame: number | null = null;

    const threshold = 60;     // px from edge to trigger scroll
    const scrollSpeed = 6;    // px per frame (tune this)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY;

      const nearBottom = mouseY > rect.bottom - threshold;
      const nearTop = mouseY < rect.top + threshold;

      if (nearBottom) {
        if (!animationFrame) {
          const scrollDown = () => {
            container.scrollTop += scrollSpeed;
            animationFrame = requestAnimationFrame(scrollDown);
          };
          animationFrame = requestAnimationFrame(scrollDown);
        }
      } else if (nearTop) {
        if (!animationFrame) {
          const scrollUp = () => {
            container.scrollTop -= scrollSpeed;
            animationFrame = requestAnimationFrame(scrollUp);
          };
          animationFrame = requestAnimationFrame(scrollUp);
        }
      } else {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      }
    };

    const stopScroll = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", stopScroll);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", stopScroll);
    };
  }, []);

  // 🔹 Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `${GLOBAL_BACKEND_URL}/video-index/list`
        );
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="video-list" ref={listRef}>
      {videos.map((filename, index) => (
        <div
          key={filename}
          className={`video-list-item ${
            hoveredIndex === index ? "hovered" : ""
          }`}
          onMouseEnter={() => {
            setHoveredIndex(index);
            onVideoSelect(filename);
          }}
          onClick={() => {
            onVideoSelect(filename);
            onPlayRequest(filename);
          }}
        >
          {filename}
        </div>
      ))}
    </div>
  );
};

export default ListOfVideos;
