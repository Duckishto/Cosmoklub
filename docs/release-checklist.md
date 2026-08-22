# CosmoKlub — ลิสต์ปล่อยของ (Google login + Settings)

โปรเจกต์ Supabase: `mgpngkzxfxmphjaiyfcg`
เว็บจริง: `https://cosmoklub.pages.dev`

---

## ทำแล้วได้อะไร / ยังไม่ได้อะไร

| ทำครบลิสต์นี้แล้วจะได้ | |
|---|---|
| Login ด้วย Google | ✅ |
| Login ด้วยอีเมล (เหมือนเดิม ไม่กระทบ) | ✅ |
| หน้า Settings 3 ส่วน Account / Security / Log out | ✅ |
| อัปโหลดรูปโปรไฟล์เอง | ✅ |
| ใช้รูปจากบัญชี Google | ✅ |
| ไม่ใส่รูป → เป็นตัวอักษร | ✅ |
| ผูก / ถอด Google กับบัญชีอีเมลเดิม | ✅ |

| ยังไม่ได้ในรอบนี้ | ทำไม |
|---|---|
| Forum โพสต์จริง ทุกคนเห็น | `forum.js` ยังเป็น mock — ผมยังไม่ได้เขียนโค้ดต่อ database |
| แจ้งเตือน (กระดิ่ง) | ต่อจาก forum |
| แชทส่วนตัว | ยังไม่มี schema |

> **`schema-forum.sql` ยังไม่ต้องรันรอบนี้** รันไปก็ไม่มีอะไรเปลี่ยน เพราะโค้ดยังไม่เรียกใช้
> เก็บไว้รันตอนทำ forum จริงพร้อมกันทีเดียว จะได้แยกออกว่าถ้าพังมาจากอะไร

---

# ส่วนที่ 1 — คุณทำใน Supabase

## ☐ 1.1 สำรองข้อมูล

Supabase → **Database** → **Backups** → สร้าง backup

เปิดไฟล์ `supabase/rollback-auth.sql` ค้างไว้อีกแท็บ เผื่อต้องใช้

---

## ☐ 1.2 รัน `schema-auth.sql`

Supabase → **SQL Editor** → **New query** → วางทั้งไฟล์ → **Run**

ควรขึ้น `Success. No rows returned`

**ไฟล์นี้ทำอะไร**
- เพิ่มคอลัมน์ `avatar_url` ในตาราง `profiles`
- แก้ trigger ตอนสมัครสมาชิกให้รองรับบัญชีที่ไม่มี username ส่งมา (คือ Google)
- ถ้าสมัครผ่านฟอร์มเรา ยังเก็บชื่อตามที่พิมพ์เป๊ะและ error ถ้าซ้ำ เหมือนเดิมทุกอย่าง

### 🔴 จุดตรวจที่ 1 — หยุดทดสอบก่อนไปต่อ

1. เข้าเว็บจริง **login ด้วยบัญชีเดิม** → ต้องเข้าได้ปกติ
2. **สมัครบัญชีอีเมลใหม่ 1 อัน** → ต้องสมัครผ่านและเข้า dashboard ได้

❌ ถ้าข้อ 2 พัง → รัน `supabase/rollback-auth.sql` ทันที แล้วหยุด แจ้งผม

---

## ☐ 1.3 รัน `schema-storage.sql`

SQL Editor → New query → วางทั้งไฟล์ → **Run**

**ไฟล์นี้ทำอะไร** สร้างที่เก็บรูปชื่อ `avatars` เปิดให้อ่านสาธารณะ (เพราะรูปต้องโชว์ข้างโพสต์ให้คนที่ยังไม่ login เห็นด้วย) แต่เขียนได้เฉพาะโฟลเดอร์ของตัวเอง จำกัด 2 MB และรับแค่ JPG/PNG/WebP

### จุดตรวจที่ 2

Supabase → **Storage** → ต้องเห็น bucket ชื่อ **avatars** และมีป้าย Public

---

## ☐ 1.4 สร้าง OAuth Client ที่ Google

<https://console.cloud.google.com>

**ก. OAuth consent screen**
- APIs & Services → OAuth consent screen → User Type **External** → Create
- App name `CosmoKlub`, ใส่อีเมลคุณในช่อง support และ developer contact
- กด Save and Continue ผ่านหน้า Scopes / Test users ไปได้เลย

**ข. Credentials**
- APIs & Services → Credentials → **Create Credentials** → **OAuth client ID**
- Application type: **Web application**
- Name: `CosmoKlub Web`
- **Authorized redirect URIs** ใส่บรรทัดนี้เป๊ะๆ:

  ```
  https://mgpngkzxfxmphjaiyfcg.supabase.co/auth/v1/callback
  ```

- Create → คัดลอก **Client ID** และ **Client Secret**

⚠️ URI นี้เป็นของ **Supabase** ไม่ใช่ cosmoklub.pages.dev
Google คุยกับ Supabase ก่อน แล้ว Supabase ค่อยส่งกลับมาเว็บเรา ใส่ผิดจะเจอ `redirect_uri_mismatch`

