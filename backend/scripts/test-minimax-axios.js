import axios from "axios";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.MINIMAX_API_KEY;
const voiceId = process.env.MINIMAX_VOICE_ID;
async function testTTS() {
    console.log("Menjalankan script Axios persis seperti kode Anda...");
    try {
        const response = await axios.post("https://api.minimax.io/v1/t2a_v2", // using exactly the .io domain
        {
            model: "speech-01-turbo", // user code had speech-2.8-turbo, but 2.8 doesn't exist. It's usually speech-01-turbo. Wait, let me use speech-01-turbo first.
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
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            responseType: "arraybuffer"
        });
        // Let's check if the response is actually JSON masquerading as a buffer
        const bufferString = response.data.toString('utf8');
        if (bufferString.includes('"base_resp"')) {
            console.log("Error dari Minimax:", bufferString);
        }
        else {
            fs.writeFileSync("output_minimax.mp3", response.data);
            console.log("Audio berhasil dibuat! (MP3 asli)");
        }
    }
    catch (error) {
        if (error.response && error.response.data) {
            console.error(error.response.data.toString('utf8'));
        }
        else {
            console.error(error.message);
        }
    }
}
testTTS();
//# sourceMappingURL=test-minimax-axios.js.map