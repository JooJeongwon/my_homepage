from PIL import Image

# Open original image
img = Image.open("/Users/joo/project/my_website/Poke Balls.png")

# Target region for the red ball (x34y21 to x45y32)
# In Pillow crop(), the box is a 4-tuple: (left, upper, right, lower)
# Note that right and lower coordinates are exclusive.
# So left=34, upper=21, right=46, lower=33.
box = (34, 21, 46, 33)
ball_img = img.crop(box)

# Convert to RGBA
ball_img = ball_img.convert("RGBA")

# Pink color to remove: (255, 166, 166)
pink_color = (255, 166, 166)

# Process pixels: make pink pixels transparent
datas = ball_img.getdata()
new_data = []
for item in datas:
    # item is (r, g, b, a)
    # Check if the RGB part matches the pink color
    if item[0] == pink_color[0] and item[1] == pink_color[1] and item[2] == pink_color[2]:
        # Make it transparent
        new_data.append((255, 166, 166, 0))
    else:
        new_data.append(item)

ball_img.putdata(new_data)

# Save the resulting image
output_path = "/Users/joo/project/my_website/pokeball1.png"
ball_img.save(output_path, "PNG")

print(f"Successfully saved transparent red ball to {output_path}")

# Double check the size of saved image
saved_img = Image.open(output_path)
print(f"Saved image size: {saved_img.size}")
print(f"Saved image mode: {saved_img.mode}")