⚠️ ถ้า consent screen ยังเป็นสถานะ **Testing** จะ login ได้แค่อีเมลใน Test users
ให้คนทั่วไปใช้ต้องกด **Publish app**

---

## ☐ 1.5 เปิด Google provider

Supabase → **Authentication** → **Providers** → **Google**
- เปิดสวิตช์
- วาง Client ID และ Client Secret
- **Save**

---

## ☐ 1.6 ตั้ง URL ที่อนุญาต

Supabase → **Authentication** → **URL Configuration**

**Site URL**
```
https://cosmoklub.pages.dev
```

**Redirect URLs** เพิ่มทั้ง 3 บรรทัด
```
https://cosmoklub.pages.dev/**
https://*.cosmoklub.pages.dev/**
http://localhost:8788/**
```

---

## ☐ 1.7 เปิด manual linking

Supabase → **Authentication** → **Sign In / Providers** → เปิด **Allow manual linking**

จำเป็นสำหรับปุ่ม Connect ในหน้า Security ถ้าไม่เปิด ปุ่มจะขึ้นข้อความบอกว่าต้องไปเปิดตรงไหน

---

# ส่วนที่ 2 — ผมทำให้ (บอกคำเดียว)

## ☐ 2.1 Push โค้ดขึ้นเว็บจริง

ไฟล์ที่จะขึ้น
- `assets/js/components/settings.js` — Settings 3 ส่วน + จัดการรูปโปรไฟล์
- `assets/css/settings.css` — ไฟล์ใหม่
- `dashboard.html` — โหลด settings.css
- `supabase/schema-auth.sql`, `schema-storage.sql`, `rollback-auth.sql` — เก็บไว้ใน repo
- `docs/` — คู่มือ

ผมจะ `git fetch` + rebase ก่อน (เพื่อน push บ่อย) แล้วรันชุดตรวจ syntax + template + logic ก่อน push ทุกครั้ง

⚠️ **ต้อง push หลังจากรัน SQL ข้อ 1.2 และ 1.3 เสร็จแล้ว** ไม่งั้นคนที่เปิดหน้า Settings
จะเจอ error เพราะโค้ดหาคอลัมน์ `avatar_url` กับ bucket `avatars` ไม่เจอ

---

# ส่วนที่ 3 — ทดสอบบนเว็บจริง

เปิด **หน้าต่าง incognito** ทุกครั้ง กัน session เก่ารบกวน

## ☐ 3.1 Google login
`https://cosmoklub.pages.dev/login.html` → **Continue with Google** → เลือกบัญชี
→ ต้องเด้งกลับมาที่ dashboard และ login อยู่

ตรวจต่อ: Supabase → Table Editor → `profiles` → มีแถวใหม่ พร้อม `username` และ `avatar_url`

## ☐ 3.2 Settings
กดไอคอนเฟืองบน dashboard → ต้องเห็น 3 ส่วน Account / Security / Log out

- **Account** → เปลี่ยนชื่อ → refresh แล้วชื่อใหม่ยังอยู่
- **Account** → Upload photo → เลือกรูป → รูปเปลี่ยนภายในไม่กี่วินาที
- **Account** → Remove → กลับเป็นตัวอักษร
- **Security** → เห็นรายการ Google / Email ตัวที่เชื่อมแล้วมีป้าย Connected

## ☐ 3.3 ผูกบัญชี
login ด้วยอีเมล → Settings → Security → กด **Connect** ที่ Google
→ เลือกบัญชี → กลับมาต้องขึ้น Connected ทั้งสองอัน

## ☐ 3.4 กันล็อกตัวเอง
ตอนมีวิธี login ทางเดียว → ปุ่มต้องเป็นข้อความ **Only method** กดถอดไม่ได้

---

# ถ้าพัง ดูตรงนี้

| ข้อความ | สาเหตุ | แก้ที่ |
|---|---|---|
| `Database error saving new user` | ยังไม่รัน `schema-auth.sql` | ข้อ 1.2 |
| `redirect_uri_mismatch` | URI ไม่ตรง | ข้อ 1.4ข |
| `Unsupported provider` | ยังไม่เปิด Google | ข้อ 1.5 |
| `requested path is invalid` | โดเมนไม่อยู่ใน Redirect URLs | ข้อ 1.6 |
| `Access blocked` / ต้องเป็น test user | consent screen ยัง Testing | ข้อ 1.4 → Publish app |
| ปุ่ม Connect ขึ้นว่า linking ปิดอยู่ | ยังไม่เปิด manual linking | ข้อ 1.7 |
| อัปโหลดรูปแล้วบอกว่า storage ไม่พร้อม | ยังไม่รัน `schema-storage.sql` | ข้อ 1.3 |

---

# สรุปลำดับสั้นๆ

```
1. backup
2. รัน schema-auth.sql      → ทดสอบสมัครอีเมลใหม่ ✋ หยุดตรวจ
3. รัน schema-storage.sql   → เช็คว่ามี bucket avatars
4. ตั้ง Google Cloud + Supabase (ข้อ 1.4 ถึง 1.7)
5. บอกผม → ผม push โค้ด
6. ทดสอบใน incognito ตามส่วนที่ 3
```
