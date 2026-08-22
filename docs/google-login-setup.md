# เปิดใช้ Google Login — ขั้นตอนละเอียด

โปรเจกต์ Supabase: `mgpngkzxfxmphjaiyfcg`
เว็บจริง: `https://cosmoklub.pages.dev`

> **ไม่ต้อง deploy โค้ดอะไรเลย** ปุ่ม "Continue with Google" อยู่บน `login.html`
> ของเว็บจริงเรียบร้อยแล้ว ที่ขาดคือฝั่งฐานข้อมูลกับการตั้งค่าเท่านั้น

---

## ขั้นที่ 0 — สำรองก่อน (2 นาที)

Supabase → **Database** → **Backups** → กดสร้าง backup

ถ้าอะไรผิดพลาดจะย้อนได้ และเก็บไฟล์ `supabase/rollback-auth.sql` ไว้ใกล้มือ

---

## ขั้นที่ 1 — รัน SQL (2 นาที)

Supabase → **SQL Editor** → **New query** → วางเนื้อหาไฟล์ `supabase/schema-auth.sql` ทั้งไฟล์ → กด **Run**

ควรขึ้น `Success. No rows returned`

**ทำไมต้องรัน:** trigger เดิมดึง username จาก metadata ตรงๆ แต่ Google ไม่ส่งฟิลด์นั้นมา
ค่าเป็น NULL แล้วชน `not null` ทำให้การสมัครล้มทั้งรายการ ต่อให้ตั้งค่าอย่างอื่นครบก็ยังพัง

### ทดสอบทันทีก่อนไปต่อ

1. เข้าเว็บจริง login ด้วย**บัญชีเดิมที่มีอยู่** → ต้องเข้าได้ปกติ
   (trigger ไม่ทำงานตอน login อยู่แล้ว ข้อนี้แทบไม่มีทางพัง)
2. **สมัครบัญชีอีเมลใหม่ 1 อัน** → ต้องสมัครผ่านและเข้า dashboard ได้

❌ ถ้าข้อ 2 พัง → รัน `supabase/rollback-auth.sql` ทันที แล้วหยุด อย่าไปต่อ

---

## ขั้นที่ 2 — สร้าง OAuth Client ใน Google (10 นาที)

ไปที่ <https://console.cloud.google.com>

1. สร้างโปรเจกต์ใหม่ หรือเลือกโปรเจกต์เดิม
2. **APIs & Services** → **OAuth consent screen**
   - User Type เลือก **External** → Create
   - App name: `CosmoKlub`
   - User support email: อีเมลคุณ
   - Developer contact: อีเมลคุณ
   - กด Save and Continue ผ่านหน้า Scopes และ Test users ไปได้เลย
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `CosmoKlub Web`
   - **Authorized redirect URIs** ใส่บรรทัดนี้ให้ตรงเป๊ะ:

     ```
     https://mgpngkzxfxmphjaiyfcg.supabase.co/auth/v1/callback
     ```

   - กด **Create**
4. คัดลอก **Client ID** และ **Client Secret** เก็บไว้

⚠️ URL ในข้อ 3 ต้องเป็นของ **Supabase** ไม่ใช่ของ cosmoklub.pages.dev
Google จะคุยกับ Supabase ก่อน แล้ว Supabase ค่อยส่งกลับมาที่เว็บเรา

⚠️ ถ้า OAuth consent screen ยังอยู่สถานะ **Testing** จะ login ได้เฉพาะอีเมลที่เพิ่มใน
Test users เท่านั้น ถ้าจะให้คนทั่วไปใช้ต้องกด **Publish app**

---

## ขั้นที่ 3 — เปิด provider ใน Supabase (3 นาที)

Supabase → **Authentication** → **Providers** → **Google**

1. เปิดสวิตช์ **Enable Sign in with Google**
2. วาง **Client ID** และ **Client Secret** จากขั้นที่ 2
3. **Save**

---

## ขั้นที่ 4 — ตั้ง URL ที่อนุญาต (3 นาที)

Supabase → **Authentication** → **URL Configuration**

