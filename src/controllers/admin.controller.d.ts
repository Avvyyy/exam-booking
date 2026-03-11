import type { Request, Response } from "express";
export declare const createCourse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Admin: Create exam slot and auto-generate batches
 */
export declare const createExamSlot: (req: Request, res: Response) => Promise<void>;
export declare const getUserDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Admin: Reschedule a student's exam
 */
export declare const rescheduleStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=admin.controller.d.ts.map