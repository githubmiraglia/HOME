import React, { useEffect, useState } from "react";
import { GLOBAL_BACKEND_URL } from "../App";
import "./css/ServeVideoThumbnail.css";

interface ServeVideoThumbnailProps {
  filename: string;
}

const ServeVideoThumbnail: React.FC<ServeVideoThumbnailProps> = ({ filename }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");

  const safeEncode = (path: string) =>
    path.split("/").map(encodeURIComponent).join("/");

  const loadThumbnail = async () => {
    setStatus("loading");
    const encodedFilename = safeEncode(filename);
    const url = `${GLOBAL_BACKEND_URL}/cache-video/${encodedFilename}.jpg`;

    try {
      const res = await fetch(`${url}?t=${Date.now()}`);
      if (res.status === 200) {
        setThumbnailUrl(url);
        setStatus("ready");
      } else {
        throw new Error("Thumbnail not found");
      }
    } catch {
      // Trigger backend generation
      try {
        const genRes = await fetch(
          `${GLOBAL_BACKEND_URL}/generate-thumbnail/${encodedFilename}`
        );
        if (genRes.ok) {
          // Retry thumbnail load
          const retryUrl = `${url}?t=${Date.now()}`;
          setThumbnailUrl(retryUrl);
          setStatus("ready");
        } else {
          throw new Error("Thumbnail generation failed");
        }
      } catch (err) {
        console.error("Thumbnail load failed:", err);
        setStatus("error");
      }
    }
  };

  useEffect(() => {
    loadThumbnail();
  }, [filename]);

  if (status === "loading") return <div className="video-thumbnail-status">Loading thumbnail...</div>;
  if (status === "error") return <div className="video-thumbnail-status">Thumbnail not available</div>;

  return (
    <div className="video-thumbnail-container">
      <img src={thumbnailUrl!} alt="Video Thumbnail" className="video-thumbnail-image" />
    </div>
  );
};

export default ServeVideoThumbnail;
