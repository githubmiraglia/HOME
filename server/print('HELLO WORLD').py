from flask import Flask, jsonify, abort, request, send_file
import os
import cv2
import numpy as np
import time
import json
import io
from PIL import Image
from PIL.ExifTags import TAGS
import pyheif
from geopy.geocoders import Nominatim
from geopy.distance import geodesic


# === Configuration ===
PHOTO_BASE_DIR = "/Volumes/Samsung_T5/Viagem Boston NY"
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
CACHE_PATH = os.path.join(CACHE_DIR, "photo_index.json")
photo_index = []

print("CROSSED HERE")

# === Location Cache ===
location_cache = []
DISTANCE_THRESHOLD_KM = 5.0
#geolocator = Nominatim(user_agent="photo_server")

