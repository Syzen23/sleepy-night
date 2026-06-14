🟡 YANG BELUM / BISA DIKEMBANGKAN (BACKLOG / TO-DO)
Jika kamu ingin melanjutkan pengembangan ke tahap berikutnya, berikut adalah beberapa area yang belum terhubung atau bisa dioptimalkan:

Sinkronisasi Data Profil ke Database (DB Sync):

Kondisi Saat Ini: Nama "Sajid", "Bedtime", dan pilihan tema di halaman Profil masih disimpan secara lokal (localStorage) atau bersifat semi-hardcoded di UI.
Rencana Pengembangan: Membuat API endpoint /api/user/profile untuk menyimpan dan membaca preferensi profil pengguna langsung dari database Neon PostgreSQL, sehingga jika kamu mengganti tema atau waktu tidur di halaman Profile, data di halaman utama dan database ikut berubah.
Integrasi Penghapusan Riwayat dengan Database (Sync Delete):

Kondisi Saat Ini: Di halaman Thoughts, ketika kamu mengeklik tombol "Let it go completely", data hanya terhapus dari localStorage browser. Baris datanya di database PostgreSQL tidak ikut terhapus.
Rencana Pengembangan: Membuat API endpoint DELETE /api/session/:id agar ketika pengguna membuang catatan pikiran, data di database juga ikut terhapus secara permanen.
Pemilihan Tema Dinamis Berdasarkan Hasil Obrolan (AI Theme Picker):

Kondisi Saat Ini: Tema akhir panggilan (coffee, snow, wind) dipilih secara acak oleh backend saat panggilan ditutup.
Rencana Pengembangan: Memanfaatkan LLM untuk membaca suasana hati (mood) dari transkrip obrolan penuh dan memilihkan tema visual yang paling pas (misalnya, jika obrolan terasa tenang dipilihkan snow, jika obrolan terasa hangat dipilihkan coffee, dsb.).
Tombol "Batal" saat Telepon Berdering (Reject Call Handshake):

Kondisi Saat Ini: Tombol merah saat telepon berdering mematikan microphone dan kembali ke home, namun suara panggilan masuk tidak memiliki suara bel/dering fisik (hanya visual pulsing rings).

Rencana Pengembangan: Menambahkan efek audio dering telepon lembut (soft ringtone) di awal masuk halaman panggilan agar kesan "telepon" terasa lebih nyata.
