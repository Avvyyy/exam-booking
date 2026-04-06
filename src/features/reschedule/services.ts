import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { RescheduleRequestStatus } from "./types";

interface CreateReschedulePayload {
  studentId: number;
  courseId: number;
  reason?: string;
}

interface ProcessReschedulePayload {
  requestId: number;
  action: "accept" | "reject";
  adminReason?: string;
}

interface RecordPaymentPayload {
  requestId: number;
  paymentRef: string;
}

interface CompleteReschedulePayload {
  requestId: number;
  studentId: number;
  slotId: number;
  batchId: number;
  mode: "physical" | "online";
}

export const createRescheduleRequest = async (payload: CreateReschedulePayload) => {
  const schedule = await prisma.studentSchedule.findUnique({
    where: {
      studentId_courseId: {
        studentId: payload.studentId,
        courseId: payload.courseId,
      },
    },
    include: {
      slot: true,
    },
  });

  if (!schedule) {
    throw new AppError("Student does not have a schedule for this course", 404);
  }

  const now = new Date();
  const diffInMs = schedule.slot.startDate.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours > 24) {
    throw new AppError(
      "Use normal slot selection for changes earlier than 24 hours. Reschedule requests are for missed/late cases",
      400
    );
  }

  const activeRequest = await prisma.rescheduleRequest.findFirst({
    where: {
      studentId: payload.studentId,
      courseId: payload.courseId,
      status: {
        in: [
          RescheduleRequestStatus.PENDING,
          RescheduleRequestStatus.APPROVED,
          RescheduleRequestStatus.PAID,
        ],
      },
    },
    select: { id: true },
  });

  if (activeRequest) {
    throw new AppError("An active reschedule request already exists", 409);
  }

  return prisma.rescheduleRequest.create({
    data: {
      studentId: payload.studentId,
      courseId: payload.courseId,
      ...(payload.reason ? { reason: payload.reason } : {}),
      status: RescheduleRequestStatus.PENDING,
    },
  });
};

export const processRescheduleRequest = async (payload: ProcessReschedulePayload) => {
  const request = await prisma.rescheduleRequest.findUnique({
    where: { id: payload.requestId },
  });

  if (!request) {
    throw new AppError("Reschedule request not found", 404);
  }

  if (request.status !== RescheduleRequestStatus.PENDING) {
    throw new AppError("Only pending requests can be processed", 400);
  }

  const nextStatus =
    payload.action === "accept"
      ? RescheduleRequestStatus.APPROVED
      : RescheduleRequestStatus.REJECTED;

  return prisma.rescheduleRequest.update({
    where: { id: request.id },
    data: {
      status: nextStatus,
      ...(payload.adminReason ? { adminReason: payload.adminReason } : {}),
    },
  });
};

export const recordReschedulePayment = async (payload: RecordPaymentPayload) => {
  const request = await prisma.rescheduleRequest.findUnique({
    where: { id: payload.requestId },
  });

  if (!request) {
    throw new AppError("Reschedule request not found", 404);
  }

  if (request.status !== RescheduleRequestStatus.REJECTED) {
    throw new AppError("Payment is only required for rejected requests", 400);
  }

  return prisma.rescheduleRequest.update({
    where: { id: request.id },
    data: {
      status: RescheduleRequestStatus.PAID,
      paymentRef: payload.paymentRef,
    },
  });
};

export const completeReschedule = async (payload: CompleteReschedulePayload) => {
  const request = await prisma.rescheduleRequest.findUnique({
    where: { id: payload.requestId },
  });

  if (!request) {
    throw new AppError("Reschedule request not found", 404);
  }

  if (request.studentId !== payload.studentId) {
    throw new AppError("Request does not belong to this student", 403);
  }

  if (
    request.status !== RescheduleRequestStatus.APPROVED &&
    request.status !== RescheduleRequestStatus.PAID
  ) {
    throw new AppError("Request must be approved or paid before selecting a new slot", 400);
  }

  const batch = await prisma.examBatch.findUnique({
    where: { id: payload.batchId },
    select: {
      id: true,
      slotId: true,
      capacity: true,
    },
  });

  if (!batch || batch.slotId !== payload.slotId) {
    throw new AppError("Invalid slot/batch combination", 400);
  }

  const usedSeats = await prisma.studentSchedule.count({
    where: {
      slotId: payload.slotId,
      batchId: payload.batchId,
    },
  });

  if (usedSeats >= batch.capacity) {
    throw new AppError("Selected batch is full", 409);
  }

  const seatNumber = usedSeats + 1;

  return prisma.$transaction(async (tx) => {
    const schedule = await tx.studentSchedule.upsert({
      where: {
        studentId_courseId: {
          studentId: payload.studentId,
          courseId: request.courseId,
        },
      },
      create: {
        studentId: payload.studentId,
        courseId: request.courseId,
        slotId: payload.slotId,
        batchId: payload.batchId,
        seatNumber,
        mode: payload.mode,
        rescheduled: true,
      },
      update: {
        slotId: payload.slotId,
        batchId: payload.batchId,
        seatNumber,
        mode: payload.mode,
        rescheduled: true,
      },
    });

    await tx.rescheduleRequest.update({
      where: { id: request.id },
      data: {
        status: RescheduleRequestStatus.COMPLETED,
      },
    });

    return schedule;
  });
};

export const listRescheduleRequests = async (status?: string) => {
  return prisma.rescheduleRequest.findMany({
    ...(status ? { where: { status } } : {}),
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          code: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
