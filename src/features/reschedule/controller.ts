import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import {
  completeReschedule,
  createRescheduleRequest,
  listRescheduleRequests,
  processRescheduleRequest,
  recordReschedulePayment,
} from "./services";
import { UserRole } from "../user/types";

export const createRescheduleRequestFunc = async (req: Request, res: Response) => {
  const authedReq = req as Request & {
    user?: {
      id: number;
      role: UserRole;
    };
  };

  if (!authedReq.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { courseId, reason } = req.body as { courseId?: number; reason?: string };

  if (!courseId) {
    throw new AppError("courseId is required", 400);
  }

  const request = await createRescheduleRequest({
    studentId: authedReq.user.id,
    courseId,
    ...(reason ? { reason } : {}),
  });

  return res.status(201).json({
    status: true,
    message: "Reschedule request submitted",
    data: request,
  });
};

export const processRescheduleRequestFunc = async (req: Request, res: Response) => {
  const requestId = Number(req.params.requestId);
  const { action, adminReason } = req.body as {
    action?: "accept" | "reject";
    adminReason?: string;
  };

  if (Number.isNaN(requestId)) {
    throw new AppError("requestId must be a number", 400);
  }

  if (!action || !["accept", "reject"].includes(action)) {
    throw new AppError("action must be either accept or reject", 400);
  }

  const request = await processRescheduleRequest({
    requestId,
    action,
    ...(adminReason ? { adminReason } : {}),
  });

  return res.status(200).json({
    status: true,
    message: "Reschedule request processed",
    data: request,
  });
};

export const recordReschedulePaymentFunc = async (req: Request, res: Response) => {
  const requestId = Number(req.params.requestId);
  const { paymentRef } = req.body as { paymentRef?: string };

  if (Number.isNaN(requestId)) {
    throw new AppError("requestId must be a number", 400);
  }

  if (!paymentRef) {
    throw new AppError("paymentRef is required", 400);
  }

  const request = await recordReschedulePayment({
    requestId,
    paymentRef,
  });

  return res.status(200).json({
    status: true,
    message: "Reschedule payment recorded",
    data: request,
  });
};

export const completeRescheduleFunc = async (req: Request, res: Response) => {
  const authedReq = req as Request & {
    user?: {
      id: number;
      role: UserRole;
    };
  };

  if (!authedReq.user) {
    throw new AppError("Unauthorized", 401);
  }

  const requestId = Number(req.params.requestId);

  const { slotId, batchId, mode } = req.body as {
    slotId?: number;
    batchId?: number;
    mode?: "physical" | "online";
  };

  if (Number.isNaN(requestId)) {
    throw new AppError("requestId must be a number", 400);
  }

  if (!slotId || !batchId || !mode) {
    throw new AppError("slotId, batchId and mode are required", 400);
  }

  const schedule = await completeReschedule({
    requestId,
    studentId: authedReq.user.id,
    slotId,
    batchId,
    mode,
  });

  return res.status(200).json({
    status: true,
    message: "Reschedule completed successfully",
    data: schedule,
  });
};

export const listRescheduleRequestsFunc = async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const requests = await listRescheduleRequests(status);

  return res.status(200).json({
    status: true,
    message: "Reschedule requests fetched successfully",
    data: requests,
  });
};
