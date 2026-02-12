import re
import os, io, json, random, time, subprocess, tempfile, uuid, logging
from collections import defaultdict
from functools import wraps
from datetime import datetime
from flask import Flask, jsonify, abort, request, send_file, send_from_directory, Response
from werkzeug.utils import secure_filename
from PIL import Image
import pillow_heif
import boto3
from botocore.exceptions import ClientError
from flask_cors import CORS
from dotenv import load_dotenv
from io import BytesIO
import sys
sys.stdout.reconfigure(line_buffering=True)

import mysql.connector
from mysql.connector import pooling

# -------------------------------------------------------------
# MYSQL setup
# -------------------------------------------------------------
MYSQL_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "dmp_mysql"),
    "user": os.getenv("MYSQL_USER", "ADMIN"),
    "password": os.getenv("MYSQL_PASSWORD", "admin"),
    "database": os.getenv("MYSQL_DB", "dmp"),
    "port": int(os.getenv("MYSQL_PORT", 3306)),
}

mysql_pool = pooling.MySQLConnectionPool(
    pool_name="dmp_pool",
    pool_size=5,
    **MYSQL_CONFIG
)

def get_db():
    return mysql_pool.get_connection()

# -------------------------------------------------------------
# Logging setup
# -------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# -------------------------------------------------------------
# Flask app + HEIF registration
# -------------------------------------------------------------
pillow_heif.register_heif_opener()
load_dotenv()

app = Flask(__name__)
CORS(app)

NUMBER_PIXELS = 600
NUMBER_PIXELS_STR = str(NUMBER_PIXELS)+"px"

# -------------------------------------------------------------
# Mode detection (local vs AWS S3)
# -------------------------------------------------------------
USE_LOCAL = os.getenv("USE_LOCAL_STORAGE", "false").lower() == "true"
LOCAL_REPO = os.getenv("LOCAL_PHOTO_REPO", "/mnt/localrepo")

print(f"🧩 Storage mode: {'LOCAL SSD' if USE_LOCAL else 'AWS S3'}")
if USE_LOCAL:
    print(f"📂 Local repository root: {LOCAL_REPO}")

# -------------------------------------------------------------
# AWS S3 configuration
# -------------------------------------------------------------
s3 = boto3.client("s3")
S3_BUCKET = "photo-video-repository"
S3_ORIGINALS_PREFIX = "photos/originals"
S3_CACHE_PREFIX_ROTATED = "cache-image/400px/rotated"
S3_CACHE_PREFIX_UNROTATED = "cache-image/400px/unrotated"

# -------------------------------------------------------------
# Index / cache
# -------------------------------------------------------------
photo_index = []
deleted_photos = set()
used_indices_by_range = defaultdict(set)

def load_filtered_index():
    try:
        with open("cache/photo_index.json", "r") as f:
            index = json.load(f)
            return [p for p in index if not os.path.basename(p["filename"]).startswith("._")]
    except:
        return []

photo_index = load_filtered_index()

try:
    with open("cache/deleted_photos.json", "r") as f:
        deleted_photos = set(json.load(f))
except:
    deleted_photos = set()

