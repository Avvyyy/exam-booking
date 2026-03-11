import type { NextFunction, Request, Response } from "express";
import type { Schema } from "joi";
export declare const validateSchema: (schema: Schema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.middleware.d.ts.map