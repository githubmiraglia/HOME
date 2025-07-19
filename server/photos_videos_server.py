from flask import Flask, jsonify, abort, request, send_file, send_from_directory
import os, io, json, random, time
from collections import defaultdict
from werkzeug.utils import secure_filename
from PIL import Image, ExifTags
import boto3
from botocore.exceptions import ClientError
from flask_cors import CORS
from dotenv import load_dotenv
from io import BytesIO
from datetime import datetime
from functools import wraps

load_dotenv()
app = Flask(__name__)
CORS(app)

# --- S3 CONFIGURATION ---
s3 = boto3.client("s3")
S3_BUCKET = "photo-video-repository"
S3_ORIGINALS_PREFIX = "photos/originals"
S3_CACHE_PREFIX_ROTATED = "cache-image/600px/rotated"
S3_CACHE_PREFIX_UNROTATED = "cache-image/600px/unrotated"

# --- IN-MEMORY INDEX ---
photo_index = []
deleted_photos = set()
used_indices_by_range = defaultdict(set)

# --- LOAD INDEX + DELETED PHOTOS ---
try:
    with open("cache/photo_index.json", "r") as f:
        photo_index = json.load(f)
except:
    photo_index = []

try:
    with open("cache/deleted_photos.json", "r") as f:
        deleted_photos = set(json.load(f))
except:
    deleted_photos = set()

# --- TIMING DECORATOR ---
def log_timing(route_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = func(*args, **kwargs)
            duration = round((time.perf_counter() - start) * 1000, 2)
            #print(f"[PERF] {route_name} took {duration} ms")
            return result
        return wrapper
    return decorator

# --- HELPERS ---
def extract_year(photo):
    try:
        if photo.get("date"):
            y = int(photo["date"][:4])
            return None if y == 2100 else y
        parts = photo["filename"].split("/")
        for part in parts:
            if part.isdigit():
                y = int(part)
                return y if 1900 <= y <= 2100 and y != 2100 else None
    except:
        return None

def filter_photos_by_year_range(start_year, end_year):
    return [p for p in photo_index if (y := extract_year(p)) and start_year <= y <= end_year]

# --- ROUTES ---

@app.route("/serve-image/<path:filename>")
@log_timing("serve-image")
def serve_image(filename):
    #print(f"[ENTRY] /serve-image/filenam {time.strftime('%Y-%m-%d %H:%M:%S')}", flush=True)
    image_entry = next((x for x in photo_index if x['filename'] == filename), None)
    if not image_entry:
        return abort(404)

    angle = image_entry.get("angle", 0)
    is_rotated = angle != 0
    original_key = f"{S3_ORIGINALS_PREFIX}/{filename}"
    cache_key = f"{S3_CACHE_PREFIX_ROTATED if is_rotated else S3_CACHE_PREFIX_UNROTATED}/{filename}.webp"

    try:
        #print(f"[CACHE] Checking cache for {cache_key}")
        cached = s3.get_object(Bucket=S3_BUCKET, Key=cache_key)
        return send_file(BytesIO(cached["Body"].read()), mimetype="image/webp")
        #print(f"[CACHE] Cache hit for {cache_key}")
    except ClientError as e:
        if e.response["Error"]["Code"] != "NoSuchKey":
            #print("[ERROR] S3 cache fetch failed:", e)
            return abort(500)

    try:
        #print(f"[S3] Fetching original image from {original_key}")
        original = s3.get_object(Bucket=S3_BUCKET, Key=original_key)
        img = Image.open(BytesIO(original["Body"].read())).convert("RGB")
        #print(f"[S3] Original image fetched successfully")
    except Exception as e:
        #print("[ERROR] Original fetch failed:", e)
        return abort(404)

    try:
        if angle:
            #print(f"[IMAGE] Rotating image by {angle} degrees")
            img = img.rotate(-angle, expand=True)
        w_percent = 600 / float(img.size[0])
        h_size = int(float(img.size[1]) * w_percent)
        img = img.resize((600, h_size), Image.LANCZOS)

        out_buffer = BytesIO()
        #print(f"[IMAGE] Saving image to buffer as WEBP")
        img.save(out_buffer, "WEBP")
        out_buffer.seek(0)
        s3.put_object(Bucket=S3_BUCKET, Key=cache_key, Body=out_buffer.getvalue(), ContentType="image/webp")
        out_buffer.seek(0)
        #print(f"[CACHE] Image saved to cache {cache_key}")
        return send_file(out_buffer, mimetype="image/webp")
    except Exception as e:
        #print("[ERROR] Image processing failed:", e)
        return abort(500)

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
@log_timing("photo-index/range-of-years")
def get_photo_year_range():
    years = [extract_year(p) for p in photo_index if extract_year(p)]
    return jsonify({"min": min(years), "max": max(years)}) if years else jsonify({"min": 2003, "max": 2025})

@app.route("/photo-index/rebuild")
def rebuild():
    return jsonify({"status": "rebuild not implemented"})

@app.route("/photo-index/random-chunk")
@log_timing("photo-index/random-chunk")
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

@app.route("/photo-index/clear-buffer")
@log_timing("photo-index/clear-buffer")
def clear_buffer():
    used_indices_by_range.clear()
    return jsonify({"status": "buffer cleared"})

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

@app.route("/deleted-photos")
def get_deleted_photos():
    return jsonify(sorted(list(deleted_photos)))

@app.route("/photo-index/rotate", methods=["POST", "OPTIONS"])
@log_timing("photo-index/rotate")
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

    original_key = f"{S3_ORIGINALS_PREFIX}/{filename}"
    rotated_cache_key = f"{S3_CACHE_PREFIX_ROTATED}/{filename}.webp"

    try:
        original_obj = s3.get_object(Bucket=S3_BUCKET, Key=original_key)
        img = Image.open(BytesIO(original_obj["Body"].read())).convert("RGB")
    except Exception as e:
        print("[ERROR] Failed to fetch original image:", e)
        return jsonify({"error": "Could not load original image"}), 500

    new_angle = (image_entry.get("angle", 0) + 90) % 360
    image_entry["angle"] = new_angle

    rotated_img = img.rotate(-new_angle, expand=True)
    w_percent = 600 / float(rotated_img.size[0])
    h_size = int(float(rotated_img.size[1]) * w_percent)
    resized_img = rotated_img.resize((600, h_size), Image.LANCZOS)

    out_buffer = BytesIO()
    resized_img.save(out_buffer, "WEBP")
    out_buffer.seek(0)

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=rotated_cache_key,
        Body=out_buffer.getvalue(),
        ContentType="image/webp"
    )

    with open("cache/photo_index.json", "w", encoding="utf-8") as f:
        json.dump(photo_index, f, indent=2)

    return jsonify({"status": "rotated", "angle": new_angle, "filename": filename})