# -------------------------------------------------------------
# Utilities
# -------------------------------------------------------------
def log_timing(route_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            duration = round((time.perf_counter() - start) * 1000, 2)
            # print(f"[PERF] {route_name} took {duration} ms")
            return result
        return wrapper
    return decorator

def extract_year(photo):
    try:
        if photo.get("date"):
            y = int(photo["date"][:4])
            return None if y == 2100 else y
        parts = photo["filename"].split("/")
        for part in parts:
            if part.isdigit():
                y = int(part)
                return y if 1900 <= y <= 2100 else None
    except:
        return None

def filter_photos_by_year_range(start_year, end_year):
    return [p for p in photo_index if (y := extract_year(p)) and start_year <= y <= end_year]

# -------------------------------------------------------------
# Routes
# -------------------------------------------------------------
@app.route("/serve-image/<path:filename>")
@log_timing("serve-image")
def serve_image(filename):
    image_entry = next((x for x in photo_index if x["filename"] == filename), None)
    if not image_entry:
        print(f"[404] Photo not in index: {filename}")
        return abort(404)

    angle = image_entry.get("angle", 0)
    is_rotated = angle != 0

    # --- LOCAL STORAGE MODE ---
    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local photo repository not available on this system.", "data": []}), 200
    if USE_LOCAL:
        cache_path = os.path.join(LOCAL_REPO, "photos", "cache-image", NUMBER_PIXELS_STR, filename)
        original_path = os.path.join(LOCAL_REPO, "photos", "originals", filename)

        # Ensure cache directory exists
        os.makedirs(os.path.dirname(cache_path), exist_ok=True)

        try:
            # 1️⃣ Serve from cache if available
            if os.path.exists(cache_path):
                img = Image.open(cache_path).convert("RGB")
            else:
                # 2️⃣ Otherwise, load from originals, rotate, resize, save to cache
                if not os.path.exists(original_path):
                    print(f"[404] Original file not found: {original_path}")
                    return abort(404)

                img = Image.open(original_path)#.convert("RGB")
                if angle:
                    img = img.rotate(-angle, expand=True)

                width = NUMBER_PIXELS
                ratio = width / float(img.size[0])
                height = int((float(img.size[1]) * ratio))
                resized = img.resize((width, height), Image.LANCZOS)

                # Save to cache in WebP format
                resized.save(cache_path, format="WEBP", quality=90)
                img = resized
                print(f"[CACHE] Created: {cache_path}")

            # 3️⃣ Always return as WEBP to frontend
            buf = BytesIO()
            img.save(buf, format="WEBP", quality=90)
            buf.seek(0)
            return send_file(buf, mimetype="image/webp")

        except Exception as e:
            print(f"[ERROR] Local image processing failed: {e}")
            return abort(500)

    # --- AWS S3 MODE (only runs when USE_LOCAL_STORAGE=false) ---
    original_key = f"{S3_ORIGINALS_PREFIX}/{filename}"
    cache_key = f"{S3_CACHE_PREFIX_ROTATED if is_rotated else S3_CACHE_PREFIX_UNROTATED}/{filename}.webp"

    try:
        cached = s3.get_object(Bucket=S3_BUCKET, Key=cache_key)
        return send_file(BytesIO(cached["Body"].read()), mimetype="image/webp")
    except ClientError as e:
        if e.response["Error"]["Code"] != "NoSuchKey":
            print(f"[S3 ERROR] cache fetch failed: {e}")
            return abort(500)

    try:
        original_obj = s3.get_object(Bucket=S3_BUCKET, Key=original_key)
        img = Image.open(BytesIO(original_obj["Body"].read())).convert("RGB")
        if angle:
            img = img.rotate(-angle, expand=True)
        width = NUMBER_PIXELS
        ratio = width / float(img.size[0])
        height = int((float(img.size[1]) * ratio))
        img = img.resize((width, height), Image.LANCZOS)
        buf = BytesIO()
        img.save(buf, format="WEBP", quality=90)
        buf.seek(0)
        s3.put_object(Bucket=S3_BUCKET, Key=cache_key, Body=buf.getvalue(), ContentType="image/webp")
        buf.seek(0)
        return send_file(buf, mimetype="image/webp")
    except Exception as e:
        print(f"[ERROR] Failed to process image from S3: {e}")
        return abort(500)

# -------------------------------------------------------------
# Download photo
# -------------------------------------------------------------

@app.route("/download-photo/<path:filename>")
@log_timing("download-photo")
def download_photo(filename):
    """
    Downloads the original image (not the resized 600px cache) as an attachment.
    Supports both LOCAL and AWS S3 storage.
    """
    # --- LOCAL MODE ---
    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local photo repository not available on this system.", "data": []}), 200
    if USE_LOCAL:
        original_path = os.path.join(LOCAL_REPO, "photos", "originals", filename)
        if not os.path.exists(original_path):
            print(f"[404] File not found for download: {original_path}")
            return abort(404)
        return send_file(original_path, as_attachment=True, download_name=os.path.basename(filename))

    # --- AWS S3 MODE ---
    try:
        original_key = f"{S3_ORIGINALS_PREFIX}/{filename}"
        s3_obj = s3.get_object(Bucket=S3_BUCKET, Key=original_key)
        buf = BytesIO(s3_obj["Body"].read())
        buf.seek(0)
        return send_file(
            buf,
            as_attachment=True,
            download_name=os.path.basename(filename),
            mimetype="image/jpeg"
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            print(f"[404] S3 key not found: {original_key}")
            return abort(404)
        print(f"[ERROR] S3 download failed: {e}")
        return abort(500)

# -------------------------------------------------------------
# Index routes
# -------------------------------------------------------------
@app.route("/photo-index/full")
def get_photo_index():
    return jsonify([p for p in photo_index if p["filename"] not in deleted_photos])

@app.route("/photo-index/sample")
def sample_index():
    return jsonify(photo_index[:3])

@app.route("/photo-index/range")
@log_timing("photo-index/range")
def get_photos_by_year_range():
    start = int(request.args.get("from", 1900))
    end = int(request.args.get("to", 2100))
    filtered = [
        p for p in photo_index
        if (y := extract_year(p)) and start <= y <= end and p["filename"] not in deleted_photos
    ]
    return jsonify(filtered)

@app.route("/photo-index/range-of-years")
def get_photo_year_range():
    years = [extract_year(p) for p in photo_index if extract_year(p)]
    return jsonify({"min": min(years), "max": max(years)}) if years else jsonify({"min": 2003, "max": 2025})

@app.route("/photo-index/random-chunk")
def get_random_photo_chunk():
    start = int(request.args.get("from", 1900))
    end = int(request.args.get("to", 2100))
    size = int(request.args.get("size", 15))
    require_faces = request.args.get("hasFaces", "false").lower() == "true"
    should_clear = request.args.get("clear", "false").lower() == "true"

    key = f"{start}-{end}-{require_faces}"
    if should_clear or len(used_indices_by_range[key]) >= len(photo_index):
        used_indices_by_range[key].clear()

    filtered = [
        p for p in filter_photos_by_year_range(start, end)
        if p["filename"] not in deleted_photos and (not require_faces or p.get("hasFaces", False))
    ]
    available = list(set(range(len(filtered))) - used_indices_by_range[key])
    if not available:
        return jsonify([])
    selected = random.sample(available, size) if len(available) >= size else available
    used_indices_by_range[key].update(selected)
    return jsonify([filtered[i] for i in selected])

@app.route("/photo-index/delete", methods=["POST"])
def delete_photo():
    data = request.get_json()
    filename = data.get("filename")
    if not filename:
        return jsonify({"error": "Missing filename"}), 400
    deleted_photos.add(filename)
    with open("cache/deleted_photos.json", "w") as f:
        json.dump(list(deleted_photos), f)
    return jsonify({"status": "deleted", "filename": filename})

@app.route("/photo-index/rotate", methods=["POST", "OPTIONS"])
def rotate_photo():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json(force=True)
    filename = data.get("filename")
    if not filename:
        return jsonify({"error": "Missing filename"}), 400

    image_entry = next((x for x in photo_index if x["filename"] == filename), None)
    if not image_entry:
        return jsonify({"error": "Photo not found"}), 404

    # --- LOCAL MODE ---
    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local photo repository not available on this system.", "data": []}), 200
    if USE_LOCAL:
        local_path = os.path.join(LOCAL_REPO, "photos", "originals", filename)
        cache_path = os.path.join(LOCAL_REPO, "photos", "cache-image", NUMBER_PIXELS_STR, filename)
        if not os.path.exists(local_path):
            return jsonify({"error": "File not found"}), 404

        new_angle = (image_entry.get("angle", 0) + 90) % 360
        image_entry["angle"] = new_angle

        # 🧹 Delete cached version (force regeneration on next serve)
        if os.path.exists(cache_path):
            try:
                os.remove(cache_path)
                print(f"[CACHE] Deleted old cached image: {cache_path}")
            except Exception as e:
                print(f"[WARN] Could not remove cache: {e}")

        # 🔄 Generate rotated image for immediate preview
        img = Image.open(local_path).convert("RGB").rotate(-new_angle, expand=True)
        w_percent = NUMBER_PIXELS / float(img.size[0])
        h_size = int(float(img.size[1]) * w_percent)
        resized = img.resize((NUMBER_PIXELS, h_size), Image.LANCZOS)

        out = BytesIO()
        resized.save(out, "WEBP", quality=90)
        out.seek(0)

        with open("cache/photo_index.json", "w") as f:
            json.dump(photo_index, f, indent=2)

        return send_file(out, mimetype="image/webp")

    # --- AWS S3 MODE ---
    try:
        original_obj = s3.get_object(Bucket=S3_BUCKET, Key=f"{S3_ORIGINALS_PREFIX}/{filename}")
        img = Image.open(BytesIO(original_obj["Body"].read())).convert("RGB")
        new_angle = (image_entry.get("angle", 0) + 90) % 360
        image_entry["angle"] = new_angle
        rotated = img.rotate(-new_angle, expand=True)
        w_percent = NUMBER_PIXELS / float(rotated.size[0])
        h_size = int(float(rotated.size[1]) * w_percent)
        resized = rotated.resize((NUMBER_PIXELS, h_size), Image.LANCZOS)
        buf = BytesIO()
        resized.save(buf, "WEBP")
        buf.seek(0)
        s3.put_object(Bucket=S3_BUCKET, Key=f"{S3_CACHE_PREFIX_ROTATED}/{filename}.webp",
                      Body=buf.getvalue(), ContentType="image/webp")
        with open("cache/photo_index.json", "w") as f:
            json.dump(photo_index, f, indent=2)
        return send_file(buf, mimetype="image/webp")
    except Exception as e:
        print(f"[ERROR] rotate failed: {e}")
        return abort(500)

# -------------------------------------------------------------
# Local cache endpoint
# -------------------------------------------------------------
@app.route("/cache/<path:filename>")
def serve_cache_file(filename):
    return send_from_directory("cache", filename)

# -------------------------------------------------------------
# Videos
# -------------------------------------------------------------
@app.route("/video-index/list")
def list_videos():
    """
    Returns a list of available videos, excluding hidden macOS '._' files and dotfiles.
    Works in both LOCAL and AWS S3 modes.
    """
    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local video repository not available on this system.", "videos": []}), 200
    if USE_LOCAL:
        # Base local path
        video_dir = os.path.join(LOCAL_REPO, "videos", "originals","VIDEOSH265")
        print(f"[LOCAL] Scanning videos in {video_dir}")

        try:
            files = [
                f for f in os.listdir(video_dir)
                if f.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".m4v"))
                and not f.startswith("._")  # 🧹 ignore Apple resource forks
                and not f.startswith(".")   # 🧹 ignore hidden dotfiles
            ]
            return jsonify({"videos": sorted(files)})
        except Exception as e:
            print(f"[LOCAL ERROR] Listing videos failed: {e}")
            return jsonify({"error": "Local video scan failed"}), 500

    # --- AWS MODE ---
    try:
        paginator = s3.get_paginator("list_objects_v2")
        page_iterator = paginator.paginate(Bucket=S3_BUCKET, Prefix="videos/originals/")
        videos = []

        for page in page_iterator:
            for obj in page.get("Contents", []):
                key = obj["Key"]
                fname = key.replace("videos/originals/", "")
                if (
                    fname.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".m4v"))
                    and not os.path.basename(fname).startswith("._")
                    and not os.path.basename(fname).startswith(".")
                ):
                    videos.append(fname)

        return jsonify({"videos": sorted(videos)})

    except Exception as e:
        print(f"[ERROR] list_videos (AWS): {e}")
        return jsonify({"error": "S3 video list failed"}), 500

