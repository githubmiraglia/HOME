// Videos.tsx
import React, { useState, useEffect } from "react";
import "./css/Videos.css";
import ListOfVideos from "../components/ListOfVideos";
import ServeVideoThumbnail from "../components/ServeVideoThumbnail";
import PlayVideo from "../components/Playvideo";
import GoBackButton from "../components/GoBackButton";

const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ESC to confirm exit from playback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPlaying) {
        const confirmExit = window.confirm("Are you sure you want to exit full screen?");
        if (confirmExit) {
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  return (
    <div className="video-overlay-wrapper">
      <div className="hover-button-wrapper">
        <GoBackButton />
      </div>

      <div className="videos-container">
        {isPlaying && selectedVideo ? (
          <PlayVideo filename={selectedVideo} onClose={() => setIsPlaying(false)} />
        ) : (
          <>
            {/* Left Panel: List of videos */}
            <div className="video-list-panel">
              <ListOfVideos
                onVideoSelect={setSelectedVideo}
                onPlayRequest={(filename) => {
                  setSelectedVideo(filename);
                  setIsPlaying(true);
                }}
              />
            </div>

            {/* Right Panel: Thumbnail viewer */}
            <div
              className="video-thumbnail-panel"
              onClick={() => {
                if (selectedVideo) setIsPlaying(true);
              }}
            >
              {selectedVideo ? (
                <ServeVideoThumbnail filename={selectedVideo} />
              ) : (
                <div className="placeholder-text">
                  Hover or select a video to see its thumbnail
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Videos;
