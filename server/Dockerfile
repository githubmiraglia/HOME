FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install OpenCV dependencies (for libGL.so.1)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Copy only necessary files (respecting .dockerignore)
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Expose Flask port
EXPOSE 8001

# Run with Gunicorn
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8001", "photos_videos_server:app"]