import subprocess

# -------------------------------------------------------------
# Video thumbnail cache + generation
# -------------------------------------------------------------
@app.route("/cache-video/<path:filename>")
def cache_video(filename):
    """
    Serve a cached video thumbnail (JPG) if it exists.
    """
    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local video repository not available on this system.", "data": []}), 200
    cache_path = os.path.join(LOCAL_REPO, "videos", "cache-video", f"{filename}")
    if not os.path.exists(cache_path):
        print(f"[404] Thumbnail not found: {cache_path}")
        return abort(404)
    return send_file(cache_path, mimetype="image/jpeg")


@app.route("/generate-thumbnail/<path:filename>")
def generate_thumbnail(filename):
    """
    Generate a video thumbnail (JPG) from the first few seconds of the original video.
    Uses ffmpeg, stores it under /videos/cache-video/.
    """
    if filename.startswith("._") or filename.startswith("."):
        # 🧹 Skip hidden Apple files
        print(f"[SKIP] Ignoring hidden video: {filename}")
        return abort(404)

    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local video repository not available on this system.", "data": []}), 200
    # Determine paths
    original_path = os.path.join(LOCAL_REPO, "videos", "originals", "VIDEOSH265", filename)
    cache_dir = os.path.join(LOCAL_REPO, "videos", "cache-video")
    cache_path = os.path.join(cache_dir, f"{filename}.jpg")

    # Ensure cache dir exists
    os.makedirs(os.path.dirname(cache_path), exist_ok=True)

    if not os.path.exists(original_path):
        print(f"[404] Video not found: {original_path}")
        return abort(404)

    # Run ffmpeg to extract a frame (e.g., at 2 seconds)
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",                # overwrite if exists
                "-ss", "3",          # seek 2 seconds in
                "-i", original_path, # input file
                "-vframes", "1",     # capture one frame
                "-vf", "scale=480:-1",  # resize (width 480)
                cache_path           # output file
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print(f"[THUMBNAIL] Created: {cache_path}")
        return send_file(cache_path, mimetype="image/jpeg")

    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Thumbnail generation failed: {e.stderr.decode(errors='ignore')}")
        return abort(500)


