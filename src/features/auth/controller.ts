import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { authenticateUser, createUser, userExists } from "./services";
import { LoginRequestBody, RegisterUserRequestBody } from "./types";
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

        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, config.jwtSecret, { expiresIn: '1h' });
        
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
        const { email, password } = req.body as LoginRequestBody;

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

        const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });

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

export const logoutFunc = async (_req: Request, res: Response) => {
    return res.status(200).json({
        status: true,
        message: "Logout successful",
    });
};

export const refreshTokenFunc = async (req: Request, res: Response) => {
    const { token } = req.body as { token?: string };

    if (!token) {
        throw new AppError("Refresh token is required", 400);
    }

    try {
        const payload = jwt.verify(token, config.jwtSecret) as { userId: number; role: string };
        const accessToken = jwt.sign(
            { userId: payload.userId, role: payload.role },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            status: true,
            message: "Token refreshed successfully",
            data: { token: accessToken },
        });
    } catch (_error) {
        throw new AppError("Invalid refresh token", 401);
    }
};

export const forgotPasswordFunc = async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string };

    if (!email) {
        throw new AppError("Email is required", 400);
    }

    return res.status(200).json({
        status: true,
        message: "If the account exists, a reset instruction has been sent",
    });
};

export const resetPasswordFunc = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body as { token?: string; newPassword?: string };

    if (!token || !newPassword) {
        throw new AppError("Token and newPassword are required", 400);
    }

    return res.status(200).json({
        status: true,
        message: "Password reset completed",
    });
};
