import sys
import os

try:
    import cv2
    import numpy as np
except ImportError:
    print("CV2 NOT FOUND")
    sys.exit(0)

img_path = 'photo/bb.png'
if not os.path.exists(img_path):
    print("IMAGE NOT FOUND", img_path)
    sys.exit(0)

# Load image with alpha channel
img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
if img is None or img.shape[2] != 4:
    print("INVALID IMAGE OR NO ALPHA CHANNEL")
    sys.exit(0)

# Extract alpha channel
alpha = img[:, :, 3]

# Blur slightly to smooth edges
alpha = cv2.GaussianBlur(alpha, (5, 5), 0)

# Threshold alpha channel to get binary mask
_, thresh = cv2.threshold(alpha, 50, 255, cv2.THRESH_BINARY)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if not contours:
    print("NO CONTOURS")
    sys.exit(0)

# Get the largest contour
contour = max(contours, key=cv2.contourArea)

# Simplify contour slightly for a smoother, smaller SVG path
epsilon = 0.002 * cv2.arcLength(contour, True)
approx = cv2.approxPolyDP(contour, epsilon, True)

path_data = ""
for i, point in enumerate(approx):
    x, y = point[0]
    if i == 0:
        path_data += f"M {x},{y} "
    else:
        path_data += f"L {x},{y} "
path_data += "Z"

h, w = alpha.shape
print(f"BBOX_WIDTH={w}")
print(f"BBOX_HEIGHT={h}")
print(f"SVG_PATH={path_data}")