@app.route("/serve-video/<path:filename>")
def serve_video(filename):
    if USE_LOCAL and not os.path.exists(LOCAL_REPO):
        return jsonify({"status": "error", "message": "Local video repository not available on this system.", "data": []}), 200
    if USE_LOCAL:
        path = os.path.join(LOCAL_REPO, "videos", "originals", "VIDEOSH265", filename)
        if not os.path.exists(path):
            return abort(404)
        return send_file(path, mimetype="video/mp4")

    try:
        key = f"videos/originals/{filename}"
        range_header = request.headers.get("Range", None)
        if not range_header:
            s3_obj = s3.get_object(Bucket=S3_BUCKET, Key=key)
            return Response(s3_obj["Body"], mimetype="video/mp4")
        match = re.search(r"bytes=(\d+)-(\d*)", range_header)
        if not match:
            return abort(416)
        byte1, byte2 = match.groups()
        byte1 = int(byte1)
        byte_range = f"bytes={byte1}-" if not byte2 else f"bytes={byte1}-{byte2}"
        s3_obj = s3.get_object(Bucket=S3_BUCKET, Key=key, Range=byte_range)
        content_length = s3_obj["ContentLength"]
        head_obj = s3.head_object(Bucket=S3_BUCKET, Key=key)
        total_length = head_obj["ContentLength"]
        resp = Response(s3_obj["Body"], 206, mimetype="video/mp4")
        resp.headers.add("Content-Range", f"bytes {byte1}-{byte1+content_length-1}/{total_length}")
        resp.headers.add("Accept-Ranges", "bytes")
        resp.headers.add("Content-Length", str(content_length))
        return resp
    except Exception as e:
        print(f"[ERROR] serve_video: {e}")
        return abort(404)

