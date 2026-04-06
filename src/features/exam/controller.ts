import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import {
  createCourse,
  getAdminDashboard,
  getExamBatchStudentCount,
  rescheduleCourseExam,
  scheduleExam,
  selectExamSlot,
} from "./services";
import { UserRole } from "../user/types";

export const createCourseFunc = async (req: Request, res: Response) => {
  const { code, title, level } = req.body as {
    code?: string;
    title?: string;
    level?: number;
  };

  if (!code || !title) {
    throw new AppError("code and title are required", 400);
  }

  const course = await createCourse({
    code,
    title,
    ...(typeof level === "number" ? { level } : {}),
  });

  return res.status(201).json({
    status: true,
    message: "Course created successfully",
    data: course,
  });
};

export const scheduleExamFunc = async (req: Request, res: Response) => {
  const { courseId, startDate, endDate, physicalCapacity, onlineCapacity, batchDurationMinutes } =
    req.body as {
      courseId?: number;
      startDate?: string;
      endDate?: string;
      physicalCapacity?: number;
      onlineCapacity?: number;
      batchDurationMinutes?: number;
    };

  if (!courseId || !startDate || !endDate || !physicalCapacity) {
    throw new AppError("courseId, startDate, endDate and physicalCapacity are required", 400);
  }

  const scheduled = await scheduleExam({
    courseId,
    startDate,
    endDate,
    physicalCapacity,
    ...(typeof onlineCapacity === "number" ? { onlineCapacity } : {}),
    ...(typeof batchDurationMinutes === "number" ? { batchDurationMinutes } : {}),
  });

  return res.status(201).json({
    status: true,
    message: "Exam scheduled successfully",
    data: scheduled,
  });
};

export const rescheduleExamFunc = async (req: Request, res: Response) => {
  const { slotId, newStartDate, newEndDate, batchDurationMinutes } = req.body as {
    slotId?: number;
    newStartDate?: string;
    newEndDate?: string;
    batchDurationMinutes?: number;
  };

  if (!slotId || !newStartDate || !newEndDate) {
    throw new AppError("slotId, newStartDate and newEndDate are required", 400);
  }

  const updated = await rescheduleCourseExam({
    slotId,
    newStartDate,
    newEndDate,
    ...(typeof batchDurationMinutes === "number" ? { batchDurationMinutes } : {}),
  });

  return res.status(200).json({
    status: true,
    message: "Course exam rescheduled successfully",
    data: updated,
  });
};

export const selectExamSlotFunc = async (req: Request, res: Response) => {
  const authedReq = req as Request & {
    user?: {
      id: number;
      role: UserRole;
    };
  };

  if (!authedReq.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { courseId, slotId, batchId, mode } = req.body as {
    courseId?: number;
    slotId?: number;
    batchId?: number;
    mode?: "physical" | "online";
  };

  if (!courseId || !slotId || !batchId || !mode) {
    throw new AppError("courseId, slotId, batchId and mode are required", 400);
  }

  const schedule = await selectExamSlot({
    studentId: authedReq.user.id,
    courseId,
    slotId,
    batchId,
    mode,
  });

  return res.status(200).json({
    status: true,
    message: "Exam slot selected successfully",
    data: schedule,
  });
};

export const examBatchStudentCountFunc = async (req: Request, res: Response) => {
  const batchId = Number(req.params.batchId);

  if (Number.isNaN(batchId)) {
    throw new AppError("batchId must be a number", 400);
  }

  const metrics = await getExamBatchStudentCount(batchId);

  return res.status(200).json({
    status: true,
    message: "Batch metrics fetched successfully",
    data: metrics,
  });
};

export const adminDashboardFunc = async (_req: Request, res: Response) => {
  const dashboard = await getAdminDashboard();

  return res.status(200).json({
    status: true,
    message: "Admin dashboard loaded successfully",
    data: dashboard,
  });
};
