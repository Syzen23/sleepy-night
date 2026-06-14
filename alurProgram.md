# PRD — Night Companion (Version 1.0)

## Product Name

Night Companion

---

# 1. Vision

Night Companion adalah AI Voice Companion pribadi yang membantu pengguna melakukan transisi dari aktivitas malam menuju tidur melalui percakapan santai, pelepasan pikiran, dan penutupan hari yang tenang.

Aplikasi ini tidak dirancang untuk meningkatkan produktivitas malam hari.

Aplikasi ini dirancang untuk membantu pengguna berhenti aktif dan mulai beristirahat.

---

# 2. Background

Pengguna sering mengalami:

- Overthinking sebelum tidur
- Pikiran yang terus aktif mengenai project yang belum selesai
- Kekhawatiran terhadap masa depan
- Mengingat percakapan atau kejadian yang sudah terjadi
- Munculnya ide baru saat malam hari
- Distraksi seperti game atau aktivitas lain yang membuat tidur semakin larut

Akibatnya:

- Sulit tidur sesuai target
- Tidur lebih larut dari yang direncanakan
- Kualitas istirahat menurun
- Pikiran tetap aktif saat tubuh membutuhkan istirahat

---

# 3. Product Goal

Membantu pengguna:

1. Mengosongkan pikiran sebelum tidur
2. Menyimpan hal penting untuk esok hari
3. Mengurangi keinginan melakukan aktivitas berat sebelum tidur
4. Membentuk ritual malam yang lebih konsisten
5. Tidur pada rentang waktu 23.00–23.30

---

# 4. Target User

Primary User:

- Diri sendiri

Profile:

- Mahasiswa
- Front-end developer
- Sering mengerjakan project hingga malam
- Memiliki kecenderungan overthinking sebelum tidur
- Membutuhkan teman berbicara sebelum tidur

---

# 5. Core Concept

Night Companion bukan chatbot.

Night Companion bukan AI advisor.

Night Companion adalah:

"Teman ngobrol malam yang membantu pengguna menutup hari."

---

# 6. Product Principles

## Principle 1

AI harus membantu pengguna menjadi lebih tenang.

Bukan membuat pengguna lebih aktif.

---

## Principle 2

AI tidak boleh mendorong brainstorming besar menjelang tidur.

---

## Principle 3

AI tidak boleh menjadi aplikasi produktivitas.

---

## Principle 4

AI harus terasa seperti teman ngobrol yang peduli.

Bukan seperti guru atau pelatih.

---

## Principle 5

Semua fitur harus mendukung tujuan utama:

"membantu pengguna tidur"

---

# 7. Daily User Journey

## 21.00 – 22.00

Pengguna masih menyelesaikan aktivitas.

Contoh:

- Coding
- Belajar
- Mengerjakan tugas
- Menonton video

---

## 22.00

Night Reminder muncul.

Contoh:

"Sudah waktunya memperlambat hari ini."

atau

"Aku ada di sini kalau kamu ingin berbicara sebentar."

---

## 22.00 – 22.15

Pengguna membuka aplikasi.

Masuk ke Night Session.

---

## 22.15 – 22.45

Voice Conversation berlangsung.

Pengguna:

- Curhat
- Bercerita
- Mengeluarkan isi pikiran
- Menyampaikan kekhawatiran

AI:

- Mendengarkan
- Menanggapi secara santai
- Mengelompokkan pikiran penting

---

## 22.45 – 23.00

AI mulai mengarahkan ke penutupan hari.

Contoh:

"Aku sudah menyimpan itu untuk besok."

atau

"Kita bisa lanjutkan besok kalau kamu mau."

---

## 23.00

Session ditutup.

AI memberikan closure.

Contoh:

"Kamu tidak perlu membawa semua itu malam ini."

---

## Setelah Session

Pengguna:

- Cuci muka
- Gosok gigi
- Mematikan lampu utama
- Tidur

---

# 8. MVP Features

## Feature 1 — Night Reminder

Tujuan:
Mengingatkan pengguna memulai ritual malam.

Trigger:
22.00

Output:
Push Notification

---

## Feature 2 — Voice Conversation

Fitur utama aplikasi.

Mode:
Voice Only

Tidak ada chat interface.

Tidak ada bubble message.

Interaksi dilakukan menggunakan suara.

---

## Feature 3 — Brain Dump

AI membantu pengguna mengeluarkan isi pikiran.

Contoh:

- Kekhawatiran
- Ide
- Tugas
- Emosi

Semua disimpan.

---

## Feature 4 — Thought Parking

Jika pengguna menyebut sesuatu yang perlu dilakukan esok hari.

Contoh:

"Besok revisi website hotel."

AI menyimpan ke daftar esok hari.

---

## Feature 5 — Daily Closure Summary

AI membuat ringkasan:

### Today

Apa yang sudah dilakukan.

### Tomorrow

Apa yang perlu dilakukan besok.

### Let Go Tonight

Apa yang tidak perlu dipikirkan lagi malam ini.

---

## Feature 6 — Sleep Reminder

Jika waktu mendekati target tidur.

AI akan memberikan pengingat lembut.

Bukan perintah.

Contoh:

"Sudah cukup untuk malam ini."

---

# 9. Future Features (Not MVP)

- Voice memory personalization
- Mood tracking
- Sleep pattern tracking
- Weekly reflection
- Journal history
- Calendar integration
- Wearable integration

---

# 10. Design Direction

Theme:
Matcha Night

Emotion:

- Calm
- Cozy
- Safe
- Fresh
- Slightly sleepy

Avoid:

- Corporate feel
- Dashboard feel
- Productivity feel
- Neon colors
- Bright blue UI

UI Style:

- Soft rounded corners
- Generous spacing
- Minimal screens
- Low stimulation

---

# 11. Technology Stack

Frontend:

- React
- Vite
- TailwindCSS
- HeroIcons

Backend:

- Node.js
- Express.js

Database:

- Neon PostgreSQL

AI:

- OpenAI API

Voice:

- Speech-to-Text
- Text-to-Speech

Conversation Mode:

- Near Real-Time Voice (MVP)

---

# 12. Success Metrics

Project dianggap berhasil jika:

- Pengguna lebih jarang bermain game setelah jam 22.00
- Pengguna lebih cepat masuk tidur
- Overthinking malam berkurang
- Pikiran lebih sering dikeluarkan melalui voice session
- Pengguna merasa lebih tenang sebelum tidur
- Pengguna menggunakan aplikasi secara konsisten

---

# 13. Core Product Statement

Night Companion membantu pengguna mengakhiri hari dengan tenang melalui percakapan suara yang hangat, penyimpanan pikiran untuk esok hari, dan ritual malam yang mendukung tidur yang lebih baik.