# -------------------------------------------------------------
# Ping
# -------------------------------------------------------------
@app.route("/ping")
def ping():
    start = time.perf_counter()
    time.sleep(0.01)
    end = time.perf_counter()
    return jsonify({"pong": True, "elapsed_ms": round((end - start) * 1000, 2)})


# -------------------------------------------------------------
# Uploads (Local Folder Mode)
# -------------------------------------------------------------
UPLOAD_ROOT = os.path.join(LOCAL_REPO, "photos", "originals")

@app.route("/upload/list-folders")
def list_folders():
    """
    List all subfolders for a given year inside photos/originals/<year>.
    Example: /upload/list-folders?year=2025
    """
    year = request.args.get("year")
    year_path = os.path.join(UPLOAD_ROOT, str(year))
    try:
        if not os.path.exists(year_path):
            return jsonify({"folders": []})
        folders = [
            f for f in os.listdir(year_path)
            if os.path.isdir(os.path.join(year_path, f))
            and not f.startswith(".")
            and not f.startswith("._")
        ]
        return jsonify({"folders": sorted(folders)})
    except Exception as e:
        print(f"[ERROR] list-folders failed: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/upload/create-folder", methods=["POST"])
def create_folder():
    """
    Create a new subfolder under photos/originals/<year>/<folder>.
    """
    data = request.get_json(force=True)
    year = str(data.get("year"))
    folder = data.get("folder", "").strip()

    if not year or not folder:
        return jsonify({"error": "Missing year or folder"}), 400

    folder_path = os.path.join(UPLOAD_ROOT, year, folder)
    try:
        os.makedirs(folder_path, exist_ok=True)
        print(f"[UPLOAD] Created folder: {folder_path}")
        return jsonify({"status": "created", "path": folder_path})
    except Exception as e:
        print(f"[ERROR] create-folder failed: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/upload/photos", methods=["POST"])
