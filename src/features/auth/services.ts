import { AppError } from "../../utils/app-error";
import bcrypt from "bcryptjs";
import { AuthUser, RegisterUserRequestBody } from "./types";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../user/types";

export const userExists = async (email: string): Promise<boolean> => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true },
        });

        return Boolean(user);
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Database error", 500);
    }
};

export const authenticateUser = async (email: string, password: string): Promise<AuthUser | null> => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                matricNo: true,
                firstName: true,
                lastName: true,
                email: true,
                password: true,
                role: true,
            },
        });
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid email or password", 401);
        }

        const fullName = `${user.firstName} ${user.lastName}`.trim();

        return {
            id: user.id,
            fullName,
            email: user.email,
            role: user.role as AuthUser["role"],
            ...(user.matricNo ? { matricNo: user.matricNo } : {}),
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Database error", 500);
    }
};

export const createUser = async (userDetails: RegisterUserRequestBody): Promise<AuthUser> => {
    try {

        if (userDetails.role !== UserRole.ADMIN) {
            if (!userDetails.matricNo) {
                throw new AppError("matricNo is required", 400);
            }
            if (!userDetails.department) {
                throw new AppError("department is required", 400);
            }
            if (!userDetails.level) {
                throw new AppError("level is required", 400);
            }
        }

        const selectedCourseIds = userDetails.selectedCourseIds ?? [];

        if (selectedCourseIds.length > 0 && userDetails.role !== UserRole.STUDENT) {
            throw new AppError("Only students can select courses during registration", 400);
        }

        const hashedPassword = await bcrypt.hash(userDetails.password, 10);

        const userData = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            password: hashedPassword,
            role: userDetails.role,
            ...(userDetails.matricNo ? { matricNo: userDetails.matricNo } : {}),
            ...(userDetails.department ? { department: userDetails.department } : {}),
            ...(typeof userDetails.level === "number" ? { level: userDetails.level } : {}),
        };

        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                matricNo: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            }

        });

        if (selectedCourseIds.length > 0) {
            const existingCourses = await prisma.course.findMany({
                where: { id: { in: selectedCourseIds } },
                select: { id: true },
            });

            if (existingCourses.length !== selectedCourseIds.length) {
                throw new AppError("One or more selected courses are invalid", 400);
            }

            await prisma.studentCourse.createMany({
                data: selectedCourseIds.map((courseId) => ({
                    studentId: user.id,
                    courseId,
                })),
                skipDuplicates: true,
            });
        }

        const fullName = `${user.firstName} ${user.lastName}`.trim();
        return {
            id: user.id,
            fullName,
            email: user.email,
            role: user.role as AuthUser["role"],
            ...(user.matricNo ? { matricNo: user.matricNo } : {}),
        };

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Database error", 500);
    }   
}