from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166, 255)

# Analyze Y: 20 to 34 around X: 78 to 98 to locate the closed masterball
print("--- Closed Masterball (Y: 20 to 34) ---")
for y in range(20, 35):
    row_str = ""
    for x in range(78, 99):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 37 to 51 (semi-open)
print("\n--- Semi-Open Masterball (Y: 37 to 51) ---")
for y in range(37, 52):
    row_str = ""
    for x in range(78, 99):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 54 to 71 (fully-open)
print("\n--- Fully-Open Masterball (Y: 54 to 71) ---")
for y in range(54, 72):
    row_str = ""
    for x in range(78, 99):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")
