import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { getStudentDashboard, listAvailableCourses, onboardStudent } from "./services";
import { StudentOnboardingPayload } from "./types";
import { UserRole } from "./types";

export const listCoursesFunc = async (_req: Request, res: Response) => {
  const courses = await listAvailableCourses();

  return res.status(200).json({
    status: true,
    message: "Courses fetched successfully",
    data: courses,
  });
};

export const studentOnboardingFunc = async (
  req: Request<{}, {}, StudentOnboardingPayload>,
  res: Response
) => {
  const {
    matricNo,
    firstName,
    lastName,
    email,
    level,
    department,
    password,
    selectedCourseIds,
  } = req.body;

  if (
    !matricNo ||
    !firstName ||
    !lastName ||
    !email ||
    !level ||
    !department ||
    !password ||
    !Array.isArray(selectedCourseIds) ||
    selectedCourseIds.length === 0
  ) {
    throw new AppError("All onboarding fields are required", 400);
  }

  const student = await onboardStudent(req.body);

  return res.status(201).json({
    status: true,
    message: "Student onboarding completed",
    data: student,
  });
};

export const studentDashboardFunc = async (req: Request, res: Response) => {
  const authedReq = req as Request & {
    user?: {
      id: number;
      role: UserRole;
    };
  };

  if (!authedReq.user) {
    throw new AppError("Unauthorized", 401);
  }

  const dashboard = await getStudentDashboard(authedReq.user.id);

  return res.status(200).json({
    status: true,
    message: "Dashboard loaded successfully",
    data: dashboard,
  });
};
