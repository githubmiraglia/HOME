import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import photosUploadImg from "../assets/photosupload.png";
import videosUploadImg from "../assets/videosupload.png";
import GoBackButton from "../components/GoBackButton"; // ✅ Import your custom GoBackButton
import "../components/css/HomeNavigation.css";

const Uploads: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const showTiles = location.pathname === "/uploads";

  const imageStyle = {
    width: isMobile ? "240px" : "300px",
    height: isMobile ? "352px" : "440px",
    margin: isMobile ? "0 0.5rem" : "0 1.5rem",
  };

  const backgroundStyle = {
    backgroundImage: `url("/background_white.png")`,
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column" as const,
  };

  const tileRowStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: isMobile ? "1rem" : "3rem",
    flexWrap: "wrap" as const,
  };

  return (
    <div style={backgroundStyle}>
      {showTiles && <GoBackButton />} {/* 👈 Only shows Go Back on /uploads */}
      {showTiles && (
        <div style={tileRowStyle}>
          <img
            src={photosUploadImg}
            alt="Photos Upload"
            onClick={() => navigate("/uploads/photos")}
            className="home-nav-image"
            style={imageStyle}
          />
          <img
            src={videosUploadImg}
            alt="Videos Upload"
            onClick={() => navigate("/uploads/videos")}
            className="home-nav-image"
            style={imageStyle}
          />
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default Uploads;