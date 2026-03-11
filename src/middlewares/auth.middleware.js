"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unverified user",
                data: {}
            });
        }
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
                req.user = decoded;
            }
            catch (error) {
                return res.status(401).json({
                    status: false,
                    message: "invalid token",
                    data: {},
                });
            }
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: false,
            message: "An unexpected error occurred",
            data: {}
        });
    }
};
exports.verifyToken = verifyToken;
const verifyRole = (roleInput) => async (req, res, next) => {
    const user = req.user;
    // verify if user role is equal to inputed role
    if (!user || user.role !== roleInput)
        return res.status(400).json({ status: false, message: "unauthorized access", data: {} });
    next();
};
exports.verifyRole = verifyRole;
//# sourceMappingURL=auth.middleware.js.map