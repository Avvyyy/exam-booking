import type { Request, Response } from "express";
export declare const getUserDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserExamSchedules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAvailableSlotsForCourse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAvailableBatches: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const pickExamBatch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=student.controller.d.ts.map