from PIL import Image

# Maskot - remove putih
maskot_path = 'public/hppmate-maskot.png'
maskot = Image.open(maskot_path).convert('RGBA')
data = maskot.getdata()

new_data = []
for item in data:
    r, g, b, a = item[0], item[1], item[2], item[3] if len(item) == 4 else 255
    if r > 240 and g > 240 and b > 240:
        new_data.append((r, g, b, 0))
    else:
        new_data.append(item)

maskot.putdata(new_data)
maskot.save(maskot_path)
print(f"Maskot done: {maskot_path}")

# Logo - remove hitam
logo_path = 'public/hppmate-logo.png'
logo = Image.open(logo_path).convert('RGBA')
data = logo.getdata()

new_data = []
for item in data:
    r, g, b, a = item[0], item[1], item[2], item[3] if len(item) == 4 else 255
    if r < 30 and g < 30 and b < 30:
        new_data.append((r, g, b, 0))
    else:
        new_data.append(item)

logo.putdata(new_data)
logo.save(logo_path)
print(f"Logo done: {logo_path}")
