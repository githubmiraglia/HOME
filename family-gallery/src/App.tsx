import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeNavigation from "./components/HomeNavigation";
import Photos from "./routes/Photos";
import Videos from "./routes/Videos";
import Uploads from "./routes/Uploads";
import PhotosUpload from "./routes/PhotosUpload";
import VideosUpload from "./routes/VideosUpload";
import Back from "./routes/Back";
import { logToBackend } from "./utils/utils";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

console.log("Loaded VITE env vars:", import.meta.env);


// === 📐 Reference dimensions for scaling ===
export const IS_RESPONSIVE_DEV = true;
export const GLOBAL_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";
export const BASE_IMAGE_WIDTH = 1536;
export const BASE_IMAGE_HEIGHT = 1024;

// === 📦 Wrapper for PhotosUpload ===
const UploadPhotosWrapper: React.FC = () => {
  const [selectedYear] = useState("2025");
  const [selectedSubfolder, setSelectedSubfolder] = useState("");

  const handleUploadComplete = () => {
    console.log("✅ Upload complete!");
    logToBackend("COMING TO UPLOAD COMPLETE: " + selectedYear);
  };

  const handleSubfolderChange = (folder: string) => {
    setSelectedSubfolder(folder);
    console.log("Selected subfolder:", folder);
    logToBackend("COMING TO CHANGE SUBFOLDER: " + folder);
  };

  return (
    <PhotosUpload
      selectedYear={selectedYear}
      selectedSubfolder={selectedSubfolder}
      onUploadComplete={handleUploadComplete}
      onSubfolderChange={handleSubfolderChange}
    />
  );
};

// === 🧭 Routes ===
const router = createBrowserRouter([
  { path: "/", element: <HomeNavigation /> },
  { path: "/photos", element: <Photos /> },
  { path: "/videos", element: <Videos /> },
  {
    path: "/uploads",
    element: <Uploads />,
    children: [
      { path: "photos", element: <UploadPhotosWrapper /> },
      { path: "videos", element: <VideosUpload /> },
    ],
  },
  { path: "/back", element: <Back /> },
]);

console.log("App.tsx rendering");

const App: React.FC = () => (
  <>
    <RouterProvider router={router} />
  </>
);

export default App;