- **Site URL:**

  ```
  https://cosmoklub.pages.dev
  ```

- **Redirect URLs** เพิ่มทั้ง 3 บรรทัด:

  ```
  https://cosmoklub.pages.dev/**
  https://*.cosmoklub.pages.dev/**
  http://localhost:8788/**
  ```

บรรทัดที่ 2 ไว้สำหรับ preview deployment บรรทัดที่ 3 ไว้ทดสอบในเครื่อง

**ทำไมต้องมี:** โค้ดส่ง `redirectTo` เป็น `window.location.origin + '/dashboard.html'`
ถ้าโดเมนไม่อยู่ในรายการนี้ Supabase จะปฏิเสธการส่งกลับ

---

## ขั้นที่ 5 — เปิด manual linking (1 นาที)

Supabase → **Authentication** → **Sign In / Providers** → เปิด **Allow manual linking**

จำเป็นสำหรับหน้า Security ที่ให้ผูก Google เข้ากับบัญชีอีเมลเดิม

> ข้อนี้ข้ามได้ถ้ายังไม่ push หน้า Settings ใหม่ — แต่เปิดไว้เลยก็ไม่เสียหาย

---

## ขั้นที่ 6 — ทดสอบ Google login

1. เปิด **หน้าต่าง incognito** (สำคัญ — กันไม่ให้ session เดิมมารบกวน)
2. เข้า `https://cosmoklub.pages.dev/login.html`
3. กด **Continue with Google** → เลือกบัญชี
4. ต้องเด้งกลับมาที่ `dashboard.html` และ login อยู่

### ถ้าพัง ให้ดูข้อความ

| ข้อความที่เห็น | สาเหตุ | แก้ที่ |
|---|---|---|
| `redirect_uri_mismatch` | URI ในขั้น 2 ไม่ตรง | Google Console → Credentials |
| `Unsupported provider` | ยังไม่ได้เปิด Google | Supabase → Providers |
| `requested path is invalid` | โดเมนไม่อยู่ใน Redirect URLs | Supabase → URL Configuration |
| `Database error saving new user` | **ยังไม่ได้รัน SQL ขั้นที่ 1** | SQL Editor |
| `Access blocked` / ต้องเป็น test user | consent screen ยังเป็น Testing | Google Console → Publish app |

### ยืนยันว่าเข้าฐานข้อมูลจริง

Supabase → **Table Editor** → `profiles` → ต้องมีแถวใหม่ที่มี `username` และ `avatar_url`
เป็นลิงก์รูปจาก Google

---

## สรุปว่า "พร้อมปล่อย" แค่ไหน

| สิ่งที่ได้ | สถานะหลังทำ 6 ขั้นนี้ |
|---|---|
| Login ด้วย Google | ✅ ใช้ได้บนเว็บจริง |
| Login ด้วยอีเมล/รหัสผ่าน | ✅ เหมือนเดิม ไม่กระทบ |
| รูปโปรไฟล์จาก Google | ✅ เก็บลง `profiles.avatar_url` |
| ชื่อผู้ใช้อัตโนมัติจาก Google | ✅ กันซ้ำให้แล้ว |

| ยังไม่ได้ | ต้องทำอะไรเพิ่ม |
|---|---|
| หน้า Settings 3 ส่วน (Account/Security/Log out) | โค้ดเขียนเสร็จแล้วแต่**ยังไม่ push** |
| ผูก/ถอด provider ในหน้า Security | อยู่ในโค้ดชุดเดียวกันที่ยังไม่ push |
| Forum โพสต์จริง ทุกคนเห็น | ต้องรัน `schema-forum.sql` **และแก้ `forum.js` ให้เลิกใช้ mock** (ยังไม่ได้ทำ) |
| แชทส่วนตัว | ยังไม่มี schema เลย |

**แปลว่า** ทำ 6 ขั้นนี้ = Google login พร้อมใช้จริง แต่ยังไม่ใช่ "ระบบครบ"
ส่วน forum กับ chat เป็นงานคนละก้อนที่ยังต้องเขียนโค้ดเพิ่ม
