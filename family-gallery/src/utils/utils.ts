import heic2any from "heic2any";
import axios from "axios";
import { GLOBAL_BACKEND_URL } from "../App";

/**
 * Converts an array of File objects, transforming any HEIC images to JPEG.
 * Returns a Promise that resolves to a new array of File objects.
 */
export async function convertHeicToJpeg(files: File[]): Promise<File[]> {
  const converted: File[] = [];

  for (const file of files) {
    const isHeic = file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic";
    if (isHeic) {
      try {
        const result = await heic2any({ blob: file, toType: "image/jpeg" });

        const blobs = Array.isArray(result) ? result : [result];
        blobs.forEach((blob, index) => {
          const jpegFile = new File(
            [blob],
            file.name.replace(/\.heic$/i, `_${index}.jpg`),
            { type: "image/jpeg" }
          );
          converted.push(jpegFile);
        });
      } catch (err) {
        console.error("HEIC conversion failed for", file.name, err);
      }
    } else {
      converted.push(file);
    }
  }

  return converted;
}

export function logToBackend(message: string, level: "info" | "warn" | "error" | "debug" = "info") {
  axios.post(`${GLOBAL_BACKEND_URL}/frontend-log`, { message, level })
    .catch((err) => {
      console.warn("Failed to log to backend:", err);
    });
}