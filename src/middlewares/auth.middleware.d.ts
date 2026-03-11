import type { NextFunction, Request, Response } from "express";
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare const verifyRole: (roleInput: string) => (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
//# sourceMappingURL=auth.middleware.d.ts.map