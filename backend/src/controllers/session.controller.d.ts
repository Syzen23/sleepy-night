import type { Request, Response } from 'express';
export declare const handleVoiceSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handleSessionEnd: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getThoughtsHistory: (req: Request, res: Response) => Promise<void>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<void>;
export declare const deleteSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=session.controller.d.ts.map