import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/HomeNavigation.css";
import photosImg from "../assets/photos.png";
import videosImg from "../assets/videos.png";
import uploadsImg from "../assets/uploads.png";

const HomeNavigation: React.FC = () => {
  const navigate = useNavigate();

  // Detect mobile
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const imageStyle = {
    width: isMobile ? "240px" : "300px",
    height: isMobile ? "352px" : "440px",
    margin: isMobile ? "0 0.5rem" : "0 1.5rem",
  };

  return (
    <div className="home-nav-container" style={{ gap: isMobile ? "1rem" : "3rem" }}>
      <img
        src={photosImg}
        alt="Family Photos"
        onClick={() => navigate("/photos")}
        className="home-nav-image"
        style={imageStyle}
      />
      <img
        src={videosImg}
        alt="Family Videos"
        onClick={() => navigate("/videos")}
        className="home-nav-image"
        style={imageStyle}
      />
      <img
        src={uploadsImg}
        alt="Image Uploads"
        onClick={() => navigate("/uploads")}
        className="home-nav-image"
        style={imageStyle}
      />
    </div>
  );
};

export default HomeNavigation;