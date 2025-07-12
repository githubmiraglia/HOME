import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeNavigation from "./components/HomeNavigation";
import Photos from "./routes/Photos";
import Videos from "./routes/Videos";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Back from "./routes/Back";

// for Prod
export const GLOBAL_BACKEND_URL = "http://wrrm.lat:8001";
// for Dev
//export const GLOBAL_BACKEND_URL = "http://localhost:8001";

const router = createBrowserRouter([
  { path: "/", element: <HomeNavigation /> },
  { path: "/photos", element: <Photos /> },
  { path: "/videos", element: <Videos /> },
  { path: "/back", element: <Back /> },
]);

console.log("App.tsx rendering");

const App: React.FC = () => (
  <>
    <RouterProvider router={router} />
  </>
);

export default App;
