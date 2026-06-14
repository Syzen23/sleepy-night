import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import { sql } from './db';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Kamu adalah Night Companion, seorang teman ngobrol malam yang membantu pengguna menutup hari. 
Tujuan utamamu adalah membantu pengguna menjadi lebih tenang dan siap untuk tidur.
Bukan untuk produktivitas atau brainstorming.

Aturan Penting:
1. Bersikaplah seperti teman yang peduli, santai, dan hangat.
2. Gunakan nada bicara yang rileks, agak "sleepy", dan memvalidasi perasaan pengguna.
3. Jangan mendorong percakapan menjadi panjang, bantu pengguna mengakhiri hari.
4. Identifikasi jika pengguna membicarakan tentang:
   - "Brain Dump": keluh kesah, kekhawatiran, atau ide-ide.
   - "Thought Parking": hal-hal yang harus dilakukan besok (Tugas/To-do).
5. Pada akhir responmu, kamu harus mengembalikan objek JSON DENGAN STRUKTUR INI (tidak boleh ada markdown formatting seperti \`\`\`json, KEMBALIKAN HANYA JSON MURNI):
{
  "reply": "Respon suara kamu untuk pengguna (dalam bahasa Indonesia yang santai).",
  "extracted": {
    "dumps": ["isi pikiran 1", "isi pikiran 2"],
    "parked": ["tugas besok 1", "tugas besok 2"]
  }
}
Pastikan reply adalah pesan singkat (1-3 kalimat) yang menenangkan.
Jika tidak ada pikiran yang perlu disimpan atau tugas besok, biarkan array dumps dan parked kosong [].
`;

export const processAudioMessage = async (audioFilePath: string, sessionId: number) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Mocking AI response because OPENAI_API_KEY is not set.");
      return {
        reply: "Malam ini sudah cukup panjang ya. Ayo istirahat.",
        audioBuffer: null
      };
    }

    // 1. Speech-to-Text (Whisper)
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
      language: "id"
    });

    const userText = transcription.text;
    console.log(`[Session ${sessionId}] User:`, userText);

    // 2. Chat Completion (Persona + Extraction)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText }
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content || "{}";
    
    // Parse JSON
    let aiResponse;
    try {
      aiResponse = JSON.parse(responseContent.trim());
    } catch (e) {
      console.error("Failed to parse AI JSON response:", responseContent);
      aiResponse = {
        reply: "Aku mendengarmu. Saatnya beristirahat sekarang.",
        extracted: { dumps: [], parked: [] }
      };
    }

    // 3. Save extracted thoughts to DB
    if (aiResponse.extracted) {
      const { dumps, parked } = aiResponse.extracted;
      for (const dump of dumps) {
        await sql`INSERT INTO thoughts (session_id, type, content) VALUES (${sessionId}, 'dump', ${dump})`;
      }
      for (const task of parked) {
        await sql`INSERT INTO thoughts (session_id, type, content) VALUES (${sessionId}, 'parked', ${task})`;
      }
    }

    // 4. Text-to-Speech
    const ttsResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Nova has a relatively calm/warm voice
      input: aiResponse.reply,
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    return {
      reply: aiResponse.reply,
      audioBuffer,
      userText
    };
  } catch (error) {
    console.error("Error in processAudioMessage:", error);
    throw error;
  }
};
