import React from "react";
import "../routes/css/Photos.css";
import PhotoCarousel from "../components/PhotoCarousel";

const Photos: React.FC = () => {
  return (
    <div className="photos-container">
      <PhotoCarousel />
    </div>
  );
};

export default Photos;
