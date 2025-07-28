import React, { useState } from "react";
import "../routes/css/Videos.css";
import ListOfVideos from "../components/ListOfVideos";
import ServeVideoThumbnail from "../components/ServeVideoThumbnail";

const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="videos-container">
      {/* Left Panel: Video List */}
      <div className="video-list-panel">
        <ListOfVideos onVideoSelect={setSelectedVideo} />
      </div>

      {/* Right Panel: Thumbnail Viewer */}
      <div className="video-thumbnail-panel">
        {selectedVideo ? (
          <ServeVideoThumbnail filename={selectedVideo} />
        ) : (
          <div className="placeholder-text">Hover or select a video to see its thumbnail</div>
        )}
      </div>
    </div>
  );
};

export default Videos;
