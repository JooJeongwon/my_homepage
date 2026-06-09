from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")

# Let's inspect the area around X: 33 to 46, Y: 20 to 34
x_start, x_end = 33, 46
y_start, y_end = 20, 34

pink_color = (255, 166, 166, 255)

print("Pixel mapping (P for pink, X for others):")
for y in range(y_start, y_end + 1):
    row_str = ""
    for x in range(x_start, x_end + 1):
        color = img.getpixel((x, y))
        if color == pink_color:
            row_str += "P "
        else:
            row_str += "X "
    print(f"Row {y:02d}: {row_str}")

print("\nExact RGBA values:")
for y in range(y_start, y_end + 1):
    row_colors = []
    for x in range(x_start, x_end + 1):
        r, g, b, a = img.getpixel((x, y))
        row_colors.append(f"({r},{g},{b})")
    print(f"Row {y:02d}: " + " ".join(row_colors))
