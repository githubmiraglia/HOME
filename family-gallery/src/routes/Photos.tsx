import React, { useEffect, useState, useRef } from "react";
import "../routes/css/Photos.css";
import PhotoCarousel from "../components/PhotoCarousel";
import SelectorPhotos, { frameToLargeFrameMap } from "../components/Selector_Photos";
import GoBackButton from "../components/GoBackButton";
import OverlayCarousel from "../components/OverlayCarousel";
import { GLOBAL_BACKEND_URL } from "../App";

const TOTAL_TO_DISPLAY = 15;
const CHUNK_SIZE = 15;
const SCROLL_INTERVAL_MS = 30;
const SLIDE_SPEED_PX = 0.5;
const ROTATION = true;
const isMobileDevice = () => /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

const Photos: React.FC = () => {
  const [chunks, setChunks] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [pauseRotation, setPauseRotation] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const checkOrientation = () => {
      const isPortraitNow = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobileDevice() && isPortraitNow);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const fetchChunk = async (): Promise<any[]> => {
    const res = await fetch(
      `${GLOBAL_BACKEND_URL}/photo-index/random-chunk?from=${fromYear}&to=${toYear}&size=${CHUNK_SIZE}&clear=true&hasFaces=${hasFaces}`
    );
    return res.json();
  };

  const safeEncodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

  const preloadImages = async (photos: any[]): Promise<string[]> => {
    const newPreloaded: { [filename: string]: string } = {};
    const urls = await Promise.all(
      photos.map((photo) => {
        const url = `${GLOBAL_BACKEND_URL}/serve-image/${safeEncodePath(photo.filename)}`;
        newPreloaded[photo.filename] = url;
        return new Promise<string>((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = img.onerror = () => resolve(url);
        });
      })
    );
    setPreloadedUrls((prev) => ({ ...prev, ...newPreloaded }));
    return urls;
  };

  const refillChunks = async () => {
    const newPhotos = await fetchChunk();
    const visiblePhotos = newPhotos.filter((p) => !deletedPhotos.has(p.filename));
    const newImages = await preloadImages(visiblePhotos);
    setChunks((prev) => [...prev, newImages]);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const deletedRes = await fetch(`${GLOBAL_BACKEND_URL}/cache/deleted_photos.json`);
        const deletedJson: string[] = await deletedRes.json();
        setDeletedPhotos(new Set(deletedJson));

        const count = ROTATION ? TOTAL_TO_DISPLAY / CHUNK_SIZE : 1;
        for (let i = 0; i < count; i++) {
          await refillChunks();
        }
        setLoading(false);
      } catch (err) {
        console.error("Initialization error:", err);
        setLoading(false);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    const fetchFullIndex = async () => {
      const res = await fetch(`${GLOBAL_BACKEND_URL}/photo-index/full`);
      const json = await res.json();
      setPhotoIndex(json);
    };
    fetchFullIndex();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const enterFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.error("Failed to enter fullscreen:", err);
        }
      }
    };
    enterFullscreen();
  }, []);

useEffect(() => {
  if (!ROTATION || pauseRotation) {
    //console.log("🛑 Scroll paused.");
    return;
  }

  //console.log("🚀 Starting auto-scroll");
  let animationFrameId: number;
  let lastTimestamp = performance.now();

  const step = (timestamp: number) => {
    const container = containerRef.current;
    if (!container) {
      //console.log("⚠️ containerRef is null");
      return;
    }

    const elapsed = timestamp - lastTimestamp;

    if (elapsed >= SCROLL_INTERVAL_MS) {
      //console.log("➡️ Scrolling...", {
        //scrollLeft: container.scrollLeft,
        //windowWidth,
      //});

      container.scrollLeft += SLIDE_SPEED_PX;
      lastTimestamp = timestamp;

      if (container.scrollLeft >= windowWidth) {
        //console.log("🔄 Rotating chunks");
        container.scrollLeft = 0;
        setChunks((prev) => prev.slice(1));
        refillChunks();
      }
    }

    animationFrameId = requestAnimationFrame(step);
};

  animationFrameId = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(animationFrameId);
    //console.log("🧹 Scroll interval cleared");
  };
}, [pauseRotation, ROTATION, windowWidth]);

useEffect(() => {
  const refreshChunks = async () => {
    try {
      //console.log("🔁 Refreshing chunks with filters:", { fromYear, toYear, hasFaces });

      setPauseRotation(true);
      setLoading(true);

      const count = ROTATION ? 2 : 1; // ensure at least 2 chunks for scrollability
      const freshChunks: string[][] = [];

      for (let i = 0; i < count; i++) {
        const newPhotos = await fetchChunk();
        //console.log(`📸 Chunk ${i + 1}: fetched ${newPhotos.length} photos`);

        const visiblePhotos = newPhotos.filter((p) => !deletedPhotos.has(p.filename));
        //console.log(`🧹 After filtering deleted, ${visiblePhotos.length} remain`);

        const newImages = await preloadImages(visiblePhotos);
        //console.log(`✅ Preloaded ${newImages.length} images`);

        freshChunks.push(newImages);
      }

      setChunks(freshChunks);
      //console.log("✅ Chunks updated", freshChunks);

      // 💡 Manually reset scrollLeft after DOM update
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (container) {
          container.scrollLeft = 0;
          //console.log("↩️ scrollLeft manually reset after chunk update");

          //console.log("📐 Scroll debug after reset:", {
            //scrollLeft: container.scrollLeft,
            //scrollWidth: container.scrollWidth,
            //clientWidth: container.clientWidth,
          //});
        }
      });

    } catch (err) {
      console.error("❌ Error refreshing photo chunks:", err);
    } finally {
      setLoading(false);
      setPauseRotation(false);
      //console.log("🎬 Rotation resumed", loading);
    }
  };

  refreshChunks();
}, [fromYear, toYear, hasFaces]);
  

  const handleImageClick = (url: string) => {
    const fullPath = url.split("/serve-image/")[1] || "";
    const filename = decodeURIComponent(fullPath.trim());
    const index = photoIndex.findIndex(
      (p) => decodeURIComponent((p.filename || "").trim().toLowerCase()) === filename.toLowerCase()
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
    setChunks((prevChunks) =>
      prevChunks.map((chunk) => chunk.filter((url) => !url.includes(filename)))
    );
  };

  const overlayFrame = frameToLargeFrameMap[selectedFrame] || selectedFrame;

  if (isPortrait) {
    return <div className="portrait-warning">Vire dispositivo paisagem (landscape).</div>;
  }

  return (
    <div className="photos-container" ref={containerRef}>
      {loading && <div className="global-loading-overlay">Loading photos...</div>}

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

      {chunks.map((chunk, idx) => (
        <PhotoCarousel
          key={idx}
          images={chunk}
          frameImage={selectedFrame}
          backgroundImage={selectedBackground}
          showLoading={loading && idx === 0}
          onImageClick={handleImageClick}
        />
      ))}

      {overlayVisible && startIndex !== null && (
        <OverlayCarousel
          photoIndex={photoIndex}
          startIndex={startIndex}
          onClose={() => {
            setOverlayVisible(false);
            setPauseRotation(false);
          }}
          onPrev={() =>
            setStartIndex((prev) => (prev !== null ? Math.max(prev - 3, 0) : 0))
          }
          onNext={() =>
            setStartIndex((prev) =>
              prev !== null ? Math.min(prev + 3, photoIndex.length - 3) : 0
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