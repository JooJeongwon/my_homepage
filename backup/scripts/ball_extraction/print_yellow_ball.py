from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166, 255)

# Analyze Y: 20 to 34 around X: 60 to 80 to locate the closed Ultra Ball
print("--- Closed Ultra Ball (Y: 20 to 34) ---")
for y in range(20, 35):
    row_str = ""
    for x in range(60, 81):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 37 to 51 (semi-open)
print("\n--- Semi-Open Ultra Ball (Y: 37 to 51) ---")
for y in range(37, 52):
    row_str = ""
    for x in range(60, 81):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 54 to 71 (fully-open)
print("\n--- Fully-Open Ultra Ball (Y: 54 to 71) ---")
for y in range(54, 72):
    row_str = ""
    for x in range(60, 81):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")
