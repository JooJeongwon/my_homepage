from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166)

def extract_and_save_ball(box, idx):
    # crop box: (left, upper, right, lower)
    # right and lower are exclusive in Pillow
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
    
    # Save the image as "masterballX.png":
    filenames = [
        f"masterball{idx}.png"
    ]
    
    for filename in filenames:
        path = f"/Users/joo/project/my_website/{filename}"
        cropped.save(path, "PNG")
        print(f"Saved: {path} (Size: {cropped.size})")

# 1. masterball1 (Closed: Y 21 to 32, X 98 to 109) -> Box: left=98, upper=21, right=110, lower=33
print("Processing masterball1...")
extract_and_save_ball((98, 21, 110, 33), 1)

# 2. masterball2 (Semi-Open: Y 38 to 50, X 98 to 109) -> Box: left=98, upper=38, right=110, lower=51
print("\nProcessing masterball2...")
extract_and_save_ball((98, 38, 110, 51), 2)

# 3. masterball3 (Fully-Open: Y 55 to 70, X 98 to 109) -> Box: left=98, upper=55, right=110, lower=71
print("\nProcessing masterball3...")
extract_and_save_ball((98, 55, 110, 71), 3)
