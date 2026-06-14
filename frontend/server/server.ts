import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { initializeDatabase, sql } from './db';
import { processAudioMessage } from './ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Night Companion API is running.' });
});

// Setup Multer for audio uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

// 1. Start Session
app.post('/api/sessions', async (req, res) => {
  try {
    const result = await sql`INSERT INTO sessions (status) VALUES ('active') RETURNING id`;
    const sessionId = result[0]?.id;
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// 2. Process Voice
app.post('/api/sessions/:id/voice', upload.single('audio'), async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const audioFile = req.file;

  if (!audioFile) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    const aiResult = await processAudioMessage(audioFile.path, sessionId);
    
    // Clean up uploaded file
    fs.unlinkSync(audioFile.path);

    if (aiResult.audioBuffer) {
      res.set({
        'Content-Type': 'audio/mpeg',
        'X-AI-Reply': encodeURIComponent(aiResult.reply)
      });
      res.send(aiResult.audioBuffer);
    } else {
      res.json({ reply: aiResult.reply });
    }
  } catch (error) {
    console.error(error);
    if (fs.existsSync(audioFile.path)) fs.unlinkSync(audioFile.path);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

// 3. End Session & Get Summary
app.post('/api/sessions/:id/end', async (req, res) => {
  const sessionId = parseInt(req.params.id);
  
  try {
    await sql`UPDATE sessions SET status = 'completed' WHERE id = ${sessionId}`;
    
    const dumps = await sql`SELECT content FROM thoughts WHERE session_id = ${sessionId} AND type = 'dump'`;
    const parked = await sql`SELECT content FROM thoughts WHERE session_id = ${sessionId} AND type = 'parked'`;
    
    // Generate simple summary
    const todayStr = dumps.length > 0 
      ? `Kamu menceritakan beberapa hal malam ini: ${dumps.map(d => d.content).join('; ')}`
      : "Malam ini cukup tenang, tidak banyak yang membebani pikiranmu.";
      
    const tomorrowStr = parked.length > 0
      ? `Besok ada beberapa hal yang perlu kamu perhatikan: ${parked.map(p => p.content).join('; ')}`
      : "Belum ada tugas spesifik untuk besok, kamu bisa beristirahat penuh malam ini.";
      
    const letGoStr = "Semua kekhawatiran dan pemikiran hari ini sudah disimpan. Kamu tidak perlu membawanya ke tempat tidur.";

    await sql`
      INSERT INTO summaries (session_id, today_summary, tomorrow_tasks, let_go)
      VALUES (${sessionId}, ${todayStr}, ${tomorrowStr}, ${letGoStr})
    `;

    // Pick a theme randomly for now (In a real app, AI could pick this based on dumps content)
    const themes = ['coffee', 'snow', 'wind'];
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

    res.json({
      today: todayStr,
      tomorrow: tomorrowStr,
      letGo: letGoStr,
      theme: selectedTheme
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close session and generate summary' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeDatabase();
});