def upload_photos():
    """
    Upload photos via multipart/form-data.
    Saves to /mnt/localrepo/photos/originals/<year>/<folder>/
    """
    year = request.form.get("year")
    folder = request.form.get("folder")
    files = request.files.getlist("photos")

    if not year or not folder:
        return jsonify({"error": "Missing year or folder"}), 400
    if not files:
        return jsonify({"error": "No photos uploaded"}), 400

    target_dir = os.path.join(UPLOAD_ROOT, year, folder)
    os.makedirs(target_dir, exist_ok=True)

    saved_files = []
    for file in files:
        filename = secure_filename(file.filename)
        save_path = os.path.join(target_dir, filename)
        try:
            file.save(save_path)
            saved_files.append(filename)
            print(f"[UPLOAD] Saved {save_path}")
        except Exception as e:
            print(f"[ERROR] Saving {filename}: {e}")

    print("CAME TO THE END OF UPLOADING PHOTOS")

    return jsonify({"status": "ok", "saved": saved_files})


@app.route("/photo-index/add", methods=["POST"])
def add_to_photo_index():
    """
    Update cache/photo_index.json with new uploaded files.
    Adds entries like: photos/originals/<year>/<folder>/<file>
    """
    data = request.get_json(force=True)
    year = str(data.get("year"))
    folder = data.get("folder", "")
    filenames = data.get("filenames", [])

    if not year or not folder or not filenames:
        print("ERROR MISSING YEAR, FOLDER OR FILENAMES")
        return jsonify({"error": "Missing year, folder, or filenames"}), 400

    try:
        index_path = "cache/photo_index.json"
        os.makedirs(os.path.dirname(index_path), exist_ok=True)

        if os.path.exists(index_path):
            with open(index_path, "r") as f:
                index = json.load(f)
        else:
            index = []

        print("TRYING ADDING PHOTOS TO THE PHOTO INDEX")

        for fname in filenames:
            entry = {
                "filename": f"photos/originals/{year}/{folder}/{fname}",
                "date": f"{year}-01-01",
                "hasFaces": False,
                "angle": 0
            }
            index.append(entry)

        with open(index_path, "w") as f:
            json.dump(index, f, indent=2)

        print(f"[INDEX] Added {len(filenames)} photos to {year}/{folder}")
        return jsonify({"added": len(filenames)}), 200

    except Exception as e:
        print(f"[ERROR] add_to_photo_index failed: {e}")
        return jsonify({"error": str(e)}), 500

