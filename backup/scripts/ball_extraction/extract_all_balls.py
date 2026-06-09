import os
from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166)

# Configuration for all 4 types of balls and their 3 opening states
ball_configs = {
    # format: "prefix": (left, right)
    "pokeball": (34, 46),      # 1st ball
    "greatball": (50, 62),     # 2nd ball
    "ultraball": (82, 94),     # 4th ball (around X 94,33)
    "masterball": (98, 110),   # 5th ball (around X 98~111)
}

# The Y coordinates for the three states (Closed, Semi-Open, Fully-Open)
y_ranges = [
    # (idx, upper, lower)
    (1, 21, 33),  # Closed (Size: 12x12)
    (2, 38, 51),  # Semi-Open (Size: 12x13)
    (3, 55, 71),  # Fully-Open (Size: 12x16)
]

def extract_and_save(prefix, x_left, x_right, state_idx, y_upper, y_lower):
    # crop box: (left, upper, right, lower)
    box = (x_left, y_upper, x_right, y_lower)
    cropped = img.crop(box)
    cropped = cropped.convert("RGBA")
    
    datas = cropped.getdata()
    new_data = []
    for item in datas:
        if item[0] == pink_color[0] and item[1] == pink_color[1] and item[2] == pink_color[2]:
            new_data.append((255, 166, 166, 0)) # transparent
        else:
            new_data.append(item)
            
    cropped.putdata(new_data)
    
    filename = f"{prefix}{state_idx}.png"
    
    # Save destinations: Both ROOT and PUBLIC/ directories
    dest_paths = [
        f"/Users/joo/project/my_website/{filename}",
        f"/Users/joo/project/my_website/public/{filename}"
    ]
    
    for path in dest_paths:
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)
        cropped.save(path, "PNG")
        
    print(f"[SUCCESS] Extracted {filename} (Size: {cropped.size}) to both root and public/ directories.")

# Run the batch extraction
print("=== Starting Batch Poke Ball Extraction ===")
for prefix, (x_left, x_right) in ball_configs.items():
    print(f"\nProcessing {prefix}s...")
    for state_idx, y_upper, y_lower in y_ranges:
        extract_and_save(prefix, x_left, x_right, state_idx, y_upper, y_lower)
        
print("\n=== Batch Extraction Finished Successfully! ===")
