import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { StudentOnboardingPayload } from "./types";
import bcrypt from "bcryptjs";
import { ExamTimeline } from "../exam/types";

export const listAvailableCourses = async () => {
  return prisma.course.findMany({
    orderBy: [{ level: "asc" }, { code: "asc" }],
  });
};

export const onboardStudent = async (payload: StudentOnboardingPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("Student with this email already exists", 400);
  }

  const courses = await prisma.course.findMany({
    where: { id: { in: payload.selectedCourseIds } },
    select: { id: true },
  });

  if (courses.length !== payload.selectedCourseIds.length) {
    throw new AppError("One or more selected courses are invalid", 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const student = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      matricNo: payload.matricNo,
      level: payload.level,
      department: payload.department,
      password: hashedPassword,
      role: "student",
      studentCourses: {
        create: payload.selectedCourseIds.map((courseId) => ({ courseId })),
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      matricNo: true,
      level: true,
      department: true,
    },
  });

  return {
    ...student,
    fullName: `${student.firstName} ${student.lastName}`.trim(),
  };
};

export const getStudentDashboard = async (studentId: number) => {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      studentSchedules: {
        include: {
          course: true,
          slot: true,
          batch: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const now = new Date();

  const schedules = student.studentSchedules.map((schedule) => {
    let timeline: ExamTimeline = ExamTimeline.INCOMING;

    if (schedule.slot.endDate < now && !schedule.rescheduled) {
      timeline = ExamTimeline.MISSED;
    } else if (schedule.slot.endDate < now) {
      timeline = ExamTimeline.PAST;
    }

    return {
      id: schedule.id,
      studentId: schedule.studentId,
      courseId: schedule.courseId,
      slotId: schedule.slotId,
      batchId: schedule.batchId,
      seatNumber: schedule.seatNumber,
      mode: schedule.mode,
      rescheduled: schedule.rescheduled,
      createdAt: schedule.createdAt,
      timeline,
      course: schedule.course,
      slot: schedule.slot,
      batch: schedule.batch,
    };
  });

  return {
    studentName: `${student.firstName} ${student.lastName}`.trim(),
    schedules,
  };
};