@app.route("/cache/<path:filename>")
@log_timing("cache")
def serve_cache_file(filename):
    #print(f"[ENTRY] /cache/{filename} {time.strftime('%Y-%m-%d %H:%M:%S')}", flush=True)
    return send_from_directory("cache", filename)

@app.route("/upload/list-folders", methods=["GET"])
@log_timing("upload/list-folders")
def list_upload_folders():
    year = request.args.get("year")
    if not year or not year.isdigit():
        return jsonify({"error": "Missing or invalid 'year' parameter"}), 400

    year_prefix = f"{S3_ORIGINALS_PREFIX}/{year}/"

    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=year_prefix, MaxKeys=1)
        if "Contents" not in response:
            placeholder_key = f"{year_prefix}.keep"
            s3.put_object(Bucket=S3_BUCKET, Key=placeholder_key, Body=b"")
            print(f"[S3] Created placeholder folder {placeholder_key}")
    except ClientError as e:
        print("[ERROR] S3 folder check failed:", e)
        return jsonify({"error": "Failed to access S3"}), 500

    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix=year_prefix, Delimiter="/")
        subfolders = [
            prefix["Prefix"].replace(year_prefix, "").strip("/")
            for prefix in response.get("CommonPrefixes", [])
            if prefix["Prefix"].replace(year_prefix, "").strip("/") != ".keep"
        ]
        return jsonify({"folders": sorted(subfolders)})
    except ClientError as e:
        print("[ERROR] S3 list subfolders failed:", e)
        return jsonify({"error": "Failed to list folders"}), 500

@app.route("/upload/create-folder", methods=["POST"])
@log_timing("upload/create-folder")
def create_s3_folder():
    data = request.get_json()
    year = data.get("year")
    folder = data.get("folder")

    if not year or not folder:
        return jsonify({"error": "Missing 'year' or 'folder'"}), 400

    folder_key = f"{S3_ORIGINALS_PREFIX}/{year}/{folder}/.keep"
    print(f"[S3] Creating folder {folder_key}")
    try:
        s3.put_object(Bucket=S3_BUCKET, Key=folder_key, Body=b"")
        return jsonify({"status": "folder created", "key": folder_key})
    except Exception as e:
        print("[ERROR] Failed to create folder:", e)
        return jsonify({"error": "Failed to create folder"}), 500

@app.route("/upload/photos", methods=["POST"])
@log_timing("upload/photos")
def upload_photos():
    year = request.form.get("year")
    folder = request.form.get("folder")

    if not year or not folder:
        return jsonify({"error": "Missing year or folder"}), 400

    files = request.files.getlist("photos")
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded_entries = []
    for file in files:
        filename = secure_filename(file.filename)
        key = f"{S3_ORIGINALS_PREFIX}/{year}/{folder}/{filename}"

        try:
            s3.upload_fileobj(file, S3_BUCKET, key)
            uploaded_entries.append({"filename": f"{year}/{folder}/{filename}"})
        except Exception as e:
            print("[ERROR] Upload failed:", e)
            return jsonify({"error": f"Failed to upload {filename}"}), 500

    return jsonify({"status": "success", "entries": uploaded_entries})

@app.route("/photo-index/add", methods=["POST"])
@log_timing("photo-index/add")
def add_to_photo_index():
    data = request.get_json()
    year = data.get("year")
    folder = data.get("folder")
    filenames = data.get("filenames")

    if not year or not folder or not filenames:
        return jsonify({"error": "Missing required fields"}), 400

    new_entries = []
    for fname in filenames:
        entry = {
            "filename": f"{year}/{folder}/{fname}",
            "date": f"{year}-01-01",
            "angle": 0,
            "hasFaces": False  # Update later with face detection
        }
        photo_index.append(entry)
        new_entries.append(entry)

    with open("cache/photo_index.json", "w") as f:
        json.dump(photo_index, f, indent=2)

    return jsonify({"status": "added", "count": len(new_entries)})


@app.route("/ping")
def ping():
    start = time.perf_counter()
    time.sleep(0.01)
    end = time.perf_counter()
    return jsonify({"pong": True, "elapsed_ms": round((end - start) * 1000, 2)})

