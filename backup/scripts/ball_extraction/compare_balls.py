from PIL import Image

img = Image.open("/Users/joo/project/my_website/Poke Balls.png")

# Ball 1 (Red Ball): X 34 to 45, Y 21 to 32
# Ball 3: X 162 to 173, Y 21 to 32

ball1_pixels = []
for y in range(21, 33):
    row = []
    for x in range(34, 46):
        row.append(img.getpixel((x, y)))
    ball1_pixels.append(row)

ball3_pixels = []
for y in range(21, 33):
    row = []
    for x in range(162, 174):
        row.append(img.getpixel((x, y)))
    ball3_pixels.append(row)

# Let's compare their structures.
# We will print out side-by-side or highlight differences.
print("Comparing Ball 1 (Red) and Ball 3 (Grey/Yellow?):")
print("Format: (Ball 1 RGB) vs (Ball 3 RGB)")
different_pixels_count = 0
for r_idx in range(12):
    row_diffs = []
    for c_idx in range(12):
        p1 = ball1_pixels[r_idx][c_idx][:3]
        p3 = ball3_pixels[r_idx][c_idx][:3]
        if p1 != p3:
            different_pixels_count += 1
            row_diffs.append(f"col{c_idx}:{p1} vs {p3}")
    if row_diffs:
        print(f"Row {r_idx + 21}: " + " | ".join(row_diffs))

print(f"\nTotal different pixels (excluding alpha): {different_pixels_count}")
