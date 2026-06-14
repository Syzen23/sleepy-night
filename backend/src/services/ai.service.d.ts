export declare const transcribeAudioBase64: (audioBase64: string) => Promise<string>;
export declare const getAiChatResponse: (transcript: string, history?: any[], previousContext?: string, isPastBedtime?: boolean, currentTimeStr?: string, userBedtime?: string) => Promise<string>;
export declare const getFinalSessionSummary: (conversationText: string) => Promise<{
    theme: any;
    summaryShared: {
        point: string;
        feedback: string;
    }[];
    summaryTomorrow: {
        point: string;
        feedback: string;
    }[];
    summaryLetGo: {
        point: string;
        feedback: string;
    }[];
}>;
export declare const generateAudioFromText: (text: string, voiceSetting?: string, voiceProvider?: string) => Promise<Buffer<ArrayBuffer> | null>;
//# sourceMappingURL=ai.service.d.ts.map