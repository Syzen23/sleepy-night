import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { handleVoiceSession, handleSessionEnd, getThoughtsHistory, getUserProfile, updateUserProfile, deleteSession } from './controllers/session.controller';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Night Companion API is running smoothly.' });
});
// User Profile Routes
app.get('/api/user/profile', getUserProfile);
app.put('/api/user/profile', updateUserProfile);
// Session Routes
app.post('/api/session/chat', handleVoiceSession);
app.post('/api/session/end', handleSessionEnd);
app.delete('/api/session/:id', deleteSession);
app.get('/api/history', getThoughtsHistory);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=index.js.map