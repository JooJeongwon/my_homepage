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
    
    # We will save the image with three filename patterns to be extremely safe and flexible:
    # 1. User specified: "Ultra BallX.png"
    # 2. Consistent numbering: "ultraball3-X.png"
    # 3. Kebab-case standard: "ultra-ballX.png"
    filenames = [
        f"Ultra Ball{idx}.png",
        f"ultraball3-{idx}.png",
        f"ultra-ball{idx}.png"
    ]
    
    for filename in filenames:
        path = f"/Users/joo/project/my_website/{filename}"
        cropped.save(path, "PNG")
        print(f"Saved: {path} (Size: {cropped.size})")

# 1. Ultra Ball 1 (Closed: Y 21 to 32, X 66 to 77) -> Box: left=66, upper=21, right=78, lower=33
print("Processing Ultra Ball 1...")
extract_and_save_ball((66, 21, 78, 33), 1)

# 2. Ultra Ball 2 (Semi-Open: Y 38 to 50, X 66 to 77) -> Box: left=66, upper=38, right=78, lower=51
print("\nProcessing Ultra Ball 2...")
extract_and_save_ball((66, 38, 78, 51), 2)

# 3. Ultra Ball 3 (Fully-Open: Y 55 to 70, X 66 to 77) -> Box: left=66, upper=55, right=78, lower=71
print("\nProcessing Ultra Ball 3...")
extract_and_save_ball((66, 55, 78, 71), 3)
