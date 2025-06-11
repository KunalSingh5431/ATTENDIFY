import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime
import sys

# Check if image path argument is provided
if len(sys.argv) < 2:
    print("Image path not provided")
    sys.exit(1)

image_path = sys.argv[1]
base_dir = os.path.dirname(os.path.abspath(__file__))

uploads_path = os.path.join(base_dir, 'uploads')
attendance_path = os.path.join(base_dir, 'Attendance')

# Load known images and their names
images = []
classNames = []
myList = os.listdir(uploads_path)

for cl in myList:
    img_path = os.path.join(uploads_path, cl)
    curImg = cv2.imread(img_path)
    if curImg is None:
        print(f"Warning: Could not read image {img_path}")
        continue
    curImg = cv2.cvtColor(curImg, cv2.COLOR_BGR2RGB)
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])  # filename without extension

def findEncodings(images):
    encodeList = []
    for img in images:
        encodings = face_recognition.face_encodings(img)
        if encodings:
            encodeList.append(encodings[0])
        else:
            encodeList.append(None)
    # Filter out None encodings (images with no detectable face)
    encodeList = [enc for enc in encodeList if enc is not None]
    return encodeList

def markAttendance(name):
    now = datetime.now()
    date_str = now.strftime('%d-%m-%Y')
    time_str = now.strftime('%H:%M:%S')
    filename = os.path.join(attendance_path, f"{date_str}.csv")

    if not os.path.exists(attendance_path):
        os.makedirs(attendance_path)

    # If file does not exist, create with headers
    if not os.path.exists(filename):
        with open(filename, 'w') as f:
            f.write("Name,Time,Date\n")

    # Read existing names to avoid duplicates
    with open(filename, 'r+') as f:
        lines = f.readlines()
        names_logged = [line.split(',')[0] for line in lines[1:]]  # skip header line
        if name not in names_logged:
            f.write(f"{name},{time_str},{date_str}\n")

# Find encodings for known images
encodeListKnown = findEncodings(images)

if not encodeListKnown:
    print("No valid face encodings found in uploads folder.")
    sys.exit(1)

# Load the input image to test
testImg = cv2.imread(image_path)
if testImg is None:
    print("Image not found or invalid format")
    sys.exit(1)

testImg = cv2.cvtColor(testImg, cv2.COLOR_BGR2RGB)

# Find faces and encodings in the test image
facesCurFrame = face_recognition.face_locations(testImg)
encodesCurFrame = face_recognition.face_encodings(testImg, facesCurFrame)

if len(encodesCurFrame) == 0:
    print("No face detected in the input image.")
    sys.exit(0)

for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
    matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
    faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
    
    if len(faceDis) == 0:
        print("No known faces to compare.")
        sys.exit(0)

    matchIndex = np.argmin(faceDis)

    if matches[matchIndex]:
        name = classNames[matchIndex].upper()
        markAttendance(name)
        print(name)
        sys.exit(0)

print("Unknown")
sys.exit(0)
