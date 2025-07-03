from flask import Flask, jsonify, abort, request, send_file
import os
import cv2
import numpy as np
import time
import json
import io
import subprocess
import random
from collections import defaultdict
from deepface import DeepFace
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import pillow_heif
pillow_heif.register_heif_opener()
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PHOTO_BASE_DIR = "/Volumes/PHOTOSVIDEO/PHOTOS"
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
CACHE_PATH = os.path.join(CACHE_DIR, "photo_index.json")
IMAGE_CACHE_DIR = os.path.join(os.path.dirname(__file__), "image_cache")

location_cache = []
DISTANCE_THRESHOLD_KM = 5.0
geolocator = Nominatim(user_agent="photo_server")

photo_index = []  # Global index loaded at startup

# ========================= HELPERS =============================

def extract_year(photo):
    try:
        if photo.get("date"):
            return int(photo["date"][:4])
        parts = photo["filename"].split("/")
        for part in parts:
            if part.isdigit():
                y = int(part)
                if 1900 <= y <= 2100:
                    return y
    except: pass
    return None

def filter_photos_by_year_range(start_year, end_year):
    return [photo for photo in photo_index if (y := extract_year(photo)) and start_year <= y <= end_year]

# ========================= METADATA =============================

def format_exif_date(raw_date: str) -> str:
    formats = [
        "%Y:%m:%d %H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y/%m/%d %H:%M:%S",
        "%Y.%m.%d %H:%M:%S",
        "%Y:%m:%d",
        "%Y-%m-%d"
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(raw_date, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

def extract_metadata(filepath):
    try:
        result = subprocess.run(
            ['exiftool', '-json', filepath],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        metadata_list = json.loads(result.stdout)
        metadata = metadata_list[0] if metadata_list else {}
        raw_date = metadata.get("DateTimeOriginal") or metadata.get("CreateDate") or metadata.get("ModifyDate")
        return {
            "date": format_exif_date(raw_date) if raw_date else None,
            "camera": metadata.get("Model")
        }
    except Exception:
        return {}

def extract_gps_from_exif(filepath):
    try:
        result = subprocess.run(['exiftool', '-json', filepath], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        metadata_list = json.loads(result.stdout)
        metadata = metadata_list[0] if metadata_list else {}
        gps_lat = metadata.get("GPSLatitude")
        gps_lon = metadata.get("GPSLongitude")
        lat_ref = metadata.get("GPSLatitudeRef")
        lon_ref = metadata.get("GPSLongitudeRef")
        if gps_lat and gps_lon:
            lat = float(gps_lat)
            lon = float(gps_lon)
            if lat_ref == "S": lat = -lat
            if lon_ref == "W": lon = -lon
            return lat, lon
    except: pass
    return None, None

def get_cached_location(lat, lon):
    for cached_lat, cached_lon, location in location_cache:
        if geodesic((lat, lon), (cached_lat, cached_lon)).km < DISTANCE_THRESHOLD_KM:
            return location
    return None

def geocode_location(lat, lon):
    cached = get_cached_location(lat, lon)
    if cached: return cached
    try:
        location = geolocator.reverse((lat, lon), language='en')
        if location and location.raw.get('address'):
            address = location.raw['address']
            result = {
                'city': address.get('city') or address.get('town') or address.get('village') or '',
                'state': address.get('state', ''),
                'country': address.get('country', '')
            }
            location_cache.append((lat, lon, result))
            return result
    except: pass
    return {}

# ========================= INDEX =============================

def save_photo_index_to_cache(photo_index):
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(photo_index, f, indent=2)

def load_photo_index_from_cache():
    global photo_index
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            photo_index = json.load(f)
        return True
    return False

def detect_rotation_angle(filepath):
    #print("TRYING TO DETECT")
    try:
        detections = DeepFace.extract_faces(
            img_path=filepath,
            detector_backend="retinaface",
            enforce_detection=False,
            align=False
        )
        #print("DETECTED FACES", len(detections))
        #print(detections)

        rotation_votes = []
        for face in detections:
            confidence = face.get("confidence", 0)
            if confidence < 0.7:
                #print(f"[SKIP] Low confidence face: {confidence}")
                continue  # Skip low confidence

            region = face.get("facial_area", {})
            #print(region)
            x, y, w, h = region.get("x", 0), region.get("y", 0), region.get("w", 0), region.get("h", 0)
            left = region.get("left_eye")
            right = region.get("right_eye")

            if left and right:
                dx, dy = right[0] - left[0], right[1] - left[1]
                if abs(dx) < 3 and abs(dy) < 3: continue 
                angle = float(np.degrees(np.arctan2(dy, dx)))
                #print("ANGLE = ",angle)
                if abs(angle) <= 70 or abs(angle) >= 120:
                    rotation_votes.append(0)
                elif abs(angle) > 70 and abs(angle) < 120:
                    eye_mid_x = (left[0] + right[0]) / 2
                    dist_left = eye_mid_x - x
                    dist_right = (x + w) - eye_mid_x
                    vote = 90 if dist_right > dist_left else -90
                    rotation_votes.append(vote)
                else:
                    rotation_votes.append(0)
            elif w > h * 1.13:
                rotation_votes.append(90)
            else:
                rotation_votes.append(0)

        final_angle = max(set(rotation_votes), key=rotation_votes.count) if rotation_votes else 0
        return final_angle

    except Exception as e:
        print("[ERROR] Failed to detect rotation angle:", e)
        return 0


def rotate_image(image, angle):
    if angle == 90:
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    elif angle == -90:
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return image

def build_photo_index():
    global photo_index
    photo_index = []
    for root, _, files in os.walk(PHOTO_BASE_DIR):
        for file in files:
            if file.startswith("._"): continue
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif")):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, PHOTO_BASE_DIR)
                meta = extract_metadata(full_path)
                angle = detect_rotation_angle(full_path)
                lat, lon = extract_gps_from_exif(full_path)
                location = geocode_location(lat, lon) if lat and lon else None
                photo_index.append({
                    "filename": rel_path.replace("\\", "/"),
                    "date": meta.get("date"),
                    "camera": meta.get("camera"),
                    "angle": angle,
                    "gps": {"latitude": lat, "longitude": lon} if lat and lon else None,
                    "location": location
                })
    save_photo_index_to_cache(photo_index)

# ========================= IMAGE SERVING =============================

@app.route("/serve-image/<path:filename>")
def serve_image(filename):
    global photo_index
    image_entry = next((x for x in photo_index if x['filename'] == filename), None)
    if not image_entry:
        return abort(404)
    original_path = os.path.join(PHOTO_BASE_DIR, filename)
    if not os.path.exists(original_path):
        return abort(404)

    cache_output = os.path.join(IMAGE_CACHE_DIR, filename + ".webp")
    os.makedirs(os.path.dirname(cache_output), exist_ok=True)

    if os.path.exists(cache_output):
        return send_file(cache_output, mimetype="image/webp")

    try:
        img = Image.open(original_path).convert("RGB")
        angle = image_entry.get("angle", 0)
        if angle != 0:
            img = img.rotate(-angle, expand=True)
        w_percent = 600 / float(img.size[0])
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((600, h_size), Image.LANCZOS)
        img.save(cache_output, "WEBP")
        return send_file(cache_output, mimetype="image/webp")
    except Exception as e:
        print("[ERROR]", e)
        return abort(500)

# ========================= API ROUTES =============================

@app.route("/photo-index")
def get_photo_index():
    return jsonify(photo_index)

@app.route("/photo-index/sample")
def sample_index():
    return jsonify(photo_index[:3])

@app.route("/photo-index/rebuild")
def rebuild():
    build_photo_index()
    return jsonify({"status": "rebuilt", "count": len(photo_index)})

@app.route("/photo-index/clear-buffer")
def clear_buffer():
    used_indices_by_range.clear()
    return jsonify({"status": "buffer cleared"})

# Memory cache to track used indices per year range
used_indices_by_range = defaultdict(set)
@app.route("/photo-index/random-chunk")
def get_random_photo_chunk():
    global used_indices_by_range
    # Parse query parameters
    start_year = int(request.args.get("from", 1900))
    end_year = int(request.args.get("to", 2100))
    chunk_size = int(request.args.get("size", 15))
    should_clear = request.args.get("clear", "false").lower() == "true"
    # Filter photos in range
    filtered_photos = filter_photos_by_year_range(start_year, end_year)
    # Handle buffer key by range
    range_key = f"{start_year}-{end_year}"
    if should_clear or len(used_indices_by_range[range_key]) >= len(filtered_photos):
        used_indices_by_range[range_key].clear()
    # Determine available indices
    available_indices = list(set(range(len(filtered_photos))) - used_indices_by_range[range_key])
    if not available_indices:
        return jsonify([])
    # Select chunk
    selected = (
        random.sample(available_indices, chunk_size)
        if len(available_indices) >= chunk_size
        else available_indices
    )
    # Update buffer
    used_indices_by_range[range_key].update(selected)
    # Return the chunk of photos
    return jsonify([filtered_photos[i] for i in selected])

if __name__ == "__main__":
    if not load_photo_index_from_cache():
        build_photo_index()
    app.run(port=8001, debug=True, use_reloader=False)