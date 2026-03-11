import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/app-error";
import bcrypt from "bcryptjs";
import { AuthUser, RegisterUserRequestBody } from "./types";

const prisma = new PrismaClient();

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

        if (userDetails.role !== "admin") {
            if (!userDetails.matricNo) {
                throw new AppError("matricNo is required", 400);
            }
            if (!userDetails.faculty) {
                throw new AppError("faculty is required", 400);
            }
              if (!userDetails.level) {
                throw new AppError("level is required", 400);
            }
        }

        const hashedPassword = await bcrypt.hash(userDetails.password, 10);
        const user = await prisma.user.create({
            data: {
                ...userDetails,
                password: hashedPassword,
            },
            select: {
                id: true,
                matricNo: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            }

        });

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