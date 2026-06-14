import fs from "fs";
import * as dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.CARTESIA_API_KEY;
const voiceId = process.env.CARTESIA_VOICE_ID;
async function testCartesia() {
    console.log("Menguji API Cartesia...");
    console.log(`Voice ID: ${voiceId}`);
    if (!apiKey || !voiceId) {
        console.error("API Key atau Voice ID tidak ditemukan di .env");
        return;
    }
    try {
        const response = await fetch("https://api.cartesia.ai/tts/bytes", {
            method: "POST",
            headers: {
                "X-API-Key": apiKey,
                "Cartesia-Version": "2024-06-10",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model_id: "sonic-3.5", // Latest active Cartesia model
                transcript: "Halo, selamat malam. Ini adalah uji coba suara Cartesia.",
                voice: {
                    mode: "id",
                    id: voiceId,
                    __experimental_controls: {
                        speed: "slowest"
                    }
                },
                output_format: {
                    container: "mp3",
                    sample_rate: 44100
                }
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ GAGAL! Cartesia menolak dengan Status ${response.status}:`, errorText);
            return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Check if it's accidentally a JSON error
        const bufferString = buffer.toString('utf8');
        if (bufferString.trim().startsWith('{')) {
            console.error(`❌ GAGAL! API mengembalikan JSON error:`, bufferString);
            return;
        }
        fs.writeFileSync("output_cartesia.mp3", buffer);
        console.log("✅ SUKSES! Audio berhasil dibuat dan disimpan sebagai output_cartesia.mp3");
    }
    catch (error) {
        console.error("Terjadi kesalahan:", error.message);
    }
}
testCartesia();
//# sourceMappingURL=test-cartesia.js.map