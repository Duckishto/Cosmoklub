# CosmoKlub — สรุปสถานะโปรเจกต์

อัปเดต 23 ส.ค. 2026 · เว็บจริง <https://cosmoklub.pages.dev> · Supabase `mgpngkzxfxmphjaiyfcg`

---

## โปรเจกต์นี้คืออะไร

เว็บชุมชนดาราศาสตร์ เขียนด้วย HTML/CSS/JS ธรรมดา + Vue 3 ผ่าน CDN **ไม่มี build step**
deploy บน Cloudflare Pages ต่อฐานข้อมูล Supabase

ทำเป็นโครงงาน ต้องมีผู้ใช้จริงมาทดลองใช้ ทีมมี 2 คนคือเจ้าของ repo (Duckishto)
กับผู้ใช้ (FUNB10X)

---

## ไทม์ไลน์ที่ทำมาทั้งหมด

### 1. แยกเว็บเป็นสองฝั่ง — public กับหลัง login

เริ่มจากโจทย์ว่าอยากแบ่งหน้าแรกกับหน้าหลัง login ให้ชัด

**สิ่งที่ค้นพบ** ระบบ login มีโค้ดครบอยู่แล้วทั้ง `signUp`, `signInWithPassword`,
`signInWithOAuth` และปุ่มก็ผูกกับฟังก์ชันเรียบร้อย แต่**ใช้งานไม่ได้เพราะ Cloudflare
ไม่ได้ตั้ง env var** ทำให้ `/api/supabase-config` คืน 503 → client เป็น null →
ทุกปุ่มขึ้น "Sign-up is not configured yet"

เพื่อนแก้โดยใส่ env var ให้ → login ใช้ได้ทันทีโดยไม่ต้องแก้โค้ดสักบรรทัด

### 2. Major Update 1.0

- `auth-guard.js` กันคนไม่ login เข้าหน้าใน
- รวมเครื่องมือทั้งหมดเป็นแท็บ **Tools** เดียว (เครื่องคิดเลข + 3 เครื่องมือ NASA
  ที่เคยอยู่หน้า `object.html`)
- หน้า **public `tools.html`** สำหรับคนยังไม่ login (3 เครื่องมือ ไม่มีเครื่องคิดเลข)
- หน้า **Profile** และ **Settings**
- เพิ่ม `.gitignore` — repo ไม่เคยมีมาก่อน ทั้งที่ `.dev.vars` เก็บคีย์ Supabase

### 3. เพื่อนรื้อโครงโปรเจกต์ใหม่ทั้งหมด

เพื่อน push 470 commits รวดเดียว ย้ายจากไฟล์กองรวมที่ root เป็น `assets/css`,
`assets/js/components`, `assets/js/lib`, `assets/images` และเพิ่มหน้าใหม่อีกเพียบ

