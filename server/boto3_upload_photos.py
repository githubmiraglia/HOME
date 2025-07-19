import os
import boto3
from pathlib import Path
from tqdm import tqdm
from boto3.s3.transfer import TransferConfig
import tempfile

# ==== Configuration ====
LOCAL_PHOTO_ROOT = "/Volumes/PHOTOSVIDEO/PHOTOS"  # ⬅️ Adjust this to your Windows path
S3_BUCKET = "photo-video-repository"
S3_PREFIX = "photos/originals"  # This will preserve subfolders under this path

# ==== AWS S3 Setup ====
s3 = boto3.client("s3")

# ==== Progress Bar Class ====
class ProgressPercentage:
    def __init__(self, filename):
        self._filename = filename
        self._size = float(os.path.getsize(filename))
        self._seen_so_far = 0
        self._tqdm = tqdm(total=self._size, unit='B', unit_scale=True, desc=os.path.basename(filename), leave=False)

    def __call__(self, bytes_amount):
        self._seen_so_far += bytes_amount
        self._tqdm.update(bytes_amount)

# ==== Gather Files ====
def gather_files(root_dir):
    all_files = []
    for root, _, files in os.walk(root_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, root_dir)
            all_files.append((full_path, rel_path))
    return all_files

# ==== Upload Logic ====
def upload_photos():
    files_to_upload = gather_files(LOCAL_PHOTO_ROOT)
    print(f"Found {len(files_to_upload)} files to upload.\n")

    for local_path, relative_path in files_to_upload:
        s3_key = f"{S3_PREFIX}/{relative_path}".replace("\\", "/")  # Ensure S3 uses forward slashes
        try:
            s3.upload_file(
                local_path,
                S3_BUCKET,
                s3_key,
                Callback=ProgressPercentage(local_path),
                Config=TransferConfig(multipart_threshold=10 * 1024 * 1024)  # 10MB+
            )
            print(f"✅ Uploaded: {relative_path}")
        except Exception as e:
            print(f"❌ Failed to upload {relative_path}: {e}")

if __name__ == "__main__":
    upload_photos()

@app.route("/upload/photos", methods=["POST"])
@log_timing("upload/photos")
def upload_photos():
    if "photos" not in request.files:
        return jsonify({"error": "No photos in request"}), 400

    year = request.form.get("year")
    folder = request.form.get("folder")

    if not year or not folder:
        return jsonify({"error": "Missing year or folder"}), 400

    files = request.files.getlist("photos")
    uploaded_entries = []

    for file in files:
        filename = secure_filename(file.filename)
        s3_key = f"{S3_ORIGINALS_PREFIX}/{year}/{folder}/{filename}"

        try:
            with tempfile.NamedTemporaryFile(delete=True) as tmp:
                file.save(tmp.name)
                s3.upload_file(tmp.name, S3_BUCKET, s3_key)
                uploaded_entries.append({"filename": f"{year}/{folder}/{filename}"})
                print(f"[S3] Uploaded: {s3_key}")
        except Exception as e:
            print(f"[ERROR] Failed to upload {filename}:", e)

    return jsonify({"status": "uploaded", "entries": uploaded_entries})