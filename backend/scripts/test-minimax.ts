import fs from "fs";
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MINIMAX_API_KEY;
const voiceId = process.env.MINIMAX_VOICE_ID;

async function testTTS() {
  console.log("Menguji API Minimax...");
  console.log(`Voice ID: ${voiceId}`);
  
  if (!apiKey || !voiceId) {
    console.error("API Key atau Voice ID tidak ditemukan di .env");
    return;
  }

  try {
    const response = await fetch(
      "https://api.minimax.io/v1/t2a_v2", // using api.minimax.io as the user intended
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "speech-2.8-turbo",
          text: "Haaaiii~ kamu lagi apa nih? hehe",
          voice_setting: {
            voice_id: voiceId,
            speed: 1.05,
            vol: 1,
            pitch: 0
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: "mp3"
          }
        })
      }
    );

    const arrayBuffer = await response.arrayBuffer();
    const bufferString = Buffer.from(arrayBuffer).toString('utf8');

    // Cek apakah response sebenarnya adalah teks JSON error (bukan file MP3 binary)
    if (bufferString.includes('"base_resp"')) {
      console.log("❌ GAGAL! Minimax menolak dengan pesan:");
      console.log(bufferString);
      return;
    }

    fs.writeFileSync("output_minimax.mp3", Buffer.from(arrayBuffer));
    console.log("✅ SUKSES! Audio berhasil dibuat dan disimpan sebagai output_minimax.mp3");
  } catch (error: any) {
    console.error("Terjadi kesalahan:", error.message);
  }
}

testTTS();
