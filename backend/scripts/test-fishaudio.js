import * as dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const FISH_AUDIO_API_KEY = process.env.FISH_AUDIO_LABS_AI;
const VOICE_ID = process.env.FISH_AUDIO_LABS_AI_VOICE;
async function testFishAudio() {
    console.log('Menguji API Fish Audio...');
    console.log(`Voice ID: ${VOICE_ID}`);
    if (!FISH_AUDIO_API_KEY || !VOICE_ID) {
        console.error('API Key atau Voice ID tidak ditemukan di .env');
        return;
    }
    const textToSpeak = "Halo Sajid, ini adalah tes suara menggunakan Fish Audio. Semoga tidurmu nyenyak malam ini.";
    try {
        const response = await fetch('https://api.fish.audio/v1/tts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FISH_AUDIO_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: textToSpeak,
                reference_id: VOICE_ID
            })
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Error dari Fish Audio (Status ${response.status}):`, errorData);
            return;
        }
        const audioBuffer = await response.arrayBuffer();
        fs.writeFileSync('test_fish_audio.mp3', Buffer.from(audioBuffer));
        console.log('✅ SUKSES! File audio berhasil disimpan sebagai test_fish_audio.mp3');
        console.log(`Ukuran file: ${Buffer.from(audioBuffer).length} bytes`);
    }
    catch (error) {
        console.error('Terjadi kesalahan saat memanggil API:', error);
    }
}
testFishAudio();
//# sourceMappingURL=test-fishaudio.js.map