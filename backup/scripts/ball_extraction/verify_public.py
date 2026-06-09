import os
from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166)

verifications = {
    # 1. Red Monsterballs
    "pokeball1.png": (34, 21, 46, 33),
    "pokeball2.png": (34, 38, 46, 51),
    "pokeball3.png": (34, 55, 46, 71),
    
    # 2. Blue Superballs
    "greatball1.png": (50, 21, 62, 33),
    "greatball2.png": (50, 38, 62, 51),
    "greatball3.png": (50, 55, 62, 71),
    
    # 3. Yellow/Black Ultra Balls
    "ultraball1.png": (82, 21, 94, 33),
    "ultraball2.png": (82, 38, 94, 51),
    "ultraball3.png": (82, 55, 94, 71),
    
    # 4. Purple Masterballs
    "masterball1.png": (98, 21, 110, 33),
    "masterball2.png": (98, 38, 110, 51),
    "masterball3.png": (98, 55, 110, 71),
}

all_success = True

print("=== Public Folder Pixel Verification ===")
for filename, box in verifications.items():
    path = f"/Users/joo/project/my_website/public/{filename}"
    if not os.path.exists(path):
        print(f"[ERROR] File not found in public/: {filename}")
        all_success = False
        continue
        
    extracted_img = Image.open(path).convert("RGBA")
    
    width = box[2] - box[0]
    height = box[3] - box[1]
    
    if extracted_img.size != (width, height):
        print(f"[FAIL] {filename} dimensions differ: Extracted {extracted_img.size} vs Expected {(width, height)}")
        all_success = False
        continue
        
    total_errors = 0
    for dy in range(height):
        for dx in range(width):
            orig_x = box[0] + dx
            orig_y = box[1] + dy
            
            orig_pixel = img.getpixel((orig_x, orig_y))
            extracted_pixel = extracted_img.getpixel((dx, dy))
            
            orig_r, orig_g, orig_b = orig_pixel[:3]
            ext_r, ext_g, ext_b, ext_a = extracted_pixel
            
            if orig_r == pink_color[0] and orig_g == pink_color[1] and orig_b == pink_color[2]:
                if ext_a != 0:
                    total_errors += 1
            else:
                if ext_a != 255 or ext_r != orig_r or ext_g != orig_g or ext_b != orig_b:
                    total_errors += 1
                    
    if total_errors == 0:
        print(f"[SUCCESS] public/{filename} is perfectly verified!")
    else:
        print(f"[FAIL] public/{filename} has {total_errors} mismatches!")
        all_success = False

print("\n==============================")
if all_success:
    print("ALL PUBLIC FILES VERIFIED SUCCESSFULLY!")
else:
    print("SOME PUBLIC FILES FAILED VERIFICATION.")
