import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { authenticateUser, createUser, userExists } from "./services";
import { RegisterUserRequestBody } from "./types";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";


export const registerFunc = async (req: Request<{}, {}, RegisterUserRequestBody>, res: Response) => {
    try {
        const userDetails = req.body;

        const doesUserExist = userDetails.email && await userExists(userDetails.email);
        if (doesUserExist) {
            throw new AppError("User with this email already exists", 400);
        }

        const newUser = await createUser(userDetails);
        if (!newUser) {
            throw new AppError("Failed to create user", 500);
        }

        const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, { expiresIn: '1h' });
        
        return res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: { ...newUser, token },
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(error instanceof Error ? error.message : "Registration failed", 500);
    }
}

export const loginFunc = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }

        if (typeof email !== "string" || typeof password !== "string") {
            throw new AppError("Email and password must be strings", 400);
        }

        const user = await authenticateUser(email, password);

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: { ...user, token },
        });
    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(err instanceof Error ? err.message : "Login failed", 500);
    }
}
