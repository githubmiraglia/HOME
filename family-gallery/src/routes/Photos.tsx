import React, { useEffect, useState } from "react";
import "../routes/css/Photos.css";
import PhotoCarousel from "../components/PhotoCarousel";
import SelectorPhotos, { frameToLargeFrameMap } from "../components/Selector_Photos";
import GoBackButton from "../components/GoBackButton";
import OverlayCarousel from "../components/OverlayCarousel";
import { GLOBAL_BACKEND_URL } from "../App";

const CHUNK_SIZE = 15;
const ROTATION = true;
const WAIT_SECONDS = 15; // ⬅️ change here for rotation timing

const isMobileDevice = () =>
  /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

const Photos: React.FC = () => {
  const [chunkA, setChunkA] = useState<string[]>([]);
  const [chunkB, setChunkB] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [pauseRotation, setPauseRotation] = useState(false);

  const [selectedFrame, setSelectedFrame] = useState("/frame1_brownish.png");
  const [selectedBackground, setSelectedBackground] = useState("/background_white.png");
  const [fromYear, setFromYear] = useState(2003);
  const [toYear, setToYear] = useState(2025);
  const [hasFaces, setHasFaces] = useState(true);

  const [photoIndex, setPhotoIndex] = useState<{ filename: string }[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<Set<string>>(new Set());

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  const [preloadedUrls, setPreloadedUrls] = useState<{ [filename: string]: string }>({});

  // ---------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------

  const safeEncodePath = (path: string) =>
    path.split("/").map(encodeURIComponent).join("/");

  const fetchChunk = async (size = CHUNK_SIZE) => {
    const res = await fetch(
      `${GLOBAL_BACKEND_URL}/photo-index/random-chunk?from=${fromYear}&to=${toYear}&size=${size}&clear=true&hasFaces=${hasFaces}`
    );
    return res.json();
  };

  // ---------------------------------------------------------------------
  // ROBUST IMAGE PRELOADER – skips errors
  // ---------------------------------------------------------------------

  const robustPreload = async (countNeeded: number): Promise<string[]> => {
    const results: string[] = [];

    while (results.length < countNeeded) {
      const batchSize = Math.max(20, countNeeded - results.length);
      const photos = await fetchChunk(batchSize);

      const visible = photos.filter((p) => !deletedPhotos.has(p.filename));

      const attempts = await Promise.all(
        visible.map(
          (p) =>
            new Promise<string | null>((resolve) => {
              const url = `${GLOBAL_BACKEND_URL}/serve-image/${safeEncodePath(
                p.filename
              )}`;

              const img = new Image();
              img.onload = () => resolve(url);
              img.onerror = () => resolve(null);
              img.src = url;
            })
        )
      );

      const success = attempts.filter((u): u is string => u !== null);
      results.push(...success);
    }

    return results.slice(0, countNeeded);
  };

  // ---------------------------------------------------------------------
  // INITIAL LOAD: chunkA + chunkB
  // ---------------------------------------------------------------------

  const loadInitialChunks = async () => {
    setLoading(true);
    const urlsA = await robustPreload(15);
    const urlsB = await robustPreload(15);
    setChunkA(urlsA);
    setChunkB(urlsB);
    setLoading(false);
  };

  // ---------------------------------------------------------------------
  // ORIENTATION CHECK
  // ---------------------------------------------------------------------

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobileDevice() && portrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // ---------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      const deletedRes = await fetch(`${GLOBAL_BACKEND_URL}/cache/deleted_photos.json`);
      const deletedJson: string[] = await deletedRes.json();
      setDeletedPhotos(new Set(deletedJson));

      await loadInitialChunks();
      setLoading(false);
    };

    initialize();
  }, []);

  // ---------------------------------------------------------------------
  // LOAD FULL INDEX (overlay navigation)
  // ---------------------------------------------------------------------

  useEffect(() => {
    const loadAll = async () => {
      const res = await fetch(`${GLOBAL_BACKEND_URL}/photo-index/full`);
      setPhotoIndex(await res.json());
    };
    loadAll();
  }, []);

  // ---------------------------------------------------------------------
  // 🔄 STATIC ROTATION (no scrolling)
  // ---------------------------------------------------------------------

  useEffect(() => {
    if (!ROTATION || pauseRotation) return;

    const interval = setInterval(async () => {
      setPauseRotation(true);

      // Move next → current
      setChunkA(chunkB);

      // Fetch new chunk
      const newChunk = await robustPreload(15);
      setChunkB(newChunk);

      setPauseRotation(false);
    }, WAIT_SECONDS * 1000);

    return () => clearInterval(interval);
  }, [chunkA, chunkB, pauseRotation]);

  // ---------------------------------------------------------------------
  // FILTER CHANGE → reload fresh 30
  // ---------------------------------------------------------------------

  useEffect(() => {
    const reload = async () => {
      setPauseRotation(true);
      await loadInitialChunks();
      setPauseRotation(false);
    };

    reload();
  }, [fromYear, toYear, hasFaces]);

  // ---------------------------------------------------------------------
  // OVERLAY HANDLERS
  // ---------------------------------------------------------------------

  const handleImageClick = (url: string) => {
    const full = url.split("/serve-image/")[1] || "";
    const filename = decodeURIComponent(full.trim());

    const index = photoIndex.findIndex(
      (p) =>
        decodeURIComponent(p.filename.trim().toLowerCase()) === filename.toLowerCase()
    );

    if (index !== -1) {
      setStartIndex(index);
      setOverlayVisible(true);
      setPauseRotation(true);
    }
  };

  const handleDeleteInOverlay = (filename: string) => {
    setDeletedPhotos((prev) => new Set([...prev, filename]));
    setPhotoIndex((prev) => prev.filter((p) => p.filename !== filename));
    setChunkA((prev) => prev.filter((u) => !u.includes(filename)));
    setChunkB((prev) => prev.filter((u) => !u.includes(filename)));
  };

  const overlayFrame = frameToLargeFrameMap[selectedFrame] || selectedFrame;

