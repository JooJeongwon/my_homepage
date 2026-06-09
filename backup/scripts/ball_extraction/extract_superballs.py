from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166)

def extract_and_save_ball(box, output_filename):
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
    
    path = f"/Users/joo/project/my_website/{output_filename}.png"
    cropped.save(path, "PNG")
    print(f"Saved: {path} (Size: {cropped.size})")

# 1. greatball1 (Closed: Y 21 to 32, X 50 to 61) -> Box: left=50, upper=21, right=62, lower=33
print("Processing greatball1...")
extract_and_save_ball((50, 21, 62, 33), "greatball1")

# 2. greatball2 (Semi-Open: Y 38 to 50, X 50 to 61) -> Box: left=50, upper=38, right=62, lower=51
print("\nProcessing greatball2...")
extract_and_save_ball((50, 38, 62, 51), "greatball2")

# 3. greatball3 (Fully-Open: Y 55 to 70, X 50 to 61) -> Box: left=50, upper=55, right=62, lower=71
print("\nProcessing greatball3...")
extract_and_save_ball((50, 55, 62, 71), "greatball3")