# -------------------------------------------------------------
# OLD DMP ENDPOINTS SUBSTITUTING PHP
# -------------------------------------------------------------

# -------------------------------------------------------------
# Check if user exists
# -------------------------------------------------------------
@app.route("/api/users/exists")
def user_exists():
    field = request.args.get("field")
    value = request.args.get("value")

    if field not in {"userName", "email"}:
        return jsonify({"error": "Invalid field"}), 400

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    query = f"SELECT * FROM users WHERE {field} = %s"
    cursor.execute(query, (value,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows)

# -------------------------------------------------------------
# PHP EQUIVALENT TO POST + INSERT
# -------------------------------------------------------------
@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json(force=True)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (userName, email, password) VALUES (%s, %s, %s)",
        (data["userName"], data["email"], data["password"])
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "ok"}), 201

# -------------------------------------------------------------
# PHP EQUIVALENT TO POST + UPDTADE
# -------------------------------------------------------------
@app.route("/api/users/<username>", methods=["PUT"])
def update_user(username):
    data = request.get_json(force=True)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE users
        SET userName=%s, email=%s, password=%s
        WHERE userName=%s
        """,
        (data["userName"], data["email"], data["password"], username)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "updated"})

# -------------------------------------------------------------
# PHP EQUIVALENT TO GETTING TOP SCORES
# -------------------------------------------------------------
@app.route("/api/scores")
def list_scores():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM topscores ORDER BY score DESC")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows)

# -------------------------------------------------------------
# PHP EQUIVALENT TO GET SAVING TOP SCORES
# -------------------------------------------------------------
@app.route("/api/scores", methods=["POST"])
def add_score():
    data = request.get_json(force=True)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO topscores (gameId, name, score) VALUES (%s, %s, %s)",
        (data["gameId"], data["name"], data["score"])
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "ok"}), 201

# -------------------------------------------------------------
# PHP EQUIVALENT TO GETTING TOP SCORES (BY GAME)
# -------------------------------------------------------------
@app.route("/api/topscores")
def get_topscores():
    game_id = request.args.get("gameId")

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    if game_id:
        cursor.execute(
            "SELECT * FROM topscores WHERE gameId = %s ORDER BY score DESC",
            (game_id,)
        )
    else:
        cursor.execute(
            "SELECT * FROM topscores ORDER BY score DESC"
        )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows)

# -------------------------------------------------------------
# LOGIN (Family Gallery)
# -------------------------------------------------------------
# -------------------------------------------------------------
# FAMILY GALLERY LOGIN
# -------------------------------------------------------------
@app.route("/login", methods=["POST"])
def login_fguser():
    data = request.get_json(force=True)
    username = data.get("user")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False}), 400

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT user, password, access, faces FROM fgusers WHERE user = %s",
        (username,)
    )

    user_row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user_row:
        return jsonify({"success": False}), 401

    # ⚠️ Plain text comparison (as you requested for now)
    if user_row["password"] != password:
        return jsonify({"success": False}), 401

    return jsonify({
        "success": True,
        "access": user_row["access"],
        "faces": user_row["faces"]
    })


# -------------------------------------------------------------
# Entrypoint
# -------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=True)
