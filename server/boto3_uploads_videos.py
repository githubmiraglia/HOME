import os
import re
import boto3
from pathlib import Path
from tqdm import tqdm

# CONFIGURATION
FOLDER_PATH = "/Volumes/PHOTOSVIDEO/VIDEOS"
BUCKET_NAME = "photo-video-repository"
S3_PREFIX = "videos/originals/"

# Match files like 2002_, 2010_, etc.
YEAR_PREFIX_PATTERN = re.compile(r"^\d{4}_.*\.(mp4|m4v|mov|avi)$", re.IGNORECASE)

# S3 client
s3 = boto3.client("s3")

class ProgressBar:
    def __init__(self, filename, filesize):
        self.filesize = filesize
        self.progress_bar = tqdm(
            total=filesize,
            unit="B",
            unit_scale=True,
            desc=filename,
            ascii=True,
            dynamic_ncols=True,
        )

    def __call__(self, bytes_amount):
        self.progress_bar.update(bytes_amount)

    def close(self):
        self.progress_bar.close()

def should_upload(filename):
    return YEAR_PREFIX_PATTERN.match(filename)

def upload_file(file_path: Path):
    s3_key = f"{S3_PREFIX}{file_path.name}"
    file_size = os.path.getsize(file_path)
    progress = ProgressBar(file_path.name, file_size)

    try:
        s3.upload_file(
            str(file_path),
            BUCKET_NAME,
            s3_key,
            Callback=progress
        )
        progress.close()
        print(f"✅ Uploaded: {file_path.name}\n")
    except Exception as e:
        progress.close()
        print(f"❌ Failed to upload {file_path.name}: {e}")

def main():
    folder = Path(FOLDER_PATH)
    if not folder.exists():
        print(f"❌ Folder does not exist: {FOLDER_PATH}")
        return

    for file in folder.iterdir():
        if file.is_file() and should_upload(file.name):
            upload_file(file)

if __name__ == "__main__":
    main()