import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/HomeNavigation.css";
import photosImg from "../assets/photos.png";
import videosImg from "../assets/videos.png";

const HomeNavigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-nav-container">
      <img
        src={photosImg}
        alt="Family Photos"
        onClick={() => navigate("/photos")}
        className="home-nav-image"
      />
      <img
        src={videosImg}
        alt="Family Videos"
        onClick={() => navigate("/videos")}
        className="home-nav-image"
      />
    </div>
  );
};

export default HomeNavigation;
