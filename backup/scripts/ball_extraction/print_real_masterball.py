from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166, 255)

# Check Y: 20 to 34 around X: 95 to 115
print("--- Closed Real Masterball (Y: 20 to 34) ---")
for y in range(20, 35):
    row_str = ""
    for x in range(95, 116):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 37 to 51
print("\n--- Semi-Open Real Masterball (Y: 37 to 51) ---")
for y in range(37, 52):
    row_str = ""
    for x in range(95, 116):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Check Y: 54 to 71
print("\n--- Fully-Open Real Masterball (Y: 54 to 71) ---")
for y in range(54, 72):
    row_str = ""
    for x in range(95, 116):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")
