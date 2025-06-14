import face_recognition
import numpy as np
import sys
import base64
import json
from io import BytesIO
from PIL import Image

# Ensure stdout prints correctly on Windows
sys.stdout.reconfigure(encoding='utf-8')

# Read input from Node.js
data = sys.stdin.read()
try:
    payload = json.loads(data)
    known_img_b64 = payload['knownImage']
    test_img_b64 = payload['testImage']
except Exception as e:
    print("Failed to parse input:", e, flush=True)
    sys.exit(1)

def b64_to_rgb_array(b64_data):
    try:
        img_data = base64.b64decode(b64_data)
        img = Image.open(BytesIO(img_data)).convert('RGB')
        return np.array(img)
    except Exception as e:
        print("Failed to decode base64 image:", e, flush=True)
        sys.exit(1)

# Convert base64 to images
known_img = b64_to_rgb_array(known_img_b64)
test_img = b64_to_rgb_array(test_img_b64)

# Encode faces
# print("Starting face encoding...", flush=True)

known_encs = face_recognition.face_encodings(known_img)
# print(f"Known faces found: {len(known_encs)}", flush=True)

test_encs = face_recognition.face_encodings(test_img)
# print(f"Test faces found: {len(test_encs)}", flush=True)

if not known_encs:
    print("No face in known image", flush=True)
    sys.exit(1)
if not test_encs:
    print("No face in test image", flush=True)
    sys.exit(1)

# Compare
distance = face_recognition.face_distance([known_encs[0]], test_encs[0])[0]
# print(f"Face distance: {distance:.4f}", flush=True)

# Threshold matching
threshold = 0.55
# print(f"Threshold: {threshold}", flush=True)

if distance <= threshold:
    print("Matched", flush=True)
    sys.exit(0)
else:
    print("Unknown", flush=True)
    sys.exit(0)