// -----------------------------------
// FULLSCREEN ENTRY (robust)
// -----------------------------------
useEffect(() => {
  const enterFullscreen = async () => {
    const elem = document.documentElement;

    const request =
      elem.requestFullscreen ||
      (elem as any).webkitRequestFullscreen ||
      (elem as any).msRequestFullscreen ||
      (elem as any).mozRequestFullScreen;

    if (request && !document.fullscreenElement) {
      try {
        await request.call(elem);
      } catch (err) {
        console.warn("Fullscreen failed:", err);
      }
    }
  };

  // Small delay to avoid layout issues during mount
  const timer = setTimeout(enterFullscreen, 400);

  return () => clearTimeout(timer);
}, []);



  // ---------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------

  if (isPortrait) {
    return <div className="portrait-warning">Vire dispositivo paisagem (landscape).</div>;
  }

  return (
    <div className="photos-container">
      <div className="controls-wrapper">
        <div className="control-bar">
          <GoBackButton />

          <SelectorPhotos
            selectedFrame={selectedFrame}
            selectedBackground={selectedBackground}
            onFrameChange={setSelectedFrame}
            onBackgroundChange={setSelectedBackground}
            fromYear={fromYear}
            toYear={toYear}
            onFromYearChange={setFromYear}
            onToYearChange={setToYear}
            hasFaces={hasFaces}
            onHasFacesChange={setHasFaces}
          />
        </div>
      </div>

      {/* Only one wall visible */}
      <PhotoCarousel
        images={chunkA}
        frameImage={selectedFrame}
        backgroundImage={selectedBackground}
        showLoading={loading}
        onImageClick={handleImageClick}
      />

      {overlayVisible && startIndex !== null && (
        <OverlayCarousel
          photoIndex={photoIndex}
          startIndex={startIndex}
          onClose={() => {
            setOverlayVisible(false);
            setPauseRotation(false);
          }}
          onPrev={() => setStartIndex((p) => (p !== null ? Math.max(p - 3, 0) : 0))}
          onNext={() =>
            setStartIndex((p) =>
              p !== null ? Math.min(p + 3, photoIndex.length - 3) : 0
            )
          }
          selectedFrame={overlayFrame}
          selectedBackground={selectedBackground}
          onDelete={handleDeleteInOverlay}
          preloadedUrls={preloadedUrls}
        />
      )}
    </div>
  );
};

export default Photos;
