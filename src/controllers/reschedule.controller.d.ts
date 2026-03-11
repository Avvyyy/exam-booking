import type { Response, Request } from "express";
export declare const createRescheduleRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllRescheduleRequests: (req: Request, res: Response) => Promise<void>;
export declare const getRescheduleRequestById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const performReschedule: (req: Request, res: Response) => Promise<void>;
export declare const handleRescheduleAction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitReschedulePayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=reschedule.controller.d.ts.map