from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")
pink_color = (255, 166, 166, 255)

# Analyze Row group 2 (Y: 37 to 51) around X: 30 to 48
print("--- Row Group 2 (Y: 37 to 51) ---")
for y in range(37, 52):
    row_str = ""
    for x in range(30, 49):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

# Analyze Row group 3 (Y: 54 to 71) around X: 30 to 48
print("\n--- Row Group 3 (Y: 54 to 71) ---")
for y in range(54, 72):
    row_str = ""
    for x in range(30, 49):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += ". "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")
