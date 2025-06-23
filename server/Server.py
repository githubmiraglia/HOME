from flask import Flask, jsonify, abort, request, send_file
import os
import cv2
import numpy as np
import time
import json
import io
from deepface import DeepFace
from PIL import Image
from PIL.ExifTags import TAGS

app = Flask(__name__)

# === Configuration ===
#PHOTO_BASE_DIR = "C:/Users/LuisMiraglia/Personal/HOME/assets/photos"
PHOTO_BASE_DIR = "D:/PHOTOS"
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
CACHE_PATH = os.path.join(CACHE_DIR, "photo_index.json")
photo_index = []

# === Metadata Extraction ===
def extract_metadata(filepath):
    try:
        img = Image.open(filepath)
        exif_data = img._getexif()
        if not exif_data:
            return {}
        exif = {TAGS.get(tag): value for tag, value in exif_data.items() if tag in TAGS}
        return {
            "date": exif.get("DateTimeOriginal") or exif.get("DateTime"),
            "camera": exif.get("Model")
        }
    except Exception:
        return {}

# === Cache Handling ===
def save_photo_index_to_cache():
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(photo_index, f, indent=2)

def load_photo_index_from_cache():
    global photo_index
    if not os.path.exists(CACHE_PATH):
        return False
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            photo_index = json.load(f)
        print("[INFO] Loaded photo index from cache.")
        return True
    except Exception as e:
        print("[ERROR] Failed to load cache:", str(e))
        return False

# === Index Building ===
def build_photo_index():
    global photo_index
    photo_index = []
    print("[INFO] Building photo index from disk...")
    count = 0

    for root, _, files in os.walk(PHOTO_BASE_DIR):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PHOTO_BASE_DIR)
                meta = extract_metadata(full_path)

                photo_index.append({
                    "filename": rel_path.replace("\\", "/"),
                    "date": meta.get("date"),
                    "camera": meta.get("camera"),
                    "gps": None,
                    "location": None
                })

                count += 1
                if count % 1000 == 0:
                    print(f"[PROGRESS] Indexed {count} photos...")

    save_photo_index_to_cache()

# === Image Rotation Detection ===
def detect_rotation_angle(filepath):
    try:
        detections = DeepFace.extract_faces(
            img_path=filepath,
            detector_backend="retinaface",
            enforce_detection=False,
            align=False
        )

        rotation_votes = []

        for face in detections:
            region = face.get("facial_area", {})
            x, y, w, h = region.get("x", 0), region.get("y", 0), region.get("w", 0), region.get("h", 0)
            landmarks = face.get("landmarks", {})

            if "left_eye" in landmarks and "right_eye" in landmarks:
                print("[DEBUG] Detected face with landmarks:", landmarks)
                left, right = landmarks["left_eye"], landmarks["right_eye"]
                dx, dy = right[0] - left[0], right[1] - left[1]
                angle = float(np.degrees(np.arctan2(dy, dx)))

                if abs(angle) < 30:
                    rotation_votes.append(0)
                elif abs(angle) > 60:
                    eye_mid_x = (left[0] + right[0]) / 2
                    dist_left = eye_mid_x - x
                    dist_right = (x + w) - eye_mid_x
                    rotation_votes.append(-90 if dist_right > dist_left else 90)
                else:
                    rotation_votes.append(0)
            elif w > h * 1.13:
                rotation_votes.append(90)
            else:
                rotation_votes.append(0)

        final_angle = max(set(rotation_votes), key=rotation_votes.count) if rotation_votes else 0
        return final_angle
    except:
        return 0

def rotate_image(image, angle):
    if angle == 90:
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif angle == -90:
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    else:
        return image

# === API Endpoints ===
@app.route("/detect-rotation/<path:filename>")
def detect_rotation(filename):
    filepath = os.path.join(PHOTO_BASE_DIR, filename)
    if not os.path.isfile(filepath):
        return abort(404)
    angle = detect_rotation_angle(filepath)
    return jsonify({"angle": angle})


@app.route("/process-image/<path:filename>")
def process_image(filename):
    filepath = os.path.join(PHOTO_BASE_DIR, filename)
    if not os.path.isfile(filepath):
        return abort(404)

    try:
        image = cv2.imread(filepath)
        angle = detect_rotation_angle(filepath)
        rotated = rotate_image(image, angle)
        _, jpeg = cv2.imencode(".jpg", rotated)
        return send_file(io.BytesIO(jpeg.tobytes()), mimetype="image/jpeg")
    except Exception as e:
        print("[ERROR] Failed to process image:", e)
        return abort(500)

@app.route("/photo-index")
def get_photo_index():
    return jsonify(photo_index)

@app.route("/photo-index/sample")
def sample_index():
    return jsonify(photo_index[:3])

@app.route("/photo-index/rebuild", methods=["POST"])
def rebuild_index():
    build_photo_index()
    return jsonify({"status": "rebuilt", "count": len(photo_index)})

@app.route("/photo-index/range")
def get_photos_by_year_range():
    start_year = int(request.args.get("from", 1900))
    end_year = int(request.args.get("to", 2100))

    def extract_year(photo):
        if photo.get("date"):
            try:
                return int(photo["date"][:4])
            except:
                return None
        try:
            parts = photo["filename"].split("/")
            for part in parts:
                if part.isdigit() and 1900 <= int(part) <= 2100:
                    return int(part)
        except:
            return None
        return None

    filtered = [
        photo for photo in photo_index
        if (year := extract_year(photo)) and start_year <= year <= end_year
    ]
    return jsonify(filtered)

@app.route("/analyze-image/<path:filename>")
def analyze_image(filename):
    filepath = os.path.join(PHOTO_BASE_DIR, filename)
    if not os.path.isfile(filepath):
        return abort(404, description="Image not found")

    try:
        start = time.perf_counter()
        angle = detect_rotation_angle(filepath)
        elapsed = round(time.perf_counter() - start, 3)

        return jsonify({
            "global_rotation_angle": angle,
            "message": "Face detection complete",
            "processing_time_seconds": elapsed
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Error during analysis",
            "global_rotation_angle": 0.0
        }), 200

# === Init ===
print("[INFO] Starting photo index setup...")
if not load_photo_index_from_cache():
    build_photo_index()

if __name__ == "__main__":
    app.run(port=8000, debug=True, use_reloader=False)
