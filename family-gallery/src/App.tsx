import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeNavigation from "./components/HomeNavigation";
import Photos from "./routes/Photos";
import Videos from "./routes/Videos";
import FullscreenToggle from "./components/FullScreenToggle";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const router = createBrowserRouter([
  { path: "/", element: <HomeNavigation /> },
  { path: "/photos", element: <Photos /> },
  { path: "/videos", element: <Videos /> },
]);

const App: React.FC = () => (
  <>
    <FullscreenToggle />
    <RouterProvider router={router} />
  </>
);

export default App;
