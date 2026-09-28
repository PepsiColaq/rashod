import base64
import json
import re
import urllib.request
from pathlib import Path

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
    r"C:\Users\pishi\.cursor\projects\d-rashod\assets\c__Users_pishi_AppData_Roaming_Cursor_User_workspaceStorage_0c85b491aceb97e72279e9e01ac11e5e_images_image-72b171aa-65c0-4829-9fd2-92e0bfa28965.jpg"
)
# fallback older photo
if not img.exists():
    img = Path(
        r"C:\Users\pishi\.cursor\projects\d-rashod\assets\c__Users_pishi_AppData_Roaming_Cursor_User_workspaceStorage_0c85b491aceb97e72279e9e01ac11e5e_images_image-7f3a52d3-0c11-4a4d-abf5-055a7e273826.jpg"
    )

b64 = base64.standard_b64encode(img.read_bytes()).decode()
body = json.dumps(
    {
        "imageBase64": "data:image/jpeg;base64," + b64,
        "day": 28,
        "group": "0903-ПД3",
        "roster": roster,
        "accessCode": "91271732100",
    },
    ensure_ascii=False,
).encode("utf-8")
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
with urllib.request.urlopen(req, timeout=300) as r:
    data = json.loads(r.read().decode("utf-8"))

out = Path(r"C:\Users\pishi\AppData\Local\Temp\rashod-test.json")
out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
students = (data.get("result") or {}).get("students") or []
print("ok", data.get("ok"), "mode", data.get("mode"), "cost", (data.get("usage") or {}).get("cost_rub"))
print("exceptionsCount", data.get("exceptionsCount"))
print("--- specials ---")
for s in students:
    if s.get("mark") != "present":
        print(f"{s.get('surname')}\t{s.get('mark')}")
print("--- check expected ---")
by = {s["surname"]: s["mark"] for s in students}
ok_all = True
for name, mark in EXPECTED.items():
    got = by.get(name)
    flag = "OK" if got == mark else "FAIL"
    if got != mark:
        ok_all = False
    print(f"{flag}\t{name}: want={mark} got={got}")
# everyone else present?
for s in students:
    if s["surname"] in EXPECTED:
        continue
    if s["mark"] != "present":
        ok_all = False
        print(f"FAIL\t{s['surname']}: want=present got={s['mark']}")
print("RESULT", "PASS" if ok_all else "FAIL")
