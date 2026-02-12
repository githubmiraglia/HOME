import React, { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./routes/Login";
import HomeNavigation from "./components/HomeNavigation";
import Photos from "./routes/Photos";
import Videos from "./routes/Videos";
import Uploads from "./routes/Uploads";
import PhotosUpload from "./routes/PhotosUpload";
import VideosUpload from "./routes/VideosUpload";
import Back from "./routes/Back";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ============================================================
// GLOBALS
// ============================================================

export const GLOBAL_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

export const BASE_IMAGE_WIDTH = 1920;
export const BASE_IMAGE_HEIGHT = 1080;
export const IS_RESPONSIVE_DEV = true;


// ============================================================
// PROTECTED ROUTE
// ============================================================

const ProtectedRoute = ({
  children,
  access,
  requiredPermission,
}: {
  children: React.ReactElement;
  access: string;
  requiredPermission: string;
}) => {
  if (!access) {
    return <Navigate to="/" replace />;
  }

  if (access === "ALL") {
    return children;
  }

  if (access === "NONE") {
    return <Navigate to="/home" replace />;
  }

  if (access.includes(requiredPermission)) {
    return children;
  }

  return <Navigate to="/home" replace />;
};

// ============================================================
// WRAPPER FOR UPLOAD PHOTOS
// ============================================================

const UploadPhotosWrapper: React.FC = () => {
  return <PhotosUpload selectedYear="2025" selectedSubfolder="" onUploadComplete={() => {}} onSubfolderChange={() => {}} />;
};

// ============================================================
// APP
// ============================================================

const App: React.FC = () => {
  const [userAccess, setUserAccess] = useState<string>("");

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Login setAccess={setUserAccess} />,
      },
      {
        path: "/home",
        element: userAccess ? (
          <HomeNavigation />
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: "/photos",
        element: (
          <ProtectedRoute
            access={userAccess}
            requiredPermission="CAROUSEL"
          >
            <Photos />
          </ProtectedRoute>
        ),
      },
      {
        path: "/videos",
        element: (
          <ProtectedRoute
            access={userAccess}
            requiredPermission="VIDEOS"
          >
            <Videos />
          </ProtectedRoute>
        ),
      },
      {
        path: "/uploads",
        element: (
          <ProtectedRoute
            access={userAccess}
            requiredPermission="UPLOAD"
          >
            <Uploads />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "photos",
            element: (
              <ProtectedRoute
                access={userAccess}
                requiredPermission="UPLOAD"
              >
                <UploadPhotosWrapper />
              </ProtectedRoute>
            ),
          },
          {
            path: "videos",
            element: (
              <ProtectedRoute
                access={userAccess}
                requiredPermission="UPLOAD"
              >
                <VideosUpload />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/back",
        element: <Back />,
      },
    ],
    {
      basename: "/family-gallery",
    }
  );

  return <RouterProvider router={router} />;
};

export default App;
