import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import dayjs from "dayjs";

interface CreateCoursePayload {
  code: string;
  title: string;
  level?: number;
}

interface ScheduleExamPayload {
  courseId: number;
  startDate: string;
  endDate: string;
  physicalCapacity: number;
  onlineCapacity?: number;
  batchDurationMinutes?: number;
}

interface RescheduleExamPayload {
  slotId: number;
  newStartDate: string;
  newEndDate: string;
  batchDurationMinutes?: number;
}

interface SelectExamSlotPayload {
  studentId: number;
  courseId: number;
  slotId: number;
  batchId: number;
  mode: "physical" | "online";
}

const splitIntoBatches = (
  startDate: Date,
  endDate: Date,
  batchDurationMinutes: number,
  capacity: number
) => {
  const batches: Array<{
    batchNumber: number;
    startTime: Date;
    endTime: Date;
    capacity: number;
  }> = [];

  let cursor = dayjs(startDate);
  const final = dayjs(endDate);
  let count = 1;

  while (cursor.isBefore(final)) {
    const next = cursor.add(batchDurationMinutes, "minute");

    batches.push({
      batchNumber: count,
      startTime: cursor.toDate(),
      endTime: next.isAfter(final) ? final.toDate() : next.toDate(),
      capacity,
    });

    cursor = next;
    count += 1;
  }

  if (batches.length === 0) {
    throw new AppError("Invalid exam range; no batches generated", 400);
  }

  return batches;
};

export const createCourse = async (payload: CreateCoursePayload) => {
  const existing = await prisma.course.findUnique({
    where: { code: payload.code },
    select: { id: true },
  });

  if (existing) {
    throw new AppError("Course code already exists", 400);
  }

  return prisma.course.create({
    data: payload,
  });
};

export const scheduleExam = async (payload: ScheduleExamPayload) => {
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId },
    select: { id: true },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Invalid datetime format", 400);
  }

  if (endDate <= startDate) {
    throw new AppError("endDate must be after startDate", 400);
  }

  const batchDuration = payload.batchDurationMinutes ?? 60;
  const batches = splitIntoBatches(startDate, endDate, batchDuration, payload.physicalCapacity);

  return prisma.$transaction(async (tx) => {
    const slot = await tx.examSlot.create({
      data: {
        startDate,
        endDate,
        physicalCapacity: payload.physicalCapacity,
        ...(typeof payload.onlineCapacity === "number"
          ? { onlineCapacity: payload.onlineCapacity }
          : {}),
      },
    });

    await tx.courseSlot.create({
      data: {
        courseId: payload.courseId,
        slotId: slot.id,
      },
    });

    await tx.examBatch.createMany({
      data: batches.map((batch) => ({
        slotId: slot.id,
        batchNumber: batch.batchNumber,
        startTime: batch.startTime,
        endTime: batch.endTime,
        capacity: batch.capacity,
      })),
    });

    return tx.examSlot.findUnique({
      where: { id: slot.id },
      include: {
        courseSlots: {
          include: {
            course: true,
          },
        },
        examBatches: true,
      },
    });
  });
};

export const rescheduleCourseExam = async (payload: RescheduleExamPayload) => {
  const slot = await prisma.examSlot.findUnique({
    where: { id: payload.slotId },
    include: {
      courseSlots: true,
    },
  });

  if (!slot) {
    throw new AppError("Exam slot not found", 404);
  }

  const startDate = new Date(payload.newStartDate);
  const endDate = new Date(payload.newEndDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new AppError("Invalid datetime format", 400);
  }

  if (endDate <= startDate) {
    throw new AppError("newEndDate must be after newStartDate", 400);
  }

  const batchDuration = payload.batchDurationMinutes ?? 60;
  const batches = splitIntoBatches(startDate, endDate, batchDuration, slot.physicalCapacity);

  return prisma.$transaction(async (tx) => {
    await tx.examBatch.deleteMany({ where: { slotId: slot.id } });

    const updated = await tx.examSlot.update({
      where: { id: slot.id },
      data: {
        startDate,
        endDate,
      },
    });

    await tx.examBatch.createMany({
      data: batches.map((batch) => ({
        slotId: slot.id,
        batchNumber: batch.batchNumber,
        startTime: batch.startTime,
        endTime: batch.endTime,
        capacity: batch.capacity,
      })),
    });

    await tx.studentSchedule.deleteMany({
      where: {
        slotId: slot.id,
      },
    });

    return updated;
  });
};

