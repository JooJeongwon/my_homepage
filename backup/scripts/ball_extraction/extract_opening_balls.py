from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")

# Pink color to remove
pink_color = (255, 166, 166)

def extract_and_save_ball(box, output_filename_base):
    # crop box: (left, upper, right, lower)
    # right and lower are exclusive
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
    
    # Save as "pokeball..."
    paths = [
        f"/Users/joo/project/my_website/{output_filename_base}.png"
    ]
    for p in paths:
        cropped.save(p, "PNG")
        print(f"Saved: {p} (Size: {cropped.size})")

# 1. pokeball2 (Row group 2: Y 38 to 50, X 34 to 45) -> Box: left=34, upper=38, right=46, lower=51
print("Processing pokeball2...")
extract_and_save_ball((34, 38, 46, 51), "pokeball2")

# 2. pokeball3 (Row group 3: Y 55 to 70, X 34 to 45) -> Box: left=34, upper=55, right=46, lower=71
print("\nProcessing pokeball3...")
extract_and_save_ball((34, 55, 46, 71), "pokeball3")
