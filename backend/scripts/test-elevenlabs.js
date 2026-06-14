import * as dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_AI;
const VOICE_ID = process.env.ELEVEN_LABS_AI_VOICE;
async function testElevenLabs() {
    console.log('Menguji API ElevenLabs...');
    console.log(`Voice ID: ${VOICE_ID}`);
    if (!ELEVEN_LABS_API_KEY || !VOICE_ID) {
        console.error('API Key atau Voice ID tidak ditemukan di .env');
        return;
    }
    const textToSpeak = "Halo Sajid, aku adalah pendamping tidurmu malam ini. Semoga tidurmu nyenyak.";
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': ELEVEN_LABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: textToSpeak,
                model_id: 'eleven_multilingual_v2', // Multilingual model is better for Indonesian
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            })
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Error dari ElevenLabs (Status ${response.status}):`, errorData);
            return;
        }
        const audioBuffer = await response.arrayBuffer();
        fs.writeFileSync('test_audio.mp3', Buffer.from(audioBuffer));
        console.log('✅ SUKSES! File audio berhasil disimpan sebagai test_audio.mp3');
        console.log(`Ukuran file: ${Buffer.from(audioBuffer).length} bytes`);
    }
    catch (error) {
        console.error('Terjadi kesalahan saat memanggil API:', error);
    }
}
testElevenLabs();
//# sourceMappingURL=test-elevenlabs.js.map