export const selectExamSlot = async (payload: SelectExamSlotPayload) => {
  const now = new Date();

  const studentCourse = await prisma.studentCourse.findUnique({
    where: {
      studentId_courseId: {
        studentId: payload.studentId,
        courseId: payload.courseId,
      },
    },
  });

  if (!studentCourse) {
    throw new AppError("Student is not enrolled in this course", 400);
  }

  const slot = await prisma.examSlot.findUnique({
    where: { id: payload.slotId },
    include: {
      courseSlots: true,
    },
  });

  if (!slot) {
    throw new AppError("Exam slot not found", 404);
  }

  if (slot.startDate <= now) {
    throw new AppError("Cannot select a time slot after exam has started", 400);
  }

  const linkedToCourse = slot.courseSlots.some((courseSlot) => courseSlot.courseId === payload.courseId);

  if (!linkedToCourse) {
    throw new AppError("Slot is not linked to the selected course", 400);
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
    throw new AppError("Invalid exam batch selection", 400);
  }

  const usedSeats = await prisma.studentSchedule.count({
    where: {
      slotId: payload.slotId,
      batchId: payload.batchId,
    },
  });

  if (usedSeats >= batch.capacity) {
    throw new AppError("Selected exam batch is full", 409);
  }

  const seatNumber = usedSeats + 1;

  return prisma.studentSchedule.upsert({
    where: {
      studentId_courseId: {
        studentId: payload.studentId,
        courseId: payload.courseId,
      },
    },
    create: {
      studentId: payload.studentId,
      courseId: payload.courseId,
      slotId: payload.slotId,
      batchId: payload.batchId,
      seatNumber,
      mode: payload.mode,
      rescheduled: false,
    },
    update: {
      slotId: payload.slotId,
      batchId: payload.batchId,
      seatNumber,
      mode: payload.mode,
    },
  });
};

export const getExamBatchStudentCount = async (batchId: number) => {
  const batch = await prisma.examBatch.findUnique({
    where: { id: batchId },
    select: {
      id: true,
      slotId: true,
      capacity: true,
    },
  });

  if (!batch) {
    throw new AppError("Batch not found", 404);
  }

  const studentCount = await prisma.studentSchedule.count({
    where: {
      batchId,
    },
  });

  return {
    batchId,
    slotId: batch.slotId,
    capacity: batch.capacity,
    registeredStudents: studentCount,
    availableSeats: batch.capacity - studentCount,
  };
};

export const getAdminDashboard = async () => {
  const now = new Date();

  const upcomingCourseSlots = await prisma.courseSlot.findMany({
    where: {
      slot: {
        startDate: {
          gte: now,
        },
      },
    },
    include: {
      course: true,
      slot: true,
    },
    orderBy: {
      slot: {
        startDate: "asc",
      },
    },
  });

  const upcomingExams = await Promise.all(
    upcomingCourseSlots.map(async (entry) => {
      const registeredStudents = await prisma.studentSchedule.count({
        where: {
          courseId: entry.courseId,
          slotId: entry.slotId,
        },
      });

      return {
        courseId: entry.course.id,
        courseCode: entry.course.code,
        courseTitle: entry.course.title,
        slotId: entry.slot.id,
        startDate: entry.slot.startDate,
        endDate: entry.slot.endDate,
        registeredStudents,
      };
    })
  );

  const totalRescheduleRequests = await prisma.rescheduleRequest.count();

  return {
    upcomingExams,
    totalRescheduleRequests,
  };
};
