import os
import boto3
import json
from pathlib import Path
from tqdm import tqdm
from PIL import Image
from PIL.ExifTags import TAGS
from boto3.s3.transfer import TransferConfig

# ========== Configuration ==========
LOCAL_PHOTO_ROOT = "/Volumes/PHOTOSVIDEO/PHOTOS/2025"
S3_BUCKET = "photo-video-repository"
S3_PREFIX = "photos/originals"
DEFAULT_YEAR = "2025"
PHOTO_INDEX_JSON = "./cache/photo_index.json"

# ========== AWS S3 Setup ==========
s3 = boto3.client("s3")

# ========== Progress Callback ==========
class ProgressPercentage:
    def __init__(self, filename):
        self._filename = filename
        self._size = float(os.path.getsize(filename))
        self._seen_so_far = 0
        self._tqdm = tqdm(total=self._size, unit='B', unit_scale=True, desc=os.path.basename(filename), leave=False)

    def __call__(self, bytes_amount):
        self._seen_so_far += bytes_amount
        self._tqdm.update(bytes_amount)

# ========== EXIF Date Extraction ==========
def extract_year_from_exif(filepath):
    try:
        img = Image.open(filepath)
        exif_data = img._getexif()
        if not exif_data:
            return None

        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "DateTimeOriginal":
                year = value.split(":")[0]
                if len(year) == 4:
                    return year
        return None
    except Exception:
        return None

def extract_full_date_from_exif(filepath):
    try:
        img = Image.open(filepath)
        exif_data = img._getexif()
        if not exif_data:
            return None

        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "DateTimeOriginal":
                return value.replace(":", "-", 2).split(" ")[0]
        return None
    except Exception:
        return None

# ========== Gather Files ==========
def gather_files(root_dir):
    all_files = []
    for root, _, files in os.walk(root_dir):
        for file in files:
            if not file.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic")):
                continue
            full_path = os.path.join(root, file)
            all_files.append(full_path)
    return all_files

# ========== Upload Logic ==========
def upload_all_photos():
    all_files = gather_files(LOCAL_PHOTO_ROOT)
    print(f"📸 Found {len(all_files)} photos to upload.\n")

    # Load existing index
    existing_index = []
    if os.path.exists(PHOTO_INDEX_JSON):
        with open(PHOTO_INDEX_JSON, "r") as f:
            try:
                existing_index = json.load(f)
                print(f"📂 Loaded existing index with {len(existing_index)} entries."   )
            except Exception as e:
                print(f"⚠️ Warning: Failed to parse existing index. Starting fresh. ({e})")
                existing_index = []

    existing_filenames = {entry["filename"] for entry in existing_index}
    new_entries = []

    for local_path in all_files:
        relative_path = os.path.relpath(local_path, LOCAL_PHOTO_ROOT)
        year = extract_year_from_exif(local_path) or DEFAULT_YEAR
        s3_key = f"{S3_PREFIX}/{year}/{relative_path}".replace("\\", "/")
        short_key = s3_key.replace(f"{S3_PREFIX}/", "")

        if short_key in existing_filenames:
            print(f"⏩ Skipped (already in index): {short_key}")
            continue

        try:
            s3.upload_file(
                local_path,
                S3_BUCKET,
                s3_key,
                Callback=ProgressPercentage(local_path),
                Config=TransferConfig(multipart_threshold=10 * 1024 * 1024)
            )
            print(f"✅ Uploaded: {s3_key}")

            entry = {
                "filename": short_key,
                "date": extract_full_date_from_exif(local_path) or f"{year}-01-01",
                "camera": None,
                "angle": 0,
                "hasFaces": True,
                "gps": None,
                "location": None
            }
            new_entries.append(entry)

        except Exception as e:
            print(f"❌ Failed to upload {relative_path}: {e}")

    # Combine and save updated index
    try:
        os.makedirs(os.path.dirname(PHOTO_INDEX_JSON), exist_ok=True)
        full_index = existing_index + new_entries
        with open(PHOTO_INDEX_JSON, "w") as f:
            json.dump(full_index, f, indent=2)
        print(f"\n📝 Updated photo index saved to {PHOTO_INDEX_JSON}")
    except Exception as e:
        print(f"❌ Failed to write photo index: {e}")

# ========== Run ==========
if __name__ == "__main__":
    upload_all_photos()