**ผลกระทบ** งาน Major Update 1.0 หายจาก main ทั้งหมด ต้องย้ายมาใส่โครงใหม่
(ทำเสร็จแล้ว merge เข้า main ผ่าน PR #2)

### 4. ตัดระบบหลายภาษา

ลบคำแปล ES/FR/JA/TH ออก 357 บรรทัด เหลือ EN อย่างเดียว
เอาปุ่มเลือกภาษาออกจากทุกหน้า

### 5. ระบบ Forum (mock)

- กล่อง **New post** ใต้ tonight's sky
- **Composer** เลือกหมวดหมู่ได้ 6 หมวด และถ้าเป็น Beginner Q&A จะมี solved/unsolved
- **ปุ่มไลค์** กดแล้วกดซ้ำได้
- **คอมเมนต์** กดการ์ดเปิดอ่านกระทู้พร้อมรายการคอมเมนต์และช่องตอบ
- แถบถาม **"Has this been solved?"** โผล่เฉพาะคำถามของตัวเองที่ยังไม่ปิด
- **Status filter** Solved / Unanswered ที่เดิมเป็นปุ่มตาย
- Mock 27 กระทู้ พร้อมคอมเมนต์ 16 ความเห็น

### 6. Settings ใหม่ + Google coming soon

- Settings แบ่ง 3 ส่วน **Account / Security / Log out** แบบแอปดัง
- รูปโปรไฟล์ ถ้าไม่มีใช้ตัวอักษรแรก
- **Google sign-in ปิดไว้ ขึ้น "Coming soon"** ทั้งหน้า login และหน้า Security
  เพราะยังไม่ได้ตั้งค่า provider ใน Supabase
- **Upload photo ขึ้น "Coming soon"** เพราะยังไม่มี storage bucket

### 7. แก้บั๊กมือถือ

- ไซด์บาร์ filter ล็อกอยู่กับที่บนมือถือแนวตั้ง (เดิมลอยตามทับโพสต์)
- sky-strip กับ New post ย้ายเข้าคอลัมน์เดียวกับฟีด ขอบตรงกันแล้ว

---

## สถานะปัจจุบัน

### บนเว็บจริง (commit `4363575`)

| ระบบ | สถานะ |
|---|---|
| Login อีเมล/รหัสผ่าน | ✅ ใช้งานได้ |
| Login Google | ⏸ ปุ่มขึ้น Coming soon |
| Library / บทเรียน / XP / rank | ✅ ใช้งานได้ ต่อ Supabase จริง |
| Tools (เครื่องคิดเลข + NASA) | ✅ ใช้งานได้ |
| Profile | ✅ แสดง XP/rank จริง แต่ Following/Followers/Likes ยังเป็น 0 |
| Settings | ✅ เปลี่ยนชื่อ + logout ได้ |
| Forum | ⚠️ **mock** โพสต์แล้วหายเมื่อ refresh |
| Chat | ⚠️ **mock** ไม่มี schema เลย |
| แจ้งเตือน (กระดิ่ง) | ❌ ไอคอนตาย ไม่มี handler |

### งานค้างในเครื่อง — ยังไม่ commit ⚠️

**มีการต่อ Forum เข้า database ค้างอยู่** 7 ไฟล์ 356 บรรทัดเพิ่ม 702 บรรทัดลบ

- `forum.js` เอา mock ออกหมดแล้ว เรียก `ForumAPI` 12 จุด
- `forum-api.js` เพิ่ม `setSolved()`
- `schema-forum.sql` เพิ่มคอลัมน์ `solved`
- `dashboard.html` โหลด `forum-api.js` แล้ว
- syntax ผ่านทุกไฟล์

**แต่ยังทดสอบไม่ได้** เพราะ `forum_threads` ใน Supabase ยังตอบ 404 — **ยังไม่ได้รัน
`schema-forum.sql`**

---

## ไฟล์ SQL ที่มี

| ไฟล์ | รันแล้ว? | ทำอะไร |
|---|---|---|
| `schema.sql` | ✅ | profiles, staff_applications, bug reports |
| `schema-progress.sql` | ✅ | XP, badges, cosmetics, และเพิ่มคอลัมน์ profiles (`avatar_url`, `display_name`, `streak_count` ฯลฯ) |
| `schema-forum.sql` | ❌ | threads, replies, likes, notifications + RLS + trigger แจ้งเตือน |
| `schema-auth.sql` | ❌ | แก้ trigger ให้รองรับ Google (ยังไม่ต้องใช้ตอนนี้) |
| `schema-storage.sql` | ❌ | bucket เก็บรูปโปรไฟล์ |
| `rollback-auth.sql` | — | กู้คืน trigger ถ้า `schema-auth.sql` ทำพัง |

⚠️ **Supabase เป็น Free plan — ไม่มี backup อัตโนมัติ** ก่อนรัน SQL ที่แตะ trigger
ต้องถ่ายสำเนาของเดิมไว้ก่อนด้วย

```sql
select pg_get_functiondef(oid) from pg_proc where proname = 'handle_new_user';
```

---

## ปัญหาที่ยังไม่ได้แก้

**`assets/js/common.js` ไม่มีอยู่จริง** ทั้งที่ 10 กว่าหน้าเรียกใช้ หายไปตอนเพื่อนรื้อโครง
มี guard เลยไม่ crash แต่**ดาวพื้นหลังไม่ขึ้นเลยทั้งเว็บ**

**Auth guard หายทั้งเว็บ** `auth-guard.js` หายไปพร้อมการรื้อโครง ตอนนี้ใครก็เปิด
`dashboard.html` ได้โดยไม่ต้อง login (ข้อมูลไม่รั่วเพราะ RLS ยังกันอยู่ แต่หน้า
Profile/Settings จะพังเงียบๆ)

**ปุ่มเครื่องคิดเลขเล็กเกินบนมือถือ** `.calc-key` ตั้ง `min-height: 0`
(แป้นโหมดกราฟตั้ง 44px ไว้ถูกแล้ว ตกหล่นเฉพาะโหมด Scientific)
CSS ฝังเป็น string อยู่ใน `calculator.js` — ปัญหาแบบเดียวกับที่เพื่อนเพิ่งแก้ให้ library
โดยย้ายออกมาเป็น `library.css`

**Minigames ยังเป็นป้าย Soon** ใน `app.js`

---

## แนวทางต่อไป

### รอบถัดไป — ปิดงาน Forum

1. **ถ่ายสำเนา trigger เดิมเก็บไว้** (คำสั่ง SQL ด้านบน) เพราะไม่มี backup
2. **รัน `schema-forum.sql`** ใน Supabase
3. **ทดสอบงานค้างในเครื่อง** บน `localhost:8788` — โพสต์ ไลค์ คอมเมนต์ ต้องอยู่รอด
   หลัง refresh และเช็คว่าคนอื่นเห็นโพสต์เราด้วย
4. **commit + push** ถ้าผ่าน

### หลังจากนั้น เรียงตามความคุ้มค่า

**ซ่อมของที่พังก่อน** — เอา `common.js` กลับมา, เอา auth guard กลับมา,
แก้ปุ่มเครื่องคิดเลขบนมือถือ ทั้งสามอย่างใช้เวลาไม่นานและเห็นผลทันที

**แล้วค่อยต่อยอด** — กระดิ่งแจ้งเตือน (ตารางกับ trigger อยู่ใน `schema-forum.sql`
แล้ว และ `forum-api.js` มี `listNotifications()` รอไว้), ตัวเลข Following/Followers
(ต้องสร้างตาราง `follows` ใหม่), แชทส่วนตัว (ยังไม่มี schema เลย ต้องออกแบบ
`conversations`, `messages` + Realtime ตั้งแต่ต้น)

**เปิด Google login** เมื่อพร้อม — รัน `schema-auth.sql` แล้วตั้งค่า Google Cloud
กับ Supabase ตามคู่มือ `docs/google-login-setup.md` โค้ดฝั่งหน้าเว็บพร้อมหมดแล้ว
แค่เอา `disabled` ออกกับเปลี่ยน flag `available` เป็น `true`

---

## วิธีทำงานที่ตกลงกันไว้

- **ทำบน `main` ตรงๆ** ไม่ใช้ branch ไม่ใช้ PR
- **ก่อน push ทุกครั้ง** — ทดสอบบน `localhost:8788` (`npx wrangler@3 pages dev .`)
  → รันชุดตรวจ syntax + ความสมดุลของแท็กใน template + logic test → `git fetch`
  แล้ว rebase
- **เพื่อน push บ่อยมาก** และแก้ผ่านหน้าเว็บ GitHub ด้วยการอัปโหลดไฟล์ทับ
  เจอ conflict มาแล้ว 5 รอบ และเคยทำงานหายทั้งชุด 1 ครั้ง — **ต้อง fetch ก่อนเริ่มงานเสมอ**
- **commit ไม่ใส่ชื่อ Claude**
- `.dev.vars` หายบ่อยเพราะถูก gitignore — ถ้า localhost ขึ้น "Sign-up is not
  configured yet" ให้สร้างใหม่จากค่า production
