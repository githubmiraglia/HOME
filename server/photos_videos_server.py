from flask import Flask, jsonify, abort, request, send_file
import os
import io
import json
import boto3
from PIL import Image
from flask_cors import CORS
from botocore.exceptions import ClientError
from datetime import datetime
from io import BytesIO

app = Flask(__name__)
CORS(app)

# S3 setup
s3 = boto3.client("s3")
S3_BUCKET = "photo-video-repository"
S3_ORIGINALS_PREFIX = "photos/originals"
S3_CACHE_PREFIX_ROTATED = "cache-image/600px/rotated"
S3_CACHE_PREFIX_UNROTATED = "cache-image/600px/unrotated"

# In-memory photo index (must be loaded on startup)
photo_index = []
deleted_photos = set()

# ========================= HELPERS =============================

def extract_year(photo):
    try:
        if photo.get("date"):
            year = int(photo["date"][:4])
            if year == 2100:
                return None
            else:
                return year
        parts = photo["filename"].split("/")
        for part in parts:
            if part.isdigit():
                y = int(part)
                if y == 2100:
                    return None
                if 1900 <= y <= 2100:
                    return y
    except:
        pass
    return None

def filter_photos_by_year_range(start_year, end_year):
    return [photo for photo in photo_index if (y := extract_year(photo)) and start_year <= y <= end_year]

# ========================= IMAGE SERVING =============================

@app.route("/serve-image/<path:filename>")
def serve_image(filename):
    image_entry = next((x for x in photo_index if x['filename'] == filename), None)
    if not image_entry:
        return abort(404)

    angle = image_entry.get("angle", 0)
    is_rotated = angle != 0

    # Define S3 paths
    original_key = f"{S3_ORIGINALS_PREFIX}/{filename}"
    cache_key = f"{S3_CACHE_PREFIX_ROTATED if is_rotated else S3_CACHE_PREFIX_UNROTATED}/{filename}.webp"

    # Try fetching cached image from S3
    try:
        cached_obj = s3.get_object(Bucket=S3_BUCKET, Key=cache_key)
        return send_file(BytesIO(cached_obj["Body"].read()), mimetype="image/webp")
    except ClientError as e:
        if e.response["Error"]["Code"] != "NoSuchKey":
            print("[ERROR] S3 cache fetch failed:", e)
            return abort(500)

    # Fetch original image from S3
    try:
        original_obj = s3.get_object(Bucket=S3_BUCKET, Key=original_key)
        img = Image.open(BytesIO(original_obj["Body"].read())).convert("RGB")
    except Exception as e:
        print("[ERROR] Failed to get original from S3:", e)
        return abort(404)

    try:
        if angle:
            img = img.rotate(-angle, expand=True)
        w_percent = 600 / float(img.size[0])
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((600, h_size), Image.LANCZOS)

        out_buffer = BytesIO()
        img.save(out_buffer, "WEBP")
        out_buffer.seek(0)

        # Upload processed image back to S3 cache
        s3.put_object(Bucket=S3_BUCKET, Key=cache_key, Body=out_buffer.getvalue(), ContentType="image/webp")
        out_buffer.seek(0)
        return send_file(out_buffer, mimetype="image/webp")
    except Exception as e:
        print("[ERROR] Image processing failed:", e)
        return abort(500)

# ========================= API ROUTES =============================

@app.route("/photo-index/full")
def get_photo_index():
    return jsonify([p for p in photo_index if p["filename"] not in deleted_photos])

@app.route("/photo-index/sample")
def sample_index():
    return jsonify(photo_index[:3])

@app.route("/photo-index/range")
def get_photos_by_year_range():
    start_year = int(request.args.get("from", 1900))
    end_year = int(request.args.get("to", 2100))
    filtered = [
        photo for photo in photo_index
        if (year := extract_year(photo)) and start_year <= year <= end_year
    ]
    return jsonify(filtered)

@app.route("/photo-index/range-of-years")
def get_photo_year_range():
    years = [extract_year(p) for p in photo_index if extract_year(p)]
    return jsonify({"min": min(years), "max": max(years)}) if years else jsonify({"min": 2003, "max": 2025})

@app.route("/photo-index/rebuild")
def rebuild():
    # Placeholder for index rebuilding
    return jsonify({"status": "rebuild not implemented"})

@app.route("/photo-index/random-chunk")
def get_random_photo_chunk():
    from collections import defaultdict
    used_indices_by_range = defaultdict(set)

    start_year = int(request.args.get("from", 1900))
    end_year = int(request.args.get("to", 2100))
    chunk_size = int(request.args.get("size", 15))
    require_faces = request.args.get("hasFaces", "false").lower() == "true"

    filtered_photos = [
        p for p in filter_photos_by_year_range(start_year, end_year)
        if p["filename"] not in deleted_photos and (not require_faces or p.get("hasFaces", False))
    ]

    selected = filtered_photos[:chunk_size]  # basic fallback
    return jsonify(selected)

@app.route("/cache/<path:filename>")
def serve_cache_file(filename):
    # Not needed with S3-based cache
    return abort(404)

if __name__ == "__main__":
    # Placeholder loading for local testing
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

    app.run(host="0.0.0.0", port=8001, debug=True, use_reloader=False)