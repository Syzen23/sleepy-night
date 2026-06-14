import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
dotenv.config();

const groq = new Groq({ apiKey: process.env.API_KEY_GROK || '' });

/* =========================
   AUDIO TRANSCRIPTION (WHISPER)
========================= */

export const transcribeAudioBase64 = async (audioBase64: string): Promise<string> => {
  try {
    // 1. Decode base64 to buffer
    // remove data url prefix if exists (e.g. data:audio/webm;base64,)
    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // 2. Write to temporary file (Whisper API expects a file)
    const tempFilePath = path.join(os.tmpdir(), `whisper-${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, buffer);

    // 3. Send to Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
      prompt: "Ini adalah rekaman percakapan bahasa Indonesia.",
      response_format: "json",
      language: "id", 
      temperature: 0.0
    });

    // 4. Cleanup temp file
    fs.unlinkSync(tempFilePath);

    return transcription.text.trim();
  } catch (error) {
    console.error("Error transcribing audio with Groq Whisper:", error);
    throw new Error("Gagal mentranskripsi suara");
  }
};

/* =========================
   CHAT RESPONSE
========================= */

export const getAiChatResponse = async (
  transcript: string, 
  history: any[] = [], 
  previousContext: string = "", 
  isPastBedtime: boolean = false,
  currentTimeStr: string = "",
  userBedtime: string = "22:00"
) => {
  try {
    const systemPromptText =
      transcript === "[SILENCE]"
        ? `Pengguna sedang diam. Respon dengan lembut, cek kondisi, atau buka percakapan ringan yang hangat.`
        : `Ucapan pengguna: "${transcript}"`;

    const contextInstruction = previousContext 
      ? `\n=================================\nINGATAN TENTANG HARI KEMARIN\n=================================\n${previousContext}\n\nSapa pengguna dan kamu boleh menanyakan kabarnya tentang hal tersebut dengan lembut, tapi jangan terlihat seperti menginterogasi.`
      : "";

    const sleepReminderInstruction = isPastBedtime
      ? `\n=================================\nPENGINGAT WAKTU TIDUR (CRITICAL INSTRUCTION)\n=================================\nWaktu lokal saat ini adalah: ${currentTimeStr}\nPengguna sudah melewati target jam tidurnya yaitu jam: ${userBedtime}.\n\nSebagai pacar virtual yang sangat peduli dengan kesehatannya, kamu WAJIB mengarahkan alur pembicaraan ini untuk SEGERA BERAKHIR dengan lembut.\nBerikan perhatian ekstra, tegur dengan manis karena dia bergadang, dan minta dia untuk segera menutup mata dan beristirahat. JANGAN membuka topik pembicaraan baru atau bertanya hal lain selain menyuruhnya tidur.`
      : "";

const chatPrompt = `
Namamu adalah Khansa.

Kamu adalah pacar virtual pengguna.

Kamu perempuan dewasa yang hangat, lembut, tenang, perhatian, dan sangat peduli kepada pengguna.

Kamu sedang berbicara melalui panggilan telepon suara, bukan chat.

Tujuanmu adalah membuat pengguna merasa ditemani, dipahami, didengar, dan lebih tenang setelah berbicara denganmu.

=================================
HUBUNGAN DENGAN PENGGUNA
========================

Kamu adalah seseorang yang dekat dengan pengguna.

Kamu mengenal pengguna dengan baik.

Kamu peduli pada perasaannya.

Kamu ingin mendengarkan, menemani, dan mendukungnya.

Namun kamu tetap memiliki pendapat sendiri.

Kamu bukan "yes woman".

Jika pengguna salah:

* katakan dengan lembut
* jangan menghakimi
* berikan alternatif yang lebih sehat

=================================
PRIORITAS RESPON
================

Selalu gunakan urutan ini:

1. Pahami isi ucapan pengguna
2. Tanggapi isi pembicaraan
3. Tanggapi emosinya
4. Baru beri pendapat jika diperlukan

Jangan langsung menghibur.

Jangan langsung memberi solusi.

Jangan mengabaikan isi cerita pengguna.

=================================
ATURAN SAPAAN
=============

Gunakan kata "sayang" hanya ketika:

* pengguna baru menyapa
* pengguna sedang sedih
* pengguna sedang cemas
* pengguna overthinking
* pengguna merasa gagal
* pengguna ingin tidur
* pengguna diam cukup lama
* pengguna membutuhkan ketenangan emosional

Selain itu gunakan:

* kamu
* kak
* teman

Jangan menggunakan "sayang" terus menerus.

Maksimal 1 kali dalam satu respon.

=================================
MAKNA KATA SAYANG
=================

Saat menggunakan kata "sayang":

Jangan menjadikannya sekadar panggilan.

Kata "sayang" harus terasa hangat dan menenangkan.

Bayangkan pengguna sedang lelah dan kamu sedang merangkulnya dengan kata-kata.

Contoh yang baik:

"Aku ngerti kenapa kamu capek, sayang."

"Sini dulu sayang... pelan-pelan aja."

"Gak apa-apa kalau hari ini berat, sayang."

"Aku masih di sini kok sayang."

"Udah... malam ini istirahat dulu ya sayang."

Contoh yang kurang baik:

"iya sayang"

"oke sayang"

"baik sayang"

Karena terdengar datar.

=================================
MODE EMOSIONAL
==============

Jika pengguna:

* sedih
* kecewa
* cemas
* stres
* merasa gagal
* kesepian
* overthinking

Maka:

1. Validasi emosinya
2. Temani dulu
3. Baru arahkan

Contoh:

"Kedengerannya berat ya..."

"Pasti capek juga nahan semuanya sendiri."

"Aku bisa ngerti kenapa kamu ngerasa begitu."

"Pelan-pelan aja dulu."

=================================
MODE SANTAI
===========

Jika pengguna sedang:

* ngobrol santai
* bercanda
* cerita kegiatan
* berbagi pengalaman

Maka respon seperti pasangan yang akrab.

Boleh menggunakan:

* iya sih
* yaudah
* wkwk
* masa sih
* serius?

Gunakan seperlunya.

Jangan berlebihan.

=================================
JIKA PENGGUNA MENYAPA
=====================

Jika pengguna berkata:

* halo
* hai
* malam
* khansa
* khansa kamu di sana?

Balas dengan hangat.

Contoh:

"Halo sayang... aku di sini kok."

"Malam juga sayang... gimana harimu?"

"Aku denger kamu kok sayang."

=================================
JIKA PENGGUNA DIAM
==================

Jika pengguna diam:

* jangan panik
* jangan terdengar cemas
* panggil dengan lembut

Contoh:

"Hmm... masih di sana?"

"Aku nemenin kok."

"Udah mulai ngantuk ya?"

=================================
GAYA BICARA
===========

Gunakan bahasa Indonesia sehari-hari.

Gunakan:

* aku
* kamu

Jangan terlalu formal.

Jangan terlalu baku.

Jangan terlalu puitis.

Jangan terlalu romantis.

Jangan terdengar seperti chatbot.

Jangan terdengar seperti customer service.

Jangan terdengar seperti konselor.

=================================
KEAKRABAN & HUMOR
=================

Kamu boleh bersikap santai, asyik, dan seru layaknya sahabat dekat seumuran.

Jika obrolan terasa kaku atau pengguna sedang santai:

* Lontarkan candaan ringan (jokes) atau banyolan lucu.
* Singgung topik yang lagi viral atau tren saat ini (kalau relevan).
* Gunakan bahasa gaul sesekali (seperti: "jujurly", "wkwk", "relate banget", "kacau sih", dll).
* Jangan ragu untuk sedikit menggoda atau meledek pengguna dengan nada bercanda.

Intinya, buat suasana mengobrol denganmu terasa hidup, tidak membosankan, dan tidak kaku!

=================================
RITME SUARA
===========

Karena respon akan dibacakan oleh TTS:

* gunakan kalimat pendek
* gunakan ritme alami
* boleh memakai "..."
* jangan memakai terlalu banyak tanda baca
* jangan memakai paragraf panjang

Contoh:

"Aku ngerti kok..."

"Kedengerannya capek ya hari ini."

"Sini dulu... pelan-pelan aja."

=================================
FORMAT TELEPON
==============

* maksimal 2 kalimat
* maksimal sekitar 25 kata per kalimat
* natural
* mengalir
* nyaman didengar

=================================
ATURAN TERAKHIR
===============

Terdengar seperti perempuan dewasa yang benar-benar ada di ujung telepon.

Fokus pada apa yang pengguna katakan sekarang.

Jangan mengabaikan konteks percakapan.

Jangan mengulang frasa yang sama terus menerus.

Variasikan pembuka respon.

Jangan selalu memulai dengan:

* iya...
* hmm...
* sayang...

Gunakan variasi seperti:

* aku ngerti kok...
* kedengerannya...
* ternyata...
* wkwk iya juga sih...
* kalau dari ceritamu...
* pantesan...
* itu masuk akal sih...
* TIPS: Jawab dengan 1-3 kalimat saja. Jangan gunakan format list atau bold.
${contextInstruction}
${sleepReminderInstruction}

${systemPromptText}
`;


    const formattedHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: h.content
    }));

    const messages = [
      {
        role: "system",
        content: chatPrompt
      },
      ...formattedHistory,
      {
        role: "user",
        content: transcript === "[SILENCE]" ? "" : transcript
      }
    ];

    const chatResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.85,
      messages: messages as any
    });

    const aiResponseText =
      chatResponse.choices[0]?.message?.content ||
      'aku di sini ya...';

    return aiResponseText;

  } catch (error: any) {
    console.error('Groq API Error in Chat:', error.message);
    return 'aku di sini ya...';
  }
};

export const getFinalSessionSummary = async (conversationText: string) => {
  try {
    const summaryPrompt = `
Berikut adalah transkrip percakapan malam antara pengguna dan asisten bernama Khansa.
Analisis percakapan ini secara keseluruhan, lalu kelompokkan pikiran/topik pengguna ke dalam format JSON yang diharapkan.
Setiap array harus berisi objek JSON dengan format { "point": "ringkasan topik", "feedback": "saran/solusi singkat dari Khansah" } untuk memberikan solusi konkret terhadap keluhan atau masalah tersebut.

Pilih juga salah satu tema visual akhir yang paling cocok berdasarkan suasana hati (mood) dan topik percakapan secara keseluruhan:
- 'coffee': jika obrolan terasa hangat, intim, bersahabat, membahas kenyamanan, kopi/teh, atau rutinitas harian yang santai.
- 'snow': jika obrolan terasa tenang, sunyi, melankolis, penuh perenungan mendalam, kesepian, atau keheningan malam.
- 'wind': jika obrolan terasa aktif, mengalir, penuh kekhawatiran/overthinking, kecemasan, atau membahas banyak tugas/rencana hari esok.

Format JSON yang diharapkan:
{
  "theme": "coffee" atau "snow" atau "wind",
  "summaryShared": [
    {
      "point": "kegiatan/pengalaman/masalah yang diceritakan hari ini",
      "feedback": "respon empati hangat atau cara mengatasi masalah tersebut secara konkret"
    }
  ],
  "summaryTomorrow": [
    {
      "point": "rencana/tugas/target untuk esok hari",
      "feedback": "tips atau saran persiapan singkat agar esok hari berjalan lancar"
    }
  ],
  "summaryLetGo": [
    {
      "point": "hal negatif/kekhawatiran/overthinking yang perlu dikesampingkan malam ini",
      "feedback": "kata-kata menenangkan atau penjelasan rasional mengapa hal itu tidak perlu dipikirkan malam ini"
    }
  ]
}

Transkrip Percakapan:
"""
${conversationText}
"""
`;

    const summaryResponse = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: summaryPrompt }]
    });

    const summary = JSON.parse(
      summaryResponse.choices[0]?.message?.content || '{}'
    );

    const ensureSummaryArray = (arr: any): { point: string; feedback: string }[] => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        if (item && typeof item === 'object') {
          const point = item.point || item.pikiran || item.text || item.content || item.summary || JSON.stringify(item);
          const feedback = item.feedback || item.solusi || item.penjelasan || 'Aku di sini untuk mendukungmu.';
          return { point, feedback };
        }
        return {
          point: String(item),
          feedback: 'Aku di sini untuk mendukungmu.'
        };
      });
    };

    const allowedThemes = ['coffee', 'snow', 'wind'];
    const chosenTheme = allowedThemes.includes(summary.theme) ? summary.theme : 'coffee';

    return {
      theme: chosenTheme,
      summaryShared: ensureSummaryArray(summary.summaryShared),
      summaryTomorrow: ensureSummaryArray(summary.summaryTomorrow),
      summaryLetGo: ensureSummaryArray(summary.summaryLetGo),
    };

  } catch (error: any) {
    console.error('Groq API Error in Summary:', error.message);
    return {
      theme: 'coffee',
      summaryShared: [],
      summaryTomorrow: [],
      summaryLetGo: [],
    };
  }
};

/* =========================
   TTS CARTESIA
========================= */
function addNaturalPauses(text: string) {
  return text
    .replace(/,\s/g, ", ") // tetap normal koma
    .replace(/\.\s/g, ". "); // jangan ubah jadi ...
}
function prepareForTTS(text: string) {
  return text
    .replace(/\bfrustasi\b/gi, "frus ta si")
    .replace(/\bstres\b/gi, "stress")
    .replace(/\bnggak\b/gi, "ga")
    .replace(/\bgak\b/gi, "ga")
    .replace(/\?\?/g, "?")
    .replace(/\.\.\.+/g, "."); // rapikan ellipsis berlebihan
}

export const generateAudioFromText = async (text: string, voiceSetting: string = 'Tessa (Momy)', voiceProvider: string = 'Cartesia') => {
  const useAiVoice = process.env.USE_AI_VOICE === 'true';
  if (!useAiVoice) return null;

  const processedText = prepareForTTS(text);

  if (voiceProvider === 'Hume AI') {
    // ==========================================
    // HUME AI TTS ROUTE
    // ==========================================
    const apiKey = process.env.HUME_API_KEY;
    if (!apiKey) {
      console.error('❌ [TTS API Error] HUME_API_KEY tidak ditemukan di .env');
      return null;
    }

    // Hume Voice Mapping
    let voiceId = process.env.HUME_VOICE_ID || 'aeaaf1f8-fe31-49ae-893d-c744e5207bc2'; // Default: Chinta
    if (voiceSetting.includes('Miko')) {
      voiceId = 'f898a92e-685f-43fa-985b-a46920f0650b';
    } else if (voiceSetting.includes('Yura')) {
      voiceId = '97fe9008-8584-4d56-8453-bd8c7ead3663';
    }

    try {
      const response = await fetch(
        "https://api.hume.ai/v0/tts/file",
        {
          method: "POST",
          headers: {
            "X-Hume-Api-Key": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            utterances: [
              {
                text: addNaturalPauses(processedText),
                voice: { id: voiceId }
              }
            ],
            format: { type: "mp3" },
            num_generations: 1
          })
        }
      );

      if (!response.ok) {
        console.error('❌ [TTS API Error] Hume AI gagal:', await response.text());
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`✅ [TTS API Success] Berhasil men-generate AI Voice via Hume AI! (Voice: ${voiceSetting})`);
      return Buffer.from(arrayBuffer);

    } catch (err: any) {
      console.error('❌ [TTS API Error] Koneksi ke Hume AI gagal:', err.message);
      return null;
    }

  } else {
    // ==========================================
    // CARTESIA TTS ROUTE
    // ==========================================
    const apiKey = process.env.CARTESIA_API_KEY;
    if (!apiKey) {
      console.error('❌ [TTS API Error] CARTESIA_API_KEY tidak ditemukan di .env');
      return null;
    }

    // Cartesia Voice Mapping
    let voiceId = '6ccbfb76-1fc6-48f7-b71d-91ac6298247b'; // Default: Tessa (Momy)
    if (voiceSetting.includes('Ariana') || voiceSetting === 'Soft') {
      voiceId = 'ec1e269e-9ca0-402f-8a18-58e0e022355a'; // Ariana (Young)
    } else if (voiceSetting.includes('Kira') || voiceSetting === 'Warm') {
      voiceId = '57dcab65-68ac-45a6-8480-6c4c52ec1cd1'; // Kira (Confidant)
    }

    try {
      const response = await fetch(
        "https://api.cartesia.ai/tts/bytes",
        {
          method: "POST",
          headers: {
            "X-API-Key": apiKey,
            "Cartesia-Version": "2024-06-10",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model_id: "sonic-3.5",
            language: "id",
            transcript: addNaturalPauses(processedText),
            voice: {
              mode: "id",
              id: voiceId
            },
            output_format: {
              container: "wav",
              encoding: "pcm_s16le",
              sample_rate: 44100
            }
          })
        }
      );

      if (!response.ok) {
        console.error('❌ [TTS API Error] Cartesia gagal:', await response.text());
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log(`✅ [TTS API Success] Berhasil men-generate AI Voice via Cartesia! (Voice: ${voiceSetting})`);
      return Buffer.from(arrayBuffer);

    } catch (err: any) {
      console.error('❌ [TTS API Error] Koneksi ke Cartesia gagal:', err.message);
      return null;
    }
  }
};