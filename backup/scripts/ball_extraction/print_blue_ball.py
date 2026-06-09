from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166, 255)

# We analyze Y: 20 to 34 around X: 45 to 65 to locate the closed blue ball (superball2-1)
print("--- Closed Blue Ball (Y: 20 to 34) ---")
for y in range(20, 35):
    row_str = ""
    for x in range(45, 65):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 37 to 51 (semi-open superball2-2)
print("\n--- Semi-Open Blue Ball (Y: 37 to 51) ---")
for y in range(37, 52):
    row_str = ""
    for x in range(45, 65):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 54 to 71 (fully-open superball2-3)
print("\n--- Fully-Open Blue Ball (Y: 54 to 71) ---")
for y in range(54, 72):
    row_str = ""
    for x in range(45, 65):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")
