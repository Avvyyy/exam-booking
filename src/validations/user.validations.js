"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    identifier: joi_1.default.string()
        .trim()
        .required()
        .messages({
        "string.base": "Matric number/Email must be a string",
        "string.empty": "Matric number/Email is required",
        "any.required": "Matric number/Email is required",
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
});
//# sourceMappingURL=user.validations.js.map