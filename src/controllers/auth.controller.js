"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user.service");
const config_1 = require("../config/config");
const loginUser = async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({
            status: false,
            message: "Email/Matric number and password are required",
            data: {},
        });
    }
    try {
        const user = await (0, user_service_1.authenticateUser)(identifier, password);
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials",
                data: {},
            });
        }
        const token = jsonwebtoken_1.default.sign({ ...user }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtLifetime });
        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: { token, user },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            status: false,
            message: error.message || "Unable to login",
            data: {},
        });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.controller.js.map