import React, { useEffect, useRef, useState } from "react";
import "./css/PlayVideo.css";
import { GLOBAL_BACKEND_URL } from "../App";

interface PlayVideoProps {
  filename: string;
  onClose: () => void;
}

const PlayVideo: React.FC<PlayVideoProps> = ({ filename, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);

  const safeEncode = (path: string) =>
    path?.split("/").map(encodeURIComponent).join("/") ?? "";

  const videoUrl = `${GLOBAL_BACKEND_URL}/serve-video/${safeEncode(filename)}`;

  const enterFullscreen = async () => {
    const container = containerRef.current;
    if (!document.fullscreenElement && container) {
      try {
        if (container.requestFullscreen) await container.requestFullscreen();
        else if ((container as any).webkitRequestFullscreen) (container as any).webkitRequestFullscreen();
        else if ((container as any).msRequestFullscreen) (container as any).msRequestFullscreen();
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
      }
    }
  };

  // First fullscreen trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const show = () => setShowControls(true);
    const hide = () => setShowControls(false);

    let timer = setTimeout(hide, 3000);

    const handleActivity = () => {
      show();
      clearTimeout(timer);
      timer = setTimeout(hide, 3000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  // Track video load progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.duration && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = Math.min((bufferedEnd / video.duration) * 100, 100);
        const rounded = Math.round(percent);
        setLoadPercent(rounded);
        if (rounded >= 3) {
          setShowLoadingOverlay(false);
          enterFullscreen(); // Ensure fullscreen after loading spinner is gone
        }
      }
    };

    const handleCanPlay = () => {
      setShowLoadingOverlay(false);
      enterFullscreen(); // Just in case progress didn't trigger it
    };

    video.addEventListener("progress", handleProgress);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <div className="play-video-overlay" ref={containerRef} id="play-video-overlay">
      <div className="video-wrapper">
        <video
          className="play-video-element"
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
        />
        {showLoadingOverlay && (
          <div className="loading-overlay">
            <div className="spinner" />
            <div className="load-text">{loadPercent}%</div>
          </div>
        )}
        {showControls && (
          <button className="go-back-button" onClick={onClose}>
            Go Back ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayVideo;
