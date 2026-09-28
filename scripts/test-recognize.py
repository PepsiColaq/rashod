import base64
import json
import re
import urllib.request
from pathlib import Path

try:
    from PIL import Image
    import io
except ImportError:
    Image = None

root = Path(r"D:\чистилка\rashod")
text = (root / "src/data/roster.js").read_text(encoding="utf-8")
surnames = re.findall(r"surname: '([^']+)'", text)
fulls = re.findall(r"fullName: '([^']+)'", text)
roster = [{"surname": s, "fullName": f} for s, f in zip(surnames, fulls)]

EXPECTED = {
    "Брюкин": "absent",
    "Исмаилов": "duty",
    "Кобзева": "event",
}

img = Path(
    r"C:\Users\pishi\.cursor\projects\d-rashod\assets\c__Users_pishi_AppData_Roaming_Cursor_User_workspaceStorage_0c85b491aceb97e72279e9e01ac11e5e_images_image-eaa5e43e-8555-42eb-9d23-a6e3f151fc7c.jpg"
)
raw = img.read_bytes()
b64 = base64.standard_b64encode(raw).decode()
crop_b64 = None
if Image:
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    crop = im.crop((int(w * 0.35), 0, w, h))
    buf = io.BytesIO()
    crop.save(buf, format="JPEG", quality=92)
    crop_b64 = base64.standard_b64encode(buf.getvalue()).decode()

payload = {
    "imageBase64": "data:image/jpeg;base64," + b64,
    "day": 28,
    "group": "0903-ПД3",
    "roster": roster,
    "accessCode": "91271732100",
}
if crop_b64:
    payload["imageCropBase64"] = "data:image/jpeg;base64," + crop_b64

body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
req = urllib.request.Request(
    "https://rashod-api.voyc-nikita.workers.dev/recognize",
    data=body,
    headers={
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://pepsicolaq.github.io",
        "X-Access-Code": "91271732100",
    },
)
with urllib.request.urlopen(req, timeout=400) as r:
    data = json.loads(r.read().decode("utf-8"))

out = Path(os_path := __import__("os").environ["TEMP"]) / "rashod-test.json"
out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
students = (data.get("result") or {}).get("students") or []
print("ok", data.get("ok"), "mode", data.get("mode"), "cost", (data.get("usage") or {}).get("cost_rub"))
print("glyphs", json.dumps(data.get("glyphs"), ensure_ascii=True))
by = {s["surname"]: s["mark"] for s in students}
ok_all = True
for name, mark in EXPECTED.items():
    got = by.get(name)
    flag = "OK" if got == mark else "FAIL"
    if got != mark:
        ok_all = False
    print(f"{flag}\t{name}: want={mark} got={got}")
for s in students:
    if s["surname"] in EXPECTED:
        continue
    if s["mark"] != "present":
        ok_all = False
        print(f"FAIL\t{s['surname']}: want=present got={s['mark']}")
print("RESULT", "PASS" if ok_all else "FAIL")
