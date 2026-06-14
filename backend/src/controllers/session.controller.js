import { db } from '../db';
import { sessions, users } from '../db/schema';
import { getAiChatResponse, getFinalSessionSummary, generateAudioFromText, transcribeAudioBase64 } from '../services/ai.service';
import { desc, eq } from 'drizzle-orm';
export const handleVoiceSession = async (req, res) => {
    try {
        const { userId, mood, transcript, history, voice, voiceProvider, audioBase64: inputAudioBase64 } = req.body;
        let finalTranscript = transcript;
        if (inputAudioBase64) {
            try {
                finalTranscript = await transcribeAudioBase64(inputAudioBase64);
            }
            catch (err) {
                console.error("Transcription failed", err);
                return res.status(500).json({ error: "Gagal memproses rekaman suara" });
            }
        }
        if (!finalTranscript) {
            return res.status(400).json({ error: 'Transcript or audio is required' });
        }
        // 0. Fetch Contextual Memory on the very first turn & Get User Data
        let previousContext = "";
        let activeUser;
        if (userId) {
            activeUser = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(res => res[0]);
        }
        else {
            activeUser = await db.select().from(users).limit(1).then(res => res[0]);
        }
        if (!history || history.length === 0) {
            const lastSessionList = await db.select().from(sessions).orderBy(desc(sessions.createdAt)).limit(1);
            if (lastSessionList.length > 0) {
                const lastSession = lastSessionList[0];
                const tomorrowArr = lastSession?.summaryTomorrow;
                if (Array.isArray(tomorrowArr) && tomorrowArr.length > 0) {
                    const tomorrowStr = tomorrowArr.map((t) => typeof t === 'string' ? t : (t.point || '')).filter(Boolean).join(', ');
                    if (tomorrowStr) {
                        previousContext = `Kemarin pengguna merencanakan ini untuk hari ini: "${tomorrowStr}".`;
                    }
                }
            }
        }
        // 1. Check if past bedtime
        let isPastBedtime = false;
        let currentTimeStr = "";
        let userBedtime = "22:00";
        if (activeUser?.bedtime) {
            userBedtime = activeUser.bedtime;
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            currentTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const [bedHourStr, bedMinStr] = userBedtime.split(':');
            const bedHour = parseInt(bedHourStr || '22', 10) || 22;
            const bedMin = parseInt(bedMinStr || '0', 10) || 0;
            if ((hours > bedHour) || (hours === bedHour && minutes >= bedMin) || (hours >= 0 && hours <= 4)) {
                isPastBedtime = true;
            }
        }
        // 2. Process transcript with Groq (stateful, with history)
        const aiResponseText = await getAiChatResponse(finalTranscript, history, previousContext, isPastBedtime, currentTimeStr, userBedtime);
        // 2. Generate Audio for AI Response
        let responseAudioBase64 = null;
        const audioBuffer = await generateAudioFromText(aiResponseText, voice || 'Tessa (Momy)', voiceProvider || 'Cartesia');
        if (audioBuffer) {
            responseAudioBase64 = audioBuffer.toString('base64');
        }
        res.json({
            success: true,
            data: {
                aiResponse: aiResponseText,
                audioBase64: responseAudioBase64
            }
        });
    }
    catch (error) {
        console.error('Error in handleVoiceSession:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const handleSessionEnd = async (req, res) => {
    try {
        const { mood, history } = req.body;
        if (!Array.isArray(history) || history.length === 0) {
            return res.status(400).json({ error: 'History is required and must be an array' });
        }
        // 1. Concatenate history for summary generation
        const conversationText = history
            .map(h => `${h.role === 'user' ? 'User' : 'Khansah'}: ${h.content}`)
            .join('\n');
        // 2. Generate final summary
        const summaryData = await getFinalSessionSummary(conversationText);
        // Ensure at least one user exists for testing
        let activeUser = await db.select().from(users).limit(1).then(res => res[0]);
        if (!activeUser) {
            [activeUser] = await db.insert(users).values({ name: 'Sajid' }).returning();
        }
        // Concatenate user transcripts and AI responses for record keeping
        const userTranscripts = history
            .filter(h => h.role === 'user')
            .map(h => h.content)
            .join(' ');
        const aiResponses = history
            .filter(h => h.role === 'assistant')
            .map(h => h.content)
            .join(' ');
        // 3. Save consolidated session to Neon Database
        const [newSession] = await db.insert(sessions).values({
            userId: activeUser.id,
            mood: mood || 'Calm',
            theme: summaryData.theme || 'coffee',
            userTranscript: userTranscripts || 'Sesi percakapan malam',
            aiResponse: aiResponses || 'Sesi percakapan malam selesai',
            summaryShared: summaryData.summaryShared,
            summaryTomorrow: summaryData.summaryTomorrow,
            summaryLetGo: summaryData.summaryLetGo,
        }).returning();
        res.json({
            success: true,
            data: newSession
        });
    }
    catch (error) {
        console.error('Error in handleSessionEnd:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getThoughtsHistory = async (req, res) => {
    try {
        const allSessions = await db.select().from(sessions).orderBy(desc(sessions.createdAt));
        res.json({ data: allSessions });
    }
    catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        let activeUser = await db.select().from(users).limit(1).then(res => res[0]);
        if (!activeUser) {
            [activeUser] = await db.insert(users).values({
                name: 'Sajid',
                bedtime: '22:00',
                theme: 'Matcha Night',
                voice: 'Tessa (Momy)',
                voiceProvider: 'Cartesia'
            }).returning();
        }
        res.json({ success: true, data: activeUser });
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};
export const updateUserProfile = async (req, res) => {
    try {
        const { name, bedtime, theme, voice, voiceProvider } = req.body;
        let activeUser = await db.select().from(users).limit(1).then(res => res[0]);
        if (!activeUser) {
            [activeUser] = await db.insert(users).values({
                name: name || 'Sajid',
                bedtime: bedtime || '22:00',
                theme: theme || 'Matcha Night',
                voice: voice || 'Tessa (Momy)',
                voiceProvider: voiceProvider || 'Cartesia'
            }).returning();
        }
        else {
            [activeUser] = await db.update(users).set({
                name: name !== undefined ? name : activeUser.name,
                bedtime: bedtime !== undefined ? bedtime : activeUser.bedtime,
                theme: theme !== undefined ? theme : activeUser.theme,
                voice: voice !== undefined ? voice : activeUser.voice,
                voiceProvider: voiceProvider !== undefined ? voiceProvider : activeUser.voiceProvider,
            }).where(eq(users.id, activeUser.id)).returning();
        }
        res.json({ success: true, data: activeUser });
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};
export const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Session ID is required' });
        }
        await db.delete(sessions).where(eq(sessions.id, id));
        res.json({ success: true, message: 'Session deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
};
//# sourceMappingURL=session.controller